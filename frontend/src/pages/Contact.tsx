import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
    FaInstagram,
    FaFacebookF,
    FaXTwitter,
    FaTiktok,
    FaYoutube,
    FaWhatsapp,
    FaLocationDot,
} from "react-icons/fa6";
import {
    FiArrowRight,
    FiMail,
    FiPhone,
    FiMapPin,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

interface ContactSettings {
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    google_maps: string;
    instagram: string;
    facebook: string;
    twitter: string;
    tiktok: string;
    youtube: string;
}

function Contact() {
    const [contact, setContact] = useState<ContactSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContactSettings = async () => {
            try {
                const response = await fetch("/api/contacts/");

                if (!response.ok) {
                    throw new Error("Failed to fetch contact settings.");
                }

                const data: ContactSettings = await response.json();

                setContact(data);
            } catch (error) {
                console.error("Failed to load contact settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContactSettings();
    }, []);


    const whatsappLink = contact?.whatsapp
        ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`
        : undefined;

    const socialLinks = [
        {
            name: "Instagram",
            href: contact?.instagram,
            icon: <FaInstagram />,
        },
        {
            name: "Facebook",
            href: contact?.facebook,
            icon: <FaFacebookF />,
        },
        {
            name: "X",
            href: contact?.twitter,
            icon: <FaXTwitter />,
        },
        {
            name: "TikTok",
            href: contact?.tiktok,
            icon: <FaTiktok />,
        },
        {
            name: "YouTube",
            href: contact?.youtube,
            icon: <FaYoutube />,
        },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#2C2C2C]">
            <Navbar />

            <main>
                {/* Hero */}
                <section className="relative overflow-hidden border-b border-black/5 bg-[#232323] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(6rem,12vw,9rem)] text-white">
                    <div className="mx-auto w-full max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                            className="max-w-3xl"
                        >
                            <p className="mb-5 text-[clamp(0.65rem,0.8vw,0.75rem)] font-medium uppercase tracking-[0.3em] text-[#C5A572]">
                                Get In Touch
                            </p>

                            <h1 className="font-[Cormorant_Garamond] text-[clamp(3rem,7vw,6rem)] font-light leading-[0.9] tracking-tight">
                                Let&apos;s start
                                <br />
                                a conversation.
                            </h1>

                            <p className="mt-8 max-w-xl text-[clamp(0.95rem,1.2vw,1.1rem)] leading-7 text-white/60">
                                Whether you&apos;re looking for your next
                                property, arranging a private viewing, or
                                simply have a question, our team is ready to
                                help.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Contact Details */}
                <section className="px-[clamp(1rem,4vw,2.5rem)] py-[clamp(4rem,8vw,7rem)]">
                    <div className="mx-auto w-full max-w-7xl">
                        <div className="grid gap-[clamp(3rem,7vw,6rem)] lg:grid-cols-[0.85fr_1.15fr]">

                            {/* Intro */}
                            <motion.div
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.7 }}
                            >
                                <p className="mb-4 text-[clamp(0.65rem,0.8vw,0.75rem)] font-medium uppercase tracking-[0.3em] text-[#C5A572]">
                                    Contact Us
                                </p>

                                <h2 className="font-[Cormorant_Garamond] text-[clamp(2.4rem,4.5vw,4rem)] font-light leading-[0.95] tracking-tight">
                                    We&apos;re here
                                    <br />
                                    when you need us.
                                </h2>

                                <p className="mt-7 max-w-md text-[clamp(0.9rem,1vw,1rem)] leading-7 text-[#4A4A4A]">
                                    Speak directly with our team about
                                    properties, viewings, partnerships, or
                                    anything else you would like to discuss.
                                </p>

                                <div className="mt-9 flex flex-wrap gap-3">
                                    <Link
                                        to="/inquiry"
                                        className="group inline-flex items-center gap-3 rounded-full bg-[#232323] px-6 py-3.5 text-sm text-white transition-all duration-300 hover:bg-[#C5A572]"
                                    >
                                        Send an Inquiry
                                        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>

                                    <Link
                                        to="/book-site-visit"
                                        className="group inline-flex items-center gap-3 rounded-full border border-black/15 bg-white px-6 py-3.5 text-sm text-[#2C2C2C] transition-all duration-300 hover:border-[#C5A572] hover:text-[#C5A572]"
                                    >
                                        Book a Visit
                                        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Details */}
                            <motion.div
                                initial={{ opacity: 0, x: 24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.7 }}
                                className="grid gap-4 sm:grid-cols-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="h-44 animate-pulse rounded-2xl bg-white" />
                                        <div className="h-44 animate-pulse rounded-2xl bg-white" />
                                        <div className="h-44 animate-pulse rounded-2xl bg-white" />
                                        <div className="h-44 animate-pulse rounded-2xl bg-white" />
                                    </>
                                ) : (
                                    <>
                                        {/* Email */}
                                        <a
                                            href={
                                                contact?.email
                                                    ? `mailto:${contact.email}`
                                                    : undefined
                                            }
                                            className="group rounded-2xl border border-black/8 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A572]/50"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FAFAF8] text-[#C5A572]">
                                                <FiMail />
                                            </div>

                                            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#4A4A4A]/60">
                                                Email
                                            </p>

                                            <p className="mt-2 break-all text-sm text-[#2C2C2C]">
                                                {contact?.email || "—"}
                                            </p>
                                        </a>

                                        {/* Phone */}
                                        <a
                                            href={
                                                contact?.phone
                                                    ? `tel:${contact.phone}`
                                                    : undefined
                                            }
                                            className="group rounded-2xl border border-black/8 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A572]/50"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FAFAF8] text-[#C5A572]">
                                                <FiPhone />
                                            </div>

                                            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#4A4A4A]/60">
                                                Phone
                                            </p>

                                            <p className="mt-2 text-sm text-[#2C2C2C]">
                                                {contact?.phone || "—"}
                                            </p>
                                        </a>

                                        {/* WhatsApp */}
                                        <a
                                            href={whatsappLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group rounded-2xl border border-black/8 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A572]/50"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FAFAF8] text-[#C5A572]">
                                                <FaWhatsapp />
                                            </div>

                                            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#4A4A4A]/60">
                                                WhatsApp
                                            </p>

                                            <p className="mt-2 text-sm text-[#2C2C2C]">
                                                {contact?.whatsapp || "—"}
                                            </p>
                                        </a>

                                        {/* Location */}
                                        <a
                                            href={contact?.google_maps}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group rounded-2xl border border-black/8 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A572]/50"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FAFAF8] text-[#C5A572]">
                                                <FiMapPin />
                                            </div>

                                            <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-[#4A4A4A]/60">
                                                Visit Us
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-[#2C2C2C]">
                                                {contact?.address || "—"}
                                            </p>
                                        </a>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Social / Location */}
                <section className="border-y border-black/5 bg-white px-[clamp(1rem,4vw,2.5rem)] py-[clamp(4rem,7vw,6rem)]">
                    <div className="mx-auto grid w-full max-w-7xl gap-12 md:grid-cols-2">

                        {/* Social */}
                        <div>
                            <p className="text-[clamp(0.65rem,0.8vw,0.75rem)] font-medium uppercase tracking-[0.3em] text-[#C5A572]">
                                Follow Along
                            </p>

                            <h2 className="mt-4 font-[Cormorant_Garamond] text-[clamp(2rem,4vw,3.25rem)] font-light leading-none">
                                Stay connected.
                            </h2>

                            <div className="mt-7 flex flex-wrap gap-3">
                                {socialLinks.map(
                                    (social) =>
                                        social.href && (
                                            <a
                                                key={social.name}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={social.name}
                                                title={social.name}
                                                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#4A4A4A] transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A572] hover:bg-[#C5A572] hover:text-white"
                                            >
                                                {social.icon}
                                            </a>
                                        ),
                                )}
                            </div>
                        </div>

                        {/* Map */}
                        <div className="flex flex-col justify-between rounded-2xl bg-[#232323] p-7 text-white">
                            <div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[#C5A572]">
                                    <FaLocationDot />
                                </div>

                                <p className="mt-6 text-xs font-medium uppercase tracking-[0.25em] text-white/40">
                                    Our Location
                                </p>

                                <p className="mt-3 max-w-sm font-[Cormorant_Garamond] text-[clamp(1.8rem,3vw,2.5rem)] font-light leading-tight">
                                    {contact?.address || "Our office location"}
                                </p>
                            </div>

                            {contact?.google_maps && (
                                <a
                                    href={contact.google_maps}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group mt-8 inline-flex w-fit items-center gap-3 text-sm text-white/70 transition-colors hover:text-[#C5A572]"
                                >
                                    Open in Google Maps
                                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                </a>
                            )}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="px-[clamp(1rem,4vw,2.5rem)] py-[clamp(5rem,9vw,8rem)]">
                    <div className="mx-auto w-full max-w-5xl text-center">
                        <p className="text-[clamp(0.65rem,0.8vw,0.75rem)] font-medium uppercase tracking-[0.3em] text-[#C5A572]">
                            Your Next Move
                        </p>

                        <h2 className="mt-5 font-[Cormorant_Garamond] text-[clamp(2.8rem,6vw,5rem)] font-light leading-[0.95] tracking-tight">
                            Let&apos;s find the right
                            <br />
                            property for you.
                        </h2>

                        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#4A4A4A]">
                            Explore our available properties or speak directly
                            with our team about what you are looking for.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Link
                                to="/properties"
                                className="group inline-flex items-center gap-3 rounded-full bg-[#232323] px-7 py-4 text-sm text-white transition-all duration-300 hover:bg-[#C5A572]"
                            >
                                Explore Properties
                                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            <Link
                                to="/inquiry"
                                className="group inline-flex items-center gap-3 rounded-full border border-black/15 bg-white px-7 py-4 text-sm transition-all duration-300 hover:border-[#C5A572] hover:text-[#C5A572]"
                            >
                                Send an Inquiry
                                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Contact;