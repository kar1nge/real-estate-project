"""Generate WebP copies of existing images and repoint fields without deleting originals."""

from io import BytesIO

from django.apps import apps
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import ImageField
from PIL import Image, ImageOps, UnidentifiedImageError


class Command(BaseCommand):
    help = "Create optimized WebP copies of existing uploaded images; original files are preserved."

    def handle(self, *args, **options):
        converted = skipped = 0
        original_bytes = optimized_bytes = 0
        for model in apps.get_models():
            image_fields = [field for field in model._meta.fields if isinstance(field, ImageField)]
            if not image_fields:
                continue
            for record in model.objects.all().iterator():
                for field in image_fields:
                    file_field = getattr(record, field.name)
                    if not file_field or file_field.name.lower().endswith(".webp"):
                        continue
                    try:
                        source_size = file_field.size
                        with file_field.open("rb") as original:
                            with Image.open(original) as source:
                                if getattr(source, "n_frames", 1) > 1:
                                    skipped += 1
                                    continue
                                source.load()
                                image = ImageOps.exif_transpose(source)
                                is_panorama = "virtual_tour" in file_field.name.lower()
                                image.thumbnail((6000, 3000) if is_panorama else (2400, 2400), Image.Resampling.LANCZOS)
                                if image.mode not in ("RGB", "RGBA"):
                                    image = image.convert("RGBA" if "transparency" in image.info else "RGB")
                                output = BytesIO()
                                image.save(output, format="WEBP", quality=86 if is_panorama else 82, method=6)
                        storage = file_field.storage
                        new_name = storage.save(
                            file_field.name.rsplit(".", 1)[0] + ".webp",
                            ContentFile(output.getvalue()),
                        )
                        with transaction.atomic():
                            model.objects.filter(pk=record.pk).update(**{field.name: new_name})
                        converted += 1
                        original_bytes += source_size
                        optimized_bytes += len(output.getvalue())
                        self.stdout.write(f"Optimized {model._meta.label} #{record.pk}: {file_field.name} -> {new_name}")
                    except (OSError, ValueError, UnidentifiedImageError) as exc:
                        skipped += 1
                        self.stderr.write(f"Skipped {model._meta.label} #{record.pk} {field.name}: {exc}")
        saved_bytes = max(original_bytes - optimized_bytes, 0)
        self.stdout.write(self.style.SUCCESS(
            f"Finished: {converted} optimized; {skipped} skipped. "
            f"Optimized image payload: {original_bytes / 1024 / 1024:.1f} MB -> "
            f"{optimized_bytes / 1024 / 1024:.1f} MB ({saved_bytes / 1024 / 1024:.1f} MB saved). "
            "Original images were preserved."
        ))
