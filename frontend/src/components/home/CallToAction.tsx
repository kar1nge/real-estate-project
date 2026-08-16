import { motion } from "framer-motion";

function CallToAction() {
    return (
        <section className="px-[clamp(1rem,4vw,2.5rem)] py-[clamp(2rem,4vw,3rem)]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative mx-auto max-w-[1800px] overflow-hidden rounded-[clamp(1.5rem,3vw,1.75rem)] bg-black px-[clamp(1.25rem,4vw,3rem)] py-[clamp(2rem,4vw,3rem)] text-white"
            >
                <div className="relative z-10 flex flex-col gap-[clamp(2rem,4vw,3rem)] md:flex-row md:items-center md:justify-between">

                    <div className="max-w-2xl">
                        <p className="text-[clamp(0.65rem,0.7vw,0.75rem)] uppercase tracking-[clamp(0.25em,0.4vw,0.35em)] text-white/50">
                            Your Next Move
                        </p>

                        <h2 className="mt-[clamp(0.65rem,1vw,0.75rem)] text-[clamp(1.75rem,3.5vw,2.5rem)] font-light leading-tight">
                            Ready to find your next property?
                        </h2>

                        <p className="mt-[clamp(0.75rem,1vw,0.875rem)] max-w-xl text-[clamp(0.8rem,0.9vw,0.875rem)] leading-6 text-white/60">
                            Explore our collection, learn more about us, or speak with our team.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-[clamp(0.5rem,1vw,0.75rem)] md:max-w-[48%] md:justify-end">

                        <motion.a
                            href="/properties"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="rounded-full bg-white px-[clamp(1.1rem,2vw,1.5rem)] py-[clamp(0.7rem,1vw,0.75rem)] text-[clamp(0.65rem,0.75vw,0.75rem)] font-medium uppercase tracking-[clamp(0.1em,0.2vw,0.15em)] text-black"
                        >
                            Properties
                        </motion.a>

                        <motion.a
                            href="/inquire"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="rounded-full border border-white/30 px-[clamp(1.1rem,2vw,1.5rem)] py-[clamp(0.7rem,1vw,0.75rem)] text-[clamp(0.65rem,0.75vw,0.75rem)] font-medium uppercase tracking-[clamp(0.1em,0.2vw,0.15em)] text-white transition-colors hover:bg-white hover:text-black"
                        >
                            Inquire
                        </motion.a>

                        <motion.a
                            href="/book-site-visit"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="rounded-full bg-white px-[clamp(1.1rem,2vw,1.5rem)] py-[clamp(0.7rem,1vw,0.75rem)] text-[clamp(0.65rem,0.75vw,0.75rem)] font-medium uppercase tracking-[clamp(0.1em,0.2vw,0.15em)] text-black transition-shadow duration-300 hover:shadow-lg"
                        >
                            Book a Site Visit
                        </motion.a>

                    </div>

                </div>
            </motion.div>
        </section>
    );
}

export default CallToAction;

