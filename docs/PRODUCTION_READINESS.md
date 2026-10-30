# Production readiness checklist

This repository contains the Django API and a Vite/React single-page frontend. Render is the selected staging provider. Production domain records, email delivery, data migration, backups, and launch review still need configuration.

## Before the first production release

1. **Set production secrets and origins.** Configure `DJANGO_ENV=production`, `DJANGO_DEBUG=false`, and a unique `SECRET_KEY`. Render supplies the generated service hostname, which Django adds to allowed hosts and CSRF trusted origins. Keep production secrets in the host's secret manager; never commit them.
2. **Provision PostgreSQL and apply schema.** Render supplies `DATABASE_URL`. Run `python manage.py migrate`; this includes the CMS account and shared cache table. Create the initial superuser with `python manage.py createsuperuser`.
3. **Configure static-file serving.** The Docker build collects Django static files and the React build into `STATIC_ROOT`; WhiteNoise serves the resulting `/static/` assets.
4. **Configure durable media storage.** Render staging uses `DJANGO_MEDIA_STORAGE=render_disk` and mounts a persistent disk at `/var/data`. Images are compressed to WebP before upload and served from `/media/`. Verify property photos, employee photos, hero images, and virtual-tour panoramas from the public site. The Render disk is tied to a single service instance and should have an independent backup. The optional Railway storage backend remains available if that provider is used later.
5. **Route the frontend correctly.** The Docker image serves the built React frontend and `/api/` from one same-origin app. Django returns the React shell for client-side routes such as `/properties/...`, `/manage/...`, and `/activate/...`; `/static/`, `/media/`, and `/robots.txt` have dedicated serving paths.
6. **Set the public CMS URL.** The CMS and public pages share one domain, so generated invitations use the current site origin automatically. If they are separated later, set frontend build variable `VITE_CMS_PUBLIC_URL` to the canonical CMS origin.
7. **Configure email.** Set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USE_TLS` or `EMAIL_USE_SSL`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, and `DEFAULT_FROM_EMAIL`. Account activation links are currently copied from the CMS for sharing; automated invitation email is not implemented.
8. **Turn on HTTPS at the proxy.** The production Django settings require HTTPS redirects and secure session/CSRF cookies. Ensure the proxy forwards `X-Forwarded-Proto: https`; set the exact host/origin values above. Review HSTS behavior before enabling subdomain coverage.
9. **Protect and verify backups.** Schedule encrypted PostgreSQL backups and a separate backup of uploaded media. Perform a restore rehearsal before launch and periodically afterward.

## Search and sharing

- `frontend/index.html` provides a site-wide title, description, and Open Graph defaults. The frontend updates titles/descriptions per route and marks CMS/activation routes `noindex`.
- `frontend/public/robots.txt` allows public pages and excludes CMS, activation, API, and Django admin paths.
- A production sitemap and canonical URLs need the confirmed public domain. Generate the sitemap from the public pages and currently published property slugs, then add its absolute URL to `robots.txt`. Add a public share image and verify Open Graph previews once brand assets/domain are settled.

## Performance and operations

- Image uploads are converted to WebP and resized by `backend/config/storage.py` (property photos up to 2400 px; virtual-tour panoramas up to 6000 × 3000). The initial Render setup serves uploaded images from its persistent disk through Django; this is suitable for the initial single instance but does not provide image CDN transformations or multi-instance sharing.
- The Django database cache is used for shared DRF rate-limit state across workers. Its table is created by migrations. CMS login attempts are limited by `CMS_LOGIN_THROTTLE_RATE` (default `5/minute`); inquiry and site-visit submission limits are independently configurable.
- Property querysets already use `select_related` and `prefetch_related`, and public APIs are paginated. No additional property indexes are added without production query plans and representative data; inspect slow queries before adding composite indexes.
- There is no external error monitoring or alerting configuration in the repository. Connect one for Django exceptions, frontend runtime errors, failed email delivery, database health, and media failures.
- No automated test suite or CI workflow is present in the repository. Add regression coverage and CI before relying on automated release gates.

## Release checks

Run these from the appropriate project directories in the release environment:

```text
backend:  python manage.py check --deploy
backend:  python manage.py migrate
backend:  python manage.py collectstatic --noinput
frontend: npm run lint
frontend: npm run build
```

Then verify in the deployed environment: public routes and browser refreshes, CMS login and invitation activation, staff permissions, forms and email delivery, property pagination/filters, uploaded images and virtual-tour panoramas, redirects/HTTPS cookies, and a database/media restore procedure.
