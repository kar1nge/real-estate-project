from rest_framework import serializers

from .models import Testimonial


class TestimonialSerializer(
    serializers.ModelSerializer
):

    rating_display = serializers.CharField(
        source="get_rating_display",
        read_only=True,
    )

    property_name = serializers.SerializerMethodField()

    class Meta:

        model = Testimonial

        fields = (
            "id",
            "client_name",
            "testimonial",
            "rating",
            "rating_display",
            "property",
            "property_name",
            "is_featured",
            "display_order",
            "is_active",
            "created_at",
            "updated_at",
        )

    def get_property_name(
        self,
        obj
    ):

        return (
            obj.property.title
            if obj.property
            else None
        )