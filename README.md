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
  - [Getting started](#getting-started)
  - [.env variables](#env-variables)
  - [Authorizing login to Kukkuu-UI and integrating to Kukkuu API](#authorizing-login-to-kukkuu-ui-and-integrating-to-kukkuu-api)
    - [Setup authorization service](#setup-authorization-service)
    - [Setup Kukkuu API backend](#setup-kukkuu-api-backend)
      - [Using local Kukkuu API backend](#using-local-kukkuu-api-backend)
      - [Using remote Kukkuu API backend](#using-remote-kukkuu-api-backend)
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

### Getting started

1. Clone the repo.
2. Use file `.env.development.local` to modify environment variables if needed. There is an example of that in `.env.development.local.example` For more info, check [this](https://vite.dev/guide/env-and-mode).
3. Run either
   - `yarn start` to run the app normally **or**
   - `docker compose up` to run the app in a Docker container. In the future, when there are changes that need rebuilding the container, run `docker compose up --build` instead. See docker-compose.yml for build arguments (comapre to .env.development.local.example)
4. Open [http://localhost:3001](http://localhost:3001) to view the app in the browser.

For isolated developing environment, you can use our Docker instructions.

### .env variables

Change VITE_ELIGIBLE_CITIES if you wish to use the project in another city or municipality.

### Authorizing login to Kukkuu-UI and integrating to Kukkuu API

You need to authorize the user you are trying to log in with to Kukkuu-UI. In order to log in an authorization service is needed.

> **NOTE:** The Kukkuu API needs to be configured to use the same authorization service as the Kukkuu UI is using, because only then the authorization can be verified.

#### Setup authorization service

Setup authorization service:

- **Use public test Keycloak**: The primary option. See [Using the Helsinki-Profile Keycloak](./docs/setup-keycloak.md).
- **Use a local Tunnistamo**: For a full local environment, see [Setting up Tunnistamo and Kukkuu API locally with Docker](./docs/setup-tunnistamo.md).

#### Setup Kukkuu API backend

You can use the public Kukkuu API from the test environment or set up a local Kukkuu API. It should be noted that in the public test environment, the data is shared with other users. If you want to test with your own data and have an isolated system, you need to set up a local API.

Choose the environment:

- **Use a public test environment API**: Check that your environment variables are set correctly. The examples are given in [.env.development.local.example](./.env.development.local.example).
- **Setup Kukkuu API locally**: See [Use Kukkuu API locally](./docs/setup-local-kukkuu-api.md).

##### Using local Kukkuu API backend

If you're using a local Kukkuu API backend (`VITE_API_URI=http://localhost:8081/graphql`), you can easily grant staff privileges to your user account. Here's how:

1. **Start the backend:** Ensure your local Kukkuu API backend is running.

2. **Access the Django admin interface:**

   - Open the Django admin interface: `http://localhost:8081/admin/`
   - Log in with the default credentials: username `admin`, password `admin`. If you don't have an admin user yet, you can create one with `python manage.py createsuperuser`.

3. **Login to Kukkuu-UI:**
   - Attempt to log in to Kukkuu-UI (`http://localhost:3000/`). This will create a user account in the backend if one doesn't exist.

##### Using remote Kukkuu API backend

If you're using a remote Kukkuu backend (e.g., the test environment; `VITE_API_URI=https://kukkuu.api.test.hel.ninja/graphql`), you'll need to grant staff privileges to your user account. Here's how:

1. **Obtain Django admin credentials:**

   - Contact the administrator of the remote backend to get the credentials.
   - If you have access to the backend pod, you can create a superuser by running `python manage.py createsuperuser` in the pod's terminal.

2. **Access the Django admin interface:**

   - Open the Django admin interface for the remote backend (e.g., `https://kukkuu.api.test.hel.ninja/admin`).
   - Log in using the credentials from step 1.

3. **Login to Kukkuu-UI:**
   - Attempt to log in to Kukkuu-UI (`http://localhost:3000/`). This will create a user account in the backend if one doesn't exist.

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

- `npx --no-install commitlint --edit "$1"`: This command uses [Commitlint](https://commitlint.js.org/#/) to lint commit messages based on the project's commit message conventions. This repo follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) -rules.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Aliases: `vite dev`, `vite serve`.<br>
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

Locally preview the production build. Do not use this as a production server as it's not designed for it.
See more from [CLI guide](https://vitejs.dev/guide/cli.html#vite-preview).

### `yarn generate:graphql`

Fetches the GraphQL schema from the backend and updates typing information. The configuration is written in [codegen.ts](./codegen.ts). Check that the environment variables are set properly to match with your API.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [Getting started](https://vitest.dev/guide/) for more information.

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
