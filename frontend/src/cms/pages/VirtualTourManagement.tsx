import { useEffect, useMemo, useState } from "react";
import type { TourHotspot, VirtualTour } from "../../types/property";
import {
  createTourHotspot,
  createTourScene,
  createVirtualTour,
  getVirtualTourForProperty,
  updateTourHotspot,
  updateTourScene,
  updateVirtualTour,
} from "../services/virtualTourManagementService";

interface Props {
  propertyId: number;
}

interface HotspotDraft {
  label: string;
  yaw: number | null;
  pitch: number | null;
  target_scene: number | "";
}

const emptyHotspot: HotspotDraft = {
  label: "",
  yaw: null,
  pitch: null,
  target_scene: "",
};

const inputClass =
  "w-full rounded-sm border border-[#DEDAD2] bg-white px-3 py-2.5 text-sm text-[#232323] outline-none focus:border-[#C5A572]";

export default function VirtualTourManagement({ propertyId }: Props) {
  const [tour, setTour] = useState<VirtualTour | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [tourTitle, setTourTitle] = useState("Virtual Tour");
  const [activeSceneId, setActiveSceneId] = useState<number | null>(null);
  const [newSceneName, setNewSceneName] = useState("");
  const [newSceneImage, setNewSceneImage] = useState<File | null>(null);
  const [sceneName, setSceneName] = useState("");
  const [sceneOrder, setSceneOrder] = useState(1);
  const [replacementImage, setReplacementImage] = useState<File | null>(null);
  const [hotspotDraft, setHotspotDraft] = useState<HotspotDraft>(emptyHotspot);
  const [editingHotspotId, setEditingHotspotId] = useState<number | null>(null);

  const scenes = useMemo(
    () =>
      [...(tour?.scenes ?? [])].sort(
        (a, b) => a.display_order - b.display_order || a.id - b.id,
      ),
    [tour?.scenes],
  );
  const activeScene = scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0];
  const targetScenes = scenes.filter((scene) => scene.id !== activeScene?.id);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getVirtualTourForProperty(propertyId)
      .then((value) => {
        if (!active) return;
        setTour(value);
        setTourTitle(value?.title ?? "Virtual Tour");
        setActiveSceneId(value?.scenes[0]?.id ?? null);
      })
      .catch((reason) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Could not load the tour.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [propertyId]);

  useEffect(() => {
    if (!activeScene) return;
    setSceneName(activeScene.name);
    setSceneOrder(activeScene.display_order);
    setReplacementImage(null);
    setHotspotDraft(emptyHotspot);
    setEditingHotspotId(null);
  }, [activeScene?.id, activeScene?.name, activeScene?.display_order]);

  async function refreshTour(preferredSceneId?: number) {
    const updated = await getVirtualTourForProperty(propertyId);
    setTour(updated);
    setTourTitle(updated?.title ?? "Virtual Tour");
    const preferredStillExists = updated?.scenes.some(
      (scene) => scene.id === preferredSceneId,
    );
    setActiveSceneId(
      preferredStillExists ? preferredSceneId! : updated?.scenes[0]?.id ?? null,
    );
  }

  async function runSave(action: () => Promise<unknown>, success: string) {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await action();
      setMessage(success);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save the tour.");
    } finally {
      setSaving(false);
    }
  }

  function handleCreateTour() {
    if (!tourTitle.trim()) {
      setError("Enter a title for the virtual tour.");
      return;
    }
    void runSave(async () => {
      const created = await createVirtualTour(propertyId, tourTitle.trim());
      setTour(created);
      setTourTitle(created.title);
      setActiveSceneId(created.scenes[0]?.id ?? null);
    }, "Virtual tour created.");
  }

  function handleSaveTourTitle() {
    if (!tourTitle.trim()) {
      setError("Enter a title for the virtual tour.");
      return;
    }
    void runSave(async () => {
      const updated = await updateVirtualTour(propertyId, tourTitle.trim());
      setTour(updated);
    }, "Tour title saved.");
  }

  function handleAddScene() {
    if (!tour) return;
    if (!newSceneName.trim() || !newSceneImage) {
      setError("Enter a scene name and choose a 360° panorama image.");
      return;
    }
    void runSave(async () => {
      const created = await createTourScene(tour.id, newSceneName.trim(), newSceneImage);
      await refreshTour(created.id);
      setNewSceneName("");
      setNewSceneImage(null);
      const input = document.getElementById("new-tour-scene-image") as HTMLInputElement | null;
      if (input) input.value = "";
    }, "Tour scene added.");
  }

  function handleSaveScene() {
    if (!activeScene || !sceneName.trim()) {
      setError("Enter a name for this scene.");
      return;
    }
    void runSave(async () => {
      await updateTourScene(activeScene.id, {
        name: sceneName.trim(),
        display_order: sceneOrder,
        image: replacementImage ?? undefined,
      });
      await refreshTour(activeScene.id);
      setReplacementImage(null);
    }, "Scene details saved.");
  }

  function editHotspot(hotspot: TourHotspot) {
    setEditingHotspotId(hotspot.id);
    setHotspotDraft({
      label: hotspot.label,
      yaw: hotspot.yaw,
      pitch: hotspot.pitch,
      target_scene: hotspot.target_scene,
    });
    setError("");
    setMessage("");
  }

  function placeHotspot(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const vertical = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    setHotspotDraft((current) => ({
      ...current,
      yaw: Number((horizontal * 360 - 180).toFixed(1)),
      pitch: Number((90 - vertical * 180).toFixed(1)),
    }));
  }

  function handleSaveHotspot() {
    if (!activeScene || !hotspotDraft.label.trim() || hotspotDraft.target_scene === "" || hotspotDraft.yaw === null || hotspotDraft.pitch === null) {
      setError("Enter a label, choose a destination scene, and click the panorama to place the hotspot.");
      return;
    }
    const values = {
      label: hotspotDraft.label.trim(),
      target_scene: Number(hotspotDraft.target_scene),
      yaw: hotspotDraft.yaw,
      pitch: hotspotDraft.pitch,
    };
    void runSave(async () => {
      if (editingHotspotId === null) {
        await createTourHotspot(activeScene.id, values);
      } else {
        await updateTourHotspot(editingHotspotId, values);
      }
      await refreshTour(activeScene.id);
      setHotspotDraft(emptyHotspot);
      setEditingHotspotId(null);
    }, editingHotspotId === null ? "Hotspot added." : "Hotspot updated.");
  }

  if (loading) {
    return <p className="py-6 text-sm text-[#77736C]">Loading virtual tour…</p>;
  }

  return (
    <div className="space-y-5">
      {(error || message) && (
        <p
          role={error ? "alert" : "status"}
          className={`rounded-sm border px-4 py-3 text-sm ${error ? "border-[#E4CFC8] bg-[#FBF5F2] text-[#9A5F50]" : "border-[#CED9C7] bg-[#F5F8F2] text-[#596B4E]"}`}
        >
          {error || message}
        </p>
      )}

      <section className="rounded-sm border border-[#ECE9E3] bg-[#FAFAF8] p-4">
        <label className="block text-xs font-medium uppercase tracking-[0.12em] text-[#77736C]">
          Tour title
          <input
            value={tourTitle}
            onChange={(event) => setTourTitle(event.target.value)}
            className={`${inputClass} mt-2 max-w-xl normal-case tracking-normal`}
            maxLength={255}
          />
        </label>
        <button
          type="button"
          onClick={tour ? handleSaveTourTitle : handleCreateTour}
          disabled={saving}
          className="mt-3 rounded-sm bg-[#232323] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : tour ? "Save tour title" : "Create virtual tour"}
        </button>
      </section>

      {tour && (
        <>
          <section className="rounded-sm border border-[#ECE9E3] bg-white p-4">
            <div className="mb-4">
              <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-[#77736C]">
                Tour scenes
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#9A978F]">
                Upload one 2:1 equirectangular 360° panorama per scene.
              </p>
            </div>
            {scenes.length > 0 && (
              <div className="mb-5 flex gap-3 overflow-x-auto pb-2">
                {scenes.map((scene) => (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => setActiveSceneId(scene.id)}
                    className={`w-36 shrink-0 overflow-hidden rounded-sm border text-left ${activeScene?.id === scene.id ? "border-[#C5A572] ring-1 ring-[#C5A572]" : "border-[#ECE9E3]"}`}
                  >
                    <img src={scene.image} alt={scene.name} className="h-20 w-full object-cover" />
                    <span className="block truncate px-2 py-2 text-xs text-[#4A4A4A]">
                      {scene.display_order}. {scene.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
              <label className="block text-xs text-[#77736C]">
                New scene name
                <input value={newSceneName} onChange={(event) => setNewSceneName(event.target.value)} className={`${inputClass} mt-1.5`} />
              </label>
              <label className="block text-xs text-[#77736C]">
                360° image
                <input id="new-tour-scene-image" type="file" accept="image/*" onChange={(event) => setNewSceneImage(event.target.files?.[0] ?? null)} className="mt-1.5 block w-full text-xs file:mr-3 file:rounded-sm file:border-0 file:bg-[#ECE9E3] file:px-3 file:py-2 file:text-xs" />
              </label>
              <button type="button" onClick={handleAddScene} disabled={saving || !tour} className="rounded-sm border border-[#C5A572] bg-[#C5A572] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white disabled:opacity-50">
                Add scene
              </button>
            </div>
          </section>

          {activeScene && (
            <section className="rounded-sm border border-[#ECE9E3] bg-white p-4">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-[#77736C]">Hotspots · {activeScene.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-[#9A978F]">Click the panorama to position a hotspot, then choose which scene it opens.</p>
                </div>
                <button type="button" onClick={() => { setEditingHotspotId(null); setHotspotDraft(emptyHotspot); setError(""); setMessage(""); }} className="rounded-sm border border-[#D8D4CC] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.08em] text-[#77736C]">
                  New hotspot
                </button>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <div className="relative cursor-crosshair overflow-hidden rounded-sm bg-[#232323]" onClick={placeHotspot}>
                    <img src={activeScene.image} alt={`${activeScene.name} panorama placement`} className="block aspect-[2/1] w-full object-fill" />
                    {activeScene.hotspots.map((hotspot) => (
                      <button
                        key={hotspot.id}
                        type="button"
                        title={`${hotspot.label} → ${hotspot.target_scene_name}`}
                        onClick={(event) => { event.stopPropagation(); editHotspot(hotspot); }}
                        style={{ left: `${((hotspot.yaw + 180) / 360) * 100}%`, top: `${((90 - hotspot.pitch) / 180) * 100}%` }}
                        className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#C5A572] text-xs font-bold text-white shadow-lg ${editingHotspotId === hotspot.id ? "ring-4 ring-white/60" : ""}`}
                      >
                        ↗
                      </button>
                    ))}
                    {hotspotDraft.yaw !== null && hotspotDraft.pitch !== null && (
                      <span style={{ left: `${((hotspotDraft.yaw + 180) / 360) * 100}%`, top: `${((90 - hotspotDraft.pitch) / 180) * 100}%` }} className="pointer-events-none absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#232323] text-xs font-bold text-white shadow-lg">+</span>
                    )}
                  </div>
                  <p className="mt-2 text-[10px] leading-5 text-[#9A978F]">Position is mapped from the panorama image. Use an equirectangular 2:1 image for accurate placement.</p>
                </div>

                <div className="space-y-4">
                  {activeScene.hotspots.length > 0 ? (
                    <div>
                      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.1em] text-[#9A978F]">Saved hotspots</p>
                      <ul className="space-y-2">
                        {activeScene.hotspots.map((hotspot) => (
                          <li key={hotspot.id}>
                            <button type="button" onClick={() => editHotspot(hotspot)} className={`w-full rounded-sm border px-3 py-2 text-left text-xs ${editingHotspotId === hotspot.id ? "border-[#C5A572] bg-[#FAFAF8]" : "border-[#ECE9E3]"}`}>
                              <span className="block font-medium text-[#232323]">{hotspot.label}</span>
                              <span className="mt-1 block text-[#9A978F]">Opens {hotspot.target_scene_name}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="rounded-sm border border-dashed border-[#D8D4CC] px-3 py-4 text-xs text-[#9A978F]">No hotspots on this scene yet.</p>
                  )}

                  <label className="block text-xs text-[#77736C]">
                    Hotspot label
                    <input value={hotspotDraft.label} onChange={(event) => setHotspotDraft((current) => ({ ...current, label: event.target.value }))} maxLength={100} className={`${inputClass} mt-1.5`} placeholder="e.g. View the living room" />
                  </label>
                  <label className="block text-xs text-[#77736C]">
                    Destination scene
                    <select value={hotspotDraft.target_scene} onChange={(event) => setHotspotDraft((current) => ({ ...current, target_scene: event.target.value ? Number(event.target.value) : "" }))} className={`${inputClass} mt-1.5`}>
                      <option value="">Choose a scene</option>
                      {targetScenes.map((scene) => <option key={scene.id} value={scene.id}>{scene.name}</option>)}
                    </select>
                  </label>
                  {targetScenes.length === 0 && <p className="text-[10px] leading-5 text-[#9A978F]">Add another scene before creating a navigation hotspot.</p>}
                  <p className="text-[10px] text-[#9A978F]">{hotspotDraft.yaw === null ? "Click the panorama to set position." : `Position: yaw ${hotspotDraft.yaw}°, pitch ${hotspotDraft.pitch}°`}</p>
                  <button type="button" onClick={handleSaveHotspot} disabled={saving || targetScenes.length === 0} className="w-full rounded-sm bg-[#232323] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white disabled:opacity-50">
                    {saving ? "Saving…" : editingHotspotId === null ? "Add hotspot" : "Save hotspot"}
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeScene && (
            <section className="grid gap-3 rounded-sm border border-[#ECE9E3] bg-[#FAFAF8] p-4 sm:grid-cols-[1fr_8rem_1fr_auto] sm:items-end">
              <label className="block text-xs text-[#77736C]">
                Selected scene name
                <input value={sceneName} onChange={(event) => setSceneName(event.target.value)} className={`${inputClass} mt-1.5`} />
              </label>
              <label className="block text-xs text-[#77736C]">
                Order
                <input type="number" min={1} value={sceneOrder} onChange={(event) => setSceneOrder(Math.max(1, Number(event.target.value)))} className={`${inputClass} mt-1.5`} />
              </label>
              <label className="block text-xs text-[#77736C]">
                Replace panorama
                <input type="file" accept="image/*" onChange={(event) => setReplacementImage(event.target.files?.[0] ?? null)} className="mt-1.5 block w-full text-xs file:mr-2 file:rounded-sm file:border-0 file:bg-[#ECE9E3] file:px-2 file:py-2" />
              </label>
              <button type="button" onClick={handleSaveScene} disabled={saving} className="rounded-sm border border-[#D8D4CC] bg-white px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[#4A4A4A] disabled:opacity-50">Save scene</button>
            </section>
          )}
        </>
      )}
    </div>
  );
}
