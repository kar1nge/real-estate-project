import { useEffect, useRef, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import hero from "../assets/images/hero.jpg"

import PropertyCard from "../components/properties";

import type { Property } from "../types/property";

import type {
    Location,
    PropertyType,
    PropertyStatus,
} from "../services/propertyService";

import {
    getProperties,
    getLocations,
    getPropertyTypes,
    getPropertyStatuses,
    type PropertyFilters,
} from "../services/propertyService";

function Properties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [locations, setLocations] = useState<Location[]>([]);
    const [propertyTypes, setPropertyTypes] =
        useState<PropertyType[]>([]);
    const [statuses, setStatuses] =
        useState<PropertyStatus[]>([]);


    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [status, setStatus] = useState("");
    const [bedrooms, setBedrooms] = useState("");
    const [minimumPrice, setMinimumPrice] = useState("");
    const [maximumPrice, setMaximumPrice] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProperties, setTotalProperties] = useState(0);

const [locationPage, setLocationPage] = useState(0);

const FIRST_LOCATION_PAGE_SIZE = 8;
const LOCATION_PAGE_SIZE = 7;

const totalLocationPages =
    locations.length <= FIRST_LOCATION_PAGE_SIZE
        ? 1
        : 1 +
          Math.ceil(
              (locations.length - FIRST_LOCATION_PAGE_SIZE) /
                  LOCATION_PAGE_SIZE
          );

