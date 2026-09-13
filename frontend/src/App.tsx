import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import About from "./pages/About";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route
                path="/properties/:slug"
                element={<PropertyDetails />}
            />
            <Route path="/about" element={<About />} />
        </Routes>
    );
}

export default App;