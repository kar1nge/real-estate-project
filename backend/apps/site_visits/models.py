from django.db import models
from apps.properties.models import Property


class SiteVisitSchedule(models.Model):
    real_estate_property = models.ForeignKey(
    Property,
    on_delete=models.CASCADE,
    related_name="site_visit_schedules"
)

    date = models.DateField()

    start_time = models.TimeField()

    end_time = models.TimeField()

    max_bookings = models.PositiveIntegerField(
        default=20
    )

    active = models.BooleanField(
        default=True
    )

    notes = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["date", "start_time"]

    def __str__(self):
        return (
            f"{self.real_estate_property.title} - "
            f"{self.date} ({self.start_time})"
        )
        

    @property
    def remaining_slots(self):
        return self.max_bookings - self.bookings.count()


class SiteVisitBooking(models.Model):

    ATTENDANCE_CHOICES = [
        ("booked", "Booked"),
        ("attended", "Attended"),
        ("cancelled", "Cancelled"),
        ("no_show", "No Show"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    status = models.CharField(
    max_length=20,
    choices=STATUS_CHOICES,
    default="pending"
    )

    confirmation_sent = models.BooleanField(
    default=False
    )

    schedule = models.ForeignKey(
        SiteVisitSchedule,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    visitor_name = models.CharField(
        max_length=255
    )

    visitor_email = models.EmailField()

    visitor_phone = models.CharField(
        max_length=20
    )

    number_of_visitors = models.PositiveIntegerField(
        default=1
    )

    message = models.TextField(
        blank=True
    )

    attendance_status = models.CharField(
        max_length=20,
        choices=ATTENDANCE_CHOICES,
        default="booked"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Site Visit Booking"
        verbose_name_plural = "Site Visit Bookings"

    def __str__(self):
        return f"{self.visitor_name} - {self.schedule.real_estate_property.title}"