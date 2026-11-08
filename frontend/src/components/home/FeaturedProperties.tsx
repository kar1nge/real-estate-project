import { motion } from "motion/react";
import PropertyCard from "../properties";
import { useEffect, useState } from "react";
import { getProperties, getFeaturedProperties } from "../../services/propertyService";
import type { Property } from "../../types/property";

function FeaturedProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const publishedProperties = [...properties]
        .filter((property) => property.publication_status === "published")
        .sort((a, b) => {
            const orderA = a.homepage_order ?? Number.MAX_SAFE_INTEGER;
            const orderB = b.homepage_order ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB || a.title.localeCompare(b.title);
        });
    const featuredProperties = publishedProperties.filter((property) => property.featured);
    const homepageProperties = (featuredProperties.length > 0
        ? featuredProperties
        : publishedProperties
    ).slice(0, 9);

    const cardLayouts = [
        { className: "h-[clamp(24rem,45vw,30rem)] md:col-span-2 lg:col-span-12 lg:h-[clamp(26rem,34vw,30rem)]", variant: "showcase" as const, priority: true },
        { className: "h-[clamp(22rem,42vw,26rem)] md:col-span-1 lg:col-span-4 lg:h-[clamp(15rem,19vw,16.25rem)]", variant: "featured" as const },
        { className: "h-[clamp(22rem,42vw,26rem)] md:col-span-1 lg:col-span-8 lg:h-[clamp(15rem,19vw,16.25rem)]", variant: "featured" as const },
        { className: "h-[clamp(23rem,44vw,28rem)] md:col-span-1 lg:col-span-8 lg:h-[clamp(17rem,22vw,18.75rem)]", variant: "featured" as const },
        { className: "h-[clamp(23rem,44vw,28rem)] md:col-span-1 lg:col-span-4 lg:h-[clamp(17rem,22vw,18.75rem)]", variant: "compact" as const },
        { className: "h-[clamp(24rem,46vw,30rem)] md:col-span-1 lg:col-span-9 lg:h-[clamp(19rem,25vw,21.25rem)]", variant: "featured" as const },
        { className: "h-[clamp(24rem,46vw,30rem)] md:col-span-1 lg:col-span-3 lg:h-[clamp(19rem,25vw,21.25rem)]", variant: "compact" as const },
        { className: "h-[clamp(22rem,42vw,26rem)] md:col-span-1 lg:col-span-4 lg:h-[clamp(16rem,20vw,17.5rem)]", variant: "compact" as const },
        { className: "h-[clamp(22rem,42vw,26rem)] md:col-span-1 lg:col-span-8 lg:h-[clamp(16rem,20vw,17.5rem)]", variant: "featured" as const },
    ];

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const [featured, allProperties] = await Promise.all([
                    getFeaturedProperties(),
                    getProperties(),
                ]);
                const publishedFeatured = featured
                    .filter((property) => property.publication_status === "published")
                    .sort((a, b) => {
                        const orderA = a.homepage_order ?? Number.MAX_SAFE_INTEGER;
                        const orderB = b.homepage_order ?? Number.MAX_SAFE_INTEGER;
                        return orderA - orderB || a.title.localeCompare(b.title);
                    });
                setProperties(
                    publishedFeatured.length > 0
                        ? publishedFeatured
                        : allProperties.results.filter(
                              (property) => property.publication_status === "published"
                          )
                );
            } catch (error) {
                console.error("Error fetching properties:", error);
                setHasError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    if (loading) {
        return (
            <section className="flex min-h-[clamp(16rem,30vw,24rem)] items-center justify-center px-[clamp(1rem,4vw,2.5rem)] text-center">
                Loading properties...
            </section>
        );
    }

    if (homepageProperties.length === 0) {
        return (
            <section className="flex min-h-[clamp(16rem,30vw,24rem)] items-center justify-center px-[clamp(1rem,4vw,2.5rem)] text-center">
                <div>
                    <p>{hasError ? "We couldn’t load properties just now." : "Featured properties are being prepared."}</p>
                    {hasError && <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-full border border-neutral-300 px-5 py-2 text-sm hover:border-neutral-900">Try again</button>}
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-[clamp(4rem,8vw,7rem)]">
            <div className="mx-auto w-full max-w-7xl px-[clamp(1rem,4vw,2.5rem)]">

                {/* Section Header */}
                <div className="mb-[clamp(3.5rem,7vw,6rem)] text-center">

                    <p className="mb-[clamp(1rem,2vw,1.25rem)] text-[clamp(0.7rem,0.8vw,1rem)] font-medium uppercase tracking-[clamp(0.2em,0.35vw,0.28em)] text-gray-700">
                        Featured Collection
                    </p>

                    <h2 className="text-[clamp(2.25rem,5vw,3rem)] font-light leading-tight text-gray-900">
                        Homes Worth Discovering
                    </h2>

                    <p className="mx-auto mt-[clamp(1rem,2vw,1.5rem)] max-w-2xl text-[clamp(0.95rem,1.2vw,1.125rem)] leading-relaxed text-gray-600">
                        Explore a curated collection of exceptional homes,
                        thoughtfully selected for modern living, timeless
                        architecture, and lasting value.
                    </p>

                </div>

                {/* Gallery */}
                <div className="grid grid-cols-1 gap-[clamp(1rem,1.5vw,1.5rem)] md:grid-cols-2 lg:grid-cols-12">
                    {homepageProperties.map((property, index) => {
                        const layout = cardLayouts[index];
                        return (
                            <motion.div
                                key={property.id}
                                className={layout.className}
                                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, amount: 0.25 }}
                                transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
                            >
                                <PropertyCard
                                    property={property}
                                    variant={layout.variant}
                                    priority={layout.priority}
                                />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Closing CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-[clamp(3.5rem,7vw,5rem)] flex flex-col items-center text-center"
                >

                    <p className="mb-[clamp(0.75rem,1.5vw,1rem)] text-[clamp(0.6rem,0.7vw,0.75rem)] uppercase tracking-[clamp(0.3em,0.5vw,0.45em)] text-gray-500">
                        THIS IS JUST THE BEGINNING
                    </p>

                    <h2 className="max-w-3xl text-[clamp(2.25rem,5vw,3rem)] font-light leading-tight text-gray-900">
                        There are more exceptional homes waiting to be discovered.
                    </h2>

                    <motion.a
                        href="/properties"
                        whileHover={{
                            scale: 1.04,
                            boxShadow: "0px 18px 45px rgba(0,0,0,0.25)",
                        }}
                        whileTap={{
                            scale: 0.97,
                        }}
                        className="group mt-[clamp(2rem,4vw,2.5rem)] flex items-center gap-[clamp(0.6rem,1vw,0.75rem)] rounded-full bg-black px-[clamp(1.5rem,3vw,2.25rem)] py-[clamp(0.75rem,1.5vw,1rem)] text-[clamp(0.65rem,0.8vw,0.875rem)] font-medium uppercase tracking-[clamp(0.15em,0.3vw,0.25em)] text-white"
                    >
                        Explore Collection

                        <motion.span
                            animate={{
                                x: [0, 6, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.8,
                                ease: "easeInOut",
                            }}
                        >
                            →
                        </motion.span>
                    </motion.a>

                </motion.div>

            </div>
        </section>
    );
}

export default FeaturedProperties;
