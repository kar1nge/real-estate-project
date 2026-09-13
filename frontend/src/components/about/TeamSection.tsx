import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getTeamMembers } from "../../services/teamService";
import type { TeamMember } from "../../types/team";

function TeamSection() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTeam() {
            try {
                const data = await getTeamMembers();
                setTeamMembers(data);
            } catch (error) {
                console.error("Failed to load team members:", error);
            } finally {
                setLoading(false);
            }
        }

        loadTeam();
    }, []);

    return (
        <section
            id="team"
            className="px-[clamp(1rem,4vw,2.5rem)] pt-[clamp(1.5rem,3vw,2.5rem)] pb-[clamp(4rem,8vw,6rem)]"
        >
            <div className="mx-auto w-full max-w-7xl">

                {/* Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-3xl"
                >
                    <p className="text-[clamp(0.65rem,0.7vw,0.75rem)] uppercase tracking-[clamp(0.25em,0.4vw,0.4em)] text-gray-400">
                        The People Behind It
                    </p>

                    <h2 className="mt-[clamp(1.25rem,2.5vw,1.75rem)] text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] tracking-[-0.02em] text-gray-900">
                        Faces behind
                        <span className="block italic text-gray-500">
                            the way we work.
                        </span>
                    </h2>

                    <p className="mt-[clamp(1.5rem,3vw,2rem)] max-w-2xl text-[clamp(0.95rem,1vw,1.05rem)] leading-7 text-gray-500">
                        Behind every property, decision, and client experience
                        is a team of people who bring knowledge, care, and
                        intention to what they do.
                    </p>
                </motion.div>

                {/* Team Members */}
                {loading ? (
                    <div className="mt-[clamp(4rem,7vw,5rem)] grid gap-[clamp(2rem,4vw,3rem)] sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-[clamp(22rem,35vw,32rem)] animate-pulse rounded-[clamp(1rem,2vw,1.5rem)] bg-gray-100"
                            />
                        ))}
                    </div>
                ) : teamMembers.length > 0 ? (
                    <div className="mt-[clamp(4rem,7vw,5rem)] grid gap-[clamp(3rem,5vw,4rem)] sm:grid-cols-2 lg:grid-cols-3">
                        {teamMembers.map((member, index) => (
                            <motion.article
                                key={member.id}
                                initial={{
                                    opacity: 0,
                                    y: 40,
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
                                    delay: index * 0.1,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="group"
                            >
                                {/* Portrait */}
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[clamp(1rem,2vw,1.5rem)] bg-gray-100">
                                    {member.photo ? (
                                        <img
                                            src={member.photo}
                                            alt={member.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <span className="text-[clamp(2rem,4vw,3rem)] font-light text-gray-300">
                                                {member.name
                                                    .split(" ")
                                                    .map((name) => name[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                </div>

                                {/* Details */}
                                <div className="mt-[clamp(1.25rem,2vw,1.5rem)]">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-[clamp(1.25rem,2vw,1.75rem)] font-light leading-tight text-gray-900">
                                                {member.name}
                                            </h3>

                                            <p className="mt-2 text-[clamp(0.65rem,0.75vw,0.75rem)] uppercase tracking-[0.18em] text-gray-400">
                                                {member.position_display}
                                            </p>
                                        </div>

                                        {member.linkedin_url && (
                                            <a
                                                href={member.linkedin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${member.name} on LinkedIn`}
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-xs text-gray-500 transition-all duration-300 hover:border-gray-400 hover:text-gray-900"
                                            >
                                                in
                                            </a>
                                        )}
                                    </div>

                                    <p className="mt-4 max-w-md text-sm leading-6 text-gray-500">
                                        {member.bio}
                                    </p>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                ) : (
                    <div className="mt-[clamp(4rem,7vw,5rem)] border-t border-gray-200 pt-8">
                        <p className="text-sm text-gray-400">
                            Our team information will appear here.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default TeamSection;