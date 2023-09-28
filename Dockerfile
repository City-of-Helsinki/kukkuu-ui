# ===============================================
FROM registry.access.redhat.com/ubi9/nodejs-18 as appbase
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
RUN yarn policies set-version $YARN_VERSION

# Copy package.json and package-lock.json/yarn.lock files
COPY --chown=root:root package*.json *yarn* ./

# Install npm depepndencies
ENV PATH /app/node_modules/.bin:$PATH

RUN yarn && yarn cache clean --force

# =============================
FROM appbase as development
# =============================

# Set NODE_ENV to development in the development container
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# copy in our source code last, as it changes the most
COPY --chown=root:root . .

# Bake package.json start command into the image
CMD ["yarn", "start"]

# ===================================
FROM appbase as staticbuilder
# ===================================

ARG VITE_ORIGIN
ARG VITE_ADMIN_TICKET_VALIDATION_URL
ARG VITE_API_URI
ARG VITE_CMS_URI
ARG VITE_OIDC_AUTHORITY
ARG VITE_ENVIRONMENT
ARG VITE_OIDC_CLIENT_ID
ARG VITE_OIDC_SCOPE
ARG VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO
ARG VITE_SENTRY_DSN

COPY . /app
RUN yarn build

# =============================
FROM nginx:1.17 as production
# =============================

# Nginx runs with user "nginx" by default
COPY --from=staticbuilder --chown=nginx:nginx /app/build /usr/share/nginx/html

COPY .prod/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
