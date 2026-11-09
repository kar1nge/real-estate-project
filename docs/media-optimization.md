# Optimizing images already on the VPS

New image uploads are compressed automatically. The first batch of images was imported directly into the persistent media volume, so it did not pass through that upload compression. The `optimize_media` management command creates WebP versions, updates image references in the database, and keeps the original files untouched.

After deploying the code, take a database backup, then run this from `/opt/real-estate-project` on the VPS:

```bash
docker compose exec web python manage.py optimize_media
```

The output lists each converted image and reports the combined size reduction. It can be run again safely: WebP-backed fields are skipped. Original files remain in the media volume as a recovery copy.
