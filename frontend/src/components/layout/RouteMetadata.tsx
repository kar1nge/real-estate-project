import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "NduKaWa Properties | Premium Real Estate",
    description: "Discover premium homes and property opportunities with NduKaWa Properties. Explore listings, arrange a viewing, and speak with our Nairobi real estate team.",
  },
  "/properties": {
    title: "Properties for Sale | NduKaWa Properties",
    description: "Browse homes and property opportunities across Nairobi. Filter listings by location, type, bedrooms, and price.",
  },
  "/about": {
    title: "About Us | NduKaWa Properties",
    description: "Meet the people and learn about the experience behind NduKaWa Properties.",
  },
  "/faqs": {
    title: "Frequently Asked Questions | NduKaWa Properties",
    description: "Find answers about buying property, viewings, and working with NduKaWa Properties.",
  },
  "/contact": {
    title: "Contact Us | NduKaWa Properties",
    description: "Contact the NduKaWa Properties team for help with a property or viewing.",
  },
  "/inquiry": {
    title: "Property Inquiry | NduKaWa Properties",
    description: "Send a property inquiry to the NduKaWa Properties team.",
  },
  "/privacy": {
    title: "Privacy Policy | NduKaWa Properties",
    description: "Read the NduKaWa Properties privacy policy.",
  },
  "/terms": {
    title: "Terms and Conditions | NduKaWa Properties",
    description: "Read the NduKaWa Properties website terms and conditions.",
  },
};

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isCms = pathname.startsWith("/manage") || pathname.startsWith("/activate/");
    const isPropertyDetails = pathname.startsWith("/properties/");
    const isNotFound = !pageMetadata[pathname] && !isPropertyDetails && !isCms;
    const metadata = pageMetadata[pathname] ?? (isPropertyDetails
      ? {
          title: "Property Details | NduKaWa Properties",
          description: "View property details, photos, location, and viewing information from NduKaWa Properties.",
        }
      : {
          title: "Page Not Found | NduKaWa Properties",
          description: "The page you are looking for could not be found.",
        });

    document.title = metadata.title;
    setMeta("name", "description", metadata.description);
    setMeta("property", "og:title", metadata.title);
    setMeta("property", "og:description", metadata.description);
    setMeta("name", "robots", isCms || isNotFound ? "noindex, nofollow" : "index, follow");
  }, [pathname]);

  return null;
}
