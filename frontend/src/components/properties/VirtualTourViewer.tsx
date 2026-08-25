import { useEffect, useRef, useState } from "react";

import type { Property } from "../../types/property";

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
    if (window.pannellum) {
        return Promise.resolve();
    }

    if (pannellumLoaded) {
        return pannellumLoaded;
    }

    pannellumLoaded = new Promise((resolve, reject) => {
        // CSS
        if (!document.querySelector("#pannellum-css")) {
            const link = document.createElement("link");

            link.id = "pannellum-css";
            link.rel = "stylesheet";
            link.href = "/pannellum/pannellum.css";

            document.head.appendChild(link);
        }

        // JavaScript
        const script = document.createElement("script");

        script.src = "/pannellum/pannellum.js";
        script.async = true;

        script.onload = () => resolve();

        script.onerror = () => {
            reject(
                new Error("Could not load Pannellum.")
            );
        };

        document.body.appendChild(script);
    });

    return pannellumLoaded;
}

function VirtualTourViewer({
    property,
}: VirtualTourViewerProps) {
    const viewerRef = useRef<HTMLDivElement | null>(null);
    const viewerInstanceRef = useRef<any>(null);

    const scenes = property.virtual_tour?.scenes ?? [];

    const [activeSceneId, setActiveSceneId] = useState<number | null>(
        scenes[0]?.id ?? null
    );

    const activeScene =
        scenes.find((scene) => scene.id === activeSceneId) ??
        scenes[0];

    useEffect(() => {
        if (!viewerRef.current || !activeScene?.image) {
            return;
        }

        let cancelled = false;

        loadPannellum()
            .then(() => {
                if (
                    cancelled ||
                    !viewerRef.current ||
                    !activeScene?.image
                ) {
                    return;
                }

                if (viewerInstanceRef.current) {
                    try {
                        viewerInstanceRef.current.destroy();
                    } catch {
                        // Ignore destroyed viewer
                    }

                    viewerInstanceRef.current = null;
                }

                viewerRef.current.innerHTML = "";

                const viewer = window.pannellum.viewer(
                    viewerRef.current,
                    {
                        type: "equirectangular",
                        panorama: activeScene.image,

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

                        autoRotate: 0,
                    }
                );

                viewerInstanceRef.current = viewer;
            })
            .catch((error) => {
                console.error(
                    "Failed to initialise Pannellum:",
                    error
                );
            });

        return () => {
            cancelled = true;

            if (viewerInstanceRef.current) {
                try {
                    viewerInstanceRef.current.destroy();
                } catch {
                    // Ignore cleanup errors
                }

                viewerInstanceRef.current = null;
            }
        };
    }, [activeScene?.id, activeScene?.image]);

    if (!activeScene) {
        return (
            <div className="flex h-full min-h-[16rem] items-center justify-center bg-neutral-950">
                <p className="text-sm text-white/40">
                    Virtual tour coming soon.
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-neutral-950">

            {/* 360° viewer */}
            <div className="relative min-h-0 flex-1">
                <div
                    ref={viewerRef}
                    className="absolute inset-0 h-full w-full"
                />
            </div>

            {/* Current scene */}
            <div className="shrink-0 border-t border-white/10 bg-neutral-950 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                    Current view
                </p>

                <p className="mt-1 text-sm text-white">
                    {activeScene.name}
                </p>
            </div>

            {/* Scene selector */}
            {scenes.length > 1 && (
                <div className="shrink-0 border-t border-white/10 bg-neutral-950 p-3">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {scenes.map((scene) => {
                            const isActive =
                                scene.id === activeScene.id;

                            return (
                                <button
                                    key={scene.id}
                                    type="button"
                                    onClick={() =>
                                        setActiveSceneId(scene.id)
                                    }
                                    className={`
                                        group
                                        relative
                                        shrink-0
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        transition
                                        ${
                                            isActive
                                                ? "border-white"
                                                : "border-white/10 hover:border-white/40"
                                        }
                                    `}
                                >
                                    <img
                                        src={scene.image}
                                        alt={scene.name}
                                        className="h-16 w-24 object-cover transition duration-300 group-hover:scale-105"
                                    />

                                    <span
                                        className={`
                                            absolute inset-x-0 bottom-0
                                            bg-black/60
                                            px-2 py-1
                                            text-left
                                            text-[9px]
                                            text-white
                                            ${
                                                isActive
                                                    ? "opacity-100"
                                                    : "opacity-0 group-hover:opacity-100"
                                            }
                                        `}
                                    >
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