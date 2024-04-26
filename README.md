[![codecov](https://codecov.io/gh/City-of-Helsinki/kukkuu-ui/branch/develop/graph/badge.svg)](https://codecov.io/gh/City-of-Helsinki/kukkuu-ui)
![Build & Staging](https://github.com/City-of-Helsinki/kukkuu-ui/workflows/Build%20&%20Staging%20&%20Accept/badge.svg)

# UI for Kulttuurin kummilapset / Culture Kids

## About

### What?

In the Culture Kids project the City promises that every child born in Helsinki from 2020 on will have an artistic or cultural institution as a “culture guardian”, through which the child and his family will get a personal connection to art. This collaboration is to be continued until the child goes to school.

Participation in the cultural activities planned for the child's age contributes to the artistic development of the child and the well-being of the family, while providing the family with a connection to the society. This action implements the right of the child to art and culture (UNESCO).

### How?

The parents of the child will receive the invitation letter sent by the children´s counselor (Lasten neuvola). Those wishing to participate sign up for the project through this service. The art & culture institute will then send those families information about the events via e-mail. Families will book events suitable for them using this project. Events are free to attend for the families.

### When?

Children born in 2020 will become the children of the Helsinki Philharmonic Orchestra. From 2021 onwards, every year a new form of art will be added to the project.

The cities´ Children´s Councilors (lasten neuvolat) and Early Childhood Education are involved in this project and will communicate as experts.

## Deployments

Production environment:
https://kummilapset.hel.fi

Testing environment:
https://kukkuu-ui.test.kuva.hel.ninja/

## See also

The backend:
https://github.com/City-of-Helsinki/kukkuu

The administration interface:
https://github.com/City-of-Helsinki/kukkuu-admin

## Issues board

https://helsinkisolutionoffice.atlassian.net/projects/KK/issues/?filter=allissues

## Development

### Getting started

- Clone the repo.
- Create `.env.development.local` from `.env.development` if you need to modify some environment variable. For more, check [this](https://create-react-app.dev/docs/adding-custom-environment-variables#docsNav)
- Run `yarn start`.

For isolated developing environment, you can use our Docker instructions.

### .env variables

Change VITE_ELIGIBLE_CITIES if you wish to use the project in another city or municipality.

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

Builds the app for production.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [building for production](https://vitejs.dev/guide/build.html) and [CLI guide](https://vitejs.dev/guide/cli.html#vite-build) for more information.

### `yarn serve`

Locally preview the production build. Do not use this as a production server as it's not designed for it.
See more from [CLI guide](https://vitejs.dev/guide/cli.html#vite-preview).

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [Getting started](https://vitest.dev/guide/) for more information.

### `yarn generate:graphql`

Generate static types for GraphQL queries by using the schema from the backend server.

### `yarn test:browser`

This command runs the browser tests. This is meant for developer usage. It runs browser tests with live and development modes e.g. open browser to follow test run and diagnose errors. It uses github login. Sometimes github login asks device verification and it is recommended to use github mobile for verification.

The command should warn when some of the necessary environment is missing. You should provide at least the following: `BROWSER_TESTS_USER_NAME`, `BROWSER_TESTS_USER_PASSWORD` and `BROWSER_ENV_URL`. The two first are personal github credentials. It is possible use helsinki-tunnus test credentials by remove option '--dev' from package.json. Test credentials you can find from from the vault secrets share/kukkuu-admin.

`BROWSER_ENV_URL` is url to the service. It can be local or hosted (staging/review). NOTE: url should not end with '/' or tests will fail!!

### `yarn test:browser:ci`

Browser tests are ran with GitHub actions on new PRs and merges into master. The command runs the tests in headless mode. It uses helsinki-tunnus login.

## Docker

`docker-compose up` to start the dockerized dev-environment. Not for production!!!  
`docker-compose down` stops the container.

## Setting up development environment locally with docker

### Set tunnistamo hostname

Add the following line to your hosts file (`/etc/hosts` on mac and linux):

    127.0.0.1 tunnistamo-backend

### Create a new OAuth app on GitHub

Go to https://github.com/settings/developers/ and add a new app with the following settings:

- Application name: can be anything, e.g. local tunnistamo
- Homepage URL: http://tunnistamo-backend:8000
- Authorization callback URL: http://tunnistamo-backend:8000/accounts/github/login/callback/

Save. You'll need the created **Client ID** and **Client Secret** for configuring tunnistamo in the next step.

### Login provider configurations

Set the environment variables so that the OIDC client gets configured properly:

The configuration constants are [here](./src/domain/auth/constants.ts).
An example of a full working configuration can be seen [here](./src/domain/auth/README.md).

### Install local tunnistamo

Clone https://github.com/City-of-Helsinki/tunnistamo/.

Follow the instructions for setting up tunnistamo locally. Before running `docker-compose up` set the following settings in tunnistamo roots `docker-compose.env.yaml`:

- SOCIAL_AUTH_GITHUB_KEY: **Client ID** from the GitHub OAuth app
- SOCIAL_AUTH_GITHUB_SECRET: **Client Secret** from the GitHub OAuth app

After you've got tunnistamo running locally, ssh to the tunnistamo docker container:

`docker-compose exec django bash`

and execute the following four commands inside your docker container:

```bash
./manage.py add_oidc_client -n kukkuu-ui -t "id_token token" -u "http://localhost:3000/callback" "http://localhost:3000/silent_renew.html" -i https://api.hel.fi/auth/kukkuu-ui -m github -s dev
./manage.py add_oidc_client -n kukkuu-api -t "code" -u http://localhost:8081/return -i https://api.hel.fi/auth/kukkuu -m github -s dev -c
./manage.py add_oidc_api -n kukkuu -d https://api.hel.fi/auth -s email,profile -c https://api.hel.fi/auth/kukkuu
./manage.py add_oidc_api_scope -an kukkuu -c https://api.hel.fi/auth/kukkuu -n "Kulttuurin kummilapset" -d"Lorem ipsum"
./manage.py add_oidc_client_to_api_scope -asi https://api.hel.fi/auth/kukkuu -c https://api.hel.fi/auth/kukkuu-ui
```

### Install kukkuu locally

Clone the repository (https://github.com/City-of-Helsinki/kukkuu). Follow the instructions for running kukkuu with docker. Before running `docker-compose up` set the following settings in kukkuu roots `docker-compose.env.yaml`:

- DEBUG=1
- CORS_ORIGIN_ALLOW_ALL=1
- TOKEN_AUTH_AUTHSERVER_URL=http://tunnistamo-backend:8000/openid
- APPLY_MIGRATIONS=1
- CREATE_SUPERUSER=1
- TOKEN_AUTH_AUTHSERVER_URL=http://tunnistamo-backend:8000/openid
- MEDIA_ROOT=/app/var/

### Headless CMS

A headless CMS system is used to produce some dynamic pages. The Headless CMS server endpoint is set with `VITE_CMS_URI` environment variable.

The default server that is used is the test / staging server:

```
VITE_CMS_URI="https://kukkuu.hkih.stage.geniem.io/graphql"
```

### kukkuu-ui

Run `docker-compose up`, now the app should be running at `http://localhost:3000/`!
`docker-compose down` stops the container.

OR

Run `yarn && yarn start`

## Debugging

### Debugging project in VS Code

To debug in VS Code:

1. Install the "Debugger for Chrome" extension to VS Code
2. Run `yarn start`
3. Set a breakpoint
4. Run "Chrome" debug configuration in VS Code
5. Reload the project in your browser

### Debugging Tests in VS Code

No plugin is needed.

1. Set a breakpoint
2. Run the "Debug tests" debugger configuration

### Debugging Tests in Chrome

We recommend using VS Code's debugger.

1. Place a `debugger;` statement in any test
2. Run yarn `test:debug`
3. Open `about:inspect` in Chrome
4. Select `inspect` on you process, press Play and you're good to go.

See more detailed instructions here:
https://create-react-app.dev/docs/debugging-tests#debugging-tests-in-chrome

### Debug Redux state

Redux internal state can be visualized with [Redux-devtools](https://github.com/zalmoxisus/redux-devtools-extension)

1. Follow instructions in [here](https://github.com/zalmoxisus/redux-devtools-extension)
2. Explore.

## Learn More

You can learn more in the [Vite documentation](https://vitejs.dev/guide/).

To learn React, check out the [React documentation](https://reactjs.org/).
