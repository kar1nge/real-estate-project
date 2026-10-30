from django.conf import settings
from django.core.mail import send_mail

from apps.contacts.services import get_company_settings


def send_site_visit_notification(booking):

    company = get_company_settings()
    schedule = booking.schedule

    send_mail(
        subject=(
            f"New Site Visit Request | "
            f"{schedule.real_estate_property.title}"
        ),
        message=(
            f"""
Dear Marketing Team,

A new site visit request has been submitted through the {company.name} website.

Booking Details
--------------------------------------------------
Property: {schedule.real_estate_property.title}
Visitor Name: {booking.visitor_name}
Email Address: {booking.visitor_email}
Phone Number: {booking.visitor_phone}
Preferred Date: {schedule.date}
Preferred Time: {schedule.start_time} - {schedule.end_time}
Number of Visitors: {booking.number_of_visitors}

Visitor Message:
{booking.message}

Please follow up with the visitor to confirm any additional arrangements and ensure a smooth viewing experience.

Kind Regards,

{company.name}
Automated Notification System

Contact:
{company.email}
{company.phone}

{company.address}
"""
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.MARKETING_EMAIL],
        fail_silently=False,
    )


def send_site_visit_confirmation(booking):

    company = get_company_settings()
    schedule = booking.schedule

    send_mail(
        subject=(
            f"Site Visit Request Received | "
            f"{company.name}"
        ),
        message=(
            f"""
Dear {booking.visitor_name},

Thank you for your interest in {company.name}.
We have received your site visit request for:

Property:
{schedule.real_estate_property.title}

Preferred Date:
{schedule.date}

Preferred Time:
{schedule.start_time} - {schedule.end_time}

Our team will review your request and contact you shortly to confirm the viewing arrangements.

If you have any questions, please feel free to contact us.

Kind Regards,

{company.name}

Email:
{company.email}

Phone:
{company.phone}

{company.address}
"""
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[booking.visitor_email],
        fail_silently=False,
    )


def send_visit_confirmed_email(booking):

    company = get_company_settings()
    schedule = booking.schedule

    send_mail(
        subject=(
            f"Your Site Visit Has Been Confirmed | "
            f"{company.name}"
        ),
        message=(
            f"""
Dear {booking.visitor_name},

We are pleased to confirm your upcoming site visit.

Property:
{schedule.real_estate_property.title}

Date:
{schedule.date}

Time:
{schedule.start_time} - {schedule.end_time}

Google Maps:
{schedule.real_estate_property.google_maps_url}

If you need to make any changes, please contact us.

Kind Regards,

{company.name}

Email:
{company.email}

Phone:
{company.phone}
"""
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[booking.visitor_email],
        fail_silently=False,
    )