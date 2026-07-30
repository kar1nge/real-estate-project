from rest_framework import generics

from .models import FAQ
from .serializers import FAQSerializer


class FAQListAPIView(
    generics.ListAPIView
):

    serializer_class = FAQSerializer

    def get_queryset(self):

        return FAQ.objects.filter(
            is_active=True
        )


class FeaturedFAQAPIView(
    generics.ListAPIView
):

    serializer_class = FAQSerializer

    def get_queryset(self):

        return FAQ.objects.filter(
            is_active=True,
            is_featured=True,
        )


class FAQDetailAPIView(
    generics.RetrieveAPIView
):

    queryset = FAQ.objects.filter(
        is_active=True
    )

    serializer_class = FAQSerializer