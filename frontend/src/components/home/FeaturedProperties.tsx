import { motion } from "motion/react";
import PropertyCard from "../properties";
import { useEffect, useState } from "react";
import { getProperties } from "../../services/propertyService";
import type { Property } from "../../types/property";

function FeaturedProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    // I'll drop the hardcoded properties once the CMS is ready and connected
    // to the frontend. For now, this is a temporary solution to showcase
    // the properties on the homepage.
    const homepageProperties = [
        "skyline-residence",
        "horizon-penthouse",
        "emerald-heights",
        "the-oak-residences",
        "willow-gardens",
        "aurora-suites",
        "serenity-villas",
        "one-riverside-sky",
        "komo",
    ]
        .map((slug) => properties.find((property) => property.slug === slug))
        .filter((property): property is Property => property !== undefined);

    console.log(
        "Homepage properties:",
        homepageProperties.map((property) => property.title)
    );

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = await getProperties();
                setProperties(data.results);
            } catch (error) {
                console.error("Error fetching properties:", error);
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

    if (homepageProperties.length < 9) {
        return (
            <section className="flex min-h-[clamp(16rem,30vw,24rem)] items-center justify-center px-[clamp(1rem,4vw,2.5rem)] text-center">
                Featured properties are being prepared.
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

                    {/* Card 1 */}
                    <motion.div
                        className="h-[clamp(24rem,45vw,30rem)] md:col-span-2 lg:col-span-12 lg:h-[clamp(26rem,34vw,30rem)]"
                        initial={{
                            opacity: 0,
                            y: 25,
                            scale: 0.98,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.3,
                        }}
                        transition={{
                            duration: 0.8,
                            ease: "easeOut",
                        }}
                    >
                        <PropertyCard
                            property={homepageProperties[0]}
                            variant="showcase"
                            priority
                        />
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        className="h-[clamp(22rem,42vw,26rem)] md:col-span-1 lg:col-span-4 lg:h-[clamp(15rem,19vw,16.25rem)]"
                        initial={{
                            opacity: 0,
                            x: -40,
                            y: 20,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.6,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "easeOut",
                        }}
                    >
                        <PropertyCard
                            property={homepageProperties[1]}
                            variant="featured"
                        />
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        className="h-[clamp(22rem,42vw,26rem)] md:col-span-1 lg:col-span-8 lg:h-[clamp(15rem,19vw,16.25rem)]"
                        initial={{
                            opacity: 0,
                            x: 40,
                            y: 20,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.6,
                        }}
                        transition={{
                            duration: 0.7,
                            delay: 0.65,
                            ease: "easeOut",
                        }}
                    >
                        <PropertyCard
                            property={homepageProperties[2]}
                            variant="featured"
                        />
                    </motion.div>

                    {/* Card 4 */}
                    <motion.div
                        className="h-[clamp(23rem,44vw,28rem)] md:col-span-1 lg:col-span-8 lg:h-[clamp(17rem,22vw,18.75rem)]"
                        initial={{
                            opacity: 0,
                            scale: 0.98,
                        }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.55,
                        }}
                        transition={{
                            duration: 1,
                            delay: 0.2,
                            ease: "easeOut",
                        }}
                    >
                        <PropertyCard
                            property={homepageProperties[3]}
                            variant="featured"
                        />
                    </motion.div>

                    {/* Card 5 */}
                    <motion.div
                        className="h-[clamp(23rem,44vw,28rem)] md:col-span-1 lg:col-span-4 lg:h-[clamp(17rem,22vw,18.75rem)]"
                        initial={{
                            opacity: 0,
                            scale: 0.98,
                        }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.6,
                        }}
                        transition={{
                            duration: 1,
                            delay: 0.5,
                            ease: "easeOut",
                        }}
                    >
                        <PropertyCard
                            property={homepageProperties[4]}
                            variant="compact"
                        />
                    </motion.div>

                    {/* Card 6 */}
                    <motion.div
                        className="h-[clamp(24rem,46vw,30rem)] md:col-span-1 lg:col-span-9 lg:h-[clamp(19rem,25vw,21.25rem)]"
                        initial={{
                            opacity: 0,
                            scale: 0.98,
                            x: -18,
                        }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.55,
                        }}
                        transition={{
                            duration: 1,
                            ease: "easeOut",
                        }}
                    >
                        <PropertyCard
                            property={homepageProperties[5]}
                            variant="featured"
                        />
                    </motion.div>

                    {/* Card 7 */}
                    <motion.div
                        className="h-[clamp(24rem,46vw,30rem)] md:col-span-1 lg:col-span-3 lg:h-[clamp(19rem,25vw,21.25rem)]"
                        initial={{
                            opacity: 0,
                            scale: 0.98,
                            x: 18,
                        }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                            x: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.55,
                        }}
                        transition={{
                            duration: 1,
                            delay: 0.18,
                            ease: "easeOut",
                        }}
                    >
                        <PropertyCard
                            property={homepageProperties[6]}
                            variant="compact"
                        />
                    </motion.div>

                    {/* Card 8 */}
                    <motion.div
                        className="h-[clamp(22rem,42vw,26rem)] md:col-span-1 lg:col-span-4 lg:h-[clamp(16rem,20vw,17.5rem)]"
                        initial={{
                            opacity: 0.2,
                        }}
                        whileInView={{
                            opacity: 1,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.6,
                        }}
                        transition={{
                            duration: 0.8,
                            ease: "easeOut",
                        }}
                    >
                        <PropertyCard
                            property={homepageProperties[7]}
                            variant="compact"
                        />
                    </motion.div>

                    {/* Card 9 */}
                    <motion.div
                        className="h-[clamp(22rem,42vw,26rem)] md:col-span-1 lg:col-span-8 lg:h-[clamp(16rem,20vw,17.5rem)]"
                        initial={{
                            opacity: 0.2,
                        }}
                        whileInView={{
                            opacity: 1,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.6,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: 0.15,
                            ease: "easeOut",
                        }}
                    >
                        <PropertyCard
                            property={homepageProperties[8]}
                            variant="featured"
                        />
                    </motion.div>

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