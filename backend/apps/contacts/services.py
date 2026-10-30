from .models import ContactSettings


def get_company_settings():
    return ContactSettings.objects.first()