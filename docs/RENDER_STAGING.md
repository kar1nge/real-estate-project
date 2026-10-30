# Render staging deployment

The repository is configured to deploy the Django API, React website, PostgreSQL database, and uploaded property images through Render. A single Docker web service serves the public pages, CMS, API, and uploaded media from one HTTPS origin.

## Create the staging environment

1. Push the intended staging code to a GitHub branch. The current local branch is `feature/cms`; the repository currently has uncommitted changes, so review and commit the intended changes before pushing. Do not include `.env` files or secrets.
2. Sign in to Render and create a **Blueprint** from this repository. Render reads `render.yaml` and provisions the web service and PostgreSQL database. Select the branch containing the reviewed staging changes.
3. Review the displayed service plans and estimate before confirming provisioning. The Blueprint uses an always-on Starter web service, a Basic 256 MB PostgreSQL database, and a 10 GB persistent media disk. Pricing can change; check the Render dashboard for the current estimate.
4. Wait for the deploy health check at `/api/health/` to pass. Render supplies the public hostname; Django trusts it for hosts and CSRF.
5. Create the first CMS administrator from the Render service shell:

   ```text
   python manage.py createsuperuser
   ```

The container applies migrations and collects static files at startup. The persistent disk is mounted at `/var/data`; Django writes compressed uploads under `/var/data/media` and streams image files from `/media/`.

## Important staging notes

- Render's attached disk preserves media across restarts and deploys, but it is available to only one service instance. It prevents scaling to multiple instances and causes a short interruption during deploys. The daily disk snapshots are retained for seven days; also keep an independent backup of important media.
- The PostgreSQL database and media disk start empty. If staging should mirror local content, import a reviewed database backup and copy the corresponding image files to `/var/data/media` after the service is running. Do not use real customer data in staging.
- `EMAIL_BACKEND` uses Django's console backend in staging, so generated mail is written to service logs and not delivered. Configure a real email provider before public launch.
- The console email backend is not a production email setup. Before launch, add SMTP secrets in Render and choose the SMTP backend.
- The generated `onrender.com` hostname is suitable for staging; a custom domain is not required yet.
- Keep `.env` files and secrets out of Git. Render generates the Django secret key through the Blueprint.

## Release verification

Check public pages and browser refreshes on deep routes, CMS sign-in and staff permissions, property image uploads and delivery, galleries and virtual tours, inquiries, site visits, database migrations, and backups. The API and CMS share the same origin as the React frontend.
