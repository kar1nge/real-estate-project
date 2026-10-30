from rest_framework import generics
from rest_framework.permissions import IsAdminUser

from .models import Testimonial
from .serializers import (
    TestimonialSerializer,
)


class TestimonialListAPIView(
    generics.ListAPIView
):

    serializer_class = (
        TestimonialSerializer
    )

    def get_queryset(self):

        return (
            Testimonial.objects
            .filter(
                is_active=True
            )
            .order_by(
                "display_order",
                "-created_at",
            )
        )


class FeaturedTestimonialAPIView(
    generics.ListAPIView
):

    serializer_class = (
        TestimonialSerializer
    )

    def get_queryset(self):

        return (
            Testimonial.objects
            .filter(
                is_active=True,
                is_featured=True,
            )
            .order_by(
                "display_order",
                "-created_at",
            )
        )


class TestimonialDetailAPIView(
    generics.RetrieveAPIView
):

    queryset = (
        Testimonial.objects.filter(
            is_active=True
        )
    )

    serializer_class = (
        TestimonialSerializer
    )

class TestimonialManagementListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminUser]
    queryset = Testimonial.objects.all()


class TestimonialManagementDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminUser]
    queryset = Testimonial.objects.all()
