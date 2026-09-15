import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import About from "./pages/About";
import FAQs from "./pages/FAQs";
import Inquiry from "./pages/Inquiry";
import ScrollToTop from "./components/layout/ScrollToTop";

function App() {
    return (
        <>
            <ScrollToTop />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<Properties />} />
                <Route
                    path="/properties/:slug"
                    element={<PropertyDetails />}
                />
                <Route path="/about" element={<About />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/inquiry" element={<Inquiry />} />
            </Routes>
        </>
    );
}

export default App;