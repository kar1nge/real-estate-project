from django.urls import path

from .views import ContactSettingsView


urlpatterns = [
    path("", ContactSettingsView.as_view(), name="contact-settings"),
]