import { motion } from "motion/react";
import aboutImage from "../assets/images/about-us.jfif";
import TeamSection from "../components/about/TeamSection";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";

function About() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash === "#team") {
            const teamSection = document.getElementById("team");

            if (teamSection) {
                setTimeout(() => {
                    teamSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 100);
            }
        }
    }, [location]);

    return (
    <main className="bg-[#FAFAF8]">
      <Navbar />

      {/* About Introduction */}
      <section className="px-[clamp(1rem,4vw,2.5rem)] py-[clamp(3rem,6vw,5rem)]">
        <div className="mx-auto grid w-full max-w-7xl items-stretch gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-[2fr_3fr]">
          {/* Image */}
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
            className="relative min-h-[18rem] overflow-hidden rounded-[clamp(1.25rem,2.5vw,1.75rem)] lg:min-h-0"
          >
            <img
              src={aboutImage}
              alt="Saif Properties architecture"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.12,
              ease: "easeOut",
            }}
            className="flex flex-col justify-center py-[clamp(0.5rem,1vw,1rem)]"
          >
            <p className="text-[clamp(0.65rem,0.7vw,0.75rem)] uppercase tracking-[clamp(0.25em,0.4vw,0.4em)] text-gray-500">
              About Us
            </p>

            <h1 className="mt-[clamp(1.25rem,2.5vw,1.75rem)] max-w-3xl text-[clamp(2.75rem,5.5vw,5rem)] font-light leading-[0.98] tracking-[-0.02em] text-gray-900">
              We believe property
              <span className="block italic">should feel like more.</span>
            </h1>

            <div className="mt-[clamp(1.5rem,3vw,2.25rem)] max-w-2xl space-y-[clamp(1rem,2vw,1.5rem)]">
              <p className="text-[clamp(0.95rem,1vw,1.1rem)] leading-[1.8] text-gray-600">
                We are a property company built around the belief that a home
                should offer more than an address. It should reflect the way
                people want to live, the places they want to belong, and the
                future they want to create.
              </p>

              <p className="text-[clamp(0.95rem,1vw,1.1rem)] leading-[1.8] text-gray-600">
                From the locations we choose to the spaces we bring to life, we
                approach property with intention. We look beyond what is simply
                available to discover opportunities with character, quality, and
                lasting value — creating experiences that feel considered from
                the very first encounter.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Our Story */}
      <section className="px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(0.5rem,1vw,0.75rem)] pb-[clamp(5rem,9vw,7rem)]">
        <div className="mx-auto w-full max-w-7xl">
          {/* Story Introduction */}
          <motion.div
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
              amount: 0.25,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="max-w-5xl"
          >
            <p className="text-[clamp(0.65rem,0.7vw,0.75rem)] uppercase tracking-[clamp(0.25em,0.4vw,0.4em)] text-gray-500">
              Our Story
            </p>

            <h2 className="mt-[clamp(1.5rem,3vw,2rem)] max-w-4xl text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-gray-900">
              We began with a simple belief:
              <span className="block italic">
                better spaces create better lives.
              </span>
            </h2>
          </motion.div>

          {/* Story Content */}
          <motion.div
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: "easeOut",
            }}
            className="mt-[clamp(3rem,7vw,5rem)] grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12"
          >
            <div className="lg:col-span-4">
              <p className="max-w-sm text-[clamp(0.9rem,1vw,1rem)] uppercase leading-7 tracking-[0.08em] text-gray-500">
                Building with intention.
                <span className="mt-1 block">Growing with purpose.</span>
              </p>
            </div>

            <div className="space-y-[clamp(1.25rem,2vw,1.75rem)] lg:col-span-7 lg:col-start-6">
              <p className="text-[clamp(1rem,1.1vw,1.15rem)] leading-[1.85] text-gray-600">
                What started with a desire to approach property differently has
                grown into a philosophy that guides everything we do. We believe
                the best spaces are not defined by size or appearance alone, but
                by the way they make people feel and the lives they allow people
                to live.
              </p>

              <p className="text-[clamp(1rem,1.1vw,1.15rem)] leading-[1.85] text-gray-600">
                Over time, our focus has remained the same: finding exceptional
                locations, creating thoughtful spaces, and giving every client
                the clarity and confidence to make decisions that feel right for
                them. Today, that belief continues to shape how we select,
                develop, and present every property.
              </p>
            </div>
          </motion.div>

          {/* Story Progression */}
          <div className="mt-[clamp(4rem,9vw,7rem)] grid border-t border-gray-200 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "The Beginning",
                description:
                  "A simple idea: approach property with greater intention.",
              },
              {
                number: "02",
                title: "The Growth",
                description:
                  "Expanding our vision while staying grounded in what matters.",
              },
              {
                number: "03",
                title: "Today",
                description:
                  "Creating spaces and experiences shaped around modern living.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.number}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.25,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.12,
                  ease: "easeOut",
                }}
                className="
                        border-b border-gray-200
                        py-[clamp(1.5rem,3vw,2rem)]
                        md:border-b-0
                        md:border-r
                        md:px-[clamp(1.5rem,3vw,2.5rem)]
                        md:first:pl-0
                        md:last:border-r-0
                        md:last:pr-0
                    "
              >
                <span className="text-[clamp(0.65rem,0.7vw,0.75rem)] tracking-[0.2em] text-gray-400">
                  {item.number}
                </span>

                <h3 className="mt-5 text-[clamp(1.4rem,2vw,1.75rem)] font-light text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-xs text-[clamp(0.8rem,0.9vw,0.9rem)] leading-6 text-gray-500">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Why Us */}
      <section className="px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(1.5rem,3vw,2.5rem)] pb-[clamp(5rem,9vw,7rem)]">
        <div className="mx-auto w-full max-w-7xl">
          {/* Section Introduction */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="max-w-2xl"
          >
            <p className="text-[clamp(0.65rem,0.7vw,0.75rem)] uppercase tracking-[clamp(0.25em,0.4vw,0.4em)] text-gray-500">
              Why Us
            </p>

            <h2 className="mt-[clamp(1.25rem,2.5vw,1.75rem)] text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-gray-900">
              What guides
              <span className="block italic">the way we work.</span>
            </h2>
          </motion.div>

          {/* Principles */}
          <div className="mt-[clamp(3rem,6vw,5rem)]">
            {[
              {
                number: "01",
                title: "Exceptional Locations",
                description:
                  "We look beyond the address when selecting the places we represent. We consider the character of the neighbourhood, access to everyday essentials, the surrounding environment, and the potential of an area to grow. For us, a great property begins with a location that makes sense today and continues to make sense tomorrow.",
              },
              {
                number: "02",
                title: "Thoughtful Design",
                description:
                  "A well-designed space should do more than look impressive. It should respond naturally to the way people live, bringing together proportion, functionality, light, comfort, and character. We value spaces that feel considered without becoming complicated, creating environments that remain relevant long after the first impression.",
              },
              {
                number: "03",
                title: "Quality & Craftsmanship",
                description:
                  "We believe quality reveals itself in the details. From materials and finishes to the way a space is constructed and maintained, we pay attention to the elements that shape everyday experience. Our aim is to represent and create properties where quality is not simply promised, but evident in the way the space feels and performs.",
              },
              {
                number: "04",
                title: "Trusted Expertise",
                description:
                  "Property decisions carry real financial and personal weight, which is why experience matters. We bring informed guidance to every stage of the journey, helping clients understand their options, assess opportunities clearly, and move forward with confidence. Our role is not simply to present property, but to make the decision-making process easier.",
              },
              {
                number: "05",
                title: "Personal Service",
                description:
                  "No two clients arrive with exactly the same priorities. We take the time to understand what matters to each person, from lifestyle and location to practical needs and long-term ambitions. That allows us to offer a more considered experience, built around the individual rather than a one-size-fits-all approach.",
              },
              {
                number: "06",
                title: "Long-Term Value",
                description:
                  "We think beyond the moment a property is purchased. The right space should continue to hold meaning and value as circumstances change. Whether it is a home, an investment, or part of a wider property portfolio, we look for opportunities with qualities that can endure — in location, design, usability, and potential.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.number}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -35 : 35,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.75,
                  ease: "easeOut",
                }}
                className="border-t border-gray-200 py-[clamp(1.75rem,4vw,3rem)]"
              >
                <div
                  className={`
                            flex flex-col gap-[clamp(1rem,2vw,1.5rem)]
                            md:flex-row md:items-start md:gap-[clamp(2rem,5vw,5rem)]
                            ${
                              index % 2 !== 0
                                ? "md:ml-auto md:max-w-4xl"
                                : "md:max-w-4xl"
                            }
                        `}
                >
                  {/* Number */}
                  <span className="shrink-0 text-[clamp(0.65rem,0.7vw,0.75rem)] tracking-[0.2em] text-gray-400">
                    {item.number}
                  </span>

                  {/* Content */}
                  <div className="max-w-3xl">
                    <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-light tracking-tight text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mt-[clamp(0.75rem,1.5vw,1rem)] text-[clamp(0.9rem,1vw,1rem)] leading-7 text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Numbers */}
      <section className="overflow-hidden px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(1.5rem,3vw,2.5rem)] pb-[clamp(5rem,10vw,8rem)]">
        <div className="mx-auto w-full max-w-7xl">
          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-[clamp(0.65rem,0.7vw,0.75rem)] uppercase tracking-[clamp(0.25em,0.4vw,0.4em)] text-gray-400">
              By the Numbers
            </p>

            <h2 className="mt-[clamp(1.25rem,2.5vw,1.75rem)] text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-gray-900">
              The difference
              <span className="block italic text-gray-500">
                is in the details.
              </span>
            </h2>
          </motion.div>

          {/* Statistics */}
          <div className="mt-[clamp(4rem,8vw,6rem)] grid grid-cols-2 border-t border-gray-200 md:grid-cols-4">
            {[
              {
                number: "00+",
                label: "Properties Represented",
              },
              {
                number: "00+",
                label: "Clients Served",
              },
              {
                number: "00+",
                label: "Years of Experience",
              },
              {
                number: "00%",
                label: "Client Satisfaction",
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{
                  opacity: 0,
                  y: 45,
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
                  duration: 0.9,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -6,
                  transition: {
                    duration: 0.3,
                  },
                }}
                className={`
                        flex flex-col items-center text-center
                        py-[clamp(2rem,4vw,3.5rem)]
                        ${
                          index >= 2
                            ? "border-t border-gray-200 md:border-t-0"
                            : ""
                        }
                        ${index > 0 ? "md:border-l md:border-gray-200" : ""}
                    `}
              >
                {/* Number */}
                <div className="relative overflow-hidden">
                  <motion.p
                    initial={{ y: "100%" }}
                    whileInView={{ y: 0 }}
                    viewport={{
                      once: true,
                      amount: 0.35,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.15 + 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-[clamp(3rem,6vw,5.75rem)] font-light leading-none tracking-[-0.05em] text-gray-900"
                  >
                    {item.number}
                  </motion.p>
                </div>

                {/* Label */}
                <p className="mt-[clamp(1rem,2vw,1.5rem)] max-w-[12rem] text-[clamp(0.65rem,0.8vw,0.75rem)] uppercase leading-5 tracking-[0.18em] text-gray-400">
                  {item.label}
                </p>

                {/* Accent line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{
                    once: true,
                    amount: 0.35,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.15 + 0.35,
                    ease: "easeOut",
                  }}
                  className="mt-[clamp(1.5rem,3vw,2rem)] h-px w-10 origin-center bg-gray-300 transition-all duration-500 group-hover:w-20"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TeamSection />

      <Footer />

    </main>
  );
}

export default About;
