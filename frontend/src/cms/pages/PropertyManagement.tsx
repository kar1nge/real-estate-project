import { useEffect, useMemo, useState } from "react";
import type { Property } from "../../types/property";
import { API_BASE_URL } from "../../services/apiConfig";
import VirtualTourManagement from "./VirtualTourManagement";
import {
  createProperty,
  getPropertiesForManagement,
  updateProperty,
  uploadPropertyImage,
  updatePropertyImage,
  type PropertyManagementData,
  type PaginatedProperties,
} from "../services/propertyManagementService";

const PROPERTIES_API_URL = `${API_BASE_URL}properties/`;

interface Option {
  id: number;
  name: string;
}

interface FormState {
  title: string;
  short_description: string;
  description: string;
  property_type: number | "";
  status: number | "";
  starting_price: string;
  available_units: string;
  bedrooms: string;
  bathrooms: string;
  location: number | "";
  google_maps_url: string;
  featured: boolean;
  homepage_order: number | null;
  publication_status: "draft" | "published";
  amenities: number[];
  youtube_url: string;
  similar_properties: number[];
  completion_date: string;
}

const emptyForm: FormState = {
  title: "",
  short_description: "",
  description: "",
  property_type: "",
  status: "",
  starting_price: "",
  available_units: "1",
  bedrooms: "",
  bathrooms: "",
  location: "",
  google_maps_url: "",
  featured: false,
  homepage_order: null,
  publication_status: "draft",
  amenities: [],
  youtube_url: "",
  similar_properties: [],
  completion_date: "",
};

