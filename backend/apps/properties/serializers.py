from rest_framework import serializers

from .models import (
    Location,
    PropertyType,
    PropertyStatus,
    Amenity,
    Property,
    PropertyImage,
    VirtualTour,
    TourScene,
    TourHotspot,
)


class LocationSerializer(serializers.ModelSerializer):
    property_count = serializers.IntegerField(
        read_only=True
    )

    class Meta:
        model = Location
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "hero_image",
            "latitude",
            "longitude",
            "created_at",
            "property_count",
        ]


class PropertyTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyType
        fields = "__all__"


class PropertyStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyStatus
        fields = "__all__"


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = "__all__"


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = "__all__"
        read_only_fields = ("property",)


class SimilarPropertySerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    property_type = PropertyTypeSerializer(read_only=True)
    status = PropertyStatusSerializer(read_only=True)
    amenities = AmenitySerializer(
        many=True,
        read_only=True,
    )
    images = PropertyImageSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "description",
            "property_type",
            "status",
            "starting_price",
            "available_units",
            "bedrooms",
            "bathrooms",
            "location",
            "google_maps_url",
            "featured",
            "amenities",
            "images",
            "youtube_url",
            "completion_date",
            "created_at",
            "updated_at",
        ]

class TourHotspotSerializer(serializers.ModelSerializer):
    target_scene_name = serializers.CharField(
        source="target_scene.name",
        read_only=True,
    )

    class Meta:
        model = TourHotspot
        fields = [
            "id",
            "label",
            "yaw",
            "pitch",
            "target_scene",
            "target_scene_name",
        ]

    def validate(self, attrs):
        target_scene = attrs.get(
            "target_scene",
            getattr(self.instance, "target_scene", None),
        )
        source_scene = getattr(self.instance, "scene", None)
        if source_scene is None:
            view = self.context.get("view")
            scene_id = getattr(view, "kwargs", {}).get("scene_id")
            source_scene = TourScene.objects.filter(pk=scene_id).first()

        if (
            target_scene is not None
            and source_scene is not None
            and target_scene.virtual_tour_id != source_scene.virtual_tour_id
        ):
            raise serializers.ValidationError({
                "target_scene": "Choose a scene from the same virtual tour."
            })
        return attrs
class TourSceneSerializer(serializers.ModelSerializer):
    hotspots = TourHotspotSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = TourScene
        fields = [
            "id",
            "name",
            "image",
            "display_order",
            "hotspots",
        ]


class TourSceneManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourScene
        fields = ["id", "name", "image", "display_order"]
        read_only_fields = ["id"]


class VirtualTourSerializer(serializers.ModelSerializer):
    scenes = TourSceneSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = VirtualTour
        fields = [
            "id",
            "title",
            "scenes",
            "created_at",
            "updated_at",
        ]


class PropertySerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    property_type = PropertyTypeSerializer(read_only=True)
    status = PropertyStatusSerializer(read_only=True)

    amenities = AmenitySerializer(
        many=True,
        read_only=True,
    )

    images = PropertyImageSerializer(
        many=True,
        read_only=True,
    )

    virtual_tour = VirtualTourSerializer(
        read_only=True,
    )

    similar_properties = SimilarPropertySerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Property
        fields = "__all__"


class PropertyListSerializer(PropertySerializer):
    """Keep collection responses small; full galleries and tours load on detail pages."""

    images = PropertyImageSerializer(
        source="listing_images",
        many=True,
        read_only=True,
    )
    virtual_tour = serializers.SerializerMethodField()
    similar_properties = serializers.SerializerMethodField()

    def get_virtual_tour(self, obj):
        return None

    def get_similar_properties(self, obj):
        return []


class PropertyManagementSerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(
        many=True,
        read_only=True,
    )
    virtual_tour = VirtualTourSerializer(read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "description",
            "property_type",
            "status",
            "starting_price",
            "available_units",
            "bedrooms",
            "bathrooms",
            "location",
            "google_maps_url",
            "featured",
            "homepage_order",
            "publication_status",
            "amenities",
            "images",
            "virtual_tour",
            "youtube_url",
            "similar_properties",
            "completion_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "created_at",
            "updated_at",
        ]
