<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Using the Helsinki-Profile Keycloak](#using-the-helsinki-profile-keycloak)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Using the Helsinki-Profile Keycloak

> NOTE: Keycloak is currently the default and primary authorization service.

> Tunnistamo is a deprecated previously used authentication service, and it can be used still for a completely isolated
> local development environment—meaning that all parts of the system are run locally, including the
> authentication service.

There is an [example of Keycloak environment variables](../.env.development.local.example) that can be used, when a local Kukkuu Admin UI is wanted to be connected to the Helsinki-Profile Keycloak of a test environment.

The example file should include some what the following variables, that are telling the app to change the behavior of the authorization provider a bit, compared to how it is with Tunnistamo.

- `VITE_OIDC_SERVER_TYPE=KEYCLOAK` is to add some parameters to the token-request that the Keycloak service needs. For Tunnistamo this would be `VITE_OIDC_SERVER_TYPE=TUNNISTAMO`).
- `VITE_OIDC_RETURN_TYPE=code` is to use authorization code flow instead of deprecated (and even removed from `oidc-client-ts`) implicit flow.
- `VITE_OIDC_AUTHORITY` tells where the authorization service is located and who the issuer of the JWT is.
- `VITE_OIDC_CLIENT_ID` is the unique client id that is used when the client is configured to auth service.
- `VITE_OIDC_SCOPE="openid profile email"` tells that the Kukkuu Public UI needs the openid, profile and email information to be included in the JWT.
- `VITE_OIDC_AUDIENCES=kukkuu-api-dev,profile-api-test` means that when the authorization is given, the access is needed to these clients too, so the api-tokens need to be generated.
- `VITE_OIDC_KUKKUU_API_CLIENT_ID` is used collect the proper auth token for communication between the Public UI and the API.

Example configuration when a local Kukkuu API is used with a local Kukkuu Public UI and Helsinki-Profile Keycloak from the test environment:

```shell
VITE_OIDC_SERVER_TYPE=KEYCLOAK
VITE_OIDC_RETURN_TYPE="code"
VITE_OIDC_AUTHORITY=https://tunnistus.test.hel.ninja/auth/realms/helsinki-tunnistus/
VITE_OIDC_CLIENT_ID="kukkuu-ui-dev"
VITE_OIDC_KUKKUU_API_CLIENT_ID="kukkuu-api-dev"
VITE_OIDC_SCOPE="openid profile email"
VITE_OIDC_AUDIENCES=kukkuu-api-dev,profile-api-test
# VITE_API_URI=https://kukkuu.api.test.hel.ninja/graphql
VITE_API_URI=http://localhost:8081/graphql
```
