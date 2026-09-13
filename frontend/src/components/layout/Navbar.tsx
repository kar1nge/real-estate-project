import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

import logo from "../../assets/images/logo.png";
import { THEME } from "../../constants/theme";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [lightMode, setLightMode] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    useEffect(() => {
        const detectBackground = () => {
            const navbar = document.querySelector("nav");

            if (!navbar) return;

            const navbarRect = navbar.getBoundingClientRect();

            // Check just below the navbar.
            const x = window.innerWidth / 2;
            const y = Math.min(
                navbarRect.bottom + 8,
                window.innerHeight - 1
            );

            let element = document.elementFromPoint(x, y);

            if (!element) return;

            let detectedLight = false;

            while (element && element !== document.body) {
                const styles = window.getComputedStyle(element);

                const backgroundColor = styles.backgroundColor;
                const backgroundImage = styles.backgroundImage;

                // Background images are treated as dark/hero-style surfaces.
                if (
                    backgroundImage &&
                    backgroundImage !== "none"
                ) {
                    detectedLight = false;
                    break;
                }

                if (
                    backgroundColor &&
                    backgroundColor !== "transparent" &&
                    backgroundColor !== "rgba(0, 0, 0, 0)"
                ) {
                    const match = backgroundColor.match(
                        /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)/
                    );

                    if (match) {
                        const red = Number(match[1]);
                        const green = Number(match[2]);
                        const blue = Number(match[3]);
                        const alpha =
                            match[4] !== undefined
                                ? Number(match[4])
                                : 1;

                        if (alpha > 0.1) {
                            const brightness =
                                (red * 299 +
                                    green * 587 +
                                    blue * 114) /
                                1000;

                            detectedLight = brightness > 175;
                            break;
                        }
                    }
                }

                element = element.parentElement;
            }

            setLightMode(detectedLight);
        };

        detectBackground();

        window.addEventListener("scroll", detectBackground, {
            passive: true,
        });

        window.addEventListener("resize", detectBackground);

        return () => {
            window.removeEventListener("scroll", detectBackground);
            window.removeEventListener("resize", detectBackground);
        };
    }, []);

    return (
        <nav className="fixed left-0 top-0 z-50 w-full px-[clamp(1rem,3vw,2.5rem)] py-2">
            <div
                className={`
                    mx-auto flex w-full max-w-[1500px]
                    items-center justify-between
                    rounded-full border
                    px-[clamp(1rem,2vw,1.5rem)] py-3
                    backdrop-blur-md
                    transition-all duration-500
                    ${
                        lightMode
                            ? "border-black/10 bg-white/80"
                            : "border-white/15 bg-black/20"
                    }
                `}
            >
                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="flex shrink-0 items-center gap-2"
                >
                    <img
                        src={logo}
                        alt={THEME.brand.name}
                        className={`
                            h-12 w-auto object-contain
                            transition-all duration-500
                            ${lightMode ? "" : ""}
                        `}
                    />

                    <span
                        className={`
                            text-sm font-medium tracking-wide
                            transition-colors duration-500
                            ${
                                lightMode
                                    ? "text-gray-900"
                                    : "text-white"
                            }
                        `}
                    >
                        {THEME.brand.name}
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center lg:flex">
                    {[
                        { label: "Home", to: "/" },
                        { label: "Properties", to: "/properties" },
                        { label: "About", to: "/about" },
                        { label: "Team", to: "/about#team" },
                        { label: "FAQs", to: "/faqs" },
                        { label: "Contact", to: "/contact" },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            onClick={closeMenu}
                            className={`
                                px-3 py-2 text-sm
                                transition-colors duration-500
                                ${
                                    lightMode
                                        ? "text-gray-800 hover:text-gray-400"
                                        : "text-white/90 hover:text-white/60"
                                }
                            `}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* CTA */}
                    <Link
                        to="/book-site-visit"
                        onClick={closeMenu}
                        className={`
                            ml-4 rounded-full border px-5 py-2
                            text-xs font-medium
                            transition-all duration-500
                            ${
                                lightMode
                                    ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                                    : "border-white text-white hover:bg-white hover:text-black"
                            }
                        `}
                    >
                        Book a Visit
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    type="button"
                    aria-label={
                        menuOpen
                            ? "Close navigation"
                            : "Open navigation"
                    }
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                    className={`
                        flex h-10 w-10 items-center justify-center
                        rounded-full border text-lg
                        transition-all duration-500
                        lg:hidden
                        ${
                            lightMode
                                ? "border-black/20 text-gray-900 hover:bg-black/5"
                                : "border-white/30 text-white hover:bg-white/10"
                        }
                    `}
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] rounded-2xl bg-[#232323] p-4 shadow-2xl lg:hidden">
                        <div className="flex flex-col">
                            <Link
                                to="/"
                                onClick={closeMenu}
                                className="border-b border-white/10 px-3 py-3 text-sm text-white/80 hover:text-white"
                            >
                                Home
                            </Link>

                            <Link
                                to="/properties"
                                onClick={closeMenu}
                                className="border-b border-white/10 px-3 py-3 text-sm text-white/80 hover:text-white"
                            >
                                Properties
                            </Link>

                            <Link
                                to="/about"
                                onClick={closeMenu}
                                className="border-b border-white/10 px-3 py-3 text-sm text-white/80 hover:text-white"
                            >
                                About
                            </Link>

                            <Link
                                to="/about#team"
                                onClick={closeMenu}
                                className="border-b border-white/10 px-3 py-3 text-sm text-white/80 hover:text-white"
                            >
                                Team
                            </Link>

                            <Link
                                to="/faqs"
                                onClick={closeMenu}
                                className="border-b border-white/10 px-3 py-3 text-sm text-white/80 hover:text-white"
                            >
                                FAQs
                            </Link>

                            <Link
                                to="/contact"
                                onClick={closeMenu}
                                className="border-b border-white/10 px-3 py-3 text-sm text-white/80 hover:text-white"
                            >
                                Contact
                            </Link>

                            <Link
                                to="/book-site-visit"
                                onClick={closeMenu}
                                className="mt-4 rounded-full bg-white px-4 py-3 text-center text-xs font-medium text-black"
                            >
                                Book a Visit
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;

