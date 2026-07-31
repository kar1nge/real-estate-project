from rest_framework import generics

from .models import HeroSlide
from .serializers import HeroSlideSerializer


class HeroSlideListAPIView(
    generics.ListAPIView
):

    serializer_class = (
        HeroSlideSerializer
    )

    def get_queryset(self):

        return HeroSlide.objects.filter(
            is_active=True
        )


class HeroSlideDetailAPIView(
    generics.RetrieveAPIView
):

    serializer_class = (
        HeroSlideSerializer
    )

    queryset = HeroSlide.objects.filter(
        is_active=True
    )