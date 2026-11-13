from rest_framework import serializers
from rest_framework.fields import empty

from .models import HeroSlide


class OptionalScheduleDateTimeField(serializers.DateTimeField):
    def run_validation(self, data=empty):
        if data == "":
            data = None
        return super().run_validation(data)


class HeroSlideSerializer(
    serializers.ModelSerializer
):
    starts_at = OptionalScheduleDateTimeField(required=False, allow_null=True)
    ends_at = OptionalScheduleDateTimeField(required=False, allow_null=True)

    class Meta:

        model = HeroSlide

        fields = "__all__"

    def validate(self, attrs):
        starts_at = attrs.get("starts_at", getattr(self.instance, "starts_at", None))
        ends_at = attrs.get("ends_at", getattr(self.instance, "ends_at", None))
        if starts_at and ends_at and starts_at >= ends_at:
            raise serializers.ValidationError({
                "ends_at": "The hide time must be later than the start time."
            })
        return attrs