const currentLocationPage =
    locationPage === 0
        ? locations.slice(0, FIRST_LOCATION_PAGE_SIZE)
        : locations.slice(
              FIRST_LOCATION_PAGE_SIZE +
                  (locationPage - 1) * LOCATION_PAGE_SIZE,
              FIRST_LOCATION_PAGE_SIZE +
                  locationPage * LOCATION_PAGE_SIZE
          );

    const [activeFilters, setActiveFilters] =
        useState<PropertyFilters>({});

    const [filterOpen, setFilterOpen] = useState(false);

    const filterButtonRef = useRef<HTMLButtonElement>(null);

    /*
     * Load filter options.
     */
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const [
                    locationsData,
                    propertyTypesData,
                    statusesData,
                ] = await Promise.all([
                    getLocations(),
                    getPropertyTypes(),
                    getPropertyStatuses(),
                ]);

                setLocations(locationsData);
                setPropertyTypes(propertyTypesData);
                setStatuses(statusesData);
            } catch (err) {
                console.error(
                    "Error loading property filters:",
                    err
                );
            }
        };

        loadFilterOptions();
    }, []);

    /*
     * Load properties whenever active filters change.
     */
    useEffect(() => {
        const loadProperties = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getProperties({
                    ...activeFilters,
                    page: currentPage,
                });

                setProperties(data.results);
                setTotalProperties(data.count);
            } catch (err) {
                console.error(
                    "Error loading properties:",
                    err
                );

                setError(
                    "We couldn't load the properties right now."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProperties();
    }, [activeFilters, currentPage]);

    const applyFilters = () => {
        const filters: PropertyFilters = {};

        if (search.trim()) {
            filters.search = search.trim();
        }

        if (location) {
            filters.location__slug = location;
        }

        if (propertyType) {
            filters.property_type = Number(propertyType);
        }

        if (status) {
            filters.status = Number(status);
        }

        if (bedrooms) {
            filters.bedrooms = Number(bedrooms);
        }

        if (minimumPrice) {
            filters.starting_price__gte =
                Number(minimumPrice);
        }

        if (maximumPrice) {
            filters.starting_price__lte =
                Number(maximumPrice);
        }

        setCurrentPage(1);
        setActiveFilters(filters);
    };

    const handleApplyFilters = () => {
        applyFilters();
        setFilterOpen(false);
    };

    const clearFilters = () => {
        setSearch("");
        setLocation("");
        setPropertyType("");
        setStatus("");
        setBedrooms("");
        setMinimumPrice("");
        setMaximumPrice("");

        setCurrentPage(1);
        setActiveFilters({});
        setFilterOpen(false);
    };

    const activeFilterCount = Object.keys(activeFilters).length;
    const hasActiveFilters = activeFilterCount > 0;

    const pageSize = 12;

    const totalPages = Math.ceil(
        totalProperties / pageSize
    );

    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 5) {
            for (let page = 1; page <= totalPages; page++) {
                pages.push(page);
            }

            return pages;
        }

        pages.push(1);

        if (currentPage > 4) {
            pages.push("...");
        }

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(
            totalPages - 1,
            currentPage + 1
        );

        for (
            let page = startPage;
            page <= endPage;
            page++
        ) {
            pages.push(page);
        }

        if (currentPage < totalPages - 3) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };



    return (
        <main className="min-h-screen bg-white text-neutral-950">

            {/* Navigation + Intro */}
            <section className="relative min-h-[clamp(14rem,24vw,20rem)] overflow-hidden">

                {/* Hero Image */}
                <img
                    src={hero}
                    alt="Luxury property in Nairobi"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                {/* Hero Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/55" />

                <Navbar />

                {/* Intro content */}
                <div className="relative mx-auto flex min-h-[clamp(16rem,28vw,23rem)] w-full max-w-7xl items-end px-[clamp(1rem,4vw,2.5rem)] pb-[clamp(1.5rem,3vw,2.25rem)] pt-[clamp(6rem,9vw,7.5rem)]">

                    <div className="max-w-3xl text-white">

                        {/* Section Label */}
                        <p className="text-[clamp(1rem,1.5vw,1.35rem)] font-medium uppercase tracking-[0.28em] text-white/75">
                            Properties
                        </p>

                        {/* Heading */}
                        <h1 className="mt-2 text-[clamp(2rem,4.5vw,4rem)] font-light tracking-tight">
                            Find a place
                            <br />
                            <span className="text-white/65">
                                worth calling home.
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mt-2 max-w-lg text-[clamp(0.75rem,1vw,0.95rem)] leading-6 text-white/70">
                            Explore our collection of thoughtfully selected
                            properties across Nairobi.
                        </p>

                    </div>

                </div>

            </section>

            {/* Search + Filter */}
            <section className="border-y border-neutral-200 bg-neutral-50 px-[clamp(1rem,4vw,2.5rem)] py-4 sm:py-5">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    applyFilters();
                                }
                            }}
                            placeholder="Search properties..."
                            className="h-12 min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-5 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-500"
                        />

                        <button
                            ref={filterButtonRef}
                            type="button"
                            onClick={() =>
                                setFilterOpen((current) => !current)
                            }
                            className={`h-12 shrink-0 rounded-full border px-5 text-sm transition ${filterOpen || hasActiveFilters
                                ? "border-neutral-950 bg-neutral-950 text-white"
                                : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-400"
                                }`}
                            aria-expanded={filterOpen}
                            aria-haspopup="dialog"
                        >
                            {hasActiveFilters
                                ? `Filters ${activeFilterCount}`
                                : "Filter"}
                        </button>

                        {filterOpen && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Close filters"
                                    onClick={() => setFilterOpen(false)}
                                    className="fixed inset-0 z-30 cursor-default"
                                />

                                <div
                                    role="dialog"
                                    aria-modal="false"
                                    aria-label="Filter properties"
                                    className="absolute right-0 top-14 z-40 w-[min(92vw,30rem)] rounded-3xl border border-white/70 bg-white/80 p-5 shadow-2xl backdrop-blur-xl sm:p-6"
                                >
                                    <div className="mb-5 flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                                                Refine your search
                                            </p>

                                            <h2 className="mt-1 text-xl font-light">
                                                Filter properties
                                            </h2>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFilterOpen(false)
                                            }
                                            className="rounded-full border border-neutral-200 bg-white/70 px-3 py-1.5 text-xs text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-950"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <div className="grid gap-3">
                                        {/* Location */}
                                        <select
                                            value={location}
                                            onChange={(event) =>
                                                setLocation(
                                                    event.target.value
                                                )
                                            }
                                            className="h-12 rounded-full border border-neutral-200 bg-white/75 px-5 text-sm outline-none transition focus:border-neutral-500"
                                        >
                                            <option value="">
                                                All locations
                                            </option>

                                            {locations.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.slug}
                                                >
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Property Type */}
                                        <select
                                            value={propertyType}
                                            onChange={(event) =>
                                                setPropertyType(
                                                    event.target.value
                                                )
                                            }
                                            className="h-12 rounded-full border border-neutral-200 bg-white/75 px-5 text-sm outline-none transition focus:border-neutral-500"
                                        >
                                            <option value="">
                                                All property types
                                            </option>

                                            {propertyTypes.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Bedrooms */}
                                        <select
                                            value={bedrooms}
                                            onChange={(event) =>
                                                setBedrooms(
                                                    event.target.value
                                                )
                                            }
                                            className="h-12 rounded-full border border-neutral-200 bg-white/75 px-5 text-sm outline-none transition focus:border-neutral-500"
                                        >
                                            <option value="">
                                                Any bedrooms
                                            </option>

                                            {[1, 2, 3, 4, 5, 6].map(
                                                (number) => (
                                                    <option
                                                        key={number}
                                                        value={number}
                                                    >
                                                        {number}{" "}
                                                        {number === 1
                                                            ? "bedroom"
                                                            : "bedrooms"}
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Minimum Price */}
                                            <input
                                                type="number"
                                                min="0"
                                                value={minimumPrice}
                                                onChange={(event) =>
                                                    setMinimumPrice(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Minimum price"
                                                className="h-12 min-w-0 rounded-full border border-neutral-200 bg-white/75 px-5 text-sm outline-none transition focus:border-neutral-500"
                                            />

                                            {/* Maximum Price */}
                                            <input
                                                type="number"
                                                min="0"
                                                value={maximumPrice}
                                                onChange={(event) =>
                                                    setMaximumPrice(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Maximum price"
                                                className="h-12 min-w-0 rounded-full border border-neutral-200 bg-white/75 px-5 text-sm outline-none transition focus:border-neutral-500"
                                            />
                                        </div>

                                        {/* Status */}
                                        <select
                                            value={status}
                                            onChange={(event) =>
                                                setStatus(
                                                    event.target.value
                                                )
                                            }
                                            className="h-12 rounded-full border border-neutral-200 bg-white/75 px-5 text-sm outline-none transition focus:border-neutral-500"
                                        >
                                            <option value="">
                                                Any status
                                            </option>

                                            {statuses.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mt-5 flex gap-2 border-t border-white/60 pt-5">
                                        <button
                                            type="button"
                                            onClick={handleApplyFilters}
                                            className="h-12 flex-1 rounded-full bg-neutral-950 px-5 text-sm text-white transition hover:bg-neutral-800"
                                        >
                                            Apply filters
                                        </button>

                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            disabled={!hasActiveFilters}
                                            className="h-12 rounded-full border border-neutral-200 bg-white/70 px-5 text-sm transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="px-[clamp(1rem,4vw,2.5rem)] py-[clamp(2rem,4vw,3.5rem)]">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                                Browse properties
                            </p>

                            <h2 className="mt-2 text-2xl font-light tracking-tight sm:text-3xl">
                                BROWSE PROPERTIES
                            </h2>
                        </div>

                        <p className="text-right text-sm text-neutral-500">
                            {loading
                                ? "Loading properties..."
                                : `${properties.length} ${properties.length === 1
                                    ? "property"
                                    : "properties"
                                }`}
                        </p>
                    </div>

                    {loading && (
                        <div className="py-24 text-center text-sm text-neutral-400">
                            Loading properties...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="py-24 text-center">
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        properties.length === 0 && (
                            <div className="py-24 text-center">
                                <h2 className="text-2xl font-light">
                                    No properties found.
                                </h2>

                                <p className="mt-3 text-sm text-neutral-500">
                                    Try adjusting your filters.
                                </p>

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-6 rounded-full bg-neutral-950 px-6 py-3 text-sm text-white"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}

                    {!loading &&
                        !error &&
                        properties.length > 0 && (
                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                {properties.map((property) => (
                                    <div
                                        key={property.id}
                                        className="h-[clamp(24rem,45vw,32rem)]"
                                    >
                                        <PropertyCard
                                            property={property}
                                            variant="featured"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                </div>
                {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-1.5">

                        {/* Previous */}
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.max(page - 1, 1)
                                )
                            }
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                            className="
                flex
                h-10
                min-w-10
                items-center
                justify-center
                rounded-full
                border
                border-neutral-200
                px-3
                text-sm
                text-neutral-600
                transition-all
                duration-200
                hover:border-neutral-400
                hover:text-neutral-950
                disabled:cursor-not-allowed
                disabled:opacity-30
            "
                        >
                            ←
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page, index) =>
                            page === "..." ? (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="
                        flex
                        h-10
                        min-w-8
                        items-center
                        justify-center
                        px-1
                        text-sm
                        text-neutral-400
                    "
                                >
                                    …
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage(page)
                                    }
                                    aria-label={`Go to page ${page}`}
                                    aria-current={
                                        currentPage === page
                                            ? "page"
                                            : undefined
                                    }
                                    className={`
                        flex
                        h-10
                        min-w-10
                        items-center
                        justify-center
                        rounded-full
                        px-3
                        text-sm
                        transition-all
                        duration-200
                        ${currentPage === page
                                            ? "bg-neutral-950 text-white"
                                            : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
                                        }
                    `}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        {/* Next */}
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(page + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                            className="
                flex
                h-10
                min-w-10
                items-center
                justify-center
                rounded-full
                border
                border-neutral-200
                px-3
                text-sm
                text-neutral-600
                transition-all
                duration-200
                hover:border-neutral-400
                hover:text-neutral-950
                disabled:cursor-not-allowed
                disabled:opacity-30
            "
                        >
                            →
                        </button>

                    </div>
                )}
                {/* Locations */}
<section className="border-t border-neutral-200 bg-neutral-50 px-[clamp(1rem,4vw,2.5rem)] py-[clamp(2rem,4vw,3rem)]">
    <div className="mx-auto w-full max-w-7xl">

        <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                Explore by location
            </p>

            <h2 className="mt-2 text-2xl font-light tracking-tight sm:text-3xl">
                Find properties across Nairobi
            </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            {/* Back */}
            {locationPage > 0 && (
                <button
                    type="button"
                    onClick={() =>
                        setLocationPage((page) =>
                            Math.max(page - 1, 0)
                        )
                    }
                    className="
                        flex
                        min-h-[4.25rem]
                        flex-col
                        justify-between
                        rounded-2xl
                        border
                        border-neutral-200
                        bg-white
                        p-3.5
                        text-left
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-neutral-400
                        hover:shadow-sm
                    "
                >
                    <span className="text-sm font-medium text-neutral-950">
                        ← Back
                    </span>

                    <span className="text-xs text-neutral-400">
                        Previous locations
                    </span>
                </button>
            )}

            {/* Locations */}
            {currentLocationPage.map((location) => (
                <button
                    key={location.id}
                    type="button"
                    onClick={() => {
                        setLocation(location.slug);
                        setCurrentPage(1);
                        applyFilters();
                    }}
                    className="
                        group
                        flex
                        min-h-[4.25rem]
                        flex-col
                        justify-between
                        rounded-2xl
                        border
                        border-neutral-200
                        bg-white
                        p-3.5
                        text-left
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-neutral-400
                        hover:shadow-sm
                    "
                >
                    <span className="text-sm font-medium text-neutral-950">
                        {location.name}
                    </span>

                    <span className="text-xs text-neutral-400">
                        {location.property_count}{" "}
                        {location.property_count === 1
                            ? "property"
                            : "properties"}
                    </span>
                </button>
            ))}

            {/* Explore More */}
            {locationPage < totalLocationPages - 1 && (
                <button
                    type="button"
                    onClick={() =>
                        setLocationPage((page) =>
                            Math.min(
                                page + 1,
                                totalLocationPages - 1
                            )
                        )
                    }
                    className="
                        flex
                        min-h-[4.25rem]
                        flex-col
                        justify-between
                        rounded-2xl
                        border
                        border-dashed
                        border-neutral-300
                        bg-transparent
                        p-3.5
                        text-left
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-neutral-500
                        hover:bg-white
                    "
                >
                    <span className="text-sm font-medium text-neutral-950">
                        Explore more locations
                    </span>

                    <span className="text-xs text-neutral-400">
                        More locations →
                    </span>
                </button>
            )}

        </div>

    </div>
</section>

            </section>

            <Footer />
        </main>
    );
}

export default Properties;