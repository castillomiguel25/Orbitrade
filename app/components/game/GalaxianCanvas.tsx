'use client';

import React from 'react';

export default function GalaxianCanvas({ canvasRef, width, height, onPointerDown, onPointerMove, onPointerUp }: Props) {
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ touchAction: 'none', width: '100%', maxWidth: 480, height: 'auto', display: 'block', margin: '0 auto' }}
    />
  );
}

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
  onPointerDown?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp?: (e: React.PointerEvent<HTMLCanvasElement>) => void;
};
