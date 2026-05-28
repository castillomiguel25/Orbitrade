"use client";

import React, { useEffect, useState } from 'react';

interface PixelIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export function PixelIcon({ name, className = '', style }: PixelIconProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const sanitizeSvg = (svg: string) => {
    return svg
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, '')
      .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
      .replace(/\s(xlink:href|href)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, '')
      .replace(/\s(xlink:href|href)\s*=\s*(['"])\s*data:[\s\S]*?\2/gi, '');
  };

  useEffect(() => {
    // Intentar cargar el icono SVG
    fetch(`/icons/${name}.svg`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Icon ${name} not found`);
        }
        return response.text();
      })
      .then(svgText => {
        setSvgContent(sanitizeSvg(svgText));
      })
      .catch(error => {
        console.error('Error loading icon:', error);
      }); 
  }, [name]);

  return (
    <div 
      className={`pixel-icon inline-block ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
} 
