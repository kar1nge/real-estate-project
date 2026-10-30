from django.urls import path

from .views import (
    FAQListAPIView,
    FeaturedFAQAPIView,
    FAQDetailAPIView,
    FAQManagementListCreateAPIView,
    FAQManagementDetailAPIView,
)

urlpatterns = [
    path("manage/", FAQManagementListCreateAPIView.as_view(), name="faq-manage"),
    path("manage/<int:pk>/", FAQManagementDetailAPIView.as_view(), name="faq-manage-detail"),
    path(
        "",
        FAQListAPIView.as_view(),
    ),

    path(
        "featured/",
        FeaturedFAQAPIView.as_view(),
    ),

    path(
        "<int:pk>/",
        FAQDetailAPIView.as_view(),
    ),
]