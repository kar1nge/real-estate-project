from django_filters.rest_framework import (
    DjangoFilterBackend,
)

from django.db.models import Count, Prefetch, Q
from django.shortcuts import get_object_or_404

from rest_framework import (
    generics,
    filters,
    status,
)
from rest_framework.parsers import (
    MultiPartParser,
    FormParser,
)
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .models import (
    Property,
    PropertyImage,
    Location,
    PropertyType,
    PropertyStatus,
    Amenity,
    VirtualTour,
    TourScene,
    TourHotspot,
)

from .serializers import (
    PropertySerializer,
    PropertyListSerializer,
    PropertyManagementSerializer,
    PropertyImageSerializer,
    LocationSerializer,
    PropertyTypeSerializer,
    PropertyStatusSerializer,
    AmenitySerializer,
    VirtualTourSerializer,
    TourSceneManagementSerializer,
    TourHotspotSerializer,
)


def public_property_list_queryset():
    first_active_image = (
        PropertyImage.objects
        .filter(is_active=True)
        .order_by("display_order", "id")[:1]
    )
    return (
        Property.objects
        .filter(publication_status="published", available_units__gt=0)
        .select_related("location", "property_type", "status")
        .prefetch_related(
            "amenities",
            Prefetch(
                "images",
                queryset=first_active_image,
                to_attr="listing_images",
            ),
        )
        .distinct()
    )


class PropertyListAPIView(generics.ListAPIView):
    serializer_class = PropertyListSerializer

    def get_queryset(self):
        return public_property_list_queryset()

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
    serializer_class = PropertySerializer

    lookup_field = "slug"

    def get_queryset(self):
        active_images = PropertyImage.objects.filter(is_active=True).order_by(
            "display_order", "id"
        )
        tour_scenes = TourScene.objects.order_by("display_order", "id").prefetch_related(
            Prefetch(
                "hotspots",
                queryset=TourHotspot.objects.select_related("target_scene"),
            )
        )
        similar_properties = (
            Property.objects
            .filter(publication_status="published", available_units__gt=0)
            .select_related("location", "property_type", "status")
            .prefetch_related(
                "amenities",
                Prefetch("images", queryset=active_images),
            )
        )
        return (
            Property.objects
            .filter(publication_status="published", available_units__gt=0)
            .select_related("location", "property_type", "status")
            .prefetch_related(
                "amenities",
                Prefetch("images", queryset=active_images),
                Prefetch("similar_properties", queryset=similar_properties),
                Prefetch("virtual_tour__scenes", queryset=tour_scenes),
            )
        )


class FeaturedPropertyAPIView(generics.ListAPIView):
    serializer_class = PropertyListSerializer

    def get_queryset(self):
        return public_property_list_queryset().filter(featured=True)


class LocationListAPIView(generics.ListAPIView):
    serializer_class = LocationSerializer

    pagination_class = None

    queryset = (
        Location.objects
        .annotate(
            property_count=Count(
                "properties",
                filter=Q(
                    properties__publication_status="published",
                    properties__available_units__gt=0,
                ),
            )
        )
        .order_by("-property_count")
    )


class PropertyTypeListAPIView(generics.ListAPIView):
    queryset = PropertyType.objects.all()

    serializer_class = PropertyTypeSerializer


class PropertyStatusListAPIView(generics.ListAPIView):
    queryset = PropertyStatus.objects.all()

    serializer_class = PropertyStatusSerializer


class AmenityListAPIView(generics.ListAPIView):
    queryset = Amenity.objects.all()

    serializer_class = AmenitySerializer


class VirtualTourDetailAPIView(generics.RetrieveAPIView):
    queryset = VirtualTour.objects.filter(
        property__publication_status="published",
        property__available_units__gt=0,
    ).prefetch_related(
        "scenes"
    )

    serializer_class = VirtualTourSerializer


class PropertyVirtualTourManagementAPIView(generics.GenericAPIView):
    serializer_class = VirtualTourSerializer
    permission_classes = [IsAdminUser]

    def get_tour(self):
        return get_object_or_404(
            VirtualTour.objects.prefetch_related("scenes__hotspots__target_scene"),
            property_id=self.kwargs["property_id"],
        )

    def get(self, request, *args, **kwargs):
        tour = self.get_tour()
        return Response(self.get_serializer(tour).data)

    def post(self, request, *args, **kwargs):
        property_instance = get_object_or_404(
            Property,
            pk=self.kwargs["property_id"],
        )
        if VirtualTour.objects.filter(property=property_instance).exists():
            return Response(
                {"detail": "A virtual tour already exists for this property."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tour = serializer.save(property=property_instance)
        return Response(
            self.get_serializer(tour).data,
            status=status.HTTP_201_CREATED,
        )

    def patch(self, request, *args, **kwargs):
        tour = self.get_tour()
        serializer = self.get_serializer(
            tour,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        tour = serializer.save()
        return Response(self.get_serializer(tour).data)


class PropertyManagementListCreateAPIView(
    generics.ListCreateAPIView
):
    serializer_class = PropertyManagementSerializer
    permission_classes = [IsAdminUser]

    queryset = Property.objects.all()


class PropertyManagementDetailAPIView(
    generics.RetrieveUpdateAPIView
):
    serializer_class = PropertyManagementSerializer
    permission_classes = [IsAdminUser]

    queryset = Property.objects.all()


class PropertyImageManagementAPIView(
    generics.ListCreateAPIView
):
    serializer_class = PropertyImageSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return PropertyImage.objects.filter(
            property_id=self.kwargs["property_id"]
        ).order_by("display_order")

    def perform_create(self, serializer):
        property_id = self.kwargs["property_id"]

        property_instance = Property.objects.get(
            pk=property_id
        )

        last_image = (
            PropertyImage.objects
            .filter(property=property_instance)
            .order_by("-display_order")
            .first()
        )

        next_order = (
            last_image.display_order + 1
            if last_image
            else 1
        )

        serializer.save(
            property=property_instance,
            display_order=next_order,
        )


class PropertyImageDetailManagementAPIView(
    generics.RetrieveUpdateAPIView
):
    serializer_class = PropertyImageSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return PropertyImage.objects.filter(
            property_id=self.kwargs["property_id"]
        )


class TourSceneManagementListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TourSceneManagementSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]
    pagination_class = None

    def get_queryset(self):
        return TourScene.objects.filter(
            virtual_tour_id=self.kwargs["tour_id"]
        ).order_by("display_order", "id")

    def perform_create(self, serializer):
        tour = get_object_or_404(
            VirtualTour,
            pk=self.kwargs["tour_id"],
        )
        last_scene = tour.scenes.order_by("-display_order").first()
        serializer.save(
            virtual_tour=tour,
            display_order=(last_scene.display_order + 1) if last_scene else 1,
        )


class TourSceneManagementDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = TourSceneManagementSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]
    queryset = TourScene.objects.all()

class TourHotspotListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TourHotspotSerializer
    permission_classes = [IsAdminUser]
    pagination_class = None

    def get_queryset(self):
        return TourHotspot.objects.filter(
            scene_id=self.kwargs["scene_id"]
        ).select_related(
            "scene",
            "target_scene",
        )

    def perform_create(self, serializer):
        scene_id = self.kwargs["scene_id"]

        scene = TourScene.objects.get(
            pk=scene_id
        )

        serializer.save(
            scene=scene
        )


class TourHotspotDetailManagementAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = TourHotspotSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return TourHotspot.objects.select_related(
            "scene",
            "target_scene",
        )
