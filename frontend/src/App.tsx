import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route
                path="/properties/:slug"
                element={<PropertyDetails />}
            />
        </Routes>
    );
}

export default App;