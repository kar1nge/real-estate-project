import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PropertyCard from "../components/properties";

import type { Property } from "../types/property";
import { getProperty } from "../services/propertyService";
import VirtualTourViewer from "../components/properties/VirtualTourViewer";


function getYoutubeEmbedUrl(url: string | null) {
    if (!url) return null;

    try {
        const parsedUrl = new URL(url);

        let videoId = "";

        if (parsedUrl.hostname.includes("youtu.be")) {
            videoId = parsedUrl.pathname.slice(1);
        } else if (parsedUrl.hostname.includes("youtube.com")) {
            videoId = parsedUrl.searchParams.get("v") || "";

            if (parsedUrl.pathname.startsWith("/embed/")) {
                videoId = parsedUrl.pathname.split("/embed/")[1];
            }

            if (parsedUrl.pathname.startsWith("/shorts/")) {
                videoId = parsedUrl.pathname.split("/shorts/")[1];
            }
        }

        if (!videoId) return null;

        return `https://www.youtube.com/embed/${videoId}`;
    } catch {
        return null;
    }
}
function PropertyDetails() {
    const { slug } = useParams<{ slug: string }>();

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    useEffect(() => {
        const loadProperty = async () => {
            if (!slug) return;

            setLoading(true);
            setError("");

            try {
                const data = await getProperty(slug);
                setProperty(data);
            } catch (err) {
                console.error("Error loading property:", err);
                setError(
                    "We couldn't load this property right now."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProperty();
    }, [slug]);

    if (loading) {
        return (
            <main className="min-h-screen bg-white text-neutral-950">
                <Navbar />

                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="text-sm text-neutral-400">
                        Loading property...
                    </p>
                </div>

                <Footer />
            </main>
        );
    }

    if (error || !property) {
        return (
            <main className="min-h-screen bg-white text-neutral-950">
                <Navbar />

                <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
                    <p className="text-sm text-red-500">
                        {error || "Property not found."}
                    </p>

                    <Link
                        to="/properties"
                        className="mt-6 rounded-full bg-neutral-950 px-6 py-3 text-sm text-white"
                    >
                        Back to properties
                    </Link>
                </div>

                <Footer />
            </main>
        );
    }

    // const tourScenes = property.virtual_tour?.scenes ?? [];
    const virtualTour = property.virtual_tour;
    const tourScenes = virtualTour?.scenes ?? [];

    return (
        <main className="min-h-screen bg-white text-neutral-950">

            {/* Property Header */}
            <section className="px-[clamp(1rem,3vw,2.5rem)] pt-5 sm:pt-7">
                <div className="mx-auto w-full max-w-[1800px]">

                    {/* Logo */}
                    <div className="flex items-center justify-between">
                        <Link
                            to="/"
                            className="text-xl font-medium tracking-tight"
                        >
                            LOGO
                        </Link>
                    </div>

                    {/* Property actions */}
                    <div className="mt-5 flex items-center justify-between gap-3">
                        <Link
                            to="/properties"
                            className="
                            rounded-full
                            border border-neutral-200
                            bg-white
                            px-4 py-2.5
                            text-sm
                            text-neutral-600
                            transition
                            hover:border-neutral-400
                            hover:text-neutral-950
                        "
                        >
                            ← Back to properties
                        </Link>

                        <button
                            type="button"
                            className="
                            rounded-full
                            bg-neutral-950
                            px-5 py-2.5
                            text-sm
                            text-white
                            transition
                            hover:bg-neutral-800
                        "
                        >
                            Book site visit
                        </button>
                    </div>

                </div>
            </section>


            {/* Property Hero */}
            <section className="px-[clamp(1rem,3vw,2.5rem)] pt-5 sm:pt-6">
                <div className="mx-auto w-full max-w-[1800px]">

                    <div className="relative h-[clamp(25rem,52vw,40rem)] overflow-hidden rounded-[28px] sm:rounded-[36px]">

                        {property.images?.[0]?.image ? (
                            <img
                                src={property.images[0].image}
                                alt={
                                    property.images[0].alt_text ||
                                    property.title
                                }
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-neutral-200" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                        {/* Property type */}
                        <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md sm:px-4 sm:py-2 sm:text-xs">
                                {property.property_type.name}
                            </span>
                        </div>

                        {/* Hero information */}
                        <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-8 sm:bottom-8 lg:inset-x-10 lg:bottom-10">

                            {/* Property identity */}
                            <div className="max-w-3xl">

                                <p className="text-xs uppercase tracking-[0.22em] text-white/65 sm:text-sm">
                                    {property.location.name}
                                </p>

                                <h1 className="mt-2 text-[clamp(2rem,4.5vw,4rem)] font-light leading-[1.05] tracking-tight">
                                    {property.title}
                                </h1>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                                    {property.short_description}
                                </p>

                            </div>

                        </div>
                    </div>

                    {/* =========================================
    PROPERTY PRICE + FACTS
========================================= */}
                    {/* =========================================
    PROPERTY PRICE + FACTS
========================================= */}
                    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

                        {/* Price */}
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.32em] text-neutral-400">
                                Starting from
                            </p>

                            <div className="mt-2 flex items-baseline gap-3">
                                <span className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                                    KSh
                                </span>

                                <span className="text-[clamp(2.4rem,5vw,4rem)] font-light leading-none tracking-[-0.04em] text-neutral-950">
                                    {Number(
                                        property.starting_price
                                    ).toLocaleString()}
                                </span>
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <span className="h-px w-8 bg-neutral-300" />

                                <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                                    {property.location.name}
                                </span>
                            </div>
                        </div>


                        {/* =========================================
        GLASS PROPERTY FACTS — SIDE BY SIDE
    ========================================= */}
                        <div
                            className="
            inline-flex
            w-fit
            max-w-full
            overflow-hidden
            rounded-[20px]
            border
            border-white/70
            bg-white/55
            shadow-[0_8px_30px_rgba(0,0,0,0.06)]
            backdrop-blur-xl
        "
                        >

                            {/* Bedrooms */}
                            <div className="px-5 py-4 sm:px-7 sm:py-5">
                                <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                                    Bedrooms
                                </p>

                                <div className="mt-2 flex items-baseline gap-1.5">
                                    <span className="text-xl font-light tracking-tight text-neutral-950">
                                        {property.bedrooms}
                                    </span>

                                    <span className="text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                                        Beds
                                    </span>
                                </div>
                            </div>


                            {/* Divider */}
                            <div className="my-4 w-px bg-neutral-200/80" />


                            {/* Bathrooms */}
                            <div className="px-5 py-4 sm:px-7 sm:py-5">
                                <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                                    Bathrooms
                                </p>

                                <div className="mt-2 flex items-baseline gap-1.5">
                                    <span className="text-xl font-light tracking-tight text-neutral-950">
                                        {property.bathrooms}
                                    </span>

                                    <span className="text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                                        Baths
                                    </span>
                                </div>
                            </div>


                            {/* Divider */}
                            <div className="my-4 w-px bg-neutral-200/80" />


                            {/* Property type */}
                            <div className="px-5 py-4 sm:px-7 sm:py-5">
                                <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                                    Property type
                                </p>

                                <p className="mt-2 whitespace-nowrap text-sm font-light tracking-tight text-neutral-950">
                                    {property.property_type.name}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* Property Description + Amenities */}
            <section className="border-t border-neutral-200 px-[clamp(1rem,3vw,2.5rem)] py-[clamp(3rem,6vw,5rem)]">
                <div className="mx-auto w-full max-w-7xl">

                    {/* Section heading */}
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                            About the property
                        </p>

                        <h2 className="mt-2 text-[clamp(2rem,4vw,3.25rem)] font-light tracking-tight">
                            A closer look
                        </h2>
                    </div>

                    {/* Amenities */}
                    {property.amenities?.length > 0 && (
                        <div className="mt-7 overflow-hidden">
                            <div className="flex w-max gap-2.5">

                                {property.amenities.map((amenity) => (
                                    <span
                                        key={amenity.id}
                                        className="
                                shrink-0
                                rounded-full
                                border
                                border-neutral-200
                                bg-neutral-50
                                px-4
                                py-2.5
                                text-xs
                                text-neutral-600
                                transition-colors
                                hover:border-neutral-400
                                hover:bg-white
                            "
                                    >
                                        {amenity.name}
                                    </span>
                                ))}

                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mt-8 max-w-4xl border-t border-neutral-200 pt-7">
                        <p className="text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
                            {property.description}
                        </p>
                    </div>

                </div>
            </section>
            {/* Property Gallery + Media */}
            <section className="px-[clamp(1rem,3vw,2.5rem)] pb-[clamp(3rem,6vw,5rem)]">
                <div className="mx-auto w-full max-w-7xl">

                    <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-50 sm:rounded-[32px]">

                        <div className="grid lg:grid-cols-2">

                            {/* =========================================
                    LEFT — PROPERTY IMAGE CAROUSEL
                ========================================= */}
                            <div className="relative min-h-[24rem] overflow-hidden bg-neutral-200 sm:min-h-[32rem] lg:min-h-[38rem]">

                                {property.images?.length > 0 ? (
                                    <>
                                        {/* Current image */}
                                        <img
                                            src={
                                                property.images[activeImage]?.image
                                            }
                                            alt={
                                                property.images[activeImage]
                                                    ?.alt_text ||
                                                property.title
                                            }
                                            className="
                                    absolute
                                    inset-0
                                    h-full
                                    w-full
                                    object-cover
                                    transition-opacity
                                    duration-500
                                "
                                        />

                                        {/* Image overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                                        {/* Gallery label */}
                                        <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
                                            <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
                                                Property gallery
                                            </span>
                                        </div>

                                        {/* Image counter */}
                                        <div className="absolute right-5 top-5 sm:right-7 sm:top-7">
                                            <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                                                {activeImage + 1} /{" "}
                                                {property.images.length}
                                            </span>
                                        </div>

                                        {/* Previous / Next */}
                                        {property.images.length > 1 && (
                                            <div className="absolute inset-x-5 bottom-5 flex items-center justify-between sm:inset-x-7 sm:bottom-7">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveImage(
                                                            (current) =>
                                                                current === 0
                                                                    ? property.images.length - 1
                                                                    : current - 1
                                                        )
                                                    }
                                                    aria-label="Previous image"
                                                    className="
                                            flex
                                            h-11
                                            w-11
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-white/20
                                            bg-black/20
                                            text-lg
                                            text-white
                                            backdrop-blur-md
                                            transition
                                            hover:bg-white
                                            hover:text-neutral-950
                                        "
                                                >
                                                    ←
                                                </button>

                                                {/* Dots */}
                                                <div className="flex max-w-[50%] items-center gap-1.5 overflow-hidden">
                                                    {property.images.map(
                                                        (_, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                onClick={() =>
                                                                    setActiveImage(index)
                                                                }
                                                                aria-label={`View image ${index + 1
                                                                    }`}
                                                                className={`
                                                        h-1.5
                                                        rounded-full
                                                        transition-all
                                                        duration-300
                                                        ${activeImage ===
                                                                        index
                                                                        ? "w-6 bg-white"
                                                                        : "w-1.5 bg-white/50 hover:bg-white/80"
                                                                    }
                                                    `}
                                                            />
                                                        )
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveImage(
                                                            (current) =>
                                                                current ===
                                                                    property.images.length - 1
                                                                    ? 0
                                                                    : current + 1
                                                        )
                                                    }
                                                    aria-label="Next image"
                                                    className="
                                            flex
                                            h-11
                                            w-11
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-white/20
                                            bg-black/20
                                            text-lg
                                            text-white
                                            backdrop-blur-md
                                            transition
                                            hover:bg-white
                                            hover:text-neutral-950
                                        "
                                                >
                                                    →
                                                </button>

                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex h-full min-h-[24rem] items-center justify-center text-sm text-neutral-400">
                                        No property images available.
                                    </div>
                                )}
                            </div>


                            {/* =========================================
                    RIGHT — VIDEO + VR
                ========================================= */}
                            {/* =========================================
    RIGHT — VIDEO + VIRTUAL TOUR
========================================= */}
                            <div className="grid min-h-[24rem] lg:min-h-[38rem] lg:grid-rows-2">

                                {/* =========================================
        YOUTUBE VIDEO
    ========================================= */}
                                <div className="relative min-h-[16rem] overflow-hidden bg-neutral-950">

                                    {getYoutubeEmbedUrl(property.youtube_url) ? (
                                        <iframe
                                            src={getYoutubeEmbedUrl(property.youtube_url)!}
                                            title={`${property.title} video tour`}
                                            className="absolute inset-0 h-full w-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="flex h-full min-h-[16rem] flex-col items-center justify-center px-6 text-center">
                                            <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                                                Video tour
                                            </p>

                                            <p className="mt-2 text-sm text-white/60">
                                                Video tour coming soon.
                                            </p>
                                        </div>
                                    )}

                                    {/* Label */}
                                    <div className="absolute left-5 top-5 z-10 sm:left-6 sm:top-6">
                                        <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
                                            Video tour
                                        </span>
                                    </div>
                                </div>


                                {/* =========================================
    360° VIRTUAL TOUR
========================================= */}
                                <div className="relative min-h-[16rem] overflow-hidden border-t border-white/10 bg-neutral-950">

                                    {tourScenes.length > 0 ? (
                                        <>
                                            {/* VR invitation */}
                                            <div className="relative flex min-h-[16rem] flex-col items-center justify-center px-6 py-10 text-center">

                                                {/* Decorative background */}
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)]" />

                                                <div className="relative z-10">

                                                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60 backdrop-blur-md">
                                                        360° Virtual tour
                                                    </span>

                                                    <h3 className="mt-4 text-xl font-light tracking-tight text-white">
                                                        Walk through the property
                                                    </h3>

                                                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/50">
                                                        Explore the home in 360° and move between rooms
                                                        using the interactive tour.
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() => setIsVirtualTourOpen(true)}
                                                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            bg-white
                            px-5
                            py-3
                            text-sm
                            font-medium
                            text-neutral-950
                            transition
                            hover:bg-neutral-200
                        "
                                                    >
                                                        <span>Explore 360°</span>
                                                        <span aria-hidden="true">→</span>
                                                    </button>

                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex min-h-[16rem] flex-col items-center justify-center px-6 text-center">

                                            <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                                                360° Virtual tour
                                            </p>

                                            <p className="mt-2 text-sm text-white/60">
                                                Virtual tour coming soon.
                                            </p>

                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* Inquiry + Book Site Visit */}
            <section className="border-t border-neutral-200 px-[clamp(1rem,3vw,2.5rem)] py-[clamp(3rem,6vw,5rem)]">
                <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">

                    {/* Inquiry */}
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                            Interested in this property?
                        </p>

                        <h2 className="mt-2 max-w-2xl text-[clamp(2rem,4vw,3.25rem)] font-light tracking-tight">
                            Let's make the next step simple.
                        </h2>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base sm:leading-8">
                            Have questions about this property, pricing,
                            availability or the buying process? Get in touch
                            with our team and we'll be happy to help.
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">

                            <a
                                href={`mailto:info@example.com?subject=Property enquiry - ${encodeURIComponent(
                                    property.title
                                )}`}
                                className="
                        inline-flex
                        items-center
                        justify-center
                        rounded-full
                        bg-neutral-950
                        px-6
                        py-3.5
                        text-sm
                        text-white
                        transition
                        hover:bg-neutral-800
                    "
                            >
                                Make an enquiry
                                <span className="ml-2">→</span>
                            </a>

                            {property.google_maps_url && (
                                <a
                                    href={property.google_maps_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-neutral-200
                            bg-white
                            px-6
                            py-3.5
                            text-sm
                            text-neutral-950
                            transition
                            hover:border-neutral-400
                        "
                                >
                                    View location
                                </a>
                            )}

                        </div>
                    </div>


                    {/* Book Site Visit */}
                    <div className="rounded-[28px] bg-neutral-950 p-7 text-white sm:p-9">

                        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                            Private viewing
                        </p>

                        <h3 className="mt-2 text-2xl font-light sm:text-3xl">
                            Book a site visit
                        </h3>

                        <p className="mt-4 text-sm leading-6 text-white/55">
                            See {property.title} in person and experience the
                            space for yourself.
                        </p>

                        <div className="mt-7 grid gap-3">

                            <input
                                type="text"
                                placeholder="Your name"
                                className="
                        h-12
                        w-full
                        rounded-full
                        border
                        border-white/10
                        bg-white/5
                        px-5
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-white/30
                        focus:border-white/30
                    "
                            />

                            <input
                                type="email"
                                placeholder="Email address"
                                className="
                        h-12
                        w-full
                        rounded-full
                        border
                        border-white/10
                        bg-white/5
                        px-5
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-white/30
                        focus:border-white/30
                    "
                            />

                            <input
                                type="tel"
                                placeholder="Phone number"
                                className="
                        h-12
                        w-full
                        rounded-full
                        border
                        border-white/10
                        bg-white/5
                        px-5
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-white/30
                        focus:border-white/30
                    "
                            />

                            <textarea
                                rows={3}
                                placeholder="Anything you'd like us to know?"
                                className="
                        w-full
                        resize-none
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/5
                        px-5
                        py-4
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-white/30
                        focus:border-white/30
                    "
                            />

                            <button
                                type="button"
                                className="
                        mt-1
                        h-12
                        w-full
                        rounded-full
                        bg-white
                        px-5
                        text-sm
                        text-neutral-950
                        transition
                        hover:bg-neutral-200
                    "
                            >
                                Request a site visit
                                <span className="ml-2">→</span>
                            </button>

                        </div>

                    </div>

                </div>
            </section>

            {/* Similar Properties */}
            {property.similar_properties?.length > 0 && (
                <section className="border-t border-neutral-200 px-[clamp(1rem,3vw,2.5rem)] py-[clamp(3rem,5vw,4rem)]">
                    <div className="mx-auto w-full max-w-7xl">

                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                                You may also like
                            </p>

                            <h2 className="mt-2 text-2xl font-light tracking-tight sm:text-3xl">
                                Similar properties
                            </h2>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            {property.similar_properties
                                .slice(0, 3)
                                .map((similarProperty) => (
                                    <div
                                        key={similarProperty.id}
                                        className="h-[clamp(15rem,25vw,19rem)]"
                                    >
                                        <PropertyCard
                                            property={similarProperty}
                                            variant="compact"
                                        />
                                    </div>
                                ))}

                        </div>

                    </div>
                </section>
            )}
            {/* =========================================
    360° VIRTUAL TOUR MODAL
========================================= */}
            {isVirtualTourOpen && tourScenes.length > 0 && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-label="360 degree virtual tour"
                >

                    {/* Modal */}
                    <div className="relative flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-[24px] bg-neutral-950 shadow-2xl sm:rounded-[32px]">

                        {/* Header */}
                        <div className="relative z-20 flex shrink-0 items-center justify-between border-b border-white/10 bg-neutral-950 px-5 py-4 sm:px-7">

                            <div>
                                <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                                    360° Virtual tour
                                </p>

                                <p className="mt-1 text-sm text-white">
                                    Explore {property.title}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsVirtualTourOpen(false)}
                                className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/10
                        bg-white/5
                        text-lg
                        text-white
                        transition
                        hover:bg-white
                        hover:text-neutral-950
                    "
                                aria-label="Close virtual tour"
                            >
                                ×
                            </button>

                        </div>

                        {/* Viewer */}
                        <div className="min-h-0 flex-1">
                            <VirtualTourViewer property={property} />
                        </div>

                    </div>

                </div>
            )}

            <Footer />
        </main>
    );
}

export default PropertyDetails;