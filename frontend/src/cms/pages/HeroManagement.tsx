import { useEffect, useState } from "react";
import type { HeroSlide } from "../../types/hero";
import { API_ORIGIN } from "../../services/apiConfig";
import {
  createHeroSlide,
  getHeroSlidesForManagement,
  updateHeroSlide,
} from "../services/heroManagementService";

interface HeroFormData {
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  order: number;
  is_active: boolean;
  starts_at: string;
  ends_at: string;
  image: File | null;
}

const emptyForm: HeroFormData = {
  title: "",
  subtitle: "",
  button_text: "",
  button_link: "",
  order: 1,
  is_active: true,
  starts_at: "",
  ends_at: "",
  image: null,
};

function toDateTimeInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function toApiDateTime(value: string) {
  return value ? new Date(value).toISOString() : "";
}

function getSlideVisibility(slide: HeroSlide) {
  if (!slide.is_active) return "Inactive";
  const now = Date.now();
  if (slide.starts_at && new Date(slide.starts_at).getTime() > now) {
    return "Scheduled";
  }
  if (slide.ends_at && new Date(slide.ends_at).getTime() <= now) {
    return "Expired";
  }
  return "Visible";
}

function HeroManagement() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<HeroFormData>(emptyForm);
  const [creating, setCreating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadSlides();
  }, []);

  useEffect(() => {
    if (!formData.image) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(formData.image);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [formData.image]);

  async function loadSlides() {
    try {
      const data = await getHeroSlidesForManagement();
      setSlides(data);
    } catch {
      setMessage("Failed to load Hero slides.");
    } finally {
      setLoading(false);
    }
  }

  function startCreating() {
    setCreating(true);
    setEditingId(null);

    setFormData({
      ...emptyForm,
      order: slides.length + 1,
    });

    setMessage("");
  }

  function startEditing(slide: HeroSlide) {
    setCreating(false);
    setEditingId(slide.id);

    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      button_text: slide.button_text,
      button_link: slide.button_link,
      order: slide.order,
      is_active: slide.is_active,
      starts_at: toDateTimeInput(slide.starts_at),
      ends_at: toDateTimeInput(slide.ends_at),
      image: null,
    });

    setMessage("");
  }

  function cancelEditing() {
    setCreating(false);
    setEditingId(null);
    setFormData(emptyForm);
    setMessage("");
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: name === "order" ? Number(value) : value,
    }));
  }

  function handleActiveChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData((current) => ({
      ...current,
      is_active: event.target.checked,
    }));
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    setFormData((current) => ({
      ...current,
      image: file,
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const startsAt = formData.starts_at ? new Date(formData.starts_at) : null;
    const endsAt = formData.ends_at ? new Date(formData.ends_at) : null;
    if (startsAt && endsAt && startsAt >= endsAt) {
      setMessage("The hide time must be later than the start time.");
      return;
    }

    setSaving(true);
    setMessage("");

    const data = new FormData();

    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("button_text", formData.button_text);
    data.append("button_link", formData.button_link);
    data.append("order", String(formData.order));
    data.append("is_active", String(formData.is_active));
    data.append("starts_at", toApiDateTime(formData.starts_at));
    data.append("ends_at", toApiDateTime(formData.ends_at));

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (editingId !== null) {
        await updateHeroSlide(editingId, data);

        setMessage("Hero slide updated successfully.");
      } else {
        if (!formData.image) {
          setMessage("Please select an image for the new Hero slide.");

          setSaving(false);
          return;
        }

        await createHeroSlide(data);

        setMessage("Hero slide created successfully.");
      }

      await loadSlides();

      setEditingId(null);
      setFormData(emptyForm);
    } catch {
      setMessage("Failed to save Hero slide.");
    } finally {
      setSaving(false);
    }
  }

  function getImageUrl(image: string) {
    return image.startsWith("http") ? image : `${API_ORIGIN}${image}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-[#E8E5DF] bg-white p-8 shadow-sm">
            <p className="text-sm text-[#4A4A4A]">Loading Hero slides...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] px-4 py-[clamp(1.5rem,3vw,3rem)] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1280px]">
        {/* Header */}
        <header className="mb-[clamp(1.75rem,4vw,3rem)] flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[clamp(0.65rem,0.8vw,0.75rem)] font-semibold uppercase tracking-[0.2em] text-[#C5A572]">
              Website Management
            </p>

            <h1 className="font-serif text-[clamp(1.9rem,4vw,3rem)] font-medium leading-tight tracking-tight text-[#232323]">
              Hero Slides
            </h1>

            <p className="mt-3 max-w-2xl text-[clamp(0.82rem,1vw,0.95rem)] leading-6 text-[#4A4A4A]">
              Manage the images, messaging and calls to action displayed in the
              website Hero section.
            </p>
          </div>

          {!editingId && (
            <button
              type="button"
              onClick={startCreating}
              className="w-full rounded-lg bg-[#232323] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2F2F2F] sm:w-auto"
            >
              Add Hero Slide
            </button>
          )}
        </header>

        {/* Empty state */}
        {!editingId && formData.title === "" && slides.length === 0 && (
          <div className="mb-8 rounded-xl border border-[#E8E5DF] bg-white p-[clamp(1.5rem,4vw,3rem)] text-center shadow-sm">
            <h2 className="text-base font-semibold text-[#232323]">
              No Hero slides found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B6B6B]">
              Add your first Hero slide to begin building the homepage.
            </p>
          </div>
        )}

        {/* Create editor */}
        {creating && (
          <section className="mb-[clamp(2rem,4vw,3rem)] overflow-hidden rounded-xl border border-[#E8E5DF] bg-white shadow-sm">
            <div className="grid lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
              <div className="border-b border-[#ECE9E3] bg-[#F7F5F1] p-[clamp(1.25rem,3vw,2rem)] lg:border-b-0 lg:border-r">
                <div className="flex h-full min-h-[280px] flex-col justify-center">
                  <div className="mb-5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#C5A572]">
                      New Slide
                    </p>

                    <h2 className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-medium text-[#232323]">
                      Add a new Hero image
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-[#6B6B6B]">
                      Upload the image that will represent this new Hero
                      slide.
                    </p>
                  </div>

                  <label
                    htmlFor="image"
                    className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D8D3CA] bg-white px-5 py-6 text-center transition hover:border-[#C5A572] hover:bg-[#FCFBF9]"
                  >
                    {formData.image ? (
                      <>
                        <span className="text-sm font-medium text-[#232323]">
                          {formData.image.name}
                        </span>

                        <span className="mt-1 text-xs text-[#7A7A7A]">
                          Image selected
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-[#232323]">
                          Choose Hero image
                        </span>

                        <span className="mt-1 text-xs text-[#7A7A7A]">
                          Click to browse your files
                        </span>
                      </>
                    )}
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                    className="sr-only"
                  />
                </div>
              </div>

              <EditorFields
                formData={formData}
                editing={false}
                saving={saving}
                message={message}
                onInputChange={handleInputChange}
                onActiveChange={handleActiveChange}
                onImageChange={handleImageChange}
                onCancel={cancelEditing}
                onSubmit={handleSubmit}
              />
            </div>
          </section>
        )}

        {/* Existing slides */}
        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#232323]">
                Existing Slides
              </h2>

              <p className="mt-1 text-sm text-[#6B6B6B]">
                {slides.length} slide
                {slides.length === 1 ? "" : "s"} configured.
              </p>
            </div>
          </div>

          {slides.length > 0 && (
            <div className="grid gap-[clamp(1rem,2vw,1.5rem)] md:grid-cols-2">
              {slides.map((slide) => {
                const isEditing = editingId === slide.id;
                const displayedImage =
                  isEditing && previewUrl
                    ? previewUrl
                    : getImageUrl(slide.image);

                return (
                  <article
                    key={slide.id}
                    className={`overflow-hidden rounded-xl border border-[#E8E5DF] bg-white shadow-sm ${
                      isEditing ? "md:col-span-2" : ""
                    }`}
                  >
                    {isEditing ? (
                      <div className="grid lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.2fr)]">
                        {/* Editing image */}
                        <div className="relative min-h-[300px] bg-[#F2F0EB] lg:min-h-full">
                          <img
                            src={displayedImage}
                            alt={slide.title}
                            className="h-full min-h-[300px] w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                          <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3 sm:bottom-6 sm:left-7 sm:right-7 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
                                Editing Slide {slide.order}
                              </p>

                              <p className="text-[clamp(1.1rem,2vw,1.5rem)] font-medium text-white">
                                {formData.title || slide.title}
                              </p>
                            </div>

                            <span
                              className={
                                formData.is_active
                                  ? "w-fit rounded-full bg-white px-3 py-1.5 text-xs font-medium text-green-700 shadow-sm"
                                  : "w-fit rounded-full bg-[#232323] px-3 py-1.5 text-xs font-medium text-white shadow-sm"
                              }
                            >
                              {formData.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>

                        {/* Editing fields */}
                        <div className="border-t border-[#ECE9E3] lg:border-l lg:border-t-0">
                          <EditorFields
                            formData={formData}
                            editing
                            saving={saving}
                            message={message}
                            onInputChange={handleInputChange}
                            onActiveChange={handleActiveChange}
                            onImageChange={handleImageChange}
                            onCancel={cancelEditing}
                            onSubmit={handleSubmit}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="relative aspect-[16/8] bg-[#F2F0EB]">
                          <img
                            src={getImageUrl(slide.image)}
                            alt={slide.title}
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute left-4 top-4">
                            <span
                              className={
                                getSlideVisibility(slide) === "Visible"
                                  ? "rounded-full bg-white px-3 py-1 text-xs font-medium text-green-700 shadow-sm"
                                  : "rounded-full bg-[#232323] px-3 py-1 text-xs font-medium text-white shadow-sm"
                              }
                            >
                              {getSlideVisibility(slide)}
                            </span>
                          </div>
                        </div>

                        <div className="p-[clamp(1rem,2vw,1.25rem)]">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-[#C5A572]">
                                Slide {slide.order}
                              </p>

                              <h3 className="truncate text-lg font-semibold text-[#232323]">
                                {slide.title}
                              </h3>
                            </div>

                            <button
                              type="button"
                              onClick={() => startEditing(slide)}
                              className="shrink-0 rounded-lg border border-[#DCD8D0] px-4 py-2 text-sm font-medium text-[#4A4A4A] transition hover:bg-[#F7F5F1]"
                            >
                              Edit
                            </button>
                          </div>

                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6B6B6B]">
                            {slide.subtitle}
                          </p>

                          <p className="mt-2 text-xs leading-5 text-[#7A7A7A]">
                            {slide.starts_at
                              ? `Starts ${new Date(slide.starts_at).toLocaleString()}`
                              : "No start time"}
                            {" · "}
                            {slide.ends_at
                              ? `Hides ${new Date(slide.ends_at).toLocaleString()}`
                              : "No end time"}
                          </p>

                          <div className="mt-4 border-t border-[#ECE9E3] pt-4">
                            <p className="text-xs text-[#7A7A7A]">Button</p>

                            <p className="mt-1 text-sm font-medium text-[#2C2C2C]">
                              {slide.button_text}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

interface EditorFieldsProps {
  formData: HeroFormData;
  editing: boolean;
  saving: boolean;
  message: string;
  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onActiveChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

function EditorFields({
  formData,
  editing,
  saving,
  message,
  onInputChange,
  onActiveChange,
  onImageChange,
  onCancel,
  onSubmit,
}: EditorFieldsProps) {
  return (
    <div className="p-[clamp(1.25rem,3vw,2rem)]">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[#232323]">
          {editing ? "Edit Hero Slide" : "New Hero Slide"}
        </h2>

        <p className="mt-1 text-sm leading-6 text-[#6B6B6B]">
          {editing
            ? "Update the content displayed with this Hero image."
            : "Add the messaging and call to action for this Hero slide."}
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid gap-[clamp(1rem,2vw,1.5rem)] lg:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-[#2C2C2C]"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={onInputChange}
              required
              className="w-full rounded-lg border border-[#DCD8D0] px-4 py-3 text-sm text-[#232323] outline-none transition focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/15"
            />
          </div>

          <div>
            <label
              htmlFor="button_text"
              className="mb-2 block text-sm font-medium text-[#2C2C2C]"
            >
              Button Text
            </label>

            <input
              id="button_text"
              name="button_text"
              value={formData.button_text}
              onChange={onInputChange}
              required
              className="w-full rounded-lg border border-[#DCD8D0] px-4 py-3 text-sm text-[#232323] outline-none transition focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/15"
            />
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="subtitle"
              className="mb-2 block text-sm font-medium text-[#2C2C2C]"
            >
              Subtitle
            </label>

            <textarea
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={onInputChange}
              required
              rows={4}
              className="w-full resize-y rounded-lg border border-[#DCD8D0] px-4 py-3 text-sm text-[#232323] outline-none transition focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/15"
            />
          </div>

          <div>
            <label
              htmlFor="button_link"
              className="mb-2 block text-sm font-medium text-[#2C2C2C]"
            >
              Button Link
            </label>

            <input
              id="button_link"
              name="button_link"
              value={formData.button_link}
              onChange={onInputChange}
              required
              placeholder="/properties"
              className="w-full rounded-lg border border-[#DCD8D0] px-4 py-3 text-sm text-[#232323] outline-none transition focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/15"
            />
          </div>

          <div>
            <label
              htmlFor="order"
              className="mb-2 block text-sm font-medium text-[#2C2C2C]"
            >
              Display Order
            </label>

            <input
              id="order"
              name="order"
              type="number"
              min="1"
              value={formData.order}
              onChange={onInputChange}
              required
              className="w-full rounded-lg border border-[#DCD8D0] px-4 py-3 text-sm text-[#232323] outline-none transition focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/15"
            />
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="replace-image"
              className="mb-2 block text-sm font-medium text-[#2C2C2C]"
            >
              {editing ? "Replace Image" : "Hero Image"}
            </label>

            <input
              id="replace-image"
              name="replace-image"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              required={!editing}
              className="block w-full rounded-lg border border-[#DCD8D0] bg-white px-4 py-3 text-sm text-[#4A4A4A] file:mr-4 file:rounded-md file:border-0 file:bg-[#F2EFE9] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#232323]"
            />

            <p className="mt-1.5 text-xs leading-5 text-[#7A7A7A]">
              {editing
                ? "Leave this unchanged to keep the current image."
                : "Choose a high-quality image for this Hero slide."}
            </p>

            {formData.image && (
              <p className="mt-2 text-xs font-medium text-[#4A4A4A]">
                Selected: {formData.image.name}
              </p>
            )}
          </div>

          <div className="lg:col-span-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={onActiveChange}
                className="h-4 w-4 rounded border-[#CFCAC1] text-[#232323] focus:ring-[#C5A572]"
              />

              <span>
                <span className="block text-sm font-medium text-[#2C2C2C]">
                  Active
                </span>

                <span className="block text-xs leading-5 text-[#7A7A7A]">
                  The slide is public only while active and within its schedule.
                </span>
              </span>
            </label>
          </div>

          <label>
            <span className="mb-2 block text-sm font-medium text-[#2C2C2C]">
              Start showing (optional)
            </span>
            <input
              type="datetime-local"
              name="starts_at"
              value={formData.starts_at}
              onChange={onInputChange}
              className="w-full rounded-lg border border-[#DCD8D0] px-4 py-3 text-sm text-[#232323] outline-none transition focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/15"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-medium text-[#2C2C2C]">
              Hide after (optional)
            </span>
            <input
              type="datetime-local"
              name="ends_at"
              value={formData.ends_at}
              onChange={onInputChange}
              className="w-full rounded-lg border border-[#DCD8D0] px-4 py-3 text-sm text-[#232323] outline-none transition focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/15"
            />
          </label>

          <p className="lg:col-span-2 text-xs leading-5 text-[#7A7A7A]">
            Times use your browser’s local time. Leave a date blank for no schedule limit.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-[#ECE9E3] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-5">
            {message && (
              <p
                className={
                  message.includes("successfully")
                    ? "text-sm text-green-700"
                    : "text-sm text-red-600"
                }
              >
                {message}
              </p>
            )}
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-[#DCD8D0] px-5 py-3 text-sm font-medium text-[#4A4A4A] transition hover:bg-[#F7F5F1] sm:flex-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-[#232323] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2F2F2F] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {saving ? "Saving..." : editing ? "Save Changes" : "Create Slide"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default HeroManagement;
