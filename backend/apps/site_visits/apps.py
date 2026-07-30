from django.apps import AppConfig
from importlib import import_module


class SiteVisitsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.site_visits'

    def ready(self):
        import_module('apps.site_visits.signals')
