import { useEffect, useState } from "react";
import { createInquiry } from "../services/inquiryService";
import { getProperties } from "../services/propertyService";
import type { Property } from "../types/property";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function Inquiry() {
  const [properties, setProperties] = useState<Property[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    property: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await getProperties();
        setProperties(response.results);
      } catch (error) {
        console.error("Failed to load properties:", error);
      }
    }

    loadProperties();
  }, []);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setSuccess(false);
    setError("");

    try {
      await createInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        property: formData.property ? Number(formData.property) : null,
      });

      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        property: "",
      });
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#2C2C2C]">
      <Navbar />
      {/* Inquiry Hero */}
      <section className="px-[clamp(1rem,4vw,2.5rem)] pt-32 pb-16">
        <div className="mx-auto max-w-[1280px]">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#C5A572]">
            Get In Touch
          </p>

          <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] tracking-tight text-[#232323] sm:text-6xl lg:text-7xl">
            Let&apos;s start
            <br />a conversation.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-[#4A4A4A] sm:text-lg">
            Have a question about a property or our services? Tell us what you
            need and our team will get back to you.
          </p>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="px-[clamp(1rem,4vw,2.5rem)] pb-24">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          {/* Intro */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#C5A572]">
              Send an Inquiry
            </p>

            <h2 className="mt-4 max-w-sm font-serif text-4xl leading-tight text-[#232323] sm:text-5xl">
              Tell us what you&apos;re looking for.
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-[#4A4A4A] sm:text-base">
              Whether you have a question about a property, need more
              information, or simply want to speak with our team, we&apos;re
              here to help.
            </p>

            <div className="mt-10 space-y-6 border-t border-[#232323]/10 pt-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#C5A572]">
                  Response
                </p>
                <p className="mt-2 text-sm leading-6 text-[#4A4A4A]">
                  Our team will review your inquiry and get back to you
                  directly.
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#C5A572]">
                  Private & Personal
                </p>
                <p className="mt-2 text-sm leading-6 text-[#4A4A4A]">
                  Every inquiry is handled directly by our team.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-[#232323]/15 pt-2"
          >
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="text-xs uppercase tracking-[0.2em] text-[#4A4A4A]"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="mt-3 w-full border-b border-[#232323]/15 bg-transparent px-0 py-3 text-sm text-[#232323] outline-none transition-colors placeholder:text-[#4A4A4A]/50 focus:border-[#C5A572]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-xs uppercase tracking-[0.2em] text-[#4A4A4A]"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="mt-3 w-full border-b border-[#232323]/15 bg-transparent px-0 py-3 text-sm text-[#232323] outline-none transition-colors placeholder:text-[#4A4A4A]/50 focus:border-[#C5A572]"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="text-xs uppercase tracking-[0.2em] text-[#4A4A4A]"
                >
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+254..."
                  className="mt-3 w-full border-b border-[#232323]/15 bg-transparent px-0 py-3 text-sm text-[#232323] outline-none transition-colors placeholder:text-[#4A4A4A]/50 focus:border-[#C5A572]"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="text-xs uppercase tracking-[0.2em] text-[#4A4A4A]"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className="mt-3 w-full border-b border-[#232323]/15 bg-transparent px-0 py-3 text-sm text-[#232323] outline-none transition-colors placeholder:text-[#4A4A4A]/50 focus:border-[#C5A572]"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="property"
                  className="text-xs uppercase tracking-[0.2em] text-[#4A4A4A]"
                >
                  Property <span className="text-[#4A4A4A]/50">(Optional)</span>
                </label>

                <select
                  id="property"
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                  className="mt-3 w-full border-b border-[#232323]/15 bg-transparent px-0 py-3 text-sm text-[#232323] outline-none transition-colors focus:border-[#C5A572]"
                >
                  <option value="">No specific property</option>

                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title} — {property.location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="text-xs uppercase tracking-[0.2em] text-[#4A4A4A]"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us a little about what you need..."
                  className="mt-3 w-full resize-none border-b border-[#232323]/15 bg-transparent px-0 py-3 text-sm text-[#232323] outline-none transition-colors placeholder:text-[#4A4A4A]/50 focus:border-[#C5A572]"
                />
              </div>
            </div>

            {success && (
              <p className="mt-6 text-sm text-green-700">
                Your inquiry has been sent successfully. We&apos;ll get back to
                you soon.
              </p>
            )}

            {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

            <div className="mt-8 flex items-center justify-between gap-6">
              <p className="max-w-sm text-xs leading-5 text-[#4A4A4A]/60">
                By submitting this inquiry, you agree to be contacted regarding
                your request.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="shrink-0 rounded-full bg-[#232323] px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#C5A572] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send Inquiry"}
              </button>
            </div>
          </form>
        </div>
      </section>
        <Footer />
    </main>
  );
}

export default Inquiry;

