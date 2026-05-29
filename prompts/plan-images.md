# Prompts — Imágenes de Planes (Gemini)

## Uso
Imágenes de portada para los dos planes de generación de Orbitrade.
Se muestran en tarjetas de selección de plan y en la landing.

**Dimensiones sugeridas:** 800 × 600 px (4:3) o 600 × 600 px (1:1)  
**Formato:** PNG o WebP con fondo transparente o fondo oscuro  
**Nombres de archivo sugeridos:**
- `public/plans/plan-entry.png`
- `public/plans/plan-industrial.png`

---

## Plan 1 — Entry / Instalación Básica

**ID:** `plan-entry`  
**Concepto:** Una unidad compacta de generación eléctrica. Escala pequeña, accesible, precisa.

### Prompt

```
Product-style render of a single compact industrial power generation unit.
A self-contained modular generator enclosure: matte dark anthracite housing
with brushed steel panels and amber (#F5A524) LED status strips along the edges.
Small digital gauge display on the front panel glowing softly in amber.
The unit sits on a clean dark concrete floor.
Isolated subject, slight three-quarter angle view.
Dramatic studio lighting from above-left with amber accent fill light.
Background: very dark charcoal gradient (#0E1116), almost black.
No green. No neon. No sci-fi elements. No cables or clutter.
Style: premium industrial product photography. Photorealistic. 8K.
The unit looks serious, compact, and reliable — like professional electrical equipment.
```

---

## Plan 2 — Industrial / Planta de Gran Escala

**ID:** `plan-industrial`  
**Concepto:** Una instalación industrial de gran capacidad. Potente, imponente, corporativo.

### Prompt

```
Product-style render of a large-scale industrial power plant installation unit.
A massive modular energy generation system: towering dark anthracite steel housing,
multiple turbine-like cylindrical sections stacked vertically, amber (#F5A524) LED
accent bands marking each section, glowing amber control panel with gauges and displays.
Heavy-duty construction, industrial bolts, metal grating details visible.
Isolated subject, dramatic low-angle three-quarter view looking slightly upward,
emphasizing scale and power.
Dramatic studio lighting from above with amber rim light outlining the silhouette.
Background: very dark charcoal gradient (#0E1116), almost black.
No green. No neon. No sci-fi elements. No cables visible.
Style: premium industrial product photography. Photorealistic. 8K.
The unit looks powerful, corporate, and massive — like turbine equipment at a real power plant.
```

---

## Notas de consistencia

- Ambas imágenes deben verse como de la **misma familia de productos** — mismos materiales, mismo estilo fotográfico, misma paleta.
- La diferencia visual clave: **tamaño y escala**. La Entry es compacta (cabe en una habitación), la Industrial es imponente (requiere un edificio industrial).
- Si Gemini genera fondo no transparente, usar el fondo oscuro `#0E1116` directamente — encajará sin recorte.
- Para recortar el fondo si es necesario: usar `remove.bg` o Photoshop con selección por color.
