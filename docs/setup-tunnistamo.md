<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Setting up Tunnistamo and Kukkuu API locally with Docker](#setting-up-tunnistamo-and-kukkuu-api-locally-with-docker)
  - [Set Tunnistamo hostname](#set-tunnistamo-hostname)
  - [Create a new OAuth app on GitHub](#create-a-new-oauth-app-on-github)
  - [Install local Tunnistamo](#install-local-tunnistamo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Setting up Tunnistamo and Kukkuu API locally with Docker

> NOTE: Tunnistamo has been replaced with Keycloak during the autumn of 2024. Tunnistamo is still a great choice as an auth service if a local authorization service is needed in a local development.

## Set Tunnistamo hostname

Add the following line to your hosts file (`/etc/hosts` on mac and linux):

    127.0.0.1 tunnistamo-backend

## Create a new OAuth app on GitHub

Go to https://github.com/settings/developers/ and add a new app with the following settings:

- Application name: can be anything, e.g. local tunnistamo
- Homepage URL: http://tunnistamo-backend:8000
- Authorization callback URL: http://tunnistamo-backend:8000/accounts/github/login/callback/

Save. You'll need the created **Client ID** and **Client Secret** for configuring tunnistamo in the next step.

## Install local Tunnistamo

Clone https://github.com/City-of-Helsinki/tunnistamo/.

Follow the instructions for setting up tunnistamo locally. Before running `docker compose up` set the following settings in tunnistamo roots `docker-compose.env.yaml`:

- SOCIAL_AUTH_GITHUB_KEY: **Client ID** from the GitHub OAuth app
- SOCIAL_AUTH_GITHUB_SECRET: **Client Secret** from the GitHub OAuth app

After you've got tunnistamo running locally, ssh to the tunnistamo docker container:

`docker compose exec django bash`

and execute the following four commands inside your docker container:

```bash
./manage.py add_oidc_client -n kukkuu-admin-ui -t "id_token token" -u "http://localhost:3001/callback" -i https://api.hel.fi/auth/kukkuu-admin-ui -m github -s dev
./manage.py add_oidc_client -n kukkuu-api -t "code" -u http://localhost:8081/return -i https://api.hel.fi/auth/kukkuu -m github -s dev -c
./manage.py add_oidc_api -n kukkuu -d https://api.hel.fi/auth -s email,profile -c https://api.hel.fi/auth/kukkuu
./manage.py add_oidc_api_scope -an kukkuu -c https://api.hel.fi/auth/kukkuu -n "Kulttuurin kummilapset" -d"Lorem ipsum"
./manage.py add_oidc_client_to_api_scope -asi https://api.hel.fi/auth/kukkuu -c https://api.hel.fi/auth/kukkuu-admin-ui
```

> NOTE: To make Kukkuu Admin use the local Tunnistamo set `VITE_OIDC_AUTHORITY="http://tunnistamo-backend:8000"` for example in file `.env.local`.
