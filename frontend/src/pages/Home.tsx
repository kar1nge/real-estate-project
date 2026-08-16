import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import FeaturedProperties from "../components/home/FeaturedProperties";
import AboutSection from "../components/home/AboutSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Statistics from "../components/home/Statistics";
import Testimonials from "../components/home/Testimonials";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/layout/Footer";

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <FeaturedProperties />
            <AboutSection />
            <WhyChooseUs />
            <Testimonials />
            <Statistics />
            <CallToAction />
            <Footer />
        </>
    );
}

export default Home;