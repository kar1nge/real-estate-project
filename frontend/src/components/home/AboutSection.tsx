import { motion } from "framer-motion";
import aboutImage from "../../assets/images/about-us.jfif";

function AboutSection() {
    return (
        <section className="relative overflow-hidden py-[clamp(3rem,7vw,6rem)]">
            <div className="mx-auto grid w-full max-w-7xl items-center gap-[clamp(2.5rem,6vw,4rem)] px-[clamp(1rem,4vw,2.5rem)] md:grid-cols-12">

                {/* Left — Story */}
                <motion.div
                    className="md:col-span-5"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <p className="text-[clamp(0.65rem,0.7vw,0.75rem)] uppercase tracking-[clamp(0.25em,0.4vw,0.4em)] text-gray-500">
                        Beyond the Address
                    </p>

                    <h2 className="mt-[clamp(1.25rem,2.5vw,1.5rem)] text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.05] text-gray-900">
                        We believe a property
                        <span className="block italic">
                            should feel like more.
                        </span>
                    </h2>

                    <p className="mt-[clamp(1.5rem,3vw,2rem)] max-w-md text-[clamp(0.95rem,1vw,1rem)] leading-7 text-gray-600">
                        Behind every address is a story, a vision, and a reason
                        someone chooses to call it home. We bring those pieces
                        together to create spaces that stand apart.
                    </p>

                    <motion.a
                        href="/about"
                        whileHover={{ x: 6 }}
                        className="group mt-[clamp(1.5rem,3vw,2rem)] inline-flex items-center gap-[clamp(0.6rem,1vw,0.75rem)] text-[clamp(0.7rem,0.8vw,0.875rem)] uppercase tracking-[clamp(0.15em,0.3vw,0.25em)] text-gray-900"
                    >
                        Discover Our Story

                        <span className="transition-transform duration-300 group-hover:translate-x-2">
                            →
                        </span>
                    </motion.a>
                </motion.div>

                {/* Right — Image */}
                <motion.div
                    className="relative md:col-span-7"
                    initial={{ opacity: 0, x: 40, scale: 0.98 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="relative h-[clamp(24rem,48vw,35rem)] overflow-hidden rounded-[clamp(1.5rem,3vw,2rem)]">

                        <img
                            src={aboutImage}
                            alt="Saif Properties architecture"
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    </div>

                    {/* Floating detail */}
                    <div className="absolute bottom-[clamp(-1.25rem,-2vw,-1.5rem)] left-[clamp(0.75rem,3vw,2.5rem)] rounded-2xl border border-white/20 bg-white/90 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(1rem,1.5vw,1.25rem)] shadow-xl backdrop-blur-md">
                        <p className="text-[clamp(0.6rem,0.7vw,0.625rem)] uppercase tracking-[clamp(0.2em,0.35vw,0.3em)] text-gray-500">
                            Our Perspective
                        </p>

                        <p className="mt-2 max-w-[clamp(12rem,18vw,13.75rem)] text-[clamp(0.8rem,0.9vw,0.875rem)] leading-6 text-gray-800">
                            Thoughtful spaces. Distinctive living.
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

export default AboutSection;

