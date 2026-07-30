from django.urls import path

from .views import (
    TestimonialListAPIView,
    FeaturedTestimonialAPIView,
    TestimonialDetailAPIView,
)

urlpatterns = [
    path(
        "",
        TestimonialListAPIView.as_view(),
    ),

    path(
        "featured/",
        FeaturedTestimonialAPIView.as_view(),
    ),

    path(
        "<int:pk>/",
        TestimonialDetailAPIView.as_view(),
    ),
]