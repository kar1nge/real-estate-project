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

    google_maps_url: string;

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

    amenities: {
        id: number;
        name: string;
    }[];

    images: {
        id: number;
        image: string;
        alt_text: string;
        display_order: number;
        property: number;
    }[];
    display_order: number;
}