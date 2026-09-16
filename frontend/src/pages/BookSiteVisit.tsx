import { motion } from "motion/react";
import { FiArrowRight, FiCalendar, FiCheck, FiClock } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import {
  createSiteVisitBooking,
  getSiteVisitSchedules,
} from "../services/siteVisitService";

import type {
  CreateSiteVisitBookingData,
  SiteVisitSchedule,
} from "../types/siteVisit";

function BookSiteVisit() {
  const [schedules, setSchedules] = useState<SiteVisitSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] =
    useState<SiteVisitSchedule | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    visitor_name: "",
    visitor_email: "",
    visitor_phone: "",
    number_of_visitors: 1,
    message: "",
  });

  useEffect(() => {
    async function loadSchedules() {
      try {
        setLoading(true);
        setError("");

        const data = await getSiteVisitSchedules();
        setSchedules(data);
      } catch {
        setError(
          "We could not load the available site visits. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadSchedules();
  }, []);

  const availableSchedules = useMemo(
    () => schedules.filter((schedule) => schedule.remaining_slots > 0),
    [schedules],
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: name === "number_of_visitors" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedSchedule) {
      setError("Please select a site visit date and time.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const bookingData: CreateSiteVisitBookingData = {
        schedule: selectedSchedule.id,
        visitor_name: formData.visitor_name,
        visitor_email: formData.visitor_email,
        visitor_phone: formData.visitor_phone,
        number_of_visitors: formData.number_of_visitors,
        message: formData.message,
      };

      await createSiteVisitBooking(bookingData);

      const updatedSchedules = await getSiteVisitSchedules();
      setSchedules(updatedSchedules);

      setSuccess(true);
    } catch {
      setError(
        "We could not submit your request. Please check your details and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#2C2C2C]">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#232323] px-6 py-28 text-white md:px-10 lg:px-16 lg:py-36">
          <div className="mx-auto max-w-[1280px]">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <p className="mb-5 text-sm uppercase tracking-[0.28em] text-[#C5A572]">
                Private Viewings
              </p>

              <h1 className="font-serif text-5xl leading-[0.95] md:text-6xl lg:text-7xl">
                Book a Site Visit
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                Experience the property in person. Choose an available viewing
                and tell us a little about your visit.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Booking */}
        <section className="px-6 py-20 md:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Intro */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <p className="mb-4 text-sm uppercase tracking-[0.25em] text-[#C5A572]">
                Arrange Your Visit
              </p>

              <h2 className="font-serif text-4xl leading-tight md:text-5xl">
                See the property
                <br />
                for yourself.
              </h2>

              <p className="mt-6 max-w-md text-base leading-8 text-[#4A4A4A]">
                Select one of the available viewing times and submit your
                details. Our team will review your request and contact you to
                confirm the arrangements.
              </p>

              <div className="mt-10 space-y-5 border-t border-black/10 pt-7">
                <div className="flex gap-4">
                  <div className="mt-1 text-[#C5A572]">
                    <FiCalendar />
                  </div>

                  <div>
                    <h3 className="font-medium">Choose a date</h3>

                    <p className="mt-1 text-sm leading-6 text-[#4A4A4A]">
                      Select from the viewing schedules currently available.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 text-[#C5A572]">
                    <FiClock />
                  </div>

                  <div>
                    <h3 className="font-medium">Pick your time</h3>

                    <p className="mt-1 text-sm leading-6 text-[#4A4A4A]">
                      Available times are provided by our property team.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:p-10"
            >
              {success ? (
                <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C5A572]/15 text-2xl text-[#C5A572]">
                    <FiCheck />
                  </div>

                  <p className="mt-7 text-sm uppercase tracking-[0.22em] text-[#C5A572]">
                    Request Received
                  </p>

                  <h2 className="mt-4 font-serif text-4xl">Thank you.</h2>

                  <p className="mt-5 max-w-md leading-7 text-[#4A4A4A]">
                    Your site visit request has been received. Our team will
                    review the request and contact you shortly to confirm the
                    viewing arrangements.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setSelectedSchedule(null);
                      setFormData({
                        visitor_name: "",
                        visitor_email: "",
                        visitor_phone: "",
                        number_of_visitors: 1,
                        message: "",
                      });
                    }}
                    className="mt-8 inline-flex items-center gap-2 border-b border-[#C5A572] pb-1 text-sm font-medium uppercase tracking-[0.16em] text-[#232323] transition hover:text-[#C5A572]"
                  >
                    Book another visit
                    <FiArrowRight />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-9">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-[#C5A572]">
                      Site Visit
                    </p>

                    <h2 className="mt-2 font-serif text-3xl md:text-4xl">
                      Select your viewing
                    </h2>
                  </div>

                  {error && (
                    <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                      {error}
                    </div>
                  )}

                  {/* Schedules */}
                  <div>
                    <label className="mb-3 block text-sm font-medium">
                      Available Viewings
                    </label>

                    {loading ? (
                      <div className="rounded-xl border border-black/10 bg-[#FAFAF8] p-5 text-sm text-[#4A4A4A]">
                        Loading available viewings...
                      </div>
                    ) : availableSchedules.length === 0 ? (
                      <div className="rounded-xl border border-black/10 bg-[#FAFAF8] p-5 text-sm leading-6 text-[#4A4A4A]">
                        There are currently no available site visit schedules.
                        Please check again later or contact our team.
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <select
                            value={selectedSchedule?.id ?? ""}
                            onChange={(e) => {
                              const schedule = availableSchedules.find(
                                (item) => item.id === Number(e.target.value),
                              );

                              setSelectedSchedule(schedule ?? null);
                            }}
                            className="w-full appearance-none rounded-xl border border-black/10 bg-white px-5 py-4 pr-12 text-sm text-[#2C2C2C] shadow-[0_8px_30px_rgba(0,0,0,0.04)] outline-none transition duration-300 hover:border-[#C5A572]/50 focus:border-[#C5A572] focus:shadow-[0_8px_30px_rgba(197,165,114,0.10)]"
                          >
                            <option value="" disabled>
                              Select an available viewing
                            </option>

                            {availableSchedules.map((schedule) => (
                              <option key={schedule.id} value={schedule.id}>
                                {schedule.property_title} —{" "}
                                {new Date(
                                  `${schedule.date}T00:00:00`,
                                ).toLocaleDateString(undefined, {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}{" "}
                                — {schedule.start_time} - {schedule.end_time} —{" "}
                                {schedule.remaining_slots} slots left
                              </option>
                            ))}
                          </select>

                          <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-[#C5A572]">
                            <FiClock className="text-base" />
                          </div>
                        </div>

                        <p className="mt-3 text-xs leading-5 text-[#4A4A4A]">
                          Select one of the scheduled viewing times available.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Visitor details */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-[#C5A572]">
                        Your Details
                      </p>

                      <h2 className="mt-2 font-serif text-3xl">
                        Tell us about your visit
                      </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="visitor_name"
                          className="mb-2 block text-sm font-medium"
                        >
                          Full Name
                        </label>

                        <input
                          id="visitor_name"
                          name="visitor_name"
                          type="text"
                          required
                          value={formData.visitor_name}
                          onChange={handleChange}
                          className="w-full border-b border-black/15 bg-transparent px-0 py-3 outline-none transition focus:border-[#C5A572]"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="visitor_phone"
                          className="mb-2 block text-sm font-medium"
                        >
                          Phone Number
                        </label>

                        <input
                          id="visitor_phone"
                          name="visitor_phone"
                          type="tel"
                          required
                          value={formData.visitor_phone}
                          onChange={handleChange}
                          className="w-full border-b border-black/15 bg-transparent px-0 py-3 outline-none transition focus:border-[#C5A572]"
                          placeholder="+254..."
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="visitor_email"
                        className="mb-2 block text-sm font-medium"
                      >
                        Email Address
                      </label>

                      <input
                        id="visitor_email"
                        name="visitor_email"
                        type="email"
                        required
                        value={formData.visitor_email}
                        onChange={handleChange}
                        className="w-full border-b border-black/15 bg-transparent px-0 py-3 outline-none transition focus:border-[#C5A572]"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="number_of_visitors"
                        className="mb-2 block text-sm font-medium"
                      >
                        Number of Visitors
                      </label>

                      <select
                        id="number_of_visitors"
                        name="number_of_visitors"
                        value={formData.number_of_visitors}
                        onChange={handleChange}
                        className="w-full border-b border-black/15 bg-transparent px-0 py-3 outline-none transition focus:border-[#C5A572]"
                      >
                        <option value={1}>1 visitor</option>
                        <option value={2}>2 visitors</option>
                        <option value={3}>3 visitors</option>
                      </select>
                      <p className="mt-2 text-xs leading-5 text-[#4A4A4A]">
                        Maximum 3 visitors per booking.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 block text-sm font-medium"
                      >
                        Message{" "}
                        <span className="font-normal text-[#4A4A4A]">
                          (Optional)
                        </span>
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full resize-none border-b border-black/15 bg-transparent px-0 py-3 outline-none transition focus:border-[#C5A572]"
                        placeholder="Tell us anything we should know about your visit..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      submitting || loading || availableSchedules.length === 0
                    }
                    className="group inline-flex w-full items-center justify-center gap-3 bg-[#232323] px-6 py-4 text-sm font-medium uppercase tracking-[0.16em] text-white transition hover:bg-[#C5A572] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting
                      ? "Submitting Request..."
                      : "Request Site Visit"}

                    {!submitting && (
                      <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </button>

                  <p className="text-center text-xs leading-5 text-[#4A4A4A]">
                    Your request is subject to confirmation by our property
                    team.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default BookSiteVisit;
