# ===============================================
FROM registry.access.redhat.com/ubi9/nodejs-18 AS appbase
# ===============================================
# install yarn
USER root
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN yum -y install yarn

WORKDIR /app

# Offical image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Global npm deps in a non-root user directory
ENV NPM_CONFIG_PREFIX=/app/.npm-global
ENV PATH=$PATH:/app/.npm-global/bin

# Yarn
ENV YARN_VERSION 1.19.1
RUN yarn policies set-version ${YARN_VERSION}

# Copy package.json and package-lock.json/yarn.lock files
COPY --chown=root:root package*.json *yarn* ./

# Install npm depepndencies
ENV PATH /app/node_modules/.bin:$PATH

RUN yarn && yarn cache clean --force

# =============================
FROM appbase AS development
# =============================

# Set NODE_ENV to development in the development container
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# copy in our source code last, as it changes the most
COPY --chown=root:root . .

# Bake package.json start command into the image
CMD ["yarn", "start", "--no-open", "--host"]

# ===================================
FROM appbase AS staticbuilder
# ===================================

ARG VITE_ORIGIN
ARG VITE_ADMIN_TICKET_VALIDATION_URL
ARG VITE_API_URI
ARG VITE_CMS_URI
ARG VITE_ENVIRONMENT
ARG VITE_OIDC_SERVER_TYPE
ARG VITE_OIDC_RETURN_TYPE
ARG VITE_OIDC_AUTHORITY
ARG VITE_OIDC_CLIENT_ID
ARG VITE_OIDC_KUKKUU_API_CLIENT_ID
ARG VITE_OIDC_SCOPE
ARG VITE_OIDC_AUTOMATIC_SILENT_RENEW_ENABLED
ARG VITE_OIDC_SESSION_POLLING_INTERVAL_MS
ARG VITE_OIDC_AUDIENCES
ARG VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO
ARG VITE_SENTRY_DSN
ARG VITE_BUILDTIME
ARG VITE_RELEASE
ARG VITE_COMMITHASH
ARG VITE_HELSINKI_PROFILE_URL

# Use template and inject the environment variables into .prod/nginx.conf
ENV VITE_BUILDTIME=${VITE_BUILDTIME:-""}
ENV VITE_RELEASE=${VITE_RELEASE:-""}
ENV VITE_COMMITHASH=${VITE_COMMITHASH:-""}
COPY .prod/nginx.conf.template /tmp/.prod/nginx.conf.template
RUN export APP_VERSION=$(yarn --silent app:version) && \
  envsubst '${APP_VERSION},${VITE_BUILDTIME},${VITE_RELEASE},${VITE_COMMITHASH}' < \
  "/tmp/.prod/nginx.conf.template" > \
  "/tmp/.prod/nginx.conf"

COPY . /app
RUN yarn build

# =============================
FROM registry.access.redhat.com/ubi9/nginx-122 AS production
# =============================
# Add application sources to a directory that the assemble script expects them
# and set permissions so that the container runs without root access
USER root

RUN chgrp -R 0 /usr/share/nginx/html && \
  chmod -R g=u /usr/share/nginx/html

# Copy static build
COPY --from=staticbuilder /app/build /usr/share/nginx/html
# Copy nginx config
COPY --from=staticbuilder /tmp/.prod/nginx.conf  /etc/nginx/nginx.conf

USER 1001

# Run script uses standard ways to run the application
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]

EXPOSE 8080

