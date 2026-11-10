import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Inquiry
from .services import send_inquiry_response_email
from apps.faqs.models import FAQ

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Inquiry)
def sync_published_faq(sender, instance, created, **kwargs):
    if not instance.subject.lower().startswith("faq question:"):
        return

    if instance.publish_to_faq and instance.status == "answered" and instance.response:
        faq = instance.published_faq
        if faq is None:
            faq = FAQ.objects.create(
                question=instance.message,
                answer=instance.response,
                category=instance.faq_category,
                display_order=(FAQ.objects.order_by("-display_order").values_list("display_order", flat=True).first() or 0) + 1,
                is_active=True,
            )
            Inquiry.objects.filter(pk=instance.pk).update(published_faq=faq)
            instance.published_faq = faq
        else:
            faq.question = instance.message
            faq.answer = instance.response
            faq.category = instance.faq_category
            faq.is_active = True
            faq.save(update_fields=["question", "answer", "category", "is_active", "updated_at"])
    elif instance.published_faq_id:
        FAQ.objects.filter(pk=instance.published_faq_id).update(is_active=False)


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

        try:
            send_inquiry_response_email(instance)
        except Exception:
            logger.exception("Could not send response email for inquiry %s", instance.pk)
            return
        Inquiry.objects.filter(pk=instance.pk).update(response_sent=True)
        instance.response_sent = True
