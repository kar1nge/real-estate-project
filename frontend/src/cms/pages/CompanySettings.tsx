import { useEffect, useState } from "react";
import type {
    CompanySettings as CompanySettingsData,
} from "../../types/companySettings";
import {
    getCompanySettings,
    updateCompanySettings,
} from "../services/companySettingsService";

function CompanySettings() {
    const [settings, setSettings] =
        useState<CompanySettingsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadSettings() {
            try {
                const data = await getCompanySettings();
                setSettings(data);
            } catch (error) {
                setMessage(error instanceof Error ? error.message : "Failed to load company settings.");
            } finally {
                setLoading(false);
            }
        }

        loadSettings();
    }, []);

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        if (!settings) return;

        setSettings({
            ...settings,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        if (!settings) return;

        setSaving(true);
        setMessage("");

        try {
            const updated = await updateCompanySettings(settings);
            setSettings(updated);
            setMessage("Company settings updated successfully.");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to update company settings.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-xl border border-[#E8E5DF] bg-white p-8 shadow-sm">
                        <p className="text-sm text-[#4A4A4A]">
                            Loading company settings...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] px-6 py-12">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-xl border border-red-100 bg-white p-8 shadow-sm">
                        <p className="text-sm text-red-600">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const fields = [
        {
            key: "name",
            label: "Company Name",
            description: "The name displayed across the website.",
            type: "text",
        },
        {
            key: "email",
            label: "Email Address",
            description: "Primary public company email.",
            type: "email",
        },
        {
            key: "phone",
            label: "Phone Number",
            description: "Primary public contact number.",
            type: "text",
        },
        {
            key: "whatsapp",
            label: "WhatsApp Number",
            description: "Number used for WhatsApp contact links.",
            type: "text",
        },
        {
            key: "address",
            label: "Business Address",
            description: "The address displayed on contact sections.",
            type: "text",
        },
        {
            key: "google_maps",
            label: "Google Maps Link",
            description: "Link used for the company location.",
            type: "url",
        },
        {
            key: "instagram",
            label: "Instagram",
            description: "Company Instagram profile URL.",
            type: "url",
        },
        {
            key: "facebook",
            label: "Facebook",
            description: "Company Facebook profile URL.",
            type: "url",
        },
        {
            key: "twitter",
            label: "X / Twitter",
            description: "Company X profile URL.",
            type: "url",
        },
        {
            key: "tiktok",
            label: "TikTok",
            description: "Company TikTok profile URL.",
            type: "url",
        },
        {
            key: "youtube",
            label: "YouTube",
            description: "Company YouTube channel URL.",
            type: "url",
        },
    ] as const;

    return (
        <div className="min-h-screen bg-[#FAFAF8] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                <div className="mb-8">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A572]">
                        Website Management
                    </p>

                    <h1 className="font-serif text-3xl font-medium tracking-tight text-[#232323] sm:text-4xl">
                        Company Settings
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#4A4A4A]">
                        Manage the company information used throughout the
                        website, including contact details, location and
                        social media profiles.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    <section className="mb-6 rounded-xl border border-[#E8E5DF] bg-white shadow-sm">
                        <div className="border-b border-[#ECE9E3] px-6 py-5">
                            <h2 className="text-base font-semibold text-[#232323]">
                                Company Information
                            </h2>

                            <p className="mt-1 text-sm text-[#6B6B6B]">
                                Basic information displayed across the public
                                website.
                            </p>
                        </div>

                        <div className="grid gap-6 p-6 md:grid-cols-2">
                            {fields.slice(0, 5).map((field) => (
                                <div key={field.key}>
                                    <label
                                        htmlFor={field.key}
                                        className="mb-2 block text-sm font-medium text-[#2C2C2C]"
                                    >
                                        {field.label}
                                    </label>

                                    <input
                                        id={field.key}
                                        name={field.key}
                                        type={field.type}
                                        value={settings[field.key]}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-[#DCD8D0] bg-white px-4 py-3 text-sm text-[#232323] outline-none transition focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/15"
                                    />

                                    <p className="mt-1.5 text-xs text-[#7A7A7A]">
                                        {field.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-6 rounded-xl border border-[#E8E5DF] bg-white shadow-sm">
                        <div className="border-b border-[#ECE9E3] px-6 py-5">
                            <h2 className="text-base font-semibold text-[#232323]">
                                Location
                            </h2>

                            <p className="mt-1 text-sm text-[#6B6B6B]">
                                Manage the business location shown on the
                                website.
                            </p>
                        </div>

                        <div className="grid gap-6 p-6 md:grid-cols-2">
                            {fields.slice(5, 6).map((field) => (
                                <div key={field.key}>
                                    <label
                                        htmlFor={field.key}
                                        className="mb-2 block text-sm font-medium text-[#2C2C2C]"
                                    >
                                        {field.label}
                                    </label>

                                    <input
                                        id={field.key}
                                        name={field.key}
                                        type={field.type}
                                        value={settings[field.key]}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-[#DCD8D0] bg-white px-4 py-3 text-sm text-[#232323] outline-none transition focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/15"
                                    />

                                    <p className="mt-1.5 text-xs text-[#7A7A7A]">
                                        {field.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-8 rounded-xl border border-[#E8E5DF] bg-white shadow-sm">
                        <div className="border-b border-[#ECE9E3] px-6 py-5">
                            <h2 className="text-base font-semibold text-[#232323]">
                                Social Media
                            </h2>

                            <p className="mt-1 text-sm text-[#6B6B6B]">
                                Update the social profiles connected to the
                                website.
                            </p>
                        </div>

                        <div className="grid gap-6 p-6 md:grid-cols-2">
                            {fields.slice(6).map((field) => (
                                <div key={field.key}>
                                    <label
                                        htmlFor={field.key}
                                        className="mb-2 block text-sm font-medium text-[#2C2C2C]"
                                    >
                                        {field.label}
                                    </label>

                                    <input
                                        id={field.key}
                                        name={field.key}
                                        type={field.type}
                                        value={settings[field.key]}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-[#DCD8D0] bg-white px-4 py-3 text-sm text-[#232323] outline-none transition focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/15"
                                    />

                                    <p className="mt-1.5 text-xs text-[#7A7A7A]">
                                        {field.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="flex flex-col gap-4 border-t border-[#E5E1D9] pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm">
                            {message && (
                                <p
                                    className={
                                        message.includes("successfully")
                                            ? "text-green-700"
                                            : "text-red-600"
                                    }
                                >
                                    {message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-[#232323] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2F2F2F] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving Changes..."
                                : "Save Changes"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default CompanySettings;
