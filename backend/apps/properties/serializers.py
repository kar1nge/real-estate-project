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