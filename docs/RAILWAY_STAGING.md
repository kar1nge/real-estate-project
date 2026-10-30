# Railway staging deployment (previous provider configuration)

Render is the selected staging provider. Use [RENDER_STAGING.md](RENDER_STAGING.md) for the current setup. This file and `railway.json` are retained as prior provider notes; they are not used by Render.

The repository is configured to build the React frontend and Django API into one Railway web service. This keeps CMS sessions and API calls on the same HTTPS origin. PostgreSQL and a private Railway Storage Bucket are separate services in the same Railway project.

## Create the staging services

1. Create a Railway project and connect this GitHub repository.
2. Add a PostgreSQL service. Use its private `DATABASE_URL` as the web service's database connection.
3. Add a Storage Bucket in the same region. Keep staging and production in separate Railway environments so their database and bucket data stay isolated.
4. Add a web service for this repository. Set its config file to the repository's `railway.json`; the Dockerfile builds both frontend and backend.
5. Generate a public domain for the web service. Railway's generated domain is enough for staging; a purchased domain is not needed yet.

## Web-service variables

Set these in the Railway web service's **staging** environment. Use Railway's variable-reference picker for the database and bucket values; the service labels below are examples and must match the names shown in the project.

```text
DJANGO_ENV=production
DJANGO_DEBUG=false
SECRET_KEY=<generate a long random value in Railway>
DJANGO_ALLOWED_HOSTS=${{RAILWAY_PUBLIC_DOMAIN}}
DJANGO_CSRF_TRUSTED_ORIGINS=https://${{RAILWAY_PUBLIC_DOMAIN}}
DJANGO_CORS_ALLOWED_ORIGINS=

DATABASE_URL=${{Postgres.DATABASE_URL}}

DJANGO_MEDIA_STORAGE=railway_bucket
AWS_STORAGE_BUCKET_NAME=${{Media.BUCKET}}
AWS_ACCESS_KEY_ID=${{Media.ACCESS_KEY_ID}}
AWS_SECRET_ACCESS_KEY=${{Media.SECRET_ACCESS_KEY}}
AWS_S3_ENDPOINT_URL=${{Media.ENDPOINT}}
AWS_DEFAULT_REGION=${{Media.REGION}}
AWS_S3_ADDRESSING_STYLE=virtual

EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

Replace `Postgres` and `Media` with the exact Railway service names, or select the equivalent references in the UI. The bucket is private: Django generates temporary signed image URLs. Railway's bucket is durable object storage, and the production settings refuse to use the container's temporary local disk for media.

The console email backend is for staging only. It records generated email in service logs instead of sending it. Before public launch, configure real SMTP credentials and switch back to Django's SMTP email backend.

## First staging release

The container start command applies migrations, collects Django and frontend static assets, and starts Gunicorn. Wait for `/api/health/` to pass. Then create the first CMS administrator from Railway's service shell:

```text
python manage.py createsuperuser
```

Open the generated Railway domain and check the public pages, a browser refresh on a deep route, CMS sign-in, a property image upload, gallery/hotspot editing, inquiries, and site-visit booking. A new staging database starts empty; import a database backup and upload existing media into the staging bucket if the staging site should mirror the current local content.

Do not use real customer data in staging. Do not add Railway secrets or local `.env` files to Git.
