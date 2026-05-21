# ============================================================
# STAGE 1: Build the Static Assets
# ============================================================
FROM helsinki.azurecr.io/ubi9/nodejs-24-pnpm-builder-base AS appbase
WORKDIR /app

# 1. Copy needed files for build
COPY --chown=default:root package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json tsconfig.node.json ./
COPY --chown=default:root ./public ./public

# 2. Run the install
# corepack in the base image will automatically use the version of pnpm
# defined in your package.json 'packageManager' field if present.
RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm store prune

# 3. Copy remaining source files
COPY --chown=default:root index.html vite.config.ts eslint.config.js .prettierrc.json .env* ./
COPY --chown=default:root ./src ./src


# ============================================================
# STAGE 2: Development
# ============================================================
FROM appbase AS development
WORKDIR /app

# Set NODE_ENV to development in the development container
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# Enable hot reload by default by polling for file changes.
#
# NOTE: Can be disabled by setting CHOKIDAR_USEPOLLING=false in file `.env`
#       if hot reload works on your system without polling to save CPU time.
ARG CHOKIDAR_USEPOLLING=true
ENV CHOKIDAR_USEPOLLING=${CHOKIDAR_USEPOLLING}

# Expose port and start development server
EXPOSE 8080
CMD pnpm exec vite --port 8080 --no-open --host


# ============================================================
# STAGE 3: Static builder for production
# ============================================================
FROM appbase AS staticbuilder

# Accept Vite build-time variables from CI/CD docker --build-arg values.
ARG VITE_ENVIRONMENT
ARG VITE_ORIGIN
ARG VITE_API_URI
ARG VITE_CMS_URI
ARG VITE_APPLICATION_NAME
ARG VITE_VERSION
ARG VITE_ELIGIBLE_CITIES
ARG VITE_OIDC_AUTHORITY
ARG VITE_OIDC_CLIENT_ID
ARG VITE_OIDC_KUKKUU_API_CLIENT_ID
ARG VITE_OIDC_SCOPE
ARG VITE_OIDC_RETURN_TYPE
ARG VITE_OIDC_SERVER_TYPE
ARG VITE_OIDC_AUDIENCES
ARG VITE_OIDC_AUTOMATIC_SILENT_RENEW_ENABLED
ARG VITE_OIDC_SESSION_POLLING_INTERVAL_MS
ARG VITE_IDLE_TIMEOUT_IN_MS
ARG VITE_HELSINKI_PROFILE_URL
ARG VITE_MATOMO_URL_BASE
ARG VITE_MATOMO_SITE_ID
ARG VITE_MATOMO_SRC_URL
ARG VITE_MATOMO_ENABLED
ARG VITE_APOLLO_PERSISTED_CACHE_TIME_TO_LIVE_MS
ARG VITE_ENROLMENT_CANCELLATION_TIME_LIMIT_HOURS
ARG VITE_FEATURE_FLAG_SHOW_CORONAVIRUS_INFO
ARG VITE_ADMIN_TICKET_VALIDATION_URL
ARG VITE_SENTRY_DSN
ARG VITE_SENTRY_ENVIRONMENT
ARG VITE_SENTRY_RELEASE
ARG VITE_SENTRY_TRACES_SAMPLE_RATE
ARG VITE_SENTRY_TRACE_PROPAGATION_TARGETS
ARG VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE
ARG VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE

# Perform the build
ARG REACT_APP_SENTRY_RELEASE
RUN pnpm build


# ============================================================
# STAGE 4: Production Runtime
# ============================================================
FROM helsinki.azurecr.io/ubi10/nginx-126-spa-standard AS production

ARG REACT_APP_SENTRY_RELEASE
ENV APP_RELEASE=${REACT_APP_SENTRY_RELEASE:-""}
# 1. Copy the compiled assets
COPY --from=staticbuilder /app/build /usr/share/nginx/html

# 2. Setup Runtime Env Injection
# env.sh is provided by the base image
WORKDIR /usr/share/nginx/html
COPY .env .

# 3. Inject Versioning for the /readiness endpoint from package.json using base image
COPY package.json .

# - env.sh      (Inherited from base image at /usr/share/nginx/html/env.sh)
# - USER 1001   (Inherited from base image)
# - EXPOSE 8080 (Inherited from base image)
# - ENTRYPOINT/CMD (Inherited from base image)

