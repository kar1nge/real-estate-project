from django.contrib import admin
from .models import (
    Location,
    PropertyType,
    PropertyStatus,
    Amenity,
    Property,
    PropertyImage,
)


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(PropertyStatus)
class PropertyStatusAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "property_type",
        "status",
        "location",
        "starting_price",
        "featured",
        "created_at",
    )

    list_filter = (
        "featured",
        "property_type",
        "status",
        "location",
    )

    search_fields = (
        "title",
        "location__name",
    )

    prepopulated_fields = {"slug": ("title",)}

    filter_horizontal = ("amenities",)

    inlines = [PropertyImageInline]


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = (
        "property",
        "display_order",
    )