export interface Location {
    id: number;
    name: string;
    slug: string;
    description: string;
    hero_image: string | null;
    latitude: string | null;
    longitude: string | null;
    created_at: string;
}

export interface PropertyType {
    id: number;
    name: string;
}

export interface PropertyStatus {
    id: number;
    name: string;
}

export interface Amenity {
    id: number;
    name: string;
}

export interface PropertyImage {
    id: number;
    image: string;
    alt_text: string;
    display_order: number;
    property: number;
}

export interface SimilarProperty {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    description: string;
    starting_price: string;
    bedrooms: number;
    bathrooms: number;

    location: {
        id: number;
        name: string;
        slug: string;
    };

    property_type: {
        id: number;
        name: string;
    };

    status: {
        id: number;
        name: string;
    };

    images: {
        id: number;
        image: string;
        alt_text: string;
        display_order: number;
    }[];

    amenities: {
        id: number;
        name: string;
    }[];

    google_maps_url: string | null;
    featured: boolean;
    youtube_url: string | null;
    completion_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface Property {
    id: number;

    title: string;
    slug: string;

    short_description: string;
    description: string;

    starting_price: string;

    bedrooms: number;
    bathrooms: number;

    featured: boolean;

    google_maps_url: string | null;

    virtual_tour_url: string | null;
    youtube_url: string | null;

    completion_date: string | null;

    created_at: string;
    updated_at: string;

    location: Location;

    property_type: PropertyType;

    status: PropertyStatus;

    amenities: Amenity[];

    images: PropertyImage[];

    virtual_tour: VirtualTour | null;

    similar_properties: Property[];
}

export interface TourScene {
    id: number;
    name: string;
    image: string;
    display_order: number;
}

export interface VirtualTour {
    id: number;
    title: string;
    scenes: TourScene[];
    created_at: string;
    updated_at: string;
}

export interface PaginatedProperties {
    count: number;
    next: string | null;
    previous: string | null;
    results: Property[];
}

