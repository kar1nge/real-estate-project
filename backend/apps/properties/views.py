from django_filters.rest_framework import (
    DjangoFilterBackend,
)

from rest_framework import (
    generics,
    filters,
)

from .models import (
    Property,
    Location,
    PropertyType,
    PropertyStatus,
    Amenity,
)

from .serializers import (
    PropertySerializer,
    LocationSerializer,
    PropertyTypeSerializer,
    PropertyStatusSerializer,
    AmenitySerializer,
)


class PropertyListAPIView(generics.ListAPIView):

    queryset = Property.objects.all()

    serializer_class = PropertySerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = {
        "location": ["exact"],
        "location__slug": ["exact"],
        "property_type": ["exact"],
        "status": ["exact"],
        "bedrooms": ["exact"],
        "featured": ["exact"],
        "amenities": ["exact"],
        "starting_price": ["exact", "gte", "lte"],
}

    search_fields = [
        "title",
        "description",
        "location__name",
    ]

    ordering_fields = [
        "starting_price",
        "created_at",
    ]


class PropertyDetailAPIView(generics.RetrieveAPIView):

    queryset = Property.objects.all()

    serializer_class = PropertySerializer

    lookup_field = "slug"


class FeaturedPropertyAPIView(generics.ListAPIView):

    serializer_class = PropertySerializer

    def get_queryset(self):

        return Property.objects.filter(
            featured=True
        )


class LocationListAPIView(generics.ListAPIView):

    queryset = Location.objects.all()

    serializer_class = (
        LocationSerializer
    )


class PropertyTypeListAPIView(
    generics.ListAPIView
):

    queryset = (
        PropertyType.objects.all()
    )

    serializer_class = (
        PropertyTypeSerializer
    )


class PropertyStatusListAPIView(
    generics.ListAPIView
):

    queryset = (
        PropertyStatus.objects.all()
    )

    serializer_class = (
        PropertyStatusSerializer
    )


class AmenityListAPIView(
    generics.ListAPIView
):

    queryset = (
        Amenity.objects.all()
    )

    serializer_class = (
        AmenitySerializer
    )