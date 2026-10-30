"""Compressed media storage backed by a private S3-compatible bucket."""

from storages.backends.s3 import S3Storage

from config.storage import CompressedImageStorageMixin


class CompressedS3ImageStorage(CompressedImageStorageMixin, S3Storage):
    """Compress uploaded images and return temporary signed access URLs."""
