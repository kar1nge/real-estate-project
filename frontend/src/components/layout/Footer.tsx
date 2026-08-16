import { useEffect, useState } from "react";
import {
    FaInstagram,
    FaFacebookF,
    FaXTwitter,
    FaTiktok,
    FaYoutube,
    FaWhatsapp,
    FaLocationDot,
} from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import { Link } from "react-router-dom";

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

function Footer() {
    const [contact, setContact] = useState<ContactSettings | null>(null);

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
            }
        };

        fetchContactSettings();
    }, []);

    /*
     * Contact information is now provided by the Django
     * /api/contacts/ endpoint.
     *
     * The backend ContactSettings model is currently populated
     * from the environment configuration.
     *
     * Later, Django Admin/CMS will allow the marketing team
     * to update these values without changing the frontend.
     */

    const companyName = contact?.name ?? "Real Estate Company";
    const email = contact?.email ?? "";

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
        {
            name: "WhatsApp",
            href: contact?.whatsapp
                ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`
                : undefined,
            icon: <FaWhatsapp />,
        },
        {
            name: "Email",
            href: email ? `mailto:${email}` : undefined,
            icon: <HiOutlineMail />,
        },
        {
            name: "Location",
            href: contact?.google_maps,
            icon: <FaLocationDot />,
        },
    ];

    return (
        <footer className="border-t border-white/10 bg-neutral-950 px-[clamp(1rem,4vw,2.5rem)] py-[clamp(3rem,6vw,4rem)] text-white">

            <div className="mx-auto w-full max-w-7xl">

                {/* Main Footer */}
                <div className="grid gap-[clamp(2.5rem,5vw,3rem)] md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div className="lg:col-span-2">

                        <Link
                            to="/"
                            className="text-[clamp(1.5rem,2.5vw,1.75rem)] font-light tracking-tight text-white"
                        >
                            {companyName}
                        </Link>

                        <p className="mt-[clamp(1rem,2vw,1.25rem)] max-w-md text-[clamp(0.8rem,0.9vw,0.875rem)] leading-6 text-white/60">
                            Connecting people with exceptional properties,
                            thoughtfully selected for the way they want to live.
                        </p>

                    </div>

                    {/* Explore */}
                    <div>

                        <p className="text-[clamp(0.65rem,0.7vw,0.75rem)] font-medium uppercase tracking-[clamp(0.2em,0.35vw,0.3em)] text-white/40">
                            Explore
                        </p>

                        <div className="mt-[clamp(1rem,2vw,1.25rem)] flex flex-col gap-[clamp(0.6rem,1vw,0.75rem)] text-[clamp(0.8rem,0.9vw,0.875rem)] text-white/60">

                            <Link
                                to="/properties"
                                className="transition-colors hover:text-white"
                            >
                                Properties
                            </Link>

                            <Link
                                to="/about"
                                className="transition-colors hover:text-white"
                            >
                                About Us
                            </Link>

                            <Link
                                to="/faqs"
                                className="transition-colors hover:text-white"
                            >
                                FAQs
                            </Link>

                            <Link
                                to="/inquire"
                                className="transition-colors hover:text-white"
                            >
                                Inquire
                            </Link>

                            <Link
                                to="/book-site-visit"
                                className="transition-colors hover:text-white"
                            >
                                Book a Site Visit
                            </Link>

                        </div>

                    </div>

                    {/* Connect */}
                    <div>

                        <p className="text-[clamp(0.65rem,0.7vw,0.75rem)] font-medium uppercase tracking-[clamp(0.2em,0.35vw,0.3em)] text-white/40">
                            Connect
                        </p>

                        <div className="mt-[clamp(1rem,2vw,1.25rem)] flex flex-wrap items-center gap-[clamp(0.5rem,1vw,0.75rem)]">

                            {socialLinks.map((social) => (
                                social.href && (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        aria-label={social.name}
                                        title={social.name}
                                        target={
                                            social.name === "Email"
                                                ? undefined
                                                : "_blank"
                                        }
                                        rel={
                                            social.name === "Email"
                                                ? undefined
                                                : "noopener noreferrer"
                                        }
                                        className="
                                            flex
                                            h-[clamp(2.5rem,3vw,2.75rem)]
                                            w-[clamp(2.5rem,3vw,2.75rem)]
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-white/15
                                            text-white/60
                                            transition-all
                                            duration-300
                                            hover:-translate-y-1
                                            hover:border-white
                                            hover:bg-white
                                            hover:text-black
                                        "
                                    >
                                        <span className="text-[clamp(0.9rem,1vw,1.0625rem)]">
                                            {social.icon}
                                        </span>
                                    </a>
                                )
                            ))}

                        </div>

                    </div>

                </div>

                {/* Bottom */}
                <div className="mt-[clamp(2.5rem,5vw,3rem)] flex flex-col gap-[clamp(1rem,2vw,1.25rem)] border-t border-white/10 pt-[clamp(1.25rem,2.5vw,1.5rem)] text-[clamp(0.65rem,0.75vw,0.75rem)] text-white/40 md:flex-row md:items-center md:justify-between">

                    <p>
                        © {new Date().getFullYear()} {companyName}. All rights reserved.
                    </p>

                    <div className="flex gap-[clamp(1rem,2vw,1.5rem)]">

                        <Link
                            to="/privacy"
                            className="transition-colors hover:text-white"
                        >
                            Privacy
                        </Link>

                        <Link
                            to="/terms"
                            className="transition-colors hover:text-white"
                        >
                            Terms
                        </Link>

                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;