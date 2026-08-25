import { Link } from "react-router-dom";
import type { Property } from "../../types/property";

interface PropertyCardProps {
    property: Property;
    variant: "showcase" | "featured" | "compact";
    priority?: boolean;
}

function PropertyCard({
    property,
    variant,
    priority = false,
}: PropertyCardProps) {
    const image = property.images[0]?.image;
    const imageAlt =
        property.images[0]?.alt_text || property.title;

    const propertyUrl = `/properties/${property.slug}`;

    switch (variant) {
        // ==========================================
        // SHOWCASE — Large Card
        // ==========================================
        case "showcase":
            return (
                <Link
                    to={propertyUrl}
                    className="
                        group
                        relative
                        block
                        h-full
                        overflow-hidden
                        rounded-[32px]
                    "
                >
                    <img
                        src={image}
                        alt={imageAlt}
                        loading={priority ? "eager" : "lazy"}
                        decoding="async"
                        className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-105
                        "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Property Type */}
                    <div className="absolute left-8 top-8">
                        <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white backdrop-blur-md">
                            {property.property_type.name}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-x-8 bottom-8 flex items-end justify-between gap-6">
                        <div className="max-w-xl text-white">
                            <p className="text-sm uppercase tracking-[0.25em] text-white/70">
                                {property.location.name}
                            </p>

                            <h2 className="mt-3 text-4xl font-light md:text-5xl">
                                {property.title}
                            </h2>
                        </div>

                        <div className="shrink-0 text-right text-white">
                            <h3 className="text-3xl font-light">
                                KSh{" "}
                                {Number(
                                    property.starting_price
                                ).toLocaleString()}
                            </h3>

                            <p className="mt-2 text-sm text-white/70">
                                {property.bedrooms} Beds •{" "}
                                {property.bathrooms} Baths
                            </p>

                            {/* CTA */}
                            <div
                                className="
                                    mt-6
                                    flex
                                    items-center
                                    justify-end
                                    gap-2
                                    text-sm
                                    uppercase
                                    tracking-[0.25em]
                                    text-white
                                    opacity-0
                                    transition-all
                                    duration-300
                                    group-hover:opacity-100
                                "
                            >
                                <span>View Property</span>

                                <span
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-2
                                    "
                                >
                                    →
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            );

        // ==========================================
        // FEATURED — Medium Card
        // ==========================================
        case "featured":
            return (
                <Link
                    to={propertyUrl}
                    className="
                        group
                        relative
                        block
                        h-full
                        overflow-hidden
                        rounded-[28px]
                    "
                >
                    <img
                        src={image}
                        alt={imageAlt}
                        loading={priority ? "eager" : "lazy"}
                        decoding="async"
                        className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-105
                        "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                    {/* Property Type */}
                    <div className="absolute left-6 top-6">
                        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
                            {property.property_type.name}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-x-6 bottom-6 text-white">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/65">
                            {property.location.name}
                        </p>

                        <h2 className="mt-2 text-2xl font-light md:text-3xl">
                            {property.title}
                        </h2>

                        <div className="mt-3 flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xl font-light">
                                    KSh{" "}
                                    {Number(
                                        property.starting_price
                                    ).toLocaleString()}
                                </p>

                                <p className="mt-1 text-xs text-white/65">
                                    {property.bedrooms} Beds •{" "}
                                    {property.bathrooms} Baths
                                </p>
                            </div>

                            {/* CTA */}
                            <div
                                className="
                                    flex
                                    shrink-0
                                    items-center
                                    gap-2
                                    text-xs
                                    uppercase
                                    tracking-[0.18em]
                                    opacity-0
                                    transition-all
                                    duration-300
                                    group-hover:opacity-100
                                "
                            >
                                <span>View Property</span>

                                <span
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-1
                                    "
                                >
                                    →
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            );
        // ==========================================
        // COMPACT — Small Card
        // ==========================================
        case "compact":
            return (
                <Link
                    to={propertyUrl}
                    className="
                        group
                        relative
                        block
                        h-full
                        overflow-hidden
                        rounded-[24px]
                    "
                >
                    <img
                        src={image}
                        alt={imageAlt}
                        loading={priority ? "eager" : "lazy"}
                        decoding="async"
                        className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-105
                        "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    {/* Property Type */}
                    <div className="absolute left-5 top-5">
                        <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-white backdrop-blur-md">
                            {property.property_type.name}
                        </span>
                    </div>

                    {/* Compact Content */}
                    <div className="absolute inset-x-5 bottom-5 text-white">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                            {property.location.name}
                        </p>

                        <h2 className="mt-1 text-xl font-light">
                            {property.title}
                        </h2>

                        <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="text-base font-light">
                                KSh{" "}
                                {Number(
                                    property.starting_price
                                ).toLocaleString()}
                            </p>

                            {/* CTA */}
                            <div
                                className="
                                    flex
                                    shrink-0
                                    items-center
                                    gap-1.5
                                    text-[10px]
                                    uppercase
                                    tracking-[0.15em]
                                    opacity-0
                                    transition-all
                                    duration-300
                                    group-hover:opacity-100
                                "
                            >
                                <span>View</span>

                                <span
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-1
                                    "
                                >
                                    →
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            );

        default:
            return null;
    }
}

export default PropertyCard;