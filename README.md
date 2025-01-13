[![codecov](https://codecov.io/gh/City-of-Helsinki/kukkuu-ui/branch/develop/graph/badge.svg)](https://codecov.io/gh/City-of-Helsinki/kukkuu-ui)
![Build & Staging](https://github.com/City-of-Helsinki/kukkuu-ui/workflows/Build%20&%20Staging%20&%20Accept/badge.svg)

# Public UI for the Culture Kids (Kulttuurin kummilapset)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [About](#about)
- [Service architecture](#service-architecture)
  - [Environments](#environments)
  - [Frameworks and Libraries](#frameworks-and-libraries)
- [Development](#development)
  - [Requirements](#requirements)
  - [Getting started](#getting-started)
    - [Running using local Node.js](#running-using-local-nodejs)
    - [Running using Docker](#running-using-docker)
    - [Running the Kukkuu backend locally](#running-the-kukkuu-backend-locally)
    - [Creating a user profile](#creating-a-user-profile)
  - [.env variables](#env-variables)
  - [Authorizing login to Kukkuu-UI and integrating to Kukkuu API](#authorizing-login-to-kukkuu-ui-and-integrating-to-kukkuu-api)
    - [Setup authorization service](#setup-authorization-service)
    - [JWT issuance for browser tests](#jwt-issuance-for-browser-tests)
  - [Husky Git Hooks](#husky-git-hooks)
    - [Pre-commit Hook](#pre-commit-hook)
    - [Commit-msg Hook](#commit-msg-hook)
- [Available Scripts](#available-scripts)
  - [`yarn start`](#yarn-start)
  - [`yarn build`](#yarn-build)
  - [`yarn serve`](#yarn-serve)
  - [`yarn generate:graphql`](#yarn-generategraphql)
  - [`yarn test`](#yarn-test)
  - [`yarn test:browser`](#yarn-testbrowser)
- [Headless CMS](#headless-cms)
  - [Headless CMS React Components -lib](#headless-cms-react-components--lib)
- [Releases, changelogs and deployments](#releases-changelogs-and-deployments)
  - [Conventional Commits](#conventional-commits)
  - [Releasable units](#releasable-units)
  - [Configuration](#configuration)
  - [Troubleshoting release-please](#troubleshoting-release-please)
    - [Fix merge conflicts by running release-please -action manually](#fix-merge-conflicts-by-running-release-please--action-manually)
  - [Deployments](#deployments)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## About

**What?**

In the Culture Kids project the City promises that every child born in Helsinki from 2020 on will have an artistic or cultural institution as a “culture guardian”, through which the child and his family will get a personal connection to art. This collaboration is to be continued until the child goes to school.

Participation in the cultural activities planned for the child's age contributes to the artistic development of the child and the well-being of the family, while providing the family with a connection to the society. This action implements the right of the child to art and culture (UNESCO).

**How?**

The parents of the child will receive the invitation letter sent by the children´s counselor (Lasten neuvola). Those wishing to participate sign up for the project through this service. The art & culture institute will then send those families information about the events via e-mail. Families will book events suitable for them using this project. Events are free to attend for the families.

**When?**

Children born in 2020 will become the children of the Helsinki Philharmonic Orchestra. From 2021 onwards, every year a new form of art will be added to the project.

The cities´ Children´s Councilors (lasten neuvolat) and Early Childhood Education are involved in this project and will communicate as experts.

## Service architecture

The Culture kids service consists of:

- **[Kukkuu API](https://github.com/City-of-Helsinki/kukkuu):** The API backend service - The primary source of data.
- **[Admin UI](https://github.com/City-of-Helsinki/kukkuu-admin):** A restricted UI where the events are maintained and published.
- **[Public UI](https://github.com/City-of-Helsinki/kukkuu-ui):** (This service). The frontend service where the kids can view and enrol in culture events.
- **[Headless CMS](https://github.com/City-of-Helsinki/headless-cms):** Content Management Service that provides dynamic pages and dynamic content for the public UI. It also provides content for the header and the footer. A React component library can be found from https://github.com/City-of-Helsinki/react-helsinki-headless-cms.
- **[Notification Service API](https://github.com/City-of-Helsinki/notification-service-api):** A service used by the Kukkuu API to send SMS messages.
- **Mailer:** A service used by the Kukkuu API to send emails.

### Environments

The public client environments (this service):

- **Production environment:** https://kummilapset.hel.fi/
- **Staging environment:** https://kukkuu-ui.stage.hel.ninja/
- **Testing environment:** https://kukkuu-ui.test.hel.ninja/

The headless CMS environments:

- **Production environment:** https://kukkuu.content.api.hel.fi/graphql
- **Testing environment:** https://kukkuu.app-staging.hkih.hion.dev/graphql

The API environments:

- **Production environment:** https://kukkuu.api.hel.fi/graphql
- **Staging environment:** https://kukkuu.api.stage.hel.ninja/graphql
- **Testing environment:** https://kukkuu.api.test.hel.ninja/graphql

The admin client environments:

- **Production environment:** https://kummilapset-admin.hel.fi/
- **Staging environment:** https://kukkuu-admin.stage.hel.ninja/
- **Testing environment:** https://kukkuu-admin.test.hel.ninja/

### Frameworks and Libraries

This project is built using the following key frameworks and libraries:

- **[Vite](https://vite.dev/):** A modern frontend build tool that provides a fast and efficient development experience. It offers features like instant server start, hot module replacement, and optimized builds.
- **[React](https://react.dev/):** A JavaScript library for building user interfaces. It allows for the creation of reusable UI components and efficient management of application state.
- **[Apollo](https://www.apollographql.com/docs/react):** Apollo Client is a comprehensive state management library for JavaScript. It enables you to manage both local and remote data with GraphQL.
- **[React Helsinki Headless CMS -library](https://github.com/City-of-Helsinki/react-helsinki-headless-cms/):** React Helsinki Headless CMS - is a highly customized component library based on HDS. It is designed for Helsinki City Web applications which are using preconfigured Wordpress Headless CMS environments (compatible with the library). This library is a set of unified visual components.

## Development

### Requirements

Compatibility defined by [Dockerfile](./Dockerfile):

- Node.js 20.x
- Yarn 1.x

### Getting started

1. Clone this repository
2. If you're new to multiple `.env*` files, read Vite's [Env Variables and Modes](https://vite.dev/guide/env-and-mode)
3. If you're new to multiple Docker compose files, read Docker's [Merge Compose Files](https://docs.docker.com/compose/how-tos/multiple-compose-files/merge/)
4. Follow the instructions below for your preferred way of running this app:
   - [Running using local Node.js](#running-using-local-nodejs) **or**
   - [Running using Docker & Docker compose](#running-using-docker)

#### Running using local Node.js

Using the following instructions you should be able to:

- Run this UI using local Node.js
- Run the Kukkuu backend locally in Docker or use the public test environment's backend
- Use the public test environments of Helsinki Profile and Keycloak for authentication

1. Install the [requirements](#requirements)
2. If you want to use the [public test environment's backend](https://kukkuu.api.test.hel.ninja/graphql):
   - Delete `.env.development.local` file, if you have it left over, so `.env.development` is used
3. If you want to run the Kukkuu backend locally:
   - Copy `.env.development.local.example` to `.env.development.local` (used as env_file for environment variables)
   - Set up the backend by following the steps in [Running the Kukkuu backend locally](#running-the-kukkuu-backend-locally)
4. Run `yarn` to install dependencies
5. Run `yarn start` to run the app
6. Open http://localhost:3000 to view the app in the browser.
7. [Create a user profile](#creating-a-user-profile) if you want to test that authentication and backend connection work.

#### Running using Docker

Using the following instructions you should be able to:

- Run this UI using Docker & Docker compose
- Run the Kukkuu backend locally in Docker or use the public test environment's backend
- Use the public test environments of Helsinki Profile and Keycloak for authentication

1. If you want to run the Kukkuu backend locally:
   - Copy `compose.override.yaml.example` to `compose.override.yaml` (used for build args and setting the env_file)
   - Copy `.env.development.local.example` to `.env.development.local` (used as env_file for environment variables)
   - Set up the backend by following the steps in [Running the Kukkuu backend locally](#running-the-kukkuu-backend-locally)
2. If you want to use the [public test environment's backend](https://kukkuu.api.test.hel.ninja/graphql):
   - Delete `compose.override.yaml`, if you have it left over, so `compose.yaml` is used
3. Run `docker compose up` to run the app
   - Later if there are changes that need rebuilding the container, run `docker compose up --build`
4. Open http://localhost:3000 to view the app in the browser.
5. [Create a user profile](#creating-a-user-profile) if you want to test that authentication and backend connection work.

#### Running the Kukkuu backend locally

If you want to run the Kukkuu backend locally:

- Clone the [backend repo](https://github.com/City-of-Helsinki/kukkuu)
- Follow its README to run it locally in Docker
- After this the backend should be running at http://localhost:8081/graphql (i.e. the value of `VITE_API_URI`)
  using public Keycloak test environment for authentication.

#### Creating a user profile

This can be done after you have set up the backend and the UI is running.

Log in to the UI—follow the instructions to create a test environment Helsinki Profile profile
if you don't already have one—and create a user profile to the used Kukkuu backend. By default
using year 2020 as the child's birthyear, Helsinki as their home municipality and checking the
"I assure that the information I have provided is correct" checkbox should work.

### .env variables

Change VITE_ELIGIBLE_CITIES if you wish to use the project in another city or municipality.

### Authorizing login to Kukkuu-UI and integrating to Kukkuu API

User needs to be authorized to be able to log in with Kukkuu UI to Kukkuu API. For this, an authorization service is needed.

> **NOTE:** The Kukkuu API and Kukkuu UI must be configured to use the same authorization service for authorization to work.

#### Setup authorization service

By default the public test Keycloak environment is used as the authentication service (More details in
[Using the Helsinki-Profile Keycloak](./docs/setup-keycloak.md)). This is the recommended way for development.

Only if you need a fully local environment, including the authentication service, Tunnistamo is recommended
to be set up locally instead as the authentication service (See [Setting up Tunnistamo and Kukkuu API locally with Docker](./docs/setup-tunnistamo.md)).
You can try to set up Keycloak locally too, but unfortunately there are no instructions for this, as it has not been attempted.

#### JWT issuance for browser tests

This section describes how JSON Web Tokens (JWT) are issued for browser tests.

In browser tests, we want to bypass the regular authentication flow and directly issue JWTs for testing user roles and permissions. This is achieved by mocking the authentication service and providing pre-generated JWTs with specific claims.

**How it works:**

- **[`clientUtils`](./browser-tests/utils/jwt/clientUtils/):** Contains helper functions that run within the Testcafe browser environment. These functions utilize Testcafe's [`ClientFunction`](https://testcafe.io/documentation/402832/guides/basic-guides/client-functions) to interact with the browser and manage JWTs.
- **[`mocks`](./browser-tests/utils/jwt/mocks/):** Provides functions to intercept network requests to the authentication service and replace them with mocked responses containing the test JWTs. This prevents actual authentication and allows us to control the user context during tests.
- **[`config`](./browser-tests/utils/jwt/config/):** Holds configuration settings for the JWT library used in browser tests.
- **[`jwt`](./browser-tests/utils/jwt/jwt.ts):** Contains utilities to create and sign JWTs symmetrically. The API needs to be configured with the same secret key to verify these tokens.
- **[`oidc`](./browser-tests/utils/jwt/oidc.ts):** Adapts the generated JWTs to a format compatible with the OpenID Connect (OIDC) client used in the application.
- **[`services`](./browser-tests/utils/jwt/services.ts):** Includes helper functions for managing test data, such as selecting an admin project for the test user. These functions make actual API calls (not mocked) to prepare the test environment.

**Key points:**

- The API and the client app (Kukkuu UI) must share the same secret key (`BROWSER_TESTS_JWT_SIGN_SECRET`) for JWT verification.
- The `BROWSER_TESTS_JWT_AD_GROUP` environment variable defines the Active Directory group used for the test user, which should have admin privileges in the API.
- Several environment variables are used to configure the JWT mocking and testing environment.

### Husky Git Hooks

This project uses [Husky](https://typicode.github.io/husky/#/) to manage Git hooks. Husky is configured to run specific scripts before committing changes to ensure code quality and consistency.

#### Pre-commit Hook

The pre-commit hook is configured to run the following commands:

```sh
yarn doctoc .
yarn lint-staged
```

- `yarn doctoc .`: This command updates the table of contents in your markdown files.
- `yarn lint-staged`: This command runs linting on staged files to ensure they meet the project's coding standards. The lint-staged configuration can be found from [.lintstagedrc.json](./.lintstagedrc.json).

> NOTE: `doctoc` and `husky` does not work seamlessly together, since the `doctoc` does update the TOCs of the markdown files, but does not reject the pre-commit hook execution, and only leaves the refactored files as unstaged in Git.

#### Commit-msg Hook

The commit-msg hook is configured to run the following command:

```sh
npx --no-install commitlint --edit "$1"
```

- `npx --no-install commitlint --edit "$1"`: This command uses [Commitlint](https://commitlint.js.org/#/) to lint commit messages based on the project's commit message conventions. This repo follows the [Conventional Commits](#conventional-commits).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

See more from [CLI guide](https://vitejs.dev/guide/cli.html#vite).

### `yarn build`

Builds the app for production to the `build` directory.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [building for production](https://vitejs.dev/guide/build.html) and [CLI guide](https://vitejs.dev/guide/cli.html#vite-build) for more information.

### `yarn serve`

Locally preview the production build built with `yarn build`.

**NOTE**: If you get a white screen on startup, try opening the devtools console
in the browser, there could be e.g. errors related to missing
environment variable values.

Do not use this as a production server as it's not designed for it!
See more from [CLI guide](https://vitejs.dev/guide/cli.html#vite-preview).

### `yarn generate:graphql`

Fetches the GraphQL schema from the backend (at `VITE_API_URI` in `.env.development.local`) and updates typing information.
The configuration is written in [codegen.ts](./codegen.ts).

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See Vitest's [Getting started](https://vitest.dev/guide/) for more information.

### `yarn test:browser`

Runs browser tests against your local version of the application (assumes port `3001`).

- The `yarn test:browser:ci` variant of this command is meant to run in the CI, and it targets the staging server. It uses headless mode and may therefore behave differently compared to the local test runner.
- The deployment pipelines are running the browser tests as automated actions. They are run against PR and staging environments when after they have been built and deployed.
- See also [JWT issuance for browser tests](#jwt-issuance-for-browser-tests)

To run browser tests locally, you need to configure the browser testing environment:

1. Run a local Kukkuu API instance with the browser testing JWT features set on. This allows the UI client to issue new JWTs for authorization by itself.
2. Run a local Kukkuu UI.
3. Carefully double-check that the UI instance is configured to use the local API. The browser test JWT token configurations also need to match in order to successfully verify the newly issued tokens. You can navigate through the UI manually to see that everything is working as expected.
4. Run the browser test with `yarn test:browser` or `yarn test:browser:ci`.

For configuration, check the following environment variables:

1. `BROWSER_TESTS_JWT_SIGN_SECRET` needs to be a valid 256 bits token and it needs to be configured the same in both, the API and in the Kukkuu UI in order to verify the self issued JWT for browser testing.
2. `BROWSER_TESTS_PROJECT_YEAR` defines the (year) project that is used for new child. This matters muc, because the year should linked to the browser test user group in the API.
3. `BROWSER_TESTS_ENV_URL` tells for Testcafe where the testable UI is
4. `VITE_API_URI` defines the Kukkuu API GraphQL endpoint. It's important in browser testing configuration for JWT mocking reasons.
5. `VITE_OIDC_KUKKUU_API_CLIENT_ID` OIDC config that is needed in JWT mocking.
6. `VITE_OIDC_CLIENT_ID` OIDC config that is needed in JWT mocking.
7. `VITE_OIDC_AUTHORITY` OIDC config that is needed in JWT mocking.

There is an [.env.test.local.example](.env.test.local.example) that can be copied to a file named `.env.test.local`. If the `.env.test.local` is present, it will be used during the local Testcafe runs.

## Headless CMS

A headless CMS system is used to produce some dynamic pages, but also the header and the footer contents for the UI (layout). The Headless CMS server endpoint is set with `VITE_CMS_URI` environment variable.

The default server that is used is the test / staging server:

```
VITE_CMS_URI="https://kukkuu.app-staging.hkih.hion.dev/graphql"
```

See the available servers from [Environments](#environments).

To login to the Wordpress admin UI, use

- `/wp/wp-admin/` -endpoint, if the credentials you are using are Entra ID -credentials
- `/wp-login.php` -endpoint, if the credentials you are using are not Entra ID -credentials.

### Headless CMS React Components -lib

> Git repository: https://github.com/City-of-Helsinki/react-helsinki-headless-cms/

The React Helsinki Headless CMS is a React component library developed by the City of Helsinki to facilitate the creation of web applications that interact with a headless WordPress CMS. This library provides a suite of pre-built components and utilities designed to streamline the development process and ensure consistency across various applications.

The architecture of the React Helsinki Headless CMS is modular and designed for flexibility:

- Component-Based Structure: The library is organized into reusable React components, each responsible for a specific piece of functionality or UI element. This modularity allows developers to compose applications efficiently by assembling these components as needed.
- Integration with Headless CMS: The library is tailored to work seamlessly with headless WordPress CMS environments. It relies on GraphQL schemas to fetch and present content, making it heavily dependent on the structure and features of the connected WordPress instance.
- Apollo Client Integration: For data management, the library utilizes Apollo Client to handle GraphQL queries and mutations. Developers are expected to provide an Apollo client linked to a GraphQL endpoint with a supported schema (headless CMS) in the apolloClient field of the configuration object.

## Releases, changelogs and deployments

The used environments are listed in [Service environments](#service-environments).

The application uses automatic semantic versions and is released using [Release Please](https://github.com/googleapis/release-please).

> Release Please is a GitHub Action that automates releases for you. It will create a GitHub release and a GitHub Pull Request with a changelog based on conventional commits.

Each time you merge a "normal" pull request, the release-please-action will create or update a "Release PR" with the changelog and the version bump related to the changes (they're named like `release-please--branches--master--components--kukkuu-ui`).

To create a new release for an app, this release PR is merged, which creates a new release with release notes and a new tag. This tag will be picked by Azure pipeline and trigger a new deployment to staging. From there, the release needs to be manually released to production.

When merging release PRs, make sure to use the "Rebase and merge" (or "Squash and merge") option, so that Github doesn't create a merge commit. All the commits must follow the conventional commits format. This is important, because the release-please-action does not work correctly with merge commits (there's an open issue you can track: [Chronological commit sorting means that merged PRs can be ignored ](https://github.com/googleapis/release-please/issues/1533)).

See [Release Please Implementation Design](https://github.com/googleapis/release-please/blob/main/docs/design.md) for more details.

And all docs are available here: [release-please docs](https://github.com/googleapis/release-please/tree/main/docs).

### Conventional Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) to ensure that the changelogs are generated correctly.

### Releasable units

Release please goes through commits and tries to find "releasable units" using commit messages as guidance - it will then add these units to their respective release PR's and figures out the version number from the types: `fix` for patch, `feat` for minor, `feat!` for major. None of the other types will be included in the changelog. So, you can use for example `chore` or `refactor` to do work that does not need to be included in the changelog and won't bump the version.

### Configuration

The release-please workflow is located in the [release-please.yml](./.github/workflows/release-please.yml) file.

The configuration for release-please is located in the [release-please-config.json](./release-please-config.json) file.
See all the options here: [release-please docs](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md).

The manifest file is located in the [release-please-manifest.json](./.release-please-manifest.json) file.

When adding a new app, add it to both the [release-please-config.json](./release-please-config.json) and [release-please-manifest.json](./.release-please-manifest.json) file with the current version of the app. After this, release-please will keep track of versions with [release-please-manifest.json](./.release-please-manifest.json).

### Troubleshoting release-please

If you were expecting a new release PR to be created or old one to be updated, but nothing happened, there's probably one of the older release PR's in pending state or action didn't run.

1. Check if the release action ran for the last merge to main. If it didn't, run the action manually with a label.
2. Check if there's any open release PR. If there is, the work is now included on this one (this is the normal scenario).
3. If you do not see any open release PR related to the work, check if any of the closed PR's are labeled with `autorelease: pending` - ie. someone might have closed a release PR manually. Change the closed PR's label to `autorelease: tagged`. Then go and re-run the last merge workflow to trigger the release action - a new release PR should now appear.
4. Finally check the output of the release action. Sometimes the bot can't parse the commit message and there is a notification about this in the action log. If this happens, it won't include the work in the commit either. You can fix this by changing the commit message to follow the [Conventional Commits](https://www.conventionalcommits.org/) format and rerun the action.

**Important!** If you have closed a release PR manually, you need to change the label of closed release PR to `autorelease: tagged`. Otherwise, the release action will not create a new release PR.

**Important!** Extra label will force release-please to re-generate PR's. This is done when action is run manually with prlabel -option

Sometimes there might be a merge conflict in release PR - this should resolve itself on the next push to main. It is possible run release-please action manually with label, it should recreate the PR's. You can also resolve it manually, by updating the [release-please-manifest.json](./.release-please-manifest.json) file.

#### Fix merge conflicts by running release-please -action manually

1. Open [release-please github action](https://github.com/City-of-Helsinki/kukkuu-ui/actions/workflows/release-please.yml)
2. Click **Run workflow**
3. Check Branch is **master**
4. Leave label field empty. New label is not needed to fix merge issues
5. Click **Run workflow** -button

There's also a CLI for debugging and manually running releases available for release-please: [release-please-cli](https://github.com/googleapis/release-please/blob/main/docs/cli.md)

### Deployments

When a Release-Please pull request is merged and a version tag is created (or a proper tag name for a commit is manually created), this tag will be picked by Azure pipeline, which then triggers a new deployment to staging. From there, the deployment needs to be manually approved to allow it to proceed to the production environment.

The tag name is defined in the [azure-pipelines-release.yml](./azure-pipelines-release.yml).