function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyPage, setPropertyPage] = useState<PaginatedProperties | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [locations, setLocations] = useState<Option[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<Option[]>([]);
  const [statuses, setStatuses] = useState<Option[]>([]);
  const [amenities, setAmenities] = useState<Option[]>([]);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [similarPropertySearch, setSimilarPropertySearch] = useState("");

  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(
    null,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [form, setForm] = useState<FormState>(emptyForm);

  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [activeSection, setActiveSection] = useState<string | null>("basic");

  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [imageUploading, setImageUploading] = useState(false);
  const [imageUpdatingId, setImageUpdatingId] = useState<number | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const loadProperties = async (page = currentPage) => {
    try {
      setLoading(true);
      setError("");

      const data = await getPropertiesForManagement(page);

      setProperties(data.results);
      setPropertyPage(data);
      setCurrentPage(page);
    } catch {
      setError("Unable to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleImageUpload = async (propertyId: number, file: File) => {
    setImageUploading(true);
    setImageError(null);

    try {
      await uploadPropertyImage(propertyId, file);
      await loadProperties();
    } catch (error) {
      setImageError(
        error instanceof Error
          ? error.message
          : "Failed to upload property image.",
      );
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageUpdate = async (
    propertyId: number,
    imageId: number,
    file?: File,
    isActive?: boolean,
  ) => {
    setImageUpdatingId(imageId);
    setImageError(null);

    try {
      await updatePropertyImage(propertyId, imageId, file, undefined, isActive);

      await loadProperties();
    } catch (error) {
      setImageError(
        error instanceof Error
          ? error.message
          : "Failed to update property image.",
      );
    } finally {
      setImageUpdatingId(null);
    }
  };

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true);

        const [
          locationsResponse,
          typesResponse,
          statusesResponse,
          amenitiesResponse,
        ] = await Promise.all([
          fetch(`${PROPERTIES_API_URL}locations/`),
          fetch(`${PROPERTIES_API_URL}property-types/`),
          fetch(`${PROPERTIES_API_URL}statuses/`),
          fetch(`${PROPERTIES_API_URL}amenities/`),
        ]);

        if (
          !locationsResponse.ok ||
          !typesResponse.ok ||
          !statusesResponse.ok ||
          !amenitiesResponse.ok
        ) {
          throw new Error();
        }

        const [locationsData, typesData, statusesData, amenitiesData] =
          await Promise.all([
            locationsResponse.json(),
            typesResponse.json(),
            statusesResponse.json(),
            amenitiesResponse.json(),
          ]);

        setLocations(locationsData.results ?? locationsData);
        setPropertyTypes(typesData.results ?? typesData);
        setStatuses(statusesData.results ?? statusesData);
        setAmenities(amenitiesData.results ?? amenitiesData);
      } catch {
        setSaveError(
          "Some property options could not be loaded. Please refresh the page.",
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  const publishedCount = properties.filter(
    (property) => property.publication_status === "published",
  ).length;

  const featuredProperties = properties
    .filter((property) => property.featured)
    .sort((a, b) => {
      const orderA = a.homepage_order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.homepage_order ?? Number.MAX_SAFE_INTEGER;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return a.created_at.localeCompare(b.created_at);
    });

  const featuredCount = featuredProperties.length;
  const homepageSlots = Math.min(featuredCount, 9);

  const filteredProperties = useMemo(() => {
    const query = search.trim().toLowerCase();

    return properties.filter((property) => {
      const matchesSearch =
        !query ||
        [
          property.title,
          property.short_description,
          property.location.name,
          property.property_type.name,
          property.status.name,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesLocation =
        !locationFilter || property.location.id.toString() === locationFilter;

      const matchesType =
        !typeFilter || property.property_type.id.toString() === typeFilter;

      const matchesStatus =
        !statusFilter || property.status.id.toString() === statusFilter;

      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "published" &&
          property.publication_status === "published") ||
        (visibilityFilter === "draft" &&
          property.publication_status === "draft") ||
        (visibilityFilter === "featured" && property.featured);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesStatus &&
        matchesVisibility
      );
    });
  }, [
    properties,
    search,
    locationFilter,
    typeFilter,
    statusFilter,
    visibilityFilter,
  ]);

  const openCreateForm = () => {
    setEditingPropertyId(null);
    setShowCreateForm(true);
    setForm(emptyForm);
    setSaveError("");
    setSuccessMessage("");
    setImageError(null);
    setActiveSection("basic");
    setSimilarPropertySearch("");
  };

  const closeEditor = () => {
    setEditingPropertyId(null);
    setShowCreateForm(false);
    setForm(emptyForm);
    setSaveError("");
    setSuccessMessage("");
    setImageError(null);
    setActiveSection("basic");
    setSimilarPropertySearch("");
  };

  const openEditor = (property: Property) => {
    setShowCreateForm(false);
    setEditingPropertyId(property.id);
    setSimilarPropertySearch("");

    setForm({
      title: property.title,
      short_description: property.short_description,
      description: property.description,
      property_type:
        typeof property.property_type === "number"
          ? property.property_type
          : property.property_type.id,

      status:
        typeof property.status === "number"
          ? property.status
          : property.status.id,
      starting_price: property.starting_price,
      available_units: property.available_units.toString(),
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      location:
        typeof property.location === "number"
          ? property.location
          : property.location.id,
      google_maps_url: property.google_maps_url ?? "",
      featured: property.featured,
      homepage_order: property.homepage_order ?? null,
      publication_status: property.publication_status,
      amenities: property.amenities.map((amenity) =>
        typeof amenity === "number" ? amenity : amenity.id,
      ),
      youtube_url: property.youtube_url ?? "",
      similar_properties: property.similar_properties.map((similar) =>
        typeof similar === "number" ? similar : similar.id,
      ),
      completion_date: property.completion_date ?? "",
    });

    setSaveError("");
    setSuccessMessage("");
    setImageError(null);
    setActiveSection("basic");
  };

  const updateForm = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleAmenity = (amenityId: number) => {
    setForm((current) => ({
      ...current,
      amenities: current.amenities.includes(amenityId)
        ? current.amenities.filter((id) => id !== amenityId)
        : [...current.amenities, amenityId],
    }));
  };

  const toggleSimilarProperty = (propertyId: number) => {
    setForm((current) => ({
      ...current,
      similar_properties: current.similar_properties.includes(propertyId)
        ? current.similar_properties.filter((id) => id !== propertyId)
        : [...current.similar_properties, propertyId],
    }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      return "Property title is required.";
    }

    if (!form.short_description.trim()) {
      return "Short description is required.";
    }

    if (!form.description.trim()) {
      return "Full description is required.";
    }

    if (!form.property_type) {
      return "Please select a property type.";
    }

    if (!form.status) {
      return "Please select a property status.";
    }

    if (!form.location) {
      return "Please select a location.";
    }

    if (!form.starting_price || Number(form.starting_price) <= 0) {
      return "Starting price must be greater than zero.";
    }

    if (
      form.available_units === "" ||
      !Number.isInteger(Number(form.available_units)) ||
      Number(form.available_units) < 0
    ) {
      return "Enter the available unit count, or 0 when sold out.";
    }

    if (!form.bedrooms || Number(form.bedrooms) < 0) {
      return "Please enter a valid bedroom count.";
    }

    if (!form.bathrooms || Number(form.bathrooms) < 0) {
      return "Please enter a valid bathroom count.";
    }

    if (form.featured && form.publication_status !== "published") {
      return "A featured property must be published.";
    }

    return "";
  };

  const buildPayload = (): PropertyManagementData => ({
    title: form.title.trim(),
    short_description: form.short_description.trim(),
    description: form.description.trim(),
    property_type: Number(form.property_type),
    status: Number(form.status),
    starting_price: form.starting_price,
    available_units: Number(form.available_units),
    bedrooms: Number(form.bedrooms),
    bathrooms: Number(form.bathrooms),
    location: Number(form.location),
    google_maps_url: form.google_maps_url.trim(),
    featured: form.featured,
    homepage_order: form.featured ? form.homepage_order : null,
    publication_status: form.publication_status,
    amenities: form.amenities,
    youtube_url: form.youtube_url.trim(),
    similar_properties: form.similar_properties,
    completion_date: form.completion_date,
  });

  const handleSave = async () => {
    const validationError = validateForm();

    if (validationError) {
      setSaveError(validationError);
      return;
    }

    try {
      setSaving(true);
      setSaveError("");
      setSuccessMessage("");

      const payload = buildPayload();

      if (editingPropertyId !== null) {
        await updateProperty(editingPropertyId, payload);

        setSuccessMessage("Property updated successfully.");
        await loadProperties();
      } else {
        const createdProperty = await createProperty(payload);

        setSuccessMessage(
          "Property created successfully. You can now add its images.",
        );

        await loadProperties();

        setShowCreateForm(false);
        setEditingPropertyId(createdProperty.id);
        setActiveSection("gallery");
      }
    } catch {
      setSaveError(
        editingPropertyId !== null
          ? "Unable to update this property."
          : "Unable to create this property.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePropertyWithImage = async (file: File) => {
    const validationError = validateForm();
    if (validationError) {
      setSaveError(validationError);
      setImageError("Complete the required property details before adding its first image.");
      return;
    }

    setSaving(true);
    setImageUploading(true);
    setSaveError("");
    setImageError(null);
    setSuccessMessage("");

    let imageUploaded = false;
    try {
      const intendedPayload = buildPayload();
      const draftPayload: PropertyManagementData = {
        ...intendedPayload,
        publication_status: "draft",
        featured: false,
        homepage_order: null,
      };
      const createdProperty = await createProperty(draftPayload);

      setEditingPropertyId(createdProperty.id);
      setShowCreateForm(false);
      setActiveSection("gallery");
      setCurrentPage(1);
      setSuccessMessage("Saved as a draft. Uploading the first image...");
      await loadProperties(1);

      await uploadPropertyImage(createdProperty.id, file);
      imageUploaded = true;

      if (intendedPayload.publication_status === "published") {
        await updateProperty(createdProperty.id, intendedPayload);
      }

      await loadProperties(1);
      setSuccessMessage("Property and image saved successfully.");
    } catch (error) {
      setImageError(
        imageUploaded
          ? "The image uploaded, but the property could not be published. It remains a draft; save your changes to try again."
          : error instanceof Error
            ? `${error.message} The property remains a draft.`
            : "The property image could not be uploaded. The property remains a draft.",
      );
    } finally {
      setSaving(false);
      setImageUploading(false);
    }
  };

  const toggleSection = (section: string) => {
    setActiveSection((current) => (current === section ? null : section));
  };

  const renderSectionHeader = (
    id: string,
    number: string,
    title: string,
    description: string,
  ) => {
    const open = activeSection === id;

    return (
      <button
        type="button"
        onClick={() => toggleSection(id)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-[#FCFBF8] sm:px-7"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D8D4CC] text-[10px] font-medium text-[#77736C]">
          {number}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-[#232323]">
            {title}
          </span>

          <span className="mt-0.5 block text-xs text-[#9A978F]">
            {description}
          </span>
        </span>

        <span className="text-lg font-light text-[#77736C]">
          {open ? "−" : "+"}
        </span>
      </button>
    );
  };

  const inputClass =
    "w-full rounded-sm border border-[#DEDAD2] bg-white px-3.5 py-2.5 text-sm text-[#232323] outline-none transition placeholder:text-[#AAA59C] focus:border-[#C5A572]";

  const selectClass =
    "w-full rounded-sm border border-[#DEDAD2] bg-white px-3.5 py-2.5 text-sm text-[#232323] outline-none transition focus:border-[#C5A572]";

  const textareaClass =
    "w-full resize-y rounded-sm border border-[#DEDAD2] bg-white px-3.5 py-2.5 text-sm leading-6 text-[#232323] outline-none transition placeholder:text-[#AAA59C] focus:border-[#C5A572]";

  const currentEditingProperty = properties.find(
    (property) => property.id === editingPropertyId,
  );

  const editorTitle = showCreateForm
    ? "Add New Property"
    : (currentEditingProperty?.title ?? "Edit Property");

  const renderEditor = () => (
    <section className="overflow-hidden rounded-sm border border-[#DCD7CE] bg-white shadow-[0_12px_40px_rgba(35,35,35,0.06)]">
      <div className="border-b border-[#ECE9E3] px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#C5A572]">
              {showCreateForm ? "New Listing" : "Editing Property"}
            </p>

            <h2 className="mt-1 truncate font-serif text-2xl font-light text-[#232323]">
              {editorTitle}
            </h2>

            <p className="mt-1 text-sm text-[#77736C]">
              {showCreateForm
                ? "Create the property record first. Once created, its gallery can be managed immediately."
                : "Update the property details from this expanded workspace."}
            </p>
          </div>

          <button
            type="button"
            onClick={closeEditor}
            className="self-start rounded-sm border border-[#D8D4CC] px-4 py-2 text-xs font-medium text-[#4A4A4A] transition hover:border-[#C5A572] hover:text-[#232323]"
          >
            Close
          </button>
        </div>
      </div>

      {saveError && (
        <div className="mx-5 mt-5 rounded-sm border border-[#E4D5C8] bg-[#FBF7F2] px-4 py-3 text-sm text-[#795B43] sm:mx-7">
          {saveError}
        </div>
      )}

      {successMessage && (
        <div className="mx-5 mt-5 rounded-sm border border-[#DCE5D8] bg-[#F4F8F2] px-4 py-3 text-sm text-[#56634F] sm:mx-7">
          {successMessage}
        </div>
      )}

      <div className="divide-y divide-[#ECE9E3]">
        <div>
          {renderSectionHeader(
            "basic",
            "01",
            "Basic Information",
            "The public-facing identity and description.",
          )}

          {activeSection === "basic" && (
            <div className="grid gap-4 px-5 pb-6 sm:grid-cols-2 sm:px-7">
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  Property title
                </span>

                <input
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="e.g. One Riverside Sky"
                  className={inputClass}
                />
              </label>

              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  Short description
                </span>

                <input
                  value={form.short_description}
                  onChange={(event) =>
                    updateForm("short_description", event.target.value)
                  }
                  placeholder="A concise property summary"
                  className={inputClass}
                />
              </label>

              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  Full description
                </span>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  rows={5}
                  placeholder="Full property description..."
                  className={textareaClass}
                />
              </label>
            </div>
          )}
        </div>

        <div>
          {renderSectionHeader(
            "details",
            "02",
            "Property Details",
            "Pricing, type, status, rooms, and completion.",
          )}

          {activeSection === "details" && (
            <div className="grid gap-4 px-5 pb-6 sm:grid-cols-2 lg:grid-cols-3 sm:px-7">
              <label>
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  Property type
                </span>

                <select
                  value={form.property_type}
                  onChange={(event) =>
                    updateForm(
                      "property_type",
                      event.target.value ? Number(event.target.value) : "",
                    )
                  }
                  className={selectClass}
                >
                  <option value="">Select type</option>

                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  Status
                </span>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target.value ? Number(event.target.value) : "",
                    )
                  }
                  className={selectClass}
                >
                  <option value="">Select status</option>

                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  Starting price
                </span>

                <input
                  type="number"
                  min="0"
                  value={form.starting_price}
                  onChange={(event) =>
                    updateForm("starting_price", event.target.value)
                  }
                  placeholder="0"
                  className={inputClass}
                />
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  Available units
                </span>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.available_units}
                  onChange={(event) =>
                    updateForm("available_units", event.target.value)
                  }
                  className={inputClass}
                />

                <span className="mt-1 block text-xs leading-5 text-[#77736C]">
                  Enter 0 when sold out; sold-out properties are hidden from the public site.
                </span>
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  Bedrooms
                </span>

                <input
                  type="number"
                  min="0"
                  value={form.bedrooms}
                  onChange={(event) =>
                    updateForm("bedrooms", event.target.value)
                  }
                  className={inputClass}
                />
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  Bathrooms
                </span>

                <input
                  type="number"
                  min="0"
                  value={form.bathrooms}
                  onChange={(event) =>
                    updateForm("bathrooms", event.target.value)
                  }
                  className={inputClass}
                />
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  Completion date
                </span>

                <input
                  type="date"
                  value={form.completion_date}
                  onChange={(event) =>
                    updateForm("completion_date", event.target.value)
                  }
                  className={inputClass}
                />
              </label>
            </div>
          )}
        </div>

        <div>
          {renderSectionHeader(
            "location",
            "03",
            "Location",
            "Property location and map destination.",
          )}

          {activeSection === "location" && (
            <div className="grid gap-4 px-5 pb-6 sm:grid-cols-2 sm:px-7">
              <label>
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  Location
                </span>

                <select
                  value={form.location}
                  onChange={(event) =>
                    updateForm(
                      "location",
                      event.target.value ? Number(event.target.value) : "",
                    )
                  }
                  className={selectClass}
                >
                  <option value="">Select location</option>

                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  Google Maps URL
                </span>

                <input
                  type="url"
                  value={form.google_maps_url}
                  onChange={(event) =>
                    updateForm("google_maps_url", event.target.value)
                  }
                  placeholder="https://maps.google.com/..."
                  className={inputClass}
                />
              </label>
            </div>
          )}
        </div>

        <div>
          {renderSectionHeader(
            "amenities",
            "04",
            "Amenities",
            "Select the amenities available at this property.",
          )}

          {activeSection === "amenities" && (
            <div className="px-5 pb-6 sm:px-7">
              {loadingOptions ? (
                <p className="text-sm text-[#77736C]">Loading amenities...</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {amenities.map((amenity) => {
                    const selected = form.amenities.includes(amenity.id);

                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`rounded-sm border px-3 py-2.5 text-left text-sm transition ${
                          selected
                            ? "border-[#C5A572] bg-[#FBF8F2] text-[#232323]"
                            : "border-[#ECE9E3] bg-white text-[#77736C] hover:border-[#C5A572]"
                        }`}
                      >
                        <span className="mr-2">{selected ? "✓" : "○"}</span>
                        {amenity.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          {renderSectionHeader(
            "visibility",
            "05",
            "Homepage Visibility",
            "Control publication and homepage placement.",
          )}

          {activeSection === "visibility" && (
            <div className="grid gap-5 px-5 pb-6 sm:px-7 lg:grid-cols-2">
              <div className="rounded-sm border border-[#ECE9E3] bg-[#FAFAF8] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#77736C]">
                  Publication
                </p>

                <div className="mt-3 flex gap-2">
                  {(["draft", "published"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateForm("publication_status", status)}
                      className={`rounded-sm border px-4 py-2 text-xs font-medium capitalize transition ${
                        form.publication_status === status
                          ? "border-[#232323] bg-[#232323] text-white"
                          : "border-[#D8D4CC] bg-white text-[#4A4A4A] hover:border-[#C5A572]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-sm border border-[#ECE9E3] bg-[#FAFAF8] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#77736C]">
                      Homepage
                    </p>

                    <p className="mt-1 text-sm text-[#4A4A4A]">
                      Include this property among the homepage featured
                      listings.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => updateForm("featured", !form.featured)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                      form.featured ? "bg-[#232323]" : "bg-[#D8D4CC]"
                    }`}
                    aria-label="Toggle featured"
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                        form.featured ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {form.featured && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-[#4A4A4A]">
                      Homepage position
                    </label>

                    <select
                      value={form.homepage_order ?? ""}
                      onChange={(event) =>
                        updateForm(
                          "homepage_order",
                          event.target.value
                            ? Number(event.target.value)
                            : null,
                        )
                      }
                      className={`mt-1.5 ${selectClass}`}
                    >
                      <option value="">Automatic position</option>

                      {Array.from({ length: 9 }, (_, index) => index + 1).map(
                        (position) => (
                          <option key={position} value={position}>
                            Position {position}
                          </option>
                        ),
                      )}
                    </select>

                    <p className="mt-2 text-[11px] leading-5 text-[#9A978F]">
                      This is the internal homepage order. The public homepage
                      remains capped at nine featured properties.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          {renderSectionHeader(
            "gallery",
            "06",
            "Gallery",
            "Review and manage the images attached to this property.",
          )}

          {activeSection === "gallery" && (
            <div className="px-5 pb-6 sm:px-7">
              {imageError && (
                <div className="mb-4 rounded-sm border border-[#E4CFC8] bg-[#FBF5F2] px-4 py-3">
                  <p className="text-xs leading-5 text-[#9A5F50]">
                    {imageError}
                  </p>
                </div>
              )}

              <div className="mb-5 flex flex-col gap-3 rounded-sm border border-[#ECE9E3] bg-[#FAFAF8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#77736C]">
                    Property Gallery
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#9A978F]">
                    Add images to this property. Existing images can be replaced
                    or activated/deactivated.
                  </p>
                  {showCreateForm && (
                    <p className="mt-1 text-xs leading-5 text-[#9A978F]">
                      Adding the first image will save this listing as a draft before uploading.
                    </p>
                  )}
                </div>

                {(currentEditingProperty || showCreateForm) && (
                  <label
                    className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm border border-[#C5A572] bg-[#C5A572] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white transition hover:bg-[#B39461] ${
                      imageUploading || saving ? "pointer-events-none opacity-60" : ""
                    }`}
                  >
                    {imageUploading ? "Saving and uploading..." : "Add Image"}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={imageUploading || saving}
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          if (currentEditingProperty) {
                            handleImageUpload(currentEditingProperty.id, file);
                          } else if (showCreateForm) {
                            handleCreatePropertyWithImage(file);
                          }
                        }

                        event.target.value = "";
                      }}
                    />
                  </label>
                )}
              </div>

              {currentEditingProperty?.images &&
              currentEditingProperty.images.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[...currentEditingProperty.images]
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((image, index) => (
                      <div
                        key={image.id}
                        className={`overflow-hidden rounded-sm border bg-white transition ${
                          image.is_active
                            ? "border-[#ECE9E3]"
                            : "border-[#E5E1D9] opacity-70"
                        }`}
                      >
                        <div className="aspect-[4/3] bg-[#F1EFEA]">
                          <img
                            src={image.image}
                            alt={image.alt_text || currentEditingProperty.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="px-3 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] uppercase tracking-[0.1em] text-[#9A978F]">
                              Image {index + 1}
                            </p>

                            <span
                              className={`text-[9px] font-medium uppercase tracking-[0.1em] ${
                                image.is_active
                                  ? "text-[#7C8765]"
                                  : "text-[#9A978F]"
                              }`}
                            >
                              {image.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <label
                              className={`inline-flex cursor-pointer items-center justify-center rounded-sm border border-[#D8D4CC] bg-[#FAFAF8] px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-[#77736C] transition hover:border-[#C5A572] hover:text-[#4A4A4A] ${
                                imageUpdatingId === image.id
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }`}
                            >
                              {imageUpdatingId === image.id
                                ? "Updating..."
                                : "Replace"}

                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={imageUpdatingId === image.id}
                                onChange={(event) => {
                                  const file = event.target.files?.[0];

                                  if (file && currentEditingProperty) {
                                    handleImageUpdate(
                                      currentEditingProperty.id,
                                      image.id,
                                      file,
                                    );
                                  }

                                  event.target.value = "";
                                }}
                              />
                            </label>

                            <button
                              type="button"
                              disabled={imageUpdatingId === image.id}
                              onClick={() => {
                                if (currentEditingProperty) {
                                  handleImageUpdate(
                                    currentEditingProperty.id,
                                    image.id,
                                    undefined,
                                    !image.is_active,
                                  );
                                }
                              }}
                              className="rounded-sm border border-[#D8D4CC] bg-white px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-[#77736C] transition hover:border-[#C5A572] hover:text-[#4A4A4A] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {image.is_active ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="rounded-sm border border-dashed border-[#D8D4CC] bg-[#FAFAF8] px-5 py-10 text-center">
                  <p className="text-sm text-[#77736C]">
                    No gallery images are attached to this property.
                  </p>

                  <p className="mt-1 text-xs text-[#9A978F]">
                    Use the Add Image button above to upload the first image.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          {renderSectionHeader(
            "youtube",
            "07",
            "YouTube",
            "Optional property video.",
          )}

          {activeSection === "youtube" && (
            <div className="px-5 pb-6 sm:px-7">
              <label>
                <span className="mb-1.5 block text-xs font-medium text-[#4A4A4A]">
                  YouTube URL
                </span>

                <input
                  type="url"
                  value={form.youtube_url}
                  onChange={(event) =>
                    updateForm("youtube_url", event.target.value)
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={inputClass}
                />
              </label>
            </div>
          )}
        </div>

        <div>
          {renderSectionHeader(
            "similar",
            "08",
            "Similar Properties",
            "Choose properties to show as related listings.",
          )}

          {activeSection === "similar" && (
            <div className="px-5 pb-6 sm:px-7">
              {(() => {
                const availableSimilarProperties = properties.filter(
                  (property) => property.id !== editingPropertyId,
                );

                const query = similarPropertySearch.trim().toLowerCase();

                const filteredSimilarProperties =
                  availableSimilarProperties.filter((property) => {
                    if (!query) {
                      return true;
                    }

                    return [
                      property.title,
                      property.short_description,
                      property.location?.name,
                      property.property_type?.name,
                      property.status?.name,
                    ].some((value) => value?.toLowerCase().includes(query));
                  });

                if (availableSimilarProperties.length === 0) {
                  return (
                    <p className="text-sm text-[#77736C]">
                      No other properties are available yet.
                    </p>
                  );
                }

                return (
                  <>
                    <div className="mb-4">
                      <input
                        type="search"
                        value={similarPropertySearch}
                        onChange={(event) =>
                          setSimilarPropertySearch(event.target.value)
                        }
                        placeholder="Search properties by name, location, type..."
                        className={inputClass}
                      />

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-[11px] text-[#9A978F]">
                          Search for a property to add as a related listing.
                        </p>

                        <span className="shrink-0 text-[11px] text-[#9A978F]">
                          {filteredSimilarProperties.length} found
                        </span>
                      </div>
                    </div>

                    {filteredSimilarProperties.length === 0 ? (
                      <div className="rounded-sm border border-dashed border-[#D8D4CC] bg-[#FAFAF8] px-5 py-8 text-center">
                        <p className="text-sm text-[#77736C]">
                          No properties match your search.
                        </p>

                        <button
                          type="button"
                          onClick={() => setSimilarPropertySearch("")}
                          className="mt-2 text-xs font-medium text-[#C5A572] transition hover:text-[#A18146]"
                        >
                          Clear search
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {filteredSimilarProperties.map((property) => {
                          const selected = form.similar_properties.includes(
                            property.id,
                          );

                          const propertyImage =
                            property.images?.find((image) => image.is_active)
                              ?.image ??
                            property.images?.[0]?.image ??
                            null;

                          return (
                            <button
                              key={property.id}
                              type="button"
                              onClick={() => toggleSimilarProperty(property.id)}
                              className={`flex items-center gap-3 rounded-sm border p-3 text-left transition ${
                                selected
                                  ? "border-[#C5A572] bg-[#FBF8F2]"
                                  : "border-[#ECE9E3] bg-white hover:border-[#C5A572]"
                              }`}
                            >
                              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-sm bg-[#F1EFEA]">
                                {propertyImage ? (
                                  <img
                                    src={propertyImage}
                                    alt={property.title}
                                    className="h-full w-full object-cover"
                                  />
                                ) : null}
                              </div>

                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-[#232323]">
                                  {property.title}
                                </span>

                                <span className="mt-0.5 block truncate text-xs text-[#77736C]">
                                  {property.location.name}
                                </span>
                              </span>

                              <span
                                className={`shrink-0 text-sm ${
                                  selected ? "text-[#C5A572]" : "text-[#B0ABA2]"
                                }`}
                              >
                                {selected ? "✓" : "○"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>

        <div>
          {renderSectionHeader(
            "tour",
            "09",
            "Virtual Tour",
            "Manage the property's immersive tour experience.",
          )}

          {activeSection === "tour" && (
            <div className="px-5 pb-6 sm:px-7">
              {currentEditingProperty ? (
                <VirtualTourManagement propertyId={currentEditingProperty.id} />
              ) : (
                <div className="rounded-sm border border-dashed border-[#D8D4CC] bg-[#FAFAF8] px-5 py-8 text-center">
                  <p className="text-sm text-[#4A4A4A]">
                    Save this property before setting up its virtual tour.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[#ECE9E3] bg-[#FCFBF8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p className="text-xs text-[#9A978F]">
          {showCreateForm
            ? "The property will receive its URL slug automatically."
            : "Changes are saved directly to the management API."}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={closeEditor}
            disabled={saving}
            className="rounded-sm border border-[#D8D4CC] bg-white px-4 py-2.5 text-xs font-medium text-[#4A4A4A] transition hover:border-[#C5A572] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-sm bg-[#232323] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#2C2C2C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : showCreateForm
                ? "Create Property"
                : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-[clamp(1rem,4vw,2.5rem)] py-[clamp(2rem,5vw,4rem)]">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-[clamp(2rem,4vw,3rem)] flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-[#C5A572]">
              Website Management
            </p>

            <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-tight text-[#232323]">
              Property Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4A4A4A] sm:text-base">
              Manage your property portfolio, homepage visibility, media, and
              virtual experiences.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="w-full rounded-sm bg-[#232323] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2C2C2C] sm:w-auto"
          >
            + Add Property
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["Properties", properties.length.toString()],
            ["Published", publishedCount.toString()],
            ["Featured", featuredCount.toString()],
            ["Homepage Slots", `${homepageSlots} / 9`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-sm border border-[#ECE9E3] bg-white px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[#77736C]">
                {label}
              </p>

              <p className="mt-2 text-xl font-medium text-[#232323]">{value}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search properties..."
              className={inputClass}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((current) => !current)}
            className="rounded-sm border border-[#ECE9E3] bg-white px-5 py-3 text-sm font-medium text-[#4A4A4A] transition hover:border-[#C5A572]"
          >
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {showFilters && (
          <div className="mb-8 grid gap-3 rounded-sm border border-[#ECE9E3] bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
            <select
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
              className={selectClass}
            >
              <option value="">All Locations</option>

              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className={selectClass}
            >
              <option value="">All Property Types</option>

              {propertyTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={selectClass}
            >
              <option value="">All Statuses</option>

              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>

            <select
              value={visibilityFilter}
              onChange={(event) => setVisibilityFilter(event.target.value)}
              className={selectClass}
            >
              <option value="all">All Visibility</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        )}

        {showCreateForm && <div className="mb-8">{renderEditor()}</div>}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-[#232323]">Properties</h2>

            <span className="text-sm text-[#77736C]">
              {loading
                ? "Loading..."
                : `${filteredProperties.length} ${
                    filteredProperties.length === 1 ? "property" : "properties"
                  }`}
            </span>
          </div>

          {loading && (
            <div className="rounded-sm border border-[#ECE9E3] bg-white px-6 py-16 text-center">
              <p className="text-sm text-[#77736C]">Loading properties...</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-sm border border-[#ECE9E3] bg-white px-6 py-16 text-center">
              <p className="text-sm text-[#77736C]">{error}</p>
            </div>
          )}

          {!loading && !error && filteredProperties.length === 0 && (
            <div className="rounded-sm border border-dashed border-[#D8D4CC] bg-white px-6 py-16 text-center">
              <p className="text-sm text-[#77736C]">
                No properties match your search.
              </p>
            </div>
          )}

          {!loading && !error && filteredProperties.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredProperties.map((property) => {
                const sortedImages = [...(property.images ?? [])].sort(
                  (a, b) => a.display_order - b.display_order,
                );

                const image =
                  sortedImages.find((propertyImage) => propertyImage.is_active)
                    ?.image ??
                  sortedImages[0]?.image ??
                  null;

                const isEditing = editingPropertyId === property.id;

                return (
                  <article
                    key={property.id}
                    className={`overflow-hidden rounded-sm border border-[#ECE9E3] bg-white transition-all ${
                      isEditing ? "lg:col-span-2" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div
                        className={`w-full shrink-0 bg-[#F1EFEA] sm:w-52 ${
                          isEditing ? "h-64 sm:h-72" : "h-48 sm:h-auto"
                        }`}
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={property.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full min-h-48 items-center justify-center text-xs text-[#9A978F]">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col p-5">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-medium text-[#232323]">
                              {property.title}
                            </h3>

                            <p className="mt-1 text-sm text-[#77736C]">
                              {property.location.name}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] ${
                              property.publication_status === "published"
                                ? "bg-[#F1F5EF] text-[#56634F]"
                                : "bg-[#F3F1ED] text-[#77736C]"
                            }`}
                          >
                            {property.publication_status}
                          </span>
                        </div>

                        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#77736C]">
                          <span>{property.property_type.name}</span>

                          <span>{property.bedrooms} beds</span>

                          <span>{property.bathrooms} baths</span>

                          <span>
                            {property.available_units === 0
                              ? "Sold out"
                              : `${property.available_units} units`}
                          </span>

                          {property.featured && (
                            <span className="text-[#A18146]">Featured</span>
                          )}
                        </div>

                        <div className="mt-auto flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-[#232323]">
                            KES{" "}
                            {Number(property.starting_price).toLocaleString()}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              isEditing ? closeEditor() : openEditor(property)
                            }
                            className="rounded-sm border border-[#D8D4CC] px-4 py-2 text-xs font-medium text-[#4A4A4A] transition hover:border-[#C5A572] hover:text-[#232323]"
                          >
                            {isEditing ? "Close" : "Edit"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="border-t border-[#ECE9E3]">
                        {renderEditor()}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
          {!loading && !error && propertyPage && propertyPage.count > 0 && (
            <div className="mt-6 flex items-center justify-between border-t border-[#ECE9E3] pt-4">
              <p className="text-xs text-[#77736C]">
                Page {currentPage} of {Math.ceil(propertyPage.count / 12)}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadProperties(currentPage - 1)}
                  disabled={!propertyPage.previous || loading}
                  className="rounded-sm border border-[#D8D4CC] px-4 py-2 text-xs font-medium text-[#4A4A4A] transition hover:border-[#C5A572] hover:text-[#232323] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => loadProperties(currentPage + 1)}
                  disabled={!propertyPage.next || loading}
                  className="rounded-sm border border-[#D8D4CC] px-4 py-2 text-xs font-medium text-[#4A4A4A] transition hover:border-[#C5A572] hover:text-[#232323] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default PropertyManagement;
