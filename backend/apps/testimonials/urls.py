from django.urls import path

from .views import (
    TestimonialListAPIView,
    FeaturedTestimonialAPIView,
    TestimonialDetailAPIView,
    TestimonialManagementListCreateAPIView,
    TestimonialManagementDetailAPIView,
)

urlpatterns = [
    path("manage/", TestimonialManagementListCreateAPIView.as_view(), name="testimonial-manage"),
    path("manage/<int:pk>/", TestimonialManagementDetailAPIView.as_view(), name="testimonial-manage-detail"),
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