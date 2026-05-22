# ============================================================
# STAGE 1: Build the Static Assets
# ============================================================
FROM helsinki.azurecr.io/ubi9/nodejs-24-pnpm-builder-base AS appbase
WORKDIR /app

# 1. Copy needed files for build
COPY --chown=default:root package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json tsconfig.node.json ./
COPY --chown=default:root ./public ./public
COPY --chown=default:root ./scripts ./scripts

# 2. Run the install
# corepack in the base image will automatically use the version of pnpm
# defined in your package.json 'packageManager' field if present.
RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm store prune
RUN pnpm update-runtime-env

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

# Perform the build
ARG VITE_SENTRY_RELEASE
RUN pnpm build


# ============================================================
# STAGE 4: Production Runtime
# ============================================================
FROM helsinki.azurecr.io/ubi10/nginx-126-spa-standard AS production

ARG VITE_SENTRY_RELEASE
ENV APP_RELEASE=${VITE_SENTRY_RELEASE:-""}
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

