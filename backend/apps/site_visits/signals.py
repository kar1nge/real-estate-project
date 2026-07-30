from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import SiteVisitBooking
from .services import send_visit_confirmed_email


@receiver(post_save, sender=SiteVisitBooking)
def send_confirmation_email(
    sender,
    instance,
    created,
    **kwargs
):

    if (
        not created
        and instance.status == "confirmed"
        and not instance.confirmation_sent
    ):

        send_visit_confirmed_email(
            instance
        )

        instance.confirmation_sent = True

        instance.save(
            update_fields=[
                "confirmation_sent"
            ]
        )