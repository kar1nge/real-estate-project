from django.db import models
from django.utils.text import slugify


class Location(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True
    )

    slug = models.SlugField(
        unique=True,
        blank=True
    )

    description = models.TextField(
        blank=True
    )

    hero_image = models.ImageField(
        upload_to="locations/",
        blank=True,
        null=True
    )

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class PropertyType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class PropertyStatus(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Property Statuses"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Amenities"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Property(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)

    short_description = models.CharField(max_length=255)
    description = models.TextField()

    property_type = models.ForeignKey(
        PropertyType,
        on_delete=models.PROTECT,
        related_name="properties"
    )

    status = models.ForeignKey(
        PropertyStatus,
        on_delete=models.PROTECT,
        related_name="properties"
    )

    starting_price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    bedrooms = models.PositiveIntegerField()
    bathrooms = models.PositiveIntegerField()

    location = models.ForeignKey(
    Location,
    on_delete=models.PROTECT,
    related_name="properties"
    )

    google_maps_url = models.URLField(
    blank=True,
    null=True,
    help_text="Google Maps URL for the property location."
    )
    
    featured = models.BooleanField(default=False)

    amenities = models.ManyToManyField(
        Amenity,
        blank=True,
        related_name="properties"
    )

    virtual_tour_url = models.URLField(
        blank=True,
        null=True
    )

    completion_date = models.DateField(
        blank=True,
        null=True
    )


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Properties"
        ordering = ["-created_at"]
    

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="properties/"
    )

    alt_text = models.CharField(
        max_length=255,
        blank=True
    )

    display_order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["display_order"]

    def __str__(self):
        return f"{self.property.title} - Image {self.display_order}"