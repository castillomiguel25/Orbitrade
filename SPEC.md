# Orbitrade — Spec de transformación (energía / industrial premium)

> Estado: acordado vía sesión de grilling (2026-05-28). Números financieros TBD.

## 1. Naturaleza del trabajo

- **Transformación in-place** de este repositorio. Este repo era PLASMINE (plataforma con temática espacial de "criaturas") y ya fue renombrado a **Orbitrade**. El PLASMINE original sigue vivo de forma independiente con su propia DB/deploy.
- **Base de datos:** clon limpio ya configurado, con **datos aislados** de PLASMINE. El esquema se puede mejorar/refactorizar libremente.
- **Dominio:** un solo dominio `orbitrade.io` (aún no comprado, se resuelve después). El modo dual-domain del middleware queda **dormido/simplificado** (ya inactivo en localhost).

## 2. Producto

- El **motor financiero se mantiene idéntico** por dentro: depósito → compra de plan → **rendimiento diario %** → claim de earnings → retiro. Solo cambia la **capa de presentación** a una narrativa de "energía/generación" (sin tocar cálculos de earnings, cron, ni modelo de movimientos de dinero).
- **Máximo 2 planes (tiers):** uno de entrada y uno industrial. **Repetibles, sin gating ni single-purchase.** Los números (yield diario, montos min/max, duración) los define el dueño más adelante; por ahora placeholders.
- Un plan comprado se presenta como una **"instalación de generación"**: tarjetas **icon/gauge-based, sin arte/ilustraciones** (los PNGs de criaturas se descartan). Muestra capacidad, producción diaria, uptime/días restantes, total producido.
- **Vocabulario:** USD como unidad principal con **flavor energético ligero** ("producción", "capacidad"). No se inventan conversiones a kWh que confundan.
- **Partners (referidos):** mecánica de **3 niveles 6% / 3% / 1% intacta** (el backend ya la calcula); solo se renombra (de "hive/colmena" a "Partners") y se rediseña la UI.

## 3. Se elimina

- Juegos arcade (Tetris, Galaxian) y sus rutas/APIs.
- Ruleta + tickets (`spin-roulette`, `redeem-tickets`, `update-tickets`).
- Token interno ZRV/ZRVS (`convert-to-zv`, `zrvs-balance`, `zrvs-bep20` y migración asociada).
- Rutas muertas/redundantes: `hangar`, `extraction`, `armada`, `simulation` (incluye restos de tema "granja": `GallineroModal`, `VaqueraModal`).
- Sistema de **rango** (`rango`) en UI y lógica; la columna en DB queda **inerte** para no romper queries.
- Tema navideño / `themeFlags.ts` (`XMAS_THEME_ENABLED`).
- Tokens de color neón: `miner-green`, `plasma-pink`, `cyber-cyan`, `bio-yellow`.
- Locales `pt` e `it`.

## 4. Se mantiene

- **TRON (TRC20)** como red de movimiento de fondos (TronWeb, CSP `api.trongrid.io`).
- **Confirmación de depósitos:** TXID **on-chain como camino principal** (`validate-deposits`), con **OCR de respaldo** (`upload-proof` + `extract-text`, OpenAI/Tesseract) para quien no tenga el hash.
- **Clave de retiro** (`withdrawalkey` + `check-withdrawal-key`) como segundo factor; solo restyle.
- Autenticación Supabase (middleware + AuthGuard), rate limiting, idle timeout.

## 5. UX / Identidad visual

- **Estilo: industrial premium oscuro.** Nada de glow, scanlines ni partículas.
  - Fondo: grafito/carbón `#0E1116`, superficies `#161A21` (no negro puro).
  - Acento primario: **ámbar/naranja eléctrico `#F5A524`**.
  - Datos/secundario: **cian-acero apagado** (solo para data-viz, no color de marca) + gris acero `#7C8AA0`.
  - Texto: blanco hueso `#E6E8EC`, gris para secundario.
  - Tipografía: **Inter o Geist** en todo; monospace solo en micro-etiquetas de datos si acaso.
- **Navegación:** **bottom-tabs en mobile**; top-nav delgado o rail lateral minimalista en desktop (se elimina el sidebar HUD actual).
- **Rutas planas** (registrar en `PROTECTED_PATHS` del middleware):

  | Función | Ruta nueva | Reemplaza |
  |---|---|---|
  | Dashboard | `/dashboard` | `command-center` |
  | Producción / ganancias | `/production` | `plasma-core` |
  | Depósitos | `/deposits` | `deposits` (+ absorbe parte de `hangar`) |
  | Retiros | `/withdrawals` | `withdrawals` (+ `extraction`) |
  | Historial | `/history` | **fusión de** `ledger` + `datalog` |
  | Partners | `/partners` | `hive` (+ tab dup. en perfil, `armada`) |
  | Cuenta | `/account` | `commander` (sin tab de referidos) |

  - Depósitos y retiros quedan como **páginas separadas** (no combinadas).

## 6. Contenido público

- **Reescribir + restyle (críticas):**
  - Auth: `access` (login), `enlist` (registro), `password-reset`, `reset-password`.
  - Legales: `terms`, `privacy`, `security`, `contact` (deben reflejar marca/tema/riesgos nuevos).
  - **Landing (`page.tsx`):** hero industrial simple — qué es, los 2 planes, CTA a registro. Sin narrativa espacial.
- **Stubs (rutas vivas con placeholder, se llenan después):** `about`, `faq`, `how-it-works`, `training-center`.
- **i18n:** `en` + `es`, **default `es`**. Todo el copy reescrito al tema/tono nuevo. `pt`/`it` se re-agregan luego sin tocar arquitectura.

## 7. Limpieza de esquema (DB)

Al eliminar features, dropear tablas/migraciones huérfanas: `galaxian_table`, `migration_add_zrvs_balance` (ZRVS), tablas de ruleta/tickets. Mantener columnas de dinero/perfil; `rango` queda inerte.

## 8. Pendientes del dueño

- Números de los 2 planes (yield diario, montos min/max, duración).
- Compra del dominio `orbitrade.io`.
- Confirmar idioma default si el mercado cambia (hoy: `es`).
