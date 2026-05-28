"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import GallineroModal from "./GallineroModal.jsx";
import VaqueraModal from "./VaqueraModal.jsx";
import { CosmicBackground } from "../../components/CosmicBackground";

export default function GrassMapWithAnimals() {
    // Datos para la grilla de “grama”
    const ROWS = 15;
    const COLS = 15;
    const TILE_SIZE = 60;
    const ZOOM = 1.35; // zoom para acercar el mapa
    const [showGallineroModal, setShowGallineroModal] = useState(false);
    const [showVaqueraModal, setShowVaqueraModal] = useState(false);

    // Conversión de coordenadas de grilla a píxeles en el plano isométrico
    const isoToPixel = (x, y) => {
        const left = (x - y) * (TILE_SIZE / 2) + (COLS * TILE_SIZE) / 2 - TILE_SIZE / 2;
        const top = (x + y) * (TILE_SIZE / 4);
        return { left, top };
    };

    // Posiciones base para las construcciones
    const gallineroPos = { x: Math.floor(COLS / 2) - 4, y: Math.floor(ROWS / 2) - 2 };
    const vaqueraPos = { x: Math.floor(COLS / 2) + 4, y: Math.floor(ROWS / 2) + 2 };

    const containerWidth = (COLS + ROWS) * (TILE_SIZE / 2);
    const containerHeight = (COLS + ROWS) * (TILE_SIZE / 4);

    const map = useMemo(
        () => Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => "grama")),
        [ROWS, COLS]
    );

    return (
        <CosmicBackground scrollable className="w-[100vw] h-[100vh] pb-24">
            <div
                className="relative bg-space-deep bg-stars-animation bg-cosmic-nebula"
                style={{
                    width: `${containerWidth}px`,
                    height: `${containerHeight + TILE_SIZE}px`,
                    transformOrigin: "top left",
                    transform: `scale(${ZOOM})`,
                    marginTop: 100,
                }}
            >
                {/* tiles del suelo */}
                {map.map((row, y) =>
                    row.map((tile, x) => {
                        const left =
                            (x - y) * (TILE_SIZE / 2) + (COLS * TILE_SIZE) / 2 - TILE_SIZE / 2;
                        const top = (x + y) * (TILE_SIZE / 4);

                        return (
                            <div
                                key={`tile-${x}-${y}`}
                                className="absolute"
                                style={{
                                    width: `${TILE_SIZE}px`,
                                    height: `${TILE_SIZE}px`,
                                    left: `${left}px`,
                                    top: `${top}px`,
                                    zIndex: y,
                                    pointerEvents: "none",
                                }}
                            >
                                <Image
                                    src={`/terreno.png`}
                                    alt="grama"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                        );
                    })
                )}

                {/* Construcción: Gallinero (click para abrir modal) */}
                {(() => {
                    const { left, top } = isoToPixel(gallineroPos.x, gallineroPos.y);
                    return (
                        <div
                            style={{ position: "absolute", left, top, zIndex: gallineroPos.y + 800, cursor: "pointer" }}
                            onClick={() => setShowGallineroModal(true)}
                        >
                            <Image src="/gallinero.png" alt="Gallinero" width={135} height={135} />
                        </div>
                    );
                })()}

                {/* Construcción: Vaquera (click para abrir modal) */}
                {/* {(() => {
          const { left, top } = isoToPixel(vaqueraPos.x, vaqueraPos.y);
          return (
            <div
              style={{ position: "absolute", left, top, zIndex: vaqueraPos.y + 800, cursor: "pointer" }}
              onClick={() => setShowVaqueraModal(true)}
            >
              <Image src="/vaquera.png" alt="Vaquera" width={150} height={150} />
            </div>
          );
        })()} */}
            </div>

            {/* Modal Gallinero */}
            {/* {showGallineroModal && (
                <GallineroModal isOpen={showGallineroModal} onClose={() => setShowGallineroModal(false)} />
            )} */}

            {/* Modal Vaquera */}
            {/* {showVaqueraModal && (
                <VaqueraModal isOpen={showVaqueraModal} onClose={() => setShowVaqueraModal(false)} />
            )} */}

        </CosmicBackground>
    );
}
