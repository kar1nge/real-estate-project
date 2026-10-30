from django.urls import path

from .views import (
    ContactSettingsView,
    CompanySettingsManagementView,
)


urlpatterns = [
    path("",ContactSettingsView.as_view(),name="contact-settings",),

    path(
        "manage/",
        CompanySettingsManagementView.as_view(),
        name="company-settings-management",
    ),
]