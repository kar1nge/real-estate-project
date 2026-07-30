from django.urls import path

from .views import (
    InquiryCreateAPIView,
    InquiryListAPIView,
)

urlpatterns = [
    path(
        "",
        InquiryListAPIView.as_view(),
    ),
    path(
        "create/",
        InquiryCreateAPIView.as_view(),
    ),
]