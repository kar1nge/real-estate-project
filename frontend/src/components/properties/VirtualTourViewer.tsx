import { useEffect, useMemo, useRef, useState } from "react";
import type { Property, TourScene } from "../../types/property";
import AnimatedImage from "../ui/AnimatedImage";

declare global {
  interface Window {
    pannellum: any;
  }
}

interface VirtualTourViewerProps {
  property: Property;
}

let pannellumLoaded: Promise<void> | null = null;

function loadPannellum() {
  if (window.pannellum) return Promise.resolve();
  if (pannellumLoaded) return pannellumLoaded;

  pannellumLoaded = new Promise<void>((resolve, reject) => {
    if (!document.querySelector("#pannellum-css")) {
      const link = document.createElement("link");
      link.id = "pannellum-css";
      link.rel = "stylesheet";
      link.href = `${import.meta.env.BASE_URL}pannellum/pannellum.css`;
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = `${import.meta.env.BASE_URL}pannellum/pannellum.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      pannellumLoaded = null;
      reject(new Error("Could not load the 360° tour viewer."));
    };
    document.body.appendChild(script);
  });

  return pannellumLoaded;
}

function VirtualTourViewer({ property }: VirtualTourViewerProps) {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewerInstanceRef = useRef<any>(null);
  const [activeSceneId, setActiveSceneId] = useState<number | null>(null);
  const [viewerError, setViewerError] = useState("");

  const scenes = useMemo(
    () =>
      [...(property.virtual_tour?.scenes ?? [])].sort(
        (a, b) => a.display_order - b.display_order || a.id - b.id,
      ),
    [property.virtual_tour?.scenes],
  );
  const activeScene = scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0];
  const sceneConfigs = useMemo(() => {
    const configs: Record<string, Record<string, unknown>> = {};
    scenes.forEach((scene: TourScene) => {
      configs[String(scene.id)] = {
        title: scene.name,
        type: "equirectangular",
        panorama: scene.image,
        hotSpots: (scene.hotspots ?? []).map((hotspot) => ({
          pitch: hotspot.pitch,
          yaw: hotspot.yaw,
          type: "scene",
          text: hotspot.label,
          sceneId: String(hotspot.target_scene),
        })),
      };
    });
    return configs;
  }, [scenes]);

  useEffect(() => {
    if (!scenes.length || !viewerRef.current) return;
    let cancelled = false;

    setViewerError("");
    loadPannellum()
      .then(() => {
        if (cancelled || !viewerRef.current) return;
        if (viewerInstanceRef.current) {
          try {
            viewerInstanceRef.current.destroy();
          } catch {
            // The viewer may already have been torn down by route navigation.
          }
          viewerInstanceRef.current = null;
        }
        viewerRef.current.innerHTML = "";

        const viewer = window.pannellum.viewer(viewerRef.current, {
          default: {
            firstScene: String(scenes[0].id),
            autoLoad: true,
            showControls: true,
            showFullscreenCtrl: true,
            showZoomCtrl: true,
            draggable: true,
            mouseZoom: true,
            keyboardZoom: true,
            hfov: 100,
            pitch: 0,
            yaw: 0,
            sceneFadeDuration: 500,
          },
          scenes: sceneConfigs,
        });

        viewer.on("scenechange", (sceneId: string) => {
          setActiveSceneId(Number(sceneId));
        });
        viewerInstanceRef.current = viewer;
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          const message = reason instanceof Error ? reason.message : "The tour could not be loaded.";
          setViewerError(message);
          console.error("Failed to initialise Pannellum:", reason);
        }
      });

    return () => {
      cancelled = true;
      if (viewerInstanceRef.current) {
        try {
          viewerInstanceRef.current.destroy();
        } catch {
          // Ignore cleanup errors during unmount.
        }
        viewerInstanceRef.current = null;
      }
    };
  }, [property.virtual_tour?.id, scenes, sceneConfigs]);

  if (!activeScene) {
    return (
      <div className="flex h-full min-h-[16rem] items-center justify-center bg-neutral-950">
        <p className="text-sm text-white/40">Virtual tour coming soon.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-neutral-950">
      <div className="relative min-h-0 flex-1">
        <div ref={viewerRef} className="absolute inset-0 h-full w-full" />
        {viewerError && (
          <p role="alert" className="absolute inset-x-4 top-4 rounded bg-black/75 px-4 py-3 text-sm text-white">
            {viewerError}
          </p>
        )}
      </div>

      <div className="shrink-0 border-t border-white/10 bg-neutral-950 px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Current view</p>
        <p className="mt-1 text-sm text-white">{activeScene.name}</p>
      </div>

      {scenes.length > 1 && (
        <div className="shrink-0 border-t border-white/10 bg-neutral-950 p-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {scenes.map((scene) => {
              const selected = scene.id === activeScene.id;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => viewerInstanceRef.current?.loadScene(String(scene.id))}
                  aria-current={selected ? "true" : undefined}
                  className={`group relative shrink-0 overflow-hidden rounded-xl border transition ${selected ? "border-white" : "border-white/10 hover:border-white/40"}`}
                >
                  <AnimatedImage src={scene.image} alt={scene.name} frameClassName="h-16 w-24" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  <span className={`absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-left text-[9px] text-white ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    {scene.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default VirtualTourViewer;
