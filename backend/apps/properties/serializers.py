from rest_framework import serializers
from .models import (
    Location,
    PropertyType,
    PropertyStatus,
    Amenity,
    Property,
    PropertyImage,
)


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = "__all__"


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


class PropertySerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    property_type = PropertyTypeSerializer(read_only=True)
    status = PropertyStatusSerializer(read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = "__all__"