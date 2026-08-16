import { motion } from "framer-motion";

const reasons = [
    {
        number: "01",
        title: "Exceptional Locations",
        description:
            "We look beyond the address, choosing locations with character, convenience, and lasting potential.",
    },
    {
        number: "02",
        title: "Thoughtful Design",
        description:
            "Every space is considered with intention, balancing distinctive design with the way modern life is lived.",
    },
    {
        number: "03",
        title: "Trusted Expertise",
        description:
            "From discovery to decision, our experience gives you the clarity and confidence to choose well.",
    },
    {
        number: "04",
        title: "Personal Service",
        description:
            "Because finding the right home is personal, we make the journey attentive, transparent, and distinctly yours.",
    },
];

function WhyChooseUs() {
    return (
        <section className="px-[clamp(1rem,4vw,2.5rem)] py-[clamp(3.5rem,7vw,5rem)]">
            <div className="mx-auto w-full max-w-7xl">

                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-2xl"
                >
                    <p className="text-[clamp(0.65rem,0.7vw,0.75rem)] uppercase tracking-[clamp(0.25em,0.4vw,0.4em)] text-gray-500">
                        Why Our Properties
                    </p>

                    <h2 className="mt-[clamp(1.25rem,2.5vw,1.5rem)] text-[clamp(2.25rem,5vw,3rem)] font-light leading-tight text-gray-900">
                        More than property.
                        <span className="block italic">
                            A different way of living.
                        </span>
                    </h2>
                </motion.div>

                {/* Reasons */}
                <div className="mt-[clamp(3rem,7vw,5rem)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

                    {reasons.map((reason, index) => (
                        <motion.div
                            key={reason.number}
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                amount: 0.35,
                            }}
                            transition={{
                                duration: 0.7,
                                delay: index * 0.25,
                                ease: "easeOut",
                            }}
                            className="
                                group
                                border-t border-gray-200
                                px-0
                                py-[clamp(1.5rem,3vw,2rem)]
                                md:px-[clamp(1rem,2vw,1.5rem)]
                                lg:first:pl-0
                                lg:last:pr-0
                            "
                        >
                            {/* Number */}
                            <div className="flex items-center justify-between">
                                <span className="text-[clamp(0.65rem,0.7vw,0.75rem)] tracking-[clamp(0.15em,0.3vw,0.25em)] text-gray-400">
                                    {reason.number}
                                </span>

                                <span className="h-px w-0 bg-black transition-all duration-500 group-hover:w-8" />
                            </div>

                            {/* Title */}
                            <h3 className="mt-[clamp(1.5rem,3vw,2rem)] text-[clamp(1.5rem,2.5vw,1.75rem)] font-light text-gray-900">
                                {reason.title}
                            </h3>

                            {/* Description */}
                            <p className="mt-[clamp(0.75rem,1.5vw,1rem)] max-w-[clamp(18rem,22vw,20rem)] text-[clamp(0.8rem,0.9vw,0.875rem)] leading-6 text-gray-500">
                                {reason.description}
                            </p>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
}

export default WhyChooseUs;

