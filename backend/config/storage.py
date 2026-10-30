"""Default media storage that converts uploaded photos to optimized WebP."""

from io import BytesIO
from pathlib import PurePosixPath

from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
from PIL import Image, ImageOps, UnidentifiedImageError


class CompressedImageStorageMixin:
    """Compress image uploads once, regardless of the backing storage."""

    PHOTO_MAX_SIZE = (2400, 2400)
    PANORAMA_MAX_SIZE = (6000, 3000)
    PHOTO_QUALITY = 82
    PANORAMA_QUALITY = 86

    def _save(self, name, content):
        try:
            with Image.open(content) as source:
                # Keep animated uploads intact instead of silently dropping frames.
                if getattr(source, "n_frames", 1) > 1:
                    content.seek(0)
                    return super()._save(name, content)

                source.load()
                image = ImageOps.exif_transpose(source)
                image_path = PurePosixPath(name)
                is_panorama = image_path.parts[0:1] == ("virtual_tours",)
                max_size = self.PANORAMA_MAX_SIZE if is_panorama else self.PHOTO_MAX_SIZE
                quality = self.PANORAMA_QUALITY if is_panorama else self.PHOTO_QUALITY
                image.thumbnail(max_size, Image.Resampling.LANCZOS)

                if image.mode not in ("RGB", "RGBA"):
                    image = image.convert("RGBA" if "transparency" in image.info else "RGB")

                output = BytesIO()
                image.save(output, format="WEBP", quality=quality, method=6)
                compressed = ContentFile(output.getvalue())
                name = image_path.with_suffix(".webp").as_posix()
                return super()._save(name, compressed)
        except (
            Image.DecompressionBombError,
            UnidentifiedImageError,
            OSError,
            ValueError,
        ):
            # If Pillow cannot decode an accepted upload, retain it unchanged.
            content.seek(0)
            return super()._save(name, content)


class CompressedImageStorage(CompressedImageStorageMixin, FileSystemStorage):
    """Compressed uploads stored on the local filesystem (development only)."""
