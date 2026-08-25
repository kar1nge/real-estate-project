from django.contrib import admin

from .models import (
    Location,
    PropertyType,
    PropertyStatus,
    Amenity,
    Property,
    PropertyImage,
    VirtualTour,
    TourScene,
    TourHotspot,
)


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "slug",
        "created_at",
    )

    search_fields = (
        "name",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }


@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = (
        "name",
    )

    search_fields = (
        "name",
    )


@admin.register(PropertyStatus)
class PropertyStatusAdmin(admin.ModelAdmin):
    list_display = (
        "name",
    )

    search_fields = (
        "name",
    )


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = (
        "name",
    )

    search_fields = (
        "name",
    )


# ---------------------------------------------------------
# PROPERTY IMAGES
# ---------------------------------------------------------

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

    prepopulated_fields = {
        "slug": ("title",),
    }

    filter_horizontal = (
        "amenities",
        "similar_properties",
    )

    inlines = [
        PropertyImageInline,
    ]


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = (
        "property",
        "display_order",
    )

    list_filter = (
        "property",
    )

    ordering = (
        "property",
        "display_order",
    )


# ---------------------------------------------------------
# VIRTUAL TOUR
# ---------------------------------------------------------

class TourSceneInline(admin.TabularInline):
    model = TourScene
    extra = 1

    fields = (
        "name",
        "image",
        "display_order",
    )


@admin.register(VirtualTour)
class VirtualTourAdmin(admin.ModelAdmin):
    list_display = (
        "property",
        "title",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "property__title",
        "title",
    )

    inlines = [
        TourSceneInline,
    ]


# ---------------------------------------------------------
# TOUR SCENES + HOTSPOTS
# ---------------------------------------------------------

class TourHotspotInline(admin.TabularInline):
    model = TourHotspot
    fk_name = "scene"
    extra = 1

    fields = (
        "target_scene",
        "label",
        "yaw",
        "pitch",
    )


@admin.register(TourScene)
class TourSceneAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "virtual_tour",
        "display_order",
    )

    list_filter = (
        "virtual_tour",
    )

    search_fields = (
        "name",
        "virtual_tour__property__title",
    )

    ordering = (
        "virtual_tour",
        "display_order",
    )

    inlines = [
        TourHotspotInline,
    ]