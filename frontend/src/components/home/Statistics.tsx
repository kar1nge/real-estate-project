import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getStatistics, type Statistic } from "../../services/statisticsService";

export function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.6 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        const duration = 1600;
        const startTime = performance.now();
        let frame = 0;
        const animate = (currentTime: number) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setDisplayValue(Math.floor(value * (1 - Math.pow(1 - progress, 3))));
            if (progress < 1) frame = requestAnimationFrame(animate);
            else setDisplayValue(value);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [isInView, value]);

    return <span ref={ref}>{displayValue}{suffix}</span>;
}

function Statistics() {
    const [statistics, setStatistics] = useState<Statistic[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        getStatistics().then(setStatistics).catch((error) => {
            console.error("Failed to load statistics:", error);
        }).finally(() => setLoaded(true));
    }, []);

    if (loaded && statistics.length === 0) return null;

    return (
        <section className="px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(2rem,4vw,2.5rem)] pb-[clamp(4rem,7vw,5rem)]">
            <div className="mx-auto w-full max-w-7xl">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }} className="mb-[clamp(2.5rem,5vw,3rem)] text-center">
                    <p className="text-[clamp(1.875rem,3.5vw,2.25rem)] font-light tracking-tight text-gray-900">Our Numbers</p>
                    <p className="mx-auto mt-[clamp(0.75rem,1vw,0.875rem)] max-w-xl text-[clamp(0.8rem,0.9vw,1rem)] leading-6 text-gray-500">Experience measured in more than words.</p>
                </motion.div>
                <div className="grid grid-cols-2 border-t border-gray-200 lg:grid-cols-4">
                    {(loaded ? statistics : []).map((stat, index) => (
                        <motion.div key={stat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }} className="border-b border-gray-200 px-[clamp(0.75rem,2.5vw,2rem)] py-[clamp(1.5rem,3vw,2rem)] first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
                            <p className="text-[clamp(2rem,4vw,3rem)] font-light tracking-tight text-gray-900"><AnimatedNumber value={stat.value} suffix={stat.suffix} /></p>
                            <p className="mt-[clamp(0.75rem,1vw,0.875rem)] text-[clamp(0.6rem,0.7vw,0.75rem)] uppercase tracking-[clamp(0.15em,0.25vw,0.2em)] text-gray-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Statistics;
