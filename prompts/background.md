# Prompt — App Background (Gemini)

## Uso
Fondo general de la aplicación web Orbitrade. Se usará como `background-image` fijo en pantalla completa, oscurecido ligeramente con una capa semitransparente encima para que el contenido sea legible.

**Dimensiones sugeridas:** 1920 × 1080 px (landscape), o 1080 × 1920 px (portrait/mobile version)  
**Formato:** PNG o WebP  
**Nombre de archivo sugerido:** `public/bg-app.png`

---

## Prompt (en inglés para mejor resultado en Gemini)

```
Ultra-wide cinematic photo of an industrial energy infrastructure interior at night.
A massive power generation facility: rows of large turbine housings and electrical
switchgear panels stretch into the distance under extremely high ceilings.
The dominant color palette is deep charcoal and anthracite grey (#0E1116 tones),
with warm amber and gold accent lighting (#F5A524) emanating from status indicator
strips, glowing gauge displays, and recessed ceiling spotlights.
No green tones. No neon. No sci-fi or futuristic elements.
The mood is industrial premium — serious, precise, powerful.
The scene is empty of people, slightly dark, with subtle volumetric light rays
filtering through high industrial windows.
Depth of field: sharp in the foreground equipment, soft and hazy deep background.
The overall feel is a real-world control center for a large-scale energy operation.
Photorealistic. 8K quality. Cinematic wide angle lens.
```

---

## Capa CSS a aplicar encima

```css
background-image: url('/bg-app.png');
background-size: cover;
background-position: center;
background-attachment: fixed;
```

Añade un overlay en el `body` o en un `div` encima:

```css
background: linear-gradient(
  to bottom,
  rgba(14, 17, 22, 0.85) 0%,
  rgba(14, 17, 22, 0.92) 60%,
  rgba(14, 17, 22, 0.98) 100%
);
```

Así el fondo se ve en la parte superior y se funde suavemente hacia el grafito sólido en la parte inferior, manteniendo la legibilidad de todo el contenido.
