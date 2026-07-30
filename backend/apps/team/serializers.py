from rest_framework import serializers

from .models import TeamMember


class TeamMemberSerializer(
    serializers.ModelSerializer
):

    position_display = serializers.CharField(
        source="get_position_display",
        read_only=True,
    )

    class Meta:

        model = TeamMember

        fields = (
            "id",
            "name",
            "position",
            "position_display",
            "bio",
            "email",
            "phone",
            "photo",
            "linkedin_url",
            "display_order",
            "is_active",
            "created_at",
            "updated_at",
        )