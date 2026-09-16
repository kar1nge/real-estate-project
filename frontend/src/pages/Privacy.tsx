import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function Privacy() {
    return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#2C2C2C]">
            <Navbar />

            <main>
                {/* Hero */}
                <section className="border-b border-black/5 bg-[#232323] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(5rem,10vw,7rem)] text-white">
                    <div className="mx-auto w-full max-w-5xl">
                        <p className="mb-5 text-[clamp(0.65rem,0.8vw,0.75rem)] font-medium uppercase tracking-[0.3em] text-[#C5A572]">
                            Legal
                        </p>

                        <h1 className="font-[Cormorant_Garamond] text-[clamp(3rem,7vw,5.5rem)] font-light leading-[0.9] tracking-tight">
                            Privacy Policy
                        </h1>

                        <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60">
                            Your privacy matters to us. This policy explains
                            how information submitted through this website may
                            be collected, used, stored, and protected.
                        </p>
                    </div>
                </section>

                {/* Content */}
                <section className="px-[clamp(1rem,4vw,2.5rem)] py-[clamp(4rem,8vw,6rem)]">
                    <div className="mx-auto w-full max-w-4xl">
                        <div className="space-y-12">

                            <section>
                                <h2 className="font-[Cormorant_Garamond] text-3xl font-light">
                                    1. Information We Collect
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-[#4A4A4A]">
                                    When you interact with this website, we may
                                    collect information that you voluntarily
                                    provide, including your name, email
                                    address, phone number, property interests,
                                    inquiry details, and site visit booking
                                    information.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-[Cormorant_Garamond] text-3xl font-light">
                                    2. How We Use Your Information
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-[#4A4A4A]">
                                    Information submitted through this website
                                    may be used to respond to inquiries,
                                    arrange property viewings, process site
                                    visit requests, communicate with you about
                                    your property interests, and provide
                                    requested services.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-[Cormorant_Garamond] text-3xl font-light">
                                    3. Communication
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-[#4A4A4A]">
                                    By submitting your contact details, you may
                                    be contacted by our team regarding your
                                    inquiry, property interest, or scheduled
                                    site visit. Where applicable, you may also
                                    receive communications related to services
                                    you have requested.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-[Cormorant_Garamond] text-3xl font-light">
                                    4. Information Protection
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-[#4A4A4A]">
                                    We take reasonable measures to protect
                                    information submitted through this website
                                    against unauthorized access, alteration,
                                    disclosure, or misuse. However, no method
                                    of transmission or electronic storage can
                                    be guaranteed to be completely secure.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-[Cormorant_Garamond] text-3xl font-light">
                                    5. Third-Party Services
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-[#4A4A4A]">
                                    This website may use third-party services
                                    such as mapping, communication, analytics,
                                    social media, or other external platforms.
                                    Those services may process information in
                                    accordance with their own privacy policies.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-[Cormorant_Garamond] text-3xl font-light">
                                    6. Cookies and Similar Technologies
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-[#4A4A4A]">
                                    This website may use cookies or similar
                                    technologies where necessary for website
                                    functionality, performance, analytics, or
                                    user experience. Any additional cookie
                                    practices should be reviewed and configured
                                    according to the specific implementation
                                    of the website.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-[Cormorant_Garamond] text-3xl font-light">
                                    7. Your Rights
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-[#4A4A4A]">
                                    Depending on applicable law, you may have
                                    rights relating to the personal information
                                    we hold about you, including requesting
                                    access, correction, or deletion of certain
                                    information. Requests may be made using the
                                    contact details provided on this website.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-[Cormorant_Garamond] text-3xl font-light">
                                    8. Policy Updates
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-[#4A4A4A]">
                                    This Privacy Policy may be updated from time
                                    to time to reflect changes in our services,
                                    website functionality, or applicable
                                    requirements. Updated versions will be
                                    published on this page.
                                </p>
                            </section>

                            <section className="border-t border-black/10 pt-8">
                                <p className="text-xs leading-6 text-[#4A4A4A]/70">
                                    Last updated: [16th September, 2026]
                                </p>
                            </section>

                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Privacy;

