# Production readiness checklist

This repository contains the Django API and a Vite/React single-page frontend. The live website is hosted with Hosting Africa at `https://ndukawaproperties.co.ke/`. The Render and Railway files and guides in this repository are retained legacy/staging configurations; they do not describe the current production host. The site is already live, so use this checklist for ongoing production operations and future changes, not as a pre-launch status report.

## Production operations

1. **Keep production configuration in Hosting Africa.** Confirm the production values for `DJANGO_ENV=production`, `DJANGO_DEBUG=false`, `SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, and `DJANGO_CSRF_TRUSTED_ORIGINS` in the active Hosting Africa environment. Keep secrets out of Git. The repository's Docker Compose configuration describes a web container and PostgreSQL service; confirm the live VPS/hosting configuration before changing it.
2. **Maintain the production database.** Back up the live PostgreSQL database before schema changes. Apply migrations using the production deployment procedure, then verify the health endpoint and key site/CMS flows.
3. **Keep static-file serving working.** The Docker build collects Django static files and the React build into `STATIC_ROOT`; WhiteNoise serves the resulting `/static/` assets.
4. **Protect uploaded media.** Images are compressed to WebP before upload and served from `/media/`. Verify property photos, employee photos, hero images, and virtual-tour panoramas after releases. Back up uploaded media separately from the database. The old Render and Railway storage settings below apply only if those providers are used for a separate environment.
5. **Route the frontend correctly.** The Docker image serves the built React frontend and `/api/` from one same-origin app. Django returns the React shell for client-side routes such as `/properties/...`, `/manage/...`, and `/activate/...`; `/static/`, `/media/`, and `/robots.txt` have dedicated serving paths.
6. **Set the public CMS URL.** The CMS and public pages share one domain, so generated invitations use the current site origin automatically. If they are separated later, set frontend build variable `VITE_CMS_PUBLIC_URL` to the canonical CMS origin.
7. **Configure email.** Set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USE_TLS` or `EMAIL_USE_SSL`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, and `DEFAULT_FROM_EMAIL`. Account activation links are currently copied from the CMS for sharing; automated invitation email is not implemented.
8. **Keep HTTPS working through Hosting Africa.** The production Django settings require HTTPS redirects and secure session/CSRF cookies. Confirm the active reverse proxy forwards `X-Forwarded-Proto: https` and the allowed host/origin values match `ndukawaproperties.co.ke`. Review HSTS behavior before enabling subdomain coverage.
9. **Protect and verify backups.** Schedule encrypted PostgreSQL backups and a separate backup of uploaded media. Perform a restore rehearsal periodically.

## Search and sharing

- `frontend/index.html` provides a site-wide title, description, and Open Graph defaults. The frontend updates titles/descriptions per route and marks CMS/activation routes `noindex`.
- `frontend/public/robots.txt` allows public pages and excludes CMS, activation, API, and Django admin paths.
- The application exposes `/sitemap.xml` and adds its absolute URL to `/robots.txt`; check both on the live domain after releases. The canonical public domain is `https://ndukawaproperties.co.ke/`. Verify the sitemap in Google Search Console and inspect important URLs there.
- For Google discovery, verify the domain in Search Console, submit `https://ndukawaproperties.co.ke/sitemap.xml`, and inspect the homepage and key property URLs. A sitemap helps Google discover URLs but does not guarantee indexing or ranking. See Google's [URL Inspection guidance](https://support.google.com/webmasters/answer/9012289/) and [crawling and indexing FAQ](https://developers.google.com/search/help/crawling-index-faq).

## Performance and operations

- Image uploads are converted to WebP and resized by `backend/config/storage.py` (property photos up to 2400 px; virtual-tour panoramas up to 6000 × 3000). Confirm production media storage and backups in the Hosting Africa environment.
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
