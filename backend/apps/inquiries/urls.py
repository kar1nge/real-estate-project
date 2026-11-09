from django.urls import path

from .views import (
    InquiryCreateAPIView,
    InquiryListAPIView,
    InquiryManagementDetailAPIView,
)

urlpatterns = [
    path("manage/<int:pk>/", InquiryManagementDetailAPIView.as_view(), name="inquiry-manage-detail"),
    path("manage/", InquiryListAPIView.as_view(), name="inquiry-manage-list"),
    path(
        "",
        InquiryListAPIView.as_view(),
    ),
    path(
        "create/",
        InquiryCreateAPIView.as_view(),
    ),
]
