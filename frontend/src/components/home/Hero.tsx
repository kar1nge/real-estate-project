import { useEffect, useState } from "react";
import { getHeroSlides } from "../../services/heroService";
import type { HeroSlide } from "../../types/hero";
import { motion, AnimatePresence } from "motion/react";

function preloadHeroImage(src: string): Promise<void> {
    return new Promise((resolve) => {
        const image = new Image();
        let completed = false;
        const finish = () => {
            if (completed) return;
            completed = true;
            window.clearTimeout(timeoutId);
            resolve();
        };
        const timeoutId = window.setTimeout(finish, 8_000);

        image.decoding = "async";
        image.fetchPriority = "high";
        image.onload = finish;
        image.onerror = finish;
        image.src = src;

        if (image.complete) finish();
    });
}

function Hero() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const fetchSlides = async () => {
            try {
                const data = await getHeroSlides();

                if (data.length > 0) {
                    await preloadHeroImage(data[0].image);
                }

                if (!cancelled) setSlides(data);
            } catch (error) {
                console.error("Error fetching hero slides:", error);
                if (!cancelled) setHasError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void fetchSlides();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (slides.length < 2) return;

        const nextSlide = slides[(currentSlide + 1) % slides.length];
        const image = new Image();
        image.decoding = "async";
        image.src = nextSlide.image;
    }, [currentSlide, slides]);

    useEffect(() => {
        if (slides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides]);

    if (loading) {
        return (
            <section className="relative flex h-screen items-center justify-center overflow-hidden bg-[#18352F] text-white">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#18352F] via-[#244E45] to-[#18352F]"
                />
                <p role="status" className="relative z-10 text-sm tracking-wide text-white/80">
                    Loading featured homes…
                </p>
            </section>
        );
    }

    if (slides.length === 0) {
        return (
            <section className="flex h-screen flex-col items-center justify-center gap-4 bg-[#18352F] px-6 text-center text-white">
                <p>{hasError ? "We couldn’t load the featured homes." : "Our featured homes are being prepared."}</p>
                {hasError && <button type="button" onClick={() => window.location.reload()} className="rounded-full border border-white/50 px-5 py-2 text-sm hover:bg-white hover:text-[#18352F]">Try again</button>}
            </section>
        );
    }

    const slide = slides[currentSlide];

    return (
        <section className="group relative h-screen overflow-hidden bg-[#18352F]">
            {/* Background Image */}
            <AnimatePresence mode="sync">
                <motion.div
                    key={slide.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                >
                    {/* Background Image */}
                    <motion.img
                        src={slide.image}
                        alt={slide.title}
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        className="absolute inset-0 h-full w-full object-cover object-[center_60%]"
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.08 }}
                        transition={{
                            duration: 6,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/60" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full items-center justify-center px-6">
                        <motion.div
                            className="max-w-4xl text-center text-white"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.2,
                            }}
                        >
                            <p className="mb-4 text-sm uppercase tracking-[0.3em]">
                                Premium Real Estate
                            </p>

                            <h1 className="text-5xl font-light md:text-7xl">
                                {slide.title}
                            </h1>

                            <p className="mt-6 text-lg leading-relaxed md:text-xl">
                                {slide.subtitle}
                            </p>

                            <a
                                href={slide.button_link}
                                className="mt-10 inline-block rounded-md border border-white px-8 py-3 text-sm font-medium transition hover:bg-white hover:text-black"
                            >
                                {slide.button_text}
                            </a>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Carousel Indicators */}
            {/* Left Arrow */}
            <button
                onClick={() =>
                    setCurrentSlide(
                        (prev) => (prev - 1 + slides.length) % slides.length
                    )
                }
                className="
        absolute left-8 top-1/2 z-20
        flex h-14 w-14 -translate-y-1/2
        items-center justify-center
        rounded-full
        bg-white/20
        text-3xl text-white
        backdrop-blur-md
        transition-all duration-300
        hover:scale-110 hover:bg-white/30
    "
            >
                ‹
            </button>

            {/* Right Arrow */}
            <button
                onClick={() =>
                    setCurrentSlide(
                        (prev) => (prev + 1) % slides.length
                    )
                }
                className="
        absolute right-8 top-1/2 z-20
        flex h-14 w-14 -translate-y-1/2
        items-center justify-center
        rounded-full
        bg-white/20
        text-3xl text-white
        backdrop-blur-md
        transition-all duration-300
        hover:scale-110 hover:bg-white/30
    "
            >
                ›
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${currentSlide === index
                            ? "bg-white scale-125"
                            : "bg-white/40"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}

export default Hero;
