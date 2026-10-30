from django.db import models


class Statistic(models.Model):
    label = models.CharField(max_length=120)
    value = models.PositiveIntegerField()
    suffix = models.CharField(max_length=12, blank=True)
    display_order = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("display_order", "id")
        verbose_name_plural = "statistics"

    def __str__(self):
        return f"{self.label}: {self.value}{self.suffix}"
