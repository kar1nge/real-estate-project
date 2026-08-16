
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

import logo from "../../assets/images/logo.png";
import { THEME } from "../../constants/theme";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="absolute left-0 top-0 z-50 w-full px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1rem,2vw,1.5rem)] text-white">
            <div className="mx-auto flex w-full max-w-[1800px] flex-wrap items-center">

                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="flex shrink-0 flex-col items-center"
                >
                    <img
                        src={logo}
                        alt={THEME.brand.name}
                        className="h-[clamp(3.5rem,5vw,5rem)] w-auto"
                    />

                    <p className="text-[clamp(0.6rem,0.7vw,0.875rem)] font-medium">
                        {THEME.brand.name}
                    </p>
                </Link>

                {/* Navigation */}
                <div
                    className={`
                        order-3 w-full overflow-hidden
                        transition-all duration-500 ease-out
                        lg:order-none lg:flex lg:w-auto lg:flex-1 lg:items-center lg:justify-center lg:overflow-visible
                        ${menuOpen
                            ? "mt-4 max-h-[min(600px,70vh)] opacity-100 lg:mt-0 lg:max-h-none lg:opacity-100"
                            : "pointer-events-none max-h-0 opacity-0 lg:pointer-events-auto lg:max-h-none lg:opacity-100"
                        }
                    `}
                >
                    <div
                        className="
                            flex max-h-[min(600px,70vh)] flex-col overflow-y-auto
                            rounded-3xl border border-white/10 bg-black/90 p-[clamp(1rem,2vw,1.5rem)]
                            shadow-2xl backdrop-blur-xl

                            lg:max-h-none lg:flex-row lg:items-center lg:justify-center
                            lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent
                            lg:p-0 lg:shadow-none lg:backdrop-blur-none
                        "
                    >
                        <Link
                            to="/"
                            onClick={closeMenu}
                            className="
                                border-b border-white/10 py-[clamp(0.75rem,1vw,1rem)]
                                text-[clamp(1rem,1vw,1.125rem)]
                                transition-opacity duration-300 hover:opacity-75

                                lg:border-0 lg:py-0
                            "
                        >
                            Home
                        </Link>

                        <Link
                            to="/properties"
                            onClick={closeMenu}
                            className="
                                border-b border-white/10 py-[clamp(0.75rem,1vw,1rem)]
                                text-[clamp(1rem,1vw,1.125rem)]
                                transition-opacity duration-300 hover:opacity-75

                                lg:border-0 lg:py-0 lg:ml-[clamp(1rem,2vw,2rem)]
                            "
                        >
                            Properties
                        </Link>

                        <Link
                            to="/about"
                            onClick={closeMenu}
                            className="
                                border-b border-white/10 py-[clamp(0.75rem,1vw,1rem)]
                                text-[clamp(1rem,1vw,1.125rem)]
                                transition-opacity duration-300 hover:opacity-75

                                lg:border-0 lg:py-0 lg:ml-[clamp(1rem,2vw,2rem)]
                            "
                        >
                            About
                        </Link>

                        <Link
                            to="/about#team"
                            onClick={closeMenu}
                            className="
                                border-b border-white/10 py-[clamp(0.75rem,1vw,1rem)]
                                text-[clamp(1rem,1vw,1.125rem)]
                                transition-opacity duration-300 hover:opacity-75

                                lg:border-0 lg:py-0 lg:ml-[clamp(1rem,2vw,2rem)]
                            "
                        >
                            Team
                        </Link>

                        <Link
                            to="/faqs"
                            onClick={closeMenu}
                            className="
                                border-b border-white/10 py-[clamp(0.75rem,1vw,1rem)]
                                text-[clamp(1rem,1vw,1.125rem)]
                                transition-opacity duration-300 hover:opacity-75

                                lg:border-0 lg:py-0 lg:ml-[clamp(1rem,2vw,2rem)]
                            "
                        >
                            FAQs
                        </Link>

                        <Link
                            to="/contact"
                            onClick={closeMenu}
                            className="
                                border-b border-white/10 py-[clamp(0.75rem,1vw,1rem)]
                                text-[clamp(1rem,1vw,1.125rem)]
                                transition-opacity duration-300 hover:opacity-75

                                lg:border-0 lg:py-0 lg:ml-[clamp(1rem,2vw,2rem)]
                            "
                        >
                            Contact
                        </Link>

                        {/* CTA */}
                        <Link
                            to="/book-site-visit"
                            onClick={closeMenu}
                            className="
                                mt-5 rounded-full bg-white px-[clamp(1.25rem,2vw,1.5rem)]
                                py-[clamp(0.7rem,1vw,0.8rem)]
                                text-center text-[clamp(0.7rem,0.8vw,0.875rem)]
                                font-medium uppercase tracking-[0.18em] text-black
                                transition-all duration-300
                                hover:-translate-y-0.5
                                active:scale-95

                                lg:mt-0 lg:ml-[clamp(1rem,2vw,2rem)]
                                lg:rounded-md lg:bg-black lg:py-2 lg:normal-case
                                lg:tracking-normal lg:text-white
                                lg:hover:bg-neutral-900
                            "
                        >
                            Book Site Visit
                        </Link>
                    </div>
                </div>

                {/* Compact Navigation Toggle */}
                <button
                    type="button"
                    aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                    className="
                        ml-auto flex h-11 w-11 shrink-0 items-center justify-center
                        rounded-full border border-white/20 bg-black/20 text-xl
                        backdrop-blur-md transition-all duration-300
                        hover:bg-white/10

                        lg:hidden
                    "
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;

