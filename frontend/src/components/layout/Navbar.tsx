import logo from "../../assets/images/logo.png";
import { THEME } from "../../constants/theme";




function Navbar() {
    return (
        <nav className="text-white absolute top-0 left-0 z-50 flex w-full items-center px-8 py-6">
            {/* Logo */}
            <div className="flex flex-col items-center">
                <img
                    src={logo}
                    alt={THEME.brand.name}
                    className="h-20 w-auto"
                />

                <p className="text-sm font-medium">
                    {THEME.brand.name}
                </p>
            </div>

            {/* Navigation */}
            <div className=" flex flex-1 justify-center gap-8">
                <a href="#">Home</a>
                <a href="#">Properties</a>
                <a href="#">About</a>
                <a href="#">Team</a>
                <a href="#">FAQs</a>
                <a href="#">Contact</a>


            </div>

            {/* CTA */}
            <button className="rounded-md bg-black px-5 py-2 text-white">
                Book Site Visit
            </button>
        </nav>
    );
}

export default Navbar;