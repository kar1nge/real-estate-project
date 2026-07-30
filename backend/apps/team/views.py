from rest_framework import generics

from .models import TeamMember
from .serializers import TeamMemberSerializer


class TeamMemberListAPIView(
    generics.ListAPIView
):

    serializer_class = (
        TeamMemberSerializer
    )

    def get_queryset(self):

        return TeamMember.objects.filter(
            is_active=True
        ).order_by(
            "display_order",
            "name",
        )


class TeamMemberDetailAPIView(
    generics.RetrieveAPIView
):

    queryset = TeamMember.objects.filter(
        is_active=True
    )

    serializer_class = (
        TeamMemberSerializer
    )