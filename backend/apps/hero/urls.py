from django.urls import path

from .views import (
    HeroSlideListAPIView,
    HeroSlideDetailAPIView,
    HeroSlideManagementListCreateAPIView,
    HeroSlideManagementDetailAPIView,
)


urlpatterns = [
    path(
        "",
        HeroSlideListAPIView.as_view(),
    ),

    path(
        "manage/",
        HeroSlideManagementListCreateAPIView.as_view(),
    ),

    path(
        "manage/<int:pk>/",
        HeroSlideManagementDetailAPIView.as_view(),
    ),

    path(
        "<int:pk>/",
        HeroSlideDetailAPIView.as_view(),
    ),
]