from django.urls import path

from .views import (
    HeroSlideListAPIView,
    HeroSlideDetailAPIView,
)

urlpatterns = [
    path(
        "",
        HeroSlideListAPIView.as_view(),
    ),

    path(
        "<int:pk>/",
        HeroSlideDetailAPIView.as_view(),
    ),
]