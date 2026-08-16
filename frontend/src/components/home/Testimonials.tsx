import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Testimonials will be dropped once the CMS is ready. For now, we will use hardcoded testimonials.
const testimonials = [
    {
        quote:
            "The entire experience felt effortless. From the first viewing to finding the right home, every detail was handled with genuine care.",
        name: "Sarah M.",
        role: "Homeowner",
        location: "Nairobi",
    },
    {
        quote:
            "What stood out was the attention to detail. We felt listened to throughout the process and never rushed into a decision.",
        name: "David K.",
        role: "Property Buyer",
        location: "Kilimani",
    },
    {
        quote:
            "Professional, responsive, and incredibly easy to work with. The team understood exactly what we were looking for.",
        name: "Michael & Grace",
        role: "Homeowners",
        location: "Lavington",
    },
];

function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % testimonials.length);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    const testimonial = testimonials[activeIndex];

    return (
        <section className="px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(3rem,6vw,4rem)] pb-[clamp(1.5rem,3vw,2rem)]">
            <div className="mx-auto w-full max-w-6xl">

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                >
                    <p className="text-[clamp(1.5rem,3vw,1.875rem)] font-light uppercase tracking-[clamp(0.15em,0.3vw,0.2em)] text-gray-900">
                        Client Stories
                    </p>

                    <p className="mt-[clamp(0.75rem,1vw,0.875rem)] max-w-xl text-[clamp(0.8rem,0.9vw,1rem)] leading-6 text-gray-500">
                        The experience matters as much as the destination.
                        Here's what our clients have to say.
                    </p>
                </motion.div>

                {/* Testimonial */}
                <div className="mt-[clamp(2rem,4vw,2.5rem)] min-h-[clamp(20rem,35vw,24rem)] rounded-[clamp(1.5rem,3vw,2rem)] bg-gray-100 px-[clamp(1.25rem,5vw,3.5rem)] py-[clamp(2rem,4vw,3rem)]">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                            }}
                            className="flex h-full flex-col justify-between"
                        >
                            <div>
                                <span className="text-[clamp(3.5rem,6vw,4.5rem)] font-serif leading-none text-gray-300">
                                    “
                                </span>

                                <blockquote className="mt-[clamp(0.75rem,1.5vw,1rem)] max-w-5xl text-[clamp(1.75rem,4.5vw,3rem)] font-light leading-[1.1] text-gray-900">
                                    {testimonial.quote}
                                </blockquote>
                            </div>

                            <div className="mt-[clamp(2rem,5vw,3rem)] flex flex-col justify-between gap-[clamp(1.5rem,3vw,2rem)] md:flex-row md:items-end">

                                <div>
                                    <p className="text-[clamp(0.8rem,0.9vw,0.875rem)] font-medium text-gray-900">
                                        {testimonial.name}
                                    </p>

                                    <p className="mt-1 text-[clamp(0.8rem,0.9vw,0.875rem)] text-gray-500">
                                        {testimonial.role} · {testimonial.location}
                                    </p>
                                </div>

                                {/* Indicators */}
                                <div className="flex items-center gap-[clamp(1rem,2vw,1.5rem)]">

                                    {/* Previous */}
                                    <button
                                        onClick={() =>
                                            setActiveIndex(
                                                (activeIndex - 1 + testimonials.length) %
                                                testimonials.length
                                            )
                                        }
                                        aria-label="Previous testimonial"
                                        className="group flex h-[clamp(2.5rem,3.5vw,2.75rem)] w-[clamp(2.5rem,3.5vw,2.75rem)] shrink-0 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
                                    >
                                        <span className="transition-transform duration-300 group-hover:-translate-x-1">
                                            ←
                                        </span>
                                    </button>

                                    {/* Indicators */}
                                    <div className="flex items-center gap-[clamp(0.4rem,0.6vw,0.5rem)]">
                                        {testimonials.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveIndex(index)}
                                                aria-label={`View testimonial ${index + 1}`}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                                    index === activeIndex
                                                        ? "w-[clamp(1.75rem,3vw,2rem)] bg-black"
                                                        : "w-2 bg-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Next */}
                                    <button
                                        onClick={() =>
                                            setActiveIndex(
                                                (activeIndex + 1) % testimonials.length
                                            )
                                        }
                                        aria-label="Next testimonial"
                                        className="group flex h-[clamp(2.5rem,3.5vw,2.75rem)] w-[clamp(2.5rem,3.5vw,2.75rem)] shrink-0 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
                                    >
                                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </button>

                                </div>

                            </div>
                        </motion.div>
                    </AnimatePresence>

                </div>
            </div>
        </section>
    );
}

export default Testimonials;

