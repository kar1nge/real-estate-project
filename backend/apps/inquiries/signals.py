from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Inquiry
from .services import send_inquiry_response_email


@receiver(post_save, sender=Inquiry)
def send_response_email(
    sender,
    instance,
    created,
    **kwargs
):

    if (
        not created
        and instance.status == "answered"
        and instance.response
        and not instance.response_sent
    ):

        send_inquiry_response_email(
            instance
        )

        instance.response_sent = True

        instance.save(
            update_fields=[
                "response_sent"
            ]
        )