from django.urls import path

from .views import (
    FAQListAPIView,
    FeaturedFAQAPIView,
    FAQDetailAPIView,
)

urlpatterns = [
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