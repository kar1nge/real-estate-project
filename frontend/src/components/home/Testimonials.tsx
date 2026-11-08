import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getTestimonials,
  type Testimonial,
} from "../../services/testimonialService";

function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getTestimonials()
      .then((items) => {
        setTestimonials(items);
        setActiveIndex(0);
      })
      .catch((error) => {
        console.error("Failed to load testimonials:", error);
        setHasError(true);
      });
  }, []);

  useEffect(() => {
    if (testimonials.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [testimonials.length]);

  if (!testimonials.length) {
    if (!hasError) return null;
    return <section role="alert" className="px-6 py-12 text-center text-sm text-gray-500">Client stories couldn’t load just now. Please try again later.</section>;
  }
  const testimonial = testimonials[activeIndex];
  const show = (index: number) =>
    setActiveIndex((index + testimonials.length) % testimonials.length);

  return (
    <section className="px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(3rem,6vw,4rem)] pb-[clamp(1.5rem,3vw,2rem)]">
      <div className="mx-auto w-full max-w-6xl">
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
            The experience matters as much as the destination. Here&apos;s what
            our clients have to say.
          </p>
        </motion.div>
        <div className="mt-[clamp(2rem,4vw,2.5rem)] min-h-[clamp(20rem,35vw,24rem)] rounded-[clamp(1.5rem,3vw,2rem)] bg-gray-100 px-[clamp(1.25rem,5vw,3.5rem)] py-[clamp(2rem,4vw,3rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex h-full flex-col justify-between"
            >
              <div>
                <span className="text-[clamp(3.5rem,6vw,4.5rem)] font-serif leading-none text-gray-300">
                  “
                </span>
                <blockquote className="mt-[clamp(0.75rem,1.5vw,1rem)] max-w-5xl text-[clamp(1.75rem,4.5vw,3rem)] font-light leading-[1.1] text-gray-900">
                  {testimonial.testimonial}
                </blockquote>
              </div>
              <div className="mt-[clamp(2rem,5vw,3rem)] flex flex-col justify-between gap-[clamp(1.5rem,3vw,2rem)] md:flex-row md:items-end">
                <div>
                  <p className="text-[clamp(0.8rem,0.9vw,0.875rem)] font-medium text-gray-900">
                    {testimonial.client_name}
                  </p>
                  {testimonial.property_name && (
                    <p className="mt-1 text-[clamp(0.8rem,0.9vw,0.875rem)] text-gray-500">
                      {testimonial.property_name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-[clamp(1rem,2vw,1.5rem)]">
                  <button
                    onClick={() => show(activeIndex - 1)}
                    aria-label="Previous testimonial"
                    className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
                  >
                    <span>←</span>
                  </button>
                  <div className="flex items-center gap-2">
                    {testimonials.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => show(index)}
                        aria-label={`View testimonial ${index + 1}`}
                        aria-current={index === activeIndex}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? "w-8 bg-black" : "w-2 bg-gray-300"}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => show(activeIndex + 1)}
                    aria-label="Next testimonial"
                    className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
                  >
                    <span>→</span>
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
