<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Use Kukkuu API locally](#use-kukkuu-api-locally)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Use Kukkuu API locally

Clone the repository (https://github.com/City-of-Helsinki/kukkuu). Follow the instructions for running kukkuu with docker. Before running `docker compose up` set the following settings in kukkuu roots `docker-compose.env.yaml`:

- DEBUG=1
- CORS_ORIGIN_ALLOW_ALL=1
- TOKEN_AUTH_AUTHSERVER_URL=http://tunnistamo-backend:8000/openid
- APPLY_MIGRATIONS=1
- TOKEN_AUTH_AUTHSERVER_URL=http://tunnistamo-backend:8000/openid
- MEDIA_ROOT=/app/var/

If you do not have a super user / admin to administrate the API yet, you can create one with `docker compose run django python manage.py add_admin_user -u admin -p admin -e admin@example.com`.

To make Kukkuu Public UI use the local Kukkuu API set `VITE_API_URI="localhost:8081/graphql"` for example in file `.env.development.local`.
