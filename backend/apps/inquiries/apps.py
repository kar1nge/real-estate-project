from django.apps import AppConfig
from importlib import import_module


class InquiriesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.inquiries'

    def ready(self):
        import_module('apps.inquiries.signals')
