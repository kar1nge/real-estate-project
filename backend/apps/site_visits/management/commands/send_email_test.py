from django.conf import settings
from django.core.mail import send_mail
from django.core.management.base import BaseCommand, CommandError
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


class Command(BaseCommand):
    help = "Send a one-time SMTP test message to the supplied address."

    def add_arguments(self, parser):
        parser.add_argument("recipient")

    def handle(self, *args, **options):
        recipient = options["recipient"].strip()
        try:
            validate_email(recipient)
        except ValidationError as exc:
            raise CommandError("Enter a valid destination email address.") from exc
        try:
            sent = send_mail(
                subject="NduKaWa Properties email delivery test",
                message="SMTP is configured and this test message was sent by the website.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                fail_silently=False,
            )
        except Exception as exc:
            raise CommandError(f"Email could not be sent ({type(exc).__name__}). Check the SMTP host, port, encryption, username, and app password in the private server .env.") from exc
        if sent != 1:
            raise CommandError("The email backend did not report a successful send.")
        self.stdout.write(self.style.SUCCESS(f"SMTP test sent to {recipient}. Check its inbox and spam folder."))
