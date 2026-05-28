# Plan de Internacionalización (i18n) - ORBITRADE

**Fecha:** 1 de Febrero, 2026  
**Versión:** 1.0  
**Estado Actual:** Sistema i18n parcialmente implementado (3 idiomas: ES, EN, IT)  
**Idiomas Objetivo:** Inglés (default), Español, Portugués, Italiano

---

## 🎯 PROGRESO GENERAL

### Estado del Proyecto: 🚧 **EN PROGRESO - 15% Completado**

| Fase | Estado | Progreso | Completado |
|------|--------|----------|------------|
| **Fase 1:** Auditoría y Preparación | ✅ | 100% | ✅ |
| **Fase 2:** Reestructuración y Default Locale | 🚧 | 40% | Task 2.0 ✅ |
| **Fase 3:** Internacionalización de Componentes | ⏳ | 0% | - |
| **Fase 4:** Metadata y SEO | ⏳ | 0% | - |
| **Fase 5:** Validaciones y Errores | ⏳ | 0% | - |
| **Fase 6:** Testing y QA | ⏳ | 0% | - |
| **Fase 7:** Documentación y Deployment | ⏳ | 0% | - |

### Últimas Acciones Completadas ✅

1. **Cambio de idioma predeterminado a Inglés**
   - `DEFAULT_LOCALE` actualizado de `'es'` a `'en'`
   - Orden de idiomas actualizado: EN, ES, PT, IT
   - `LanguageSelector` actualizado con Portugués

2. **Script de validación creado**
   - Script `validate-i18n.js` funcional
   - Comando npm: `npm run i18n:validate`
   - Detecta keys faltantes y extras en cada idioma

3. **Estado de traducciones validado**
   - EN: 1,188 keys (Base - 100%)
   - ES: 1,171 keys (98.6%)
   - PT: 345 keys (29.0%) ⚠️
   - IT: 747 keys (62.9%)

### Próximos Pasos 🎯

1. **Inmediato:** Completar traducciones faltantes
   - Prioridad 1: Portugués (846 keys pendientes)
   - Prioridad 2: Italiano (453 keys pendientes)
   - Prioridad 3: Español (51 keys pendientes)

2. **Esta Semana:** Internacionalizar Landing Page
   - Hero Section
   - Stats Section
   - NFT Collection Section
   - Features Section
   - How It Works Section
   - CTA Section

---

## 📊 ANÁLISIS DEL ESTADO ACTUAL

### ✅ **Componentes Ya Implementados**

1. **Infraestructura i18n Base**
   - ✅ React Intl Provider configurado (`app/i18n/IntlProvider.tsx`)
   - ✅ Sistema de cookies para persistencia de idioma
   - ⚠️ 3 idiomas soportados: Español (default actual), Inglés, Italiano
   - ⚠️ **CAMBIO REQUERIDO:** Inglés debe ser el idioma predeterminado
   - ✅ Selector de idioma funcional (`LanguageSelector.tsx`)
   - ✅ Archivos de traducción estructurados (`messages/en.ts`, `es.ts`, `it.ts`)
   - ⚠️ Portugués (`pt.ts`) existe pero no completamente funcional

2. **Componentes Internacionalizados**
   - ✅ Header
   - ✅ Footer
   - ✅ NavBar/SidebarNav
   - ✅ Páginas estáticas: Privacy, Terms, Security, About, FAQ, Contact, How It Works
   - ✅ Componentes de Earnings (ClaimCrystal, EarningsStats, EarningsHistoryTable)
   - ✅ Componentes de Withdrawals (WithdrawModal, WithdrawBanner, WithdrawKeyModal)
   - ✅ Componentes de Deposits (DepositStep, DepositHistory, DepositSummary)
   - ✅ Componentes de Referrals (ReferralLinkBox, ReferralCommissionsInfo, ReferralTable, ReferralHowItWorks)
   - ✅ Páginas de perfil y transacciones

### ❌ **Componentes Sin Internacionalizar**

1. **Página principal (`app/page.tsx`)**
   - ❌ Hero Section - Todo hardcoded en inglés
   - ❌ Stats Section - Labels hardcoded
   - ❌ NFT Collection Section - Títulos y descripciones
   - ❌ Features Section - Cards de características
   - ❌ How It Works Section - Steps hardcoded
   - ❌ CTA Section - Botones y badges

2. **Dashboard/Command Center**
   - ❌ Labels de estadísticas (Balance, Daily Yield, etc.)
   - ❌ Botones de acción (Deposit, Extract, Harvest)
   - ❌ Títulos de sección
   - ⚠️ Nombres de planes (parcialmente en messages)

3. **Componentes de UI Base**
   - ❌ Button component - algunos textos hardcoded
   - ❌ Modal component - títulos genéricos
   - ⚠️ CreatureDetail - mezcla de hardcoded y i18n

4. **Páginas protegidas**
   - ⚠️ `/command-center` - Dashboard principal
   - ⚠️ `/plasma-core` - Earnings page
   - ⚠️ `/hangar` - Deposits/Withdrawals
   - ❌ `/simulation` - Juegos (Tetris, Galaxian)

5. **Rutas públicas**
   - ❌ `/enlist` - Registro
   - ❌ `/access` - Login
   - ❌ `/password-reset` - Reset de contraseña

6. **Componentes de juegos**
   - ❌ GalaxianGame
   - ❌ Tetris

### 🔍 **Problemas Identificados**

1. **Inconsistencia en nomenclatura de keys**
   - Algunos usan `pages.*.title`, otros `components.*`
   - Algunos paths muy largos, otros muy cortos

2. **Traducciones incompletas**
   - Archivo `pt.ts` (Portugués) existe pero no está en uso
   - Algunos mensajes solo en inglés/español

3. **Textos dinámicos sin internacionalizar**
   - Nombres de planes de inversión
   - Descripciones de criaturas/miners
   - Mensajes de error de validación

4. **Metadata y SEO**
   - `layout.tsx` metadata hardcoded en inglés
   - No hay estrategia de rutas localizadas

---

## 🎯 OBJETIVOS DEL PROYECTO

### Objetivo Principal
Convertir el 100% del sitio en multilenguaje con 4 idiomas completos: **Inglés (default), Español, Portugués e Italiano**.

### Objetivos Secundarios
1. ✅ **Cambiar idioma predeterminado a Inglés**
2. ✅ Consistencia en convenciones de naming
3. ✅ Implementación completa de Portugués
4. ✅ **Internacionalización completa de landing page (`app/page.tsx`)**
5. ✅ SEO multilenguaje
6. ✅ Metadatos dinámicos por idioma
7. ✅ Validaciones y mensajes de error internacionalizados

---

## 📋 PLAN DE IMPLEMENTACIÓN

### **FASE 1: AUDITORÍA Y PREPARACIÓN** ✅

**Duración estimada:** Completada

**Tareas:**
- [x] 1.1 Auditar todos los archivos TSX/JSX del proyecto
- [x] 1.2 Identificar todos los textos hardcoded
- [x] 1.3 Crear inventario de strings a traducir
- [x] 1.4 Establecer convención de naming unificada
- [x] 1.5 Documentar estado actual

**Convención de Naming Establecida:**
```
[contexto].[componente/página].[elemento]

Ejemplos:
- pages.home.hero.title
- components.header.login
- common.buttons.submit
- forms.validation.required
- notifications.success.saved
```

---

### **FASE 2: REESTRUCTURACIÓN DE MESSAGES Y CAMBIO DE DEFAULT LOCALE** 🚧 **EN PROGRESO**

**Duración estimada:** 2-3 días  
**Estado:** 40% completado

**Completado:**
- ✅ Task 2.0: Cambio de idioma predeterminado a Inglés
- ✅ Script de validación de traducciones creado
- ✅ Portugués agregado a IntlProvider

**Pendiente:**
- 🚧 Task 2.2: Completar traducciones faltantes (en progreso)
- ⏳ Task 2.3: Agregar keys para componentes sin i18n

#### **Task 2.0: Cambiar idioma predeterminado a Inglés** ⭐ **PRIORITARIO** ✅ **COMPLETADO**
- [x] 2.0.1 Actualizar `DEFAULT_LOCALE` en `app/i18n/utils/locales.ts`
  ```typescript
  // ✅ Cambiado de 'es' a 'en'
  export const DEFAULT_LOCALE: Locale = 'en';
  ```
- [x] 2.0.2 Actualizar orden en `VALID_LOCALES` para reflejar prioridad
  ```typescript
  // ✅ Actualizado
  export const VALID_LOCALES: readonly Locale[] = ['en', 'es', 'pt', 'it'] as const;
  ```
- [x] 2.0.3 Actualizar `LanguageSelector.tsx` - orden de idiomas
  ```typescript
  // ✅ Inglés ahora aparece primero
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', short: 'EN' },
    { code: 'es', name: 'Español', flag: '🇪🇸', short: 'ES' },
    { code: 'pt', name: 'Português', flag: '🇧🇷', short: 'PT' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', short: 'IT' },
  ];
  ```
- [x] 2.0.4 Actualizar metadata en `app/layout.tsx` para que inglés sea default
  ```typescript
  // ✅ Ya estaba en inglés, verificado
  ```
- [x] 2.0.5 Agregar Portugués a IntlProvider
  ```typescript
  // ✅ Importado y agregado al Record de messages
  ```
- [ ] 2.0.6 Testing: Verificar que usuarios nuevos ven el sitio en inglés por defecto

#### **Task 2.1: Reorganizar estructura de archivos de traducción**
- [ ] 2.1.1 Crear nueva estructura de carpetas en `messages/`:
  ```
  messages/
  ├── en/
  │   ├── common.ts
  │   ├── pages.ts
  │   ├── components.ts
  │   ├── forms.ts
  │   └── index.ts
  ├── es/
  ├── it/
  ├── pt/
  └── index.ts
  ```
  **NOTA:** Esta tarea puede hacerse después. Por ahora vamos a completar las traducciones faltantes en la estructura actual.
  
- [ ] 2.1.2 Migrar mensajes existentes a nueva estructura
- [ ] 2.1.3 Actualizar imports en `IntlProvider.tsx`

#### **Task 2.2: Completar traducciones faltantes** 🚧 **EN PROGRESO**

**Estado actual (validado con script):**
- ✅ **EN (Base):** 1,188 keys - COMPLETO
- ⚠️ **ES:** 1,171 keys - Faltan 51 keys
- ❌ **PT:** 345 keys - Faltan 846 keys (29% completo)
- ⚠️ **IT:** 747 keys - Faltan 453 keys (63% completo)

**Sub-tareas:**
- [ ] 2.2.1 Completar traducciones de Español (51 keys faltantes)
  - Principalmente keys de privacy/GDPR
- [ ] 2.2.2 Completar traducciones de Portugués (846 keys faltantes) ⚠️ **PRIORITARIO**
  - Necesita traducción masiva
  - Considerar usar herramienta de traducción profesional
- [ ] 2.2.3 Completar traducciones de Italiano (453 keys faltantes)
  - Principalmente withdrawals y nuevas features
- [ ] 2.2.4 Limpiar keys extras que no existen en base (EN)
  - ES: 34 keys extras
  - PT: 3 keys extras
  - IT: 12 keys extras
- [x] 2.2.5 Crear script de validación de traducciones ✅
  ```bash
  npm run i18n:validate
  ```

#### **Task 2.3: Agregar keys faltantes para componentes sin i18n**
- [ ] 2.3.1 Landing page (Hero, Stats, NFT Section, Features, etc.)
- [ ] 2.3.2 Dashboard/Command Center
- [ ] 2.3.3 Authentication flows (Login, Register, Password Reset)
- [ ] 2.3.4 Investment plans descriptions
- [ ] 2.3.5 Game components

**Subtareas detalladas:**

**2.3.1 - Landing Page Keys**
```typescript
// pages/home.ts
export const homeMessages = {
  "pages.home.hero.title.line1": "ORBITRADE",
  "pages.home.hero.title.line2": "NFT",
  "pages.home.hero.title.line3": "COLLECTION",
  "pages.home.hero.subtitle": "A collection of unique miner NFTs...",
  "pages.home.hero.cta.primary": "START COLLECTING",
  "pages.home.hero.cta.secondary": "SIGN IN",
  
  "pages.home.stats.collectors.value": "15K+",
  "pages.home.stats.collectors.label": "Collectors",
  "pages.home.stats.plasma.value": "999M+",
  "pages.home.stats.plasma.label": "Plasma Generated",
  "pages.home.stats.species.value": "8",
  "pages.home.stats.species.label": "Miner Species",
  "pages.home.stats.uptime.value": "24/7",
  "pages.home.stats.uptime.label": "Network Uptime",
  
  "pages.home.collection.badge": "NFT COLLECTION",
  "pages.home.collection.title.part1": "CHOOSE YOUR",
  "pages.home.collection.title.part2": "MINER",
  "pages.home.collection.subtitle": "Each species has unique plasma generation...",
  "pages.home.collection.card.rarity.common": "Common",
  "pages.home.collection.card.rarity.rare": "Rare",
  "pages.home.collection.card.rarity.epic": "Epic",
  "pages.home.collection.card.rarity.legendary": "Legendary",
  "pages.home.collection.card.price": "Price",
  "pages.home.collection.card.dailyYield": "Daily Yield",
  "pages.home.collection.cta": "VIEW ALL COLLECTION",
  
  "pages.home.features.badge": "WHY ORBITRADE",
  "pages.home.features.title.part1": "BUILT FOR",
  "pages.home.features.title.part2": "COLLECTORS",
  "pages.home.features.passiveIncome.title": "Passive Income",
  "pages.home.features.passiveIncome.description": "Your miners work 24/7...",
  "pages.home.features.secure.title": "Secure & Transparent",
  "pages.home.features.secure.description": "Built on blockchain technology...",
  "pages.home.features.instant.title": "Instant Rewards",
  "pages.home.features.instant.description": "See your plasma accumulate...",
  "pages.home.features.community.title": "Global Community",
  "pages.home.features.community.description": "Join thousands of collectors...",
  
  "pages.home.howItWorks.badge": "HOW IT WORKS",
  "pages.home.howItWorks.title.part1": "SIMPLE",
  "pages.home.howItWorks.title.part2": "4 STEPS",
  "pages.home.howItWorks.step1.number": "01",
  "pages.home.howItWorks.step1.title": "Create Account",
  "pages.home.howItWorks.step1.description": "Sign up in seconds...",
  "pages.home.howItWorks.step2.number": "02",
  "pages.home.howItWorks.step2.title": "Choose Miner",
  "pages.home.howItWorks.step2.description": "Browse and select...",
  "pages.home.howItWorks.step3.number": "03",
  "pages.home.howItWorks.step3.title": "Start Earning",
  "pages.home.howItWorks.step3.description": "Instantly generate...",
  "pages.home.howItWorks.step4.number": "04",
  "pages.home.howItWorks.step4.title": "Withdraw",
  "pages.home.howItWorks.step4.description": "Cash out anytime...",
  
  "pages.home.cta.title.part1": "READY TO JOIN THE",
  "pages.home.cta.title.part2": "ORBITRADE UNIVERSE",
  "pages.home.cta.subtitle": "Your miner collection is waiting...",
  "pages.home.cta.button": "ENTER THE VERSE",
  "pages.home.cta.badge.noFees": "No Hidden Fees",
  "pages.home.cta.badge.instant": "Instant Withdrawals",
  "pages.home.cta.badge.support": "24/7 Support",
};
```

**2.3.2 - Dashboard Keys**
```typescript
// pages/dashboard.ts
export const dashboardMessages = {
  "pages.dashboard.header.title.part1": "DASHBOARD",
  "pages.dashboard.header.title.part2": "CENTER",
  "pages.dashboard.header.commander.label": "Commander",
  "pages.dashboard.header.status.connected": "CONNECTED",
  
  "pages.dashboard.stats.balance.label": "Balance",
  "pages.dashboard.stats.balance.sublabel": "Available Balance",
  "pages.dashboard.stats.dailyYield.label": "Daily Yield",
  "pages.dashboard.stats.dailyYield.sublabel": "USDT per day",
  "pages.dashboard.stats.incubation.label": "Incubation",
  "pages.dashboard.stats.incubation.sublabel": "Creatures Active",
  "pages.dashboard.stats.referrals.label": "Referrals",
  "pages.dashboard.stats.referrals.sublabel": "Members",
  
  "pages.dashboard.actions.deposit": "Deposit",
  "pages.dashboard.actions.extract": "Extract",
  "pages.dashboard.actions.harvest": "Harvest Plasma",
  
  "pages.dashboard.creatures.title.part1": "MINER",
  "pages.dashboard.creatures.title.part2": "Specimens",
  "pages.dashboard.creatures.subtitle": "Select a creature to {incubate} and {harvest} plasma",
  "pages.dashboard.creatures.subtitle.incubate": "incubate",
  "pages.dashboard.creatures.subtitle.harvest": "harvest",
  "pages.dashboard.creatures.available": "{count} Available",
  "pages.dashboard.creatures.card.plasma": "Plasma",
  "pages.dashboard.creatures.card.daily": "Daily",
  "pages.dashboard.creatures.card.rarity.common": "COMMON",
  "pages.dashboard.creatures.card.rarity.rare": "RARE",
  "pages.dashboard.creatures.card.rarity.epic": "EPIC",
  "pages.dashboard.creatures.card.rarity.legendary": "LEGENDARY",
};
```

**2.3.3 - Authentication Keys**
```typescript
// pages/auth.ts
export const authMessages = {
  // Login
  "pages.login.title": "Sign In",
  "pages.login.subtitle": "Welcome back to ORBITRADE",
  "pages.login.email.label": "Email",
  "pages.login.email.placeholder": "Enter your email",
  "pages.login.password.label": "Password",
  "pages.login.password.placeholder": "Enter your password",
  "pages.login.forgotPassword": "Forgot password?",
  "pages.login.submit": "Sign In",
  "pages.login.noAccount": "Don't have an account?",
  "pages.login.register": "Register",
  "pages.login.error.invalidCredentials": "Invalid email or password",
  "pages.login.error.completeFields": "Please fill in all fields",
  
  // Register
  "pages.register.title": "Create Account",
  "pages.register.subtitle": "Join the ORBITRADE community",
  "pages.register.name.label": "Full Name",
  "pages.register.name.placeholder": "Enter your full name",
  "pages.register.email.label": "Email",
  "pages.register.email.placeholder": "Enter your email",
  "pages.register.phone.label": "Phone",
  "pages.register.phone.placeholder": "Enter your phone number",
  "pages.register.password.label": "Password",
  "pages.register.password.placeholder": "Create a password",
  "pages.register.confirmPassword.label": "Confirm Password",
  "pages.register.confirmPassword.placeholder": "Confirm your password",
  "pages.register.referralCode.label": "Referral Code",
  "pages.register.referralCode.placeholder": "Optional referral code",
  "pages.register.submit": "Create Account",
  "pages.register.alreadyHaveAccount": "Already have an account?",
  "pages.register.signIn": "Sign In",
  "pages.register.error.passwordMismatch": "Passwords do not match",
  "pages.register.error.completeFields": "Please fill in all required fields",
  "pages.register.success": "Account created successfully!",
  
  // Password Reset
  "pages.passwordReset.title": "Reset Password",
  "pages.passwordReset.subtitle": "Enter your email to receive reset instructions",
  "pages.passwordReset.email.label": "Email",
  "pages.passwordReset.email.placeholder": "Enter your email",
  "pages.passwordReset.submit": "Send Reset Link",
  "pages.passwordReset.backToLogin": "Back to Sign In",
  "pages.passwordReset.success": "Reset link sent to your email",
  "pages.passwordReset.error": "Error sending reset link",
};
```

**2.3.4 - Investment Plans**
```typescript
// components/investmentPlans.ts
export const investmentPlansMessages = {
  // Plan names and descriptions
  "plans.zyxDrone.name": "Zyx Drone",
  "plans.zyxDrone.description": "Basic reconnaissance specimen from the Zyx nebula.",
  "plans.vortexHunter.name": "Vortex Hunter",
  "plans.vortexHunter.description": "Predatory species specialized in plasma extraction.",
  "plans.nebulaSentinel.name": "Nebula Sentinel",
  "plans.nebulaSentinel.description": "Elite guardian of the cosmic frontier.",
  // ... (continuar con todos los planes)
  
  // Common plan labels
  "plans.common.yield": "Daily Yield",
  "plans.common.cost": "Cost",
  "plans.common.minInvestment": "Min Investment",
  "plans.common.maxInvestment": "Max Investment",
  "plans.common.duration": "Duration",
  "plans.common.status.active": "Active",
  "plans.common.status.inactive": "Inactive",
  "plans.common.activate": "Activate Plan",
  "plans.common.viewDetails": "View Details",
};
```

**2.3.5 - Game Components**
```typescript
// games/games.ts
export const gamesMessages = {
  // Tetris
  "games.tetris.title": "TETRIS GALAXY",
  "games.tetris.subtitle": "Play to earn tickets",
  "games.tetris.score": "Score",
  "games.tetris.level": "Level",
  "games.tetris.lines": "Lines",
  "games.tetris.tickets": "Tickets",
  "games.tetris.gameOver": "Game Over",
  "games.tetris.playAgain": "Play Again",
  "games.tetris.instructions": "Use arrow keys to play",
  
  // Galaxian
  "games.galaxian.title": "GALAXIAN BATTLE",
  "games.galaxian.subtitle": "Defend the galaxy",
  "games.galaxian.lives": "Lives",
  "games.galaxian.wave": "Wave",
  "games.galaxian.highScore": "High Score",
  "games.galaxian.start": "Start Game",
  "games.galaxian.pause": "Pause",
  "games.galaxian.resume": "Resume",
};
```

---

### **FASE 3: INTERNACIONALIZACIÓN DE COMPONENTES**

**Duración estimada:** 5-7 días

#### **Task 3.1: Internacionalizar página principal (`app/page.tsx`)** ⭐ **PRIORITARIO - LANDING PAGE**
- [ ] 3.1.1 Hero Section
- [ ] 3.1.2 Stats Section
- [ ] 3.1.3 NFT Collection Section
- [ ] 3.1.4 Features Section
- [ ] 3.1.5 How It Works Section
- [ ] 3.1.6 CTA Section

**NOTA IMPORTANTE:** Esta es la primera impresión del sitio. Asegurar que:
- Todas las traducciones sean de alta calidad
- Los textos en inglés suenen naturales y profesionales
- Las traducciones reflejen el tono "cosmic/space mining" del proyecto
- Testing extensivo en los 4 idiomas antes de continuar con otras páginas

**Subtareas por sección:**

**3.1.1 - Hero Section** 🏠 **LANDING PAGE**

```typescript
// Antes (hardcoded en inglés)
<h1>
  <span>ORBITRADE </span>
  <span>NFT</span>
  <span> COLLECTION</span>
</h1>
<p>A collection of unique miner NFTs on the blockchain. Metaverse-ready, and designed to generate passive plasma for their holders.</p>
<button>START COLLECTING</button>
<button>SIGN IN</button>

// Después (internacionalizado - 4 idiomas)
const intl = useIntl();

<h1>
  <span>{intl.formatMessage({ id: 'pages.home.hero.title.line1' })} </span>
  <span>{intl.formatMessage({ id: 'pages.home.hero.title.line2' })}</span>
  <span> {intl.formatMessage({ id: 'pages.home.hero.title.line3' })}</span>
</h1>
<p>{intl.formatMessage({ id: 'pages.home.hero.subtitle' })}</p>
<button>{intl.formatMessage({ id: 'pages.home.hero.cta.primary' })}</button>
<button>{intl.formatMessage({ id: 'pages.home.hero.cta.secondary' })}</button>

// Traducciones en messages:
// EN (default):
"pages.home.hero.title.line1": "ORBITRADE",
"pages.home.hero.title.line2": "NFT",
"pages.home.hero.title.line3": "COLLECTION",
"pages.home.hero.subtitle": "A collection of unique miner NFTs on the blockchain. Metaverse-ready, and designed to generate passive plasma for their holders.",
"pages.home.hero.cta.primary": "START COLLECTING",
"pages.home.hero.cta.secondary": "SIGN IN",

// ES:
"pages.home.hero.title.line1": "ORBITRADE",
"pages.home.hero.title.line2": "NFT",
"pages.home.hero.title.line3": "COLECCIÓN",
"pages.home.hero.subtitle": "Una colección de NFTs de mineros únicos en blockchain. Listos para el metaverso y diseñados para generar plasma pasivo para sus dueños.",
"pages.home.hero.cta.primary": "COMENZAR A COLECCIONAR",
"pages.home.hero.cta.secondary": "INICIAR SESIÓN",

// PT:
"pages.home.hero.title.line1": "ORBITRADE",
"pages.home.hero.title.line2": "NFT",
"pages.home.hero.title.line3": "COLEÇÃO",
"pages.home.hero.subtitle": "Uma coleção de NFTs de mineradores únicos na blockchain. Pronto para o metaverso e projetado para gerar plasma passivo para seus detentores.",
"pages.home.hero.cta.primary": "COMEÇAR A COLECIONAR",
"pages.home.hero.cta.secondary": "ENTRAR",

// IT:
"pages.home.hero.title.line1": "ORBITRADE",
"pages.home.hero.title.line2": "NFT",
"pages.home.hero.title.line3": "COLLEZIONE",
"pages.home.hero.subtitle": "Una collezione di NFT di minatori unici sulla blockchain. Pronti per il metaverso e progettati per generare plasma passivo per i loro proprietari.",
"pages.home.hero.cta.primary": "INIZIA A COLLEZIONARE",
"pages.home.hero.cta.secondary": "ACCEDI",
```

**3.1.2 - Stats Section** 🏠 **LANDING PAGE**

```typescript
// Antes (hardcoded)
const stats = [
  { value: '15K+', label: 'Collectors', color: '#13f187' },
  { value: '999M+', label: 'Plasma Generated', color: '#00f5ff' },
  { value: '8', label: 'Miner Species', color: '#dc95e6' },
  { value: '24/7', label: 'Network Uptime', color: '#c8ff00' },
];

// Después (internacionalizado)
const intl = useIntl();
const stats = [
  { 
    value: intl.formatMessage({ id: 'pages.home.stats.collectors.value' }),
    label: intl.formatMessage({ id: 'pages.home.stats.collectors.label' }),
    color: '#13f187' 
  },
  { 
    value: intl.formatMessage({ id: 'pages.home.stats.plasma.value' }),
    label: intl.formatMessage({ id: 'pages.home.stats.plasma.label' }),
    color: '#00f5ff' 
  },
  { 
    value: intl.formatMessage({ id: 'pages.home.stats.species.value' }),
    label: intl.formatMessage({ id: 'pages.home.stats.species.label' }),
    color: '#dc95e6' 
  },
  { 
    value: intl.formatMessage({ id: 'pages.home.stats.uptime.value' }),
    label: intl.formatMessage({ id: 'pages.home.stats.uptime.label' }),
    color: '#c8ff00' 
  },
];

// Traducciones (los valores pueden variar por idioma si tiene sentido):
// EN:
"pages.home.stats.collectors.value": "15K+",
"pages.home.stats.collectors.label": "Collectors",
"pages.home.stats.plasma.value": "999M+",
"pages.home.stats.plasma.label": "Plasma Generated",
"pages.home.stats.species.value": "8",
"pages.home.stats.species.label": "Miner Species",
"pages.home.stats.uptime.value": "24/7",
"pages.home.stats.uptime.label": "Network Uptime",

// ES:
"pages.home.stats.collectors.label": "Coleccionistas",
"pages.home.stats.plasma.label": "Plasma Generado",
"pages.home.stats.species.label": "Especies de Mineros",
"pages.home.stats.uptime.label": "Tiempo Activo de Red",

// PT:
"pages.home.stats.collectors.label": "Colecionadores",
"pages.home.stats.plasma.label": "Plasma Gerado",
"pages.home.stats.species.label": "Espécies de Mineradores",
"pages.home.stats.uptime.label": "Tempo de Atividade da Rede",

// IT:
"pages.home.stats.collectors.label": "Collezionisti",
"pages.home.stats.plasma.label": "Plasma Generato",
"pages.home.stats.species.label": "Specie di Minatori",
"pages.home.stats.uptime.label": "Uptime della Rete",
```

**3.1.3 - NFT Collection Section**
- [ ] Internacionalizar badge "NFT COLLECTION"
- [ ] Internacionalizar título "CHOOSE YOUR MINER"
- [ ] Internacionalizar subtitle
- [ ] Internacionalizar labels de rareza en NFTCard
- [ ] Internacionalizar "Price" y "Daily Yield"
- [ ] Internacionalizar botón "VIEW ALL COLLECTION"

**3.1.4 - Features Section**
- [ ] Internacionalizar badge "WHY ORBITRADE"
- [ ] Internacionalizar título "BUILT FOR COLLECTORS"
- [ ] Internacionalizar cada feature card (título + descripción)

**3.1.5 - How It Works Section**
- [ ] Internacionalizar badge "HOW IT WORKS"
- [ ] Internacionalizar título "SIMPLE 4 STEPS"
- [ ] Internacionalizar cada step (número, título, descripción)

**3.1.6 - CTA Section**
- [ ] Internacionalizar título principal
- [ ] Internacionalizar subtítulo
- [ ] Internacionalizar botón "ENTER THE VERSE"
- [ ] Internacionalizar trust badges

#### **Task 3.2: Internacionalizar Dashboard/Command Center**
- [ ] 3.2.1 Header section
- [ ] 3.2.2 Stats grid (RadialStat components)
- [ ] 3.2.3 Action buttons
- [ ] 3.2.4 Creatures section
- [ ] 3.2.5 CreatureCard component

**Subtareas:**

**3.2.1 - Header**
```typescript
// Reemplazar
<h1>
  <span className="italic">DASHBOARD</span>{' '}
  <span>CENTER</span>
</h1>

// Por
<h1>
  <span className="italic">
    {intl.formatMessage({ id: 'pages.dashboard.header.title.part1' })}
  </span>{' '}
  <span>
    {intl.formatMessage({ id: 'pages.dashboard.header.title.part2' })}
  </span>
</h1>
```

**3.2.2 - Stats Grid**
```typescript
// Crear configuración de stats internacionalizada
const statsConfig = [
  {
    icon: "💎",
    labelKey: "pages.dashboard.stats.balance.label",
    value: `$${(profile.trc20balance ?? 0).toLocaleString()}`,
    sublabelKey: "pages.dashboard.stats.balance.sublabel",
    color: "#13f187"
  },
  // ... resto de stats
];

// Modificar RadialStat para aceptar keys
<RadialStat
  icon={stat.icon}
  label={intl.formatMessage({ id: stat.labelKey })}
  value={stat.value}
  sublabel={intl.formatMessage({ id: stat.sublabelKey })}
  color={stat.color}
/>
```

**3.2.3 - Action Buttons**
```typescript
// Internacionalizar todos los textos de botones
<Button>
  {intl.formatMessage({ id: 'pages.dashboard.actions.deposit' })}
</Button>
<Button>
  {intl.formatMessage({ id: 'pages.dashboard.actions.extract' })}
</Button>
<Button>
  {intl.formatMessage({ id: 'pages.dashboard.actions.harvest' })}
</Button>
```

**3.2.4 - Creatures Section**
```typescript
// Título de sección
<h2>
  <span className="text-miner-green italic">
    {intl.formatMessage({ id: 'pages.dashboard.creatures.title.part1' })}
  </span>{' '}
  <span>
    {intl.formatMessage({ id: 'pages.dashboard.creatures.title.part2' })}
  </span>
</h2>

// Subtitle con valores interpolados
<p>
  {intl.formatMessage(
    { id: 'pages.dashboard.creatures.subtitle' },
    {
      incubate: <span className="italic text-plasma-pink">
        {intl.formatMessage({ id: 'pages.dashboard.creatures.subtitle.incubate' })}
      </span>,
      harvest: <span className="font-bold text-miner-green">
        {intl.formatMessage({ id: 'pages.dashboard.creatures.subtitle.harvest' })}
      </span>
    }
  )}
</p>
```

**3.2.5 - CreatureCard Component**
```typescript
// Internacionalizar labels de rareza
const getRarityLabel = (rarity: string) => {
  return intl.formatMessage({ 
    id: `pages.dashboard.creatures.card.rarity.${rarity.toLowerCase()}` 
  });
};

// Internacionalizar "Plasma" y "Daily"
<div className="text-[9px]">
  {intl.formatMessage({ id: 'pages.dashboard.creatures.card.plasma' })}
</div>
<div className="text-[9px]">
  {intl.formatMessage({ id: 'pages.dashboard.creatures.card.daily' })}
</div>
```

#### **Task 3.3: Internacionalizar rutas de autenticación**
- [ ] 3.3.1 `/access` - Login page
- [ ] 3.3.2 `/enlist` - Register page
- [ ] 3.3.3 `/password-reset` - Password reset page

**Subtareas:**

**3.3.1 - Login Page**
- [ ] Internacionalizar título y subtítulo
- [ ] Internacionalizar labels de formulario
- [ ] Internacionalizar placeholders
- [ ] Internacionalizar mensajes de error
- [ ] Internacionalizar botones y links

**3.3.2 - Register Page**
- [ ] Internacionalizar todos los campos del formulario
- [ ] Internacionalizar mensajes de validación
- [ ] Internacionalizar mensajes de éxito/error
- [ ] Internacionalizar terms acceptance

**3.3.3 - Password Reset**
- [ ] Internacionalizar formulario
- [ ] Internacionalizar mensajes de confirmación

#### **Task 3.4: Internacionalizar componentes de inversión**
- [ ] 3.4.1 CreatureDetail modal
- [ ] 3.4.2 PlanCarousel
- [ ] 3.4.3 InvestmentPlan component
- [ ] 3.4.4 Actualizar `investmentPlans.ts` para usar keys

**3.4.4 - Investment Plans Constants**
```typescript
// Antes
export const investmentPlans: InvestmentPlanType[] = [
  {
    id: 'zyx_drone',
    title: 'Zyx Drone',
    description: 'A basic reconnaissance specimen...',
    // ...
  }
];

// Después
export const investmentPlans: InvestmentPlanType[] = [
  {
    id: 'zyx_drone',
    titleKey: 'plans.zyxDrone.name',
    descriptionKey: 'plans.zyxDrone.description',
    // ...
  }
];

// Modificar tipo
export interface InvestmentPlanType {
  id: string;
  titleKey: string; // Cambiar de title a titleKey
  descriptionKey: string; // Cambiar de description a descriptionKey
  // ... resto de campos
}
```

#### **Task 3.5: Internacionalizar juegos**
- [ ] 3.5.1 Tetris game
- [ ] 3.5.2 Galaxian game
- [ ] 3.5.3 Game modals y overlays

#### **Task 3.6: Internacionalizar componentes restantes**
- [ ] 3.6.1 TopCryptos component
- [ ] 3.6.2 CosmicBackground
- [ ] 3.6.3 Modals genéricos
- [ ] 3.6.4 Loading states
- [ ] 3.6.5 Error states

---

### **FASE 4: METADATA Y SEO MULTILENGUAJE**

**Duración estimada:** 2 días

#### **Task 4.1: Internacionalizar metadata en layout.tsx**
- [ ] 4.1.1 Crear función para generar metadata por idioma
- [ ] 4.1.2 Implementar metadata dinámica según locale
- [ ] 4.1.3 Agregar alternate links para SEO

**Implementación:**
```typescript
// app/layout.tsx
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromServerCookies();
  
  // NOTA: Inglés es el idioma predeterminado
  const metadataByLocale: Record<Locale, Metadata> = {
    en: {
      title: "ORBITRADE - Miner NFT Collection",
      description: "Collect and breed unique miner creatures. Generate cosmic plasma while your creatures evolve in the ORBITRADE.",
      keywords: ["NFT", "Miner", "Crypto", "Collection", "Breeding", "Plasma", "ORBITRADE", "Metaverse"],
    },
    es: {
      title: "ORBITRADE - Colección NFT de Mineros",
      description: "Colecciona y cría criaturas mineras únicas. Genera plasma cósmico mientras tus criaturas evolucionan en ORBITRADE.",
      keywords: ["NFT", "Minero", "Cripto", "Colección", "Crianza", "Plasma", "ORBITRADE", "Metaverso"],
    },
    pt: {
      title: "ORBITRADE - Coleção NFT de Mineiros",
      description: "Colecione e crie criaturas mineradoras únicas. Gere plasma cósmico enquanto suas criaturas evoluem no ORBITRADE.",
      keywords: ["NFT", "Minerador", "Cripto", "Coleção", "Criação", "Plasma", "ORBITRADE", "Metaverso"],
    },
    it: {
      title: "ORBITRADE - Collezione NFT di Minatori",
      description: "Raccogli e alleva creature minerarie uniche. Genera plasma cosmico mentre le tue creature evolvono in ORBITRADE.",
      keywords: ["NFT", "Minatore", "Cripto", "Collezione", "Allevamento", "Plasma", "ORBITRADE", "Metaverso"],
    },
  };
  
  return {
    ...metadataByLocale[locale],
    metadataBase: new URL('https://orbitrade.io'),
    alternates: {
      canonical: `https://orbitrade.io/${locale}`,
      languages: {
        'en-US': 'https://orbitrade.io/en',  // Default
        'es-ES': 'https://orbitrade.io/es',
        'pt-BR': 'https://orbitrade.io/pt',
        'it-IT': 'https://orbitrade.io/it',
      },
    },
    openGraph: {
      ...metadataByLocale[locale],
      type: "website",
      locale: locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : locale === 'it' ? 'it_IT' : 'pt_BR',
      url: `https://orbitrade.io/${locale}`,
    },
  };
}
```

#### **Task 4.2: Agregar metadata keys a messages**
- [ ] 4.2.1 Crear archivo `metadata.ts` en cada idioma
- [ ] 4.2.2 Definir todas las metadata strings

**Ejemplo:**
```typescript
// messages/en/metadata.ts
export const metadataMessages = {
  "metadata.site.title": "ORBITRADE - Miner NFT Collection",
  "metadata.site.description": "Collect and breed unique miner creatures...",
  "metadata.site.keywords": "NFT, Miner, Crypto, Collection, Breeding, Plasma",
  
  "metadata.pages.home.title": "Home | ORBITRADE",
  "metadata.pages.home.description": "Welcome to ORBITRADE...",
  
  "metadata.pages.dashboard.title": "Dashboard | ORBITRADE",
  "metadata.pages.dashboard.description": "Manage your miners...",
  
  // ... para cada página
};
```

#### **Task 4.3: Implementar sitemap multilenguaje**
- [ ] 4.3.1 Crear `sitemap.xml` con todas las rutas en todos los idiomas
- [ ] 4.3.2 Agregar `robots.txt` con referencias al sitemap

---

### **FASE 5: VALIDACIONES Y MENSAJES DE ERROR**

**Duración estimada:** 1-2 días

#### **Task 5.1: Internacionalizar validaciones de formularios**
- [ ] 5.1.1 Crear archivo `forms/validations.ts` en cada idioma
- [ ] 5.1.2 Migrar todos los mensajes de error hardcoded

**Ejemplo:**
```typescript
// messages/en/validations.ts
export const validationMessages = {
  "forms.validation.required": "This field is required",
  "forms.validation.email.invalid": "Please enter a valid email address",
  "forms.validation.password.tooShort": "Password must be at least {min} characters",
  "forms.validation.password.mismatch": "Passwords do not match",
  "forms.validation.phone.invalid": "Please enter a valid phone number",
  "forms.validation.amount.min": "Minimum amount is {min}",
  "forms.validation.amount.max": "Maximum amount is {max}",
  "forms.validation.wallet.invalid": "Invalid wallet address",
};
```

#### **Task 5.2: Internacionalizar notificaciones (toasts)**
- [ ] 5.2.1 Crear archivo `notifications.ts` en cada idioma
- [ ] 5.2.2 Reemplazar todos los toast messages hardcoded

**Ejemplo:**
```typescript
// messages/en/notifications.ts
export const notificationMessages = {
  // Success
  "notifications.success.saved": "Changes saved successfully",
  "notifications.success.deposit": "Deposit completed successfully",
  "notifications.success.withdrawal": "Withdrawal initiated successfully",
  "notifications.success.claimed": "Earnings claimed successfully",
  
  // Error
  "notifications.error.generic": "An error occurred. Please try again.",
  "notifications.error.network": "Network error. Please check your connection.",
  "notifications.error.unauthorized": "You must be logged in to perform this action.",
  "notifications.error.insufficientBalance": "Insufficient balance",
  
  // Warning
  "notifications.warning.unsavedChanges": "You have unsaved changes",
  
  // Info
  "notifications.info.processing": "Processing your request...",
};
```

#### **Task 5.3: Implementar helper para toasts internacionalizados**
- [ ] 5.3.1 Crear utility `showToast()` que use intl
- [ ] 5.3.2 Reemplazar todas las llamadas a `toast()` directas

**Implementación:**
```typescript
// utils/toast.ts
import { toast } from 'sonner';
import { IntlShape } from 'react-intl';

export const showToast = {
  success: (intl: IntlShape, messageKey: string, values?: any) => {
    toast.success(intl.formatMessage({ id: messageKey }, values));
  },
  error: (intl: IntlShape, messageKey: string, values?: any) => {
    toast.error(intl.formatMessage({ id: messageKey }, values));
  },
  warning: (intl: IntlShape, messageKey: string, values?: any) => {
    toast.warning(intl.formatMessage({ id: messageKey }, values));
  },
  info: (intl: IntlShape, messageKey: string, values?: any) => {
    toast.info(intl.formatMessage({ id: messageKey }, values));
  },
};

// Uso
import { useIntl } from 'react-intl';
import { showToast } from '@/app/utils/toast';

const intl = useIntl();
showToast.success(intl, 'notifications.success.deposit', { amount: 100 });
```

---

### **FASE 6: TESTING Y QA**

**Duración estimada:** 3-4 días

#### **Task 6.1: Testing funcional**
- [ ] 6.1.1 Verificar que todos los textos se muestran correctamente en cada idioma
- [ ] 6.1.2 Probar el cambio de idioma en todas las páginas
- [ ] 6.1.3 Verificar que las traducciones persisten después de refresh
- [ ] 6.1.4 Verificar que las cookies de idioma funcionan correctamente

#### **Task 6.2: Testing de edge cases**
- [ ] 6.2.1 Textos muy largos (overflow handling)
- [ ] 6.2.2 Textos muy cortos
- [ ] 6.2.3 Caracteres especiales en cada idioma
- [ ] 6.2.4 Números y formatos de fecha
- [ ] 6.2.5 Monedas y formatos numéricos

#### **Task 6.3: Testing de SEO**
- [ ] 6.3.1 Verificar metadata en cada idioma
- [ ] 6.3.2 Verificar alternate links
- [ ] 6.3.3 Verificar sitemap.xml
- [ ] 6.3.4 Verificar robots.txt
- [ ] 6.3.5 Verificar Open Graph tags
- [ ] 6.3.6 Verificar Twitter Card tags

#### **Task 6.4: Testing de performance**
- [ ] 6.4.1 Medir tiempo de carga con diferentes idiomas
- [ ] 6.4.2 Verificar que no hay memory leaks en cambio de idioma
- [ ] 6.4.3 Optimizar bundle size de traducciones si es necesario

#### **Task 6.5: Testing de accesibilidad**
- [ ] 6.5.1 Verificar que lang attribute se actualiza correctamente
- [ ] 6.5.2 Verificar screen readers con diferentes idiomas
- [ ] 6.5.3 Verificar keyboard navigation

#### **Task 6.6: Testing cross-browser**
- [ ] 6.6.1 Chrome
- [ ] 6.6.2 Firefox
- [ ] 6.6.3 Safari
- [ ] 6.6.4 Edge
- [ ] 6.6.5 Mobile browsers (iOS Safari, Chrome Android)

---

### **FASE 7: DOCUMENTACIÓN Y DEPLOYMENT**

**Duración estimada:** 1-2 días

#### **Task 7.1: Documentación técnica**
- [ ] 7.1.1 Crear guía de contribución para nuevas traducciones
- [ ] 7.1.2 Documentar convenciones de naming
- [ ] 7.1.3 Documentar cómo agregar un nuevo idioma
- [ ] 7.1.4 Documentar cómo agregar nuevas keys
- [ ] 7.1.5 Crear ejemplos de uso comunes

**Ejemplo de guía:**
```markdown
# Guía de Internacionalización - ORBITRADE

## Agregar una nueva traducción

1. Agregar key en todos los archivos de idioma:
```typescript
// messages/en/pages.ts
"pages.newPage.title": "My New Page"

// messages/es/pages.ts
"pages.newPage.title": "Mi Nueva Página"

// messages/it/pages.ts
"pages.newPage.title": "La Mia Nuova Pagina"

// messages/pt/pages.ts
"pages.newPage.title": "Minha Nova Página"
```

2. Usar en componente:
```typescript
import { useIntl } from 'react-intl';

const intl = useIntl();
<h1>{intl.formatMessage({ id: 'pages.newPage.title' })}</h1>
```

## Convenciones de Naming

- `pages.*` - Contenido de páginas
- `components.*` - Componentes reutilizables
- `common.*` - Textos comunes (botones, labels)
- `forms.*` - Validaciones y formularios
- `notifications.*` - Toasts y alertas
- `metadata.*` - SEO y metadata

## Agregar un nuevo idioma

1. Crear carpeta en `messages/[codigo-idioma]/`
2. Copiar estructura de archivos de otro idioma
3. Traducir todos los strings
4. Agregar a `VALID_LOCALES` en `utils/locales.ts`
5. Agregar al `LanguageSelector`
6. Agregar metadata del idioma en `layout.tsx`
```

#### **Task 7.2: Documentación para usuarios**
- [ ] 7.2.1 Actualizar README con información de multilenguaje
- [ ] 7.2.2 Crear FAQ sobre cambio de idioma
- [ ] 7.2.3 Agregar capturas de pantalla del selector de idioma

#### **Task 7.3: Preparar deployment**
- [ ] 7.3.1 Verificar que todas las variables de entorno están configuradas
- [ ] 7.3.2 Crear plan de rollback si hay problemas
- [ ] 7.3.3 Configurar monitoring de errores por idioma
- [ ] 7.3.4 Preparar scripts de pre-deployment checks

#### **Task 7.4: Deploy y monitoreo**
- [ ] 7.4.1 Deploy a staging
- [ ] 7.4.2 Testing final en staging
- [ ] 7.4.3 Deploy a producción
- [ ] 7.4.4 Monitorear errores post-deployment
- [ ] 7.4.5 Recopilar feedback de usuarios

---

## 📊 MÉTRICAS DE ÉXITO

### KPIs Principales
1. **Cobertura de traducción:** 100% de textos traducidos en 4 idiomas
2. **Performance:** No degradación en tiempo de carga (< 5% diferencia)
3. **SEO:** Indexación correcta en Google en los 4 idiomas
4. **Errores:** 0 strings faltantes en producción
5. **Usabilidad:** Cambio de idioma en < 1 segundo

### Métricas Secundarias
1. **Bundle size:** Incremento < 50KB por idioma adicional
2. **Accesibilidad:** Score de Lighthouse mantener > 90
3. **User engagement:** Tiempo en sitio por idioma
4. **Conversiones:** Tasa de registro por idioma

---

## 🚨 RIESGOS Y MITIGACIÓN

### Riesgos Identificados

1. **Riesgo: Traducciones inconsistentes o de baja calidad**
   - **Probabilidad:** Media
   - **Impacto:** Alto
   - **Mitigación:** 
     - Usar herramientas de traducción profesional
     - Revisión por hablantes nativos
     - Testing exhaustivo por idioma

2. **Riesgo: Strings faltantes en producción**
   - **Probabilidad:** Alta
   - **Impacto:** Alto
   - **Mitigación:**
     - Script de validación pre-commit
     - Test automatizado para verificar todas las keys
     - Fallback a idioma por defecto

3. **Riesgo: Degradación de performance**
   - **Probabilidad:** Baja
   - **Impacto:** Medio
   - **Mitigación:**
     - Code splitting por idioma
     - Lazy loading de traducciones
     - Testing de performance continuo

4. **Riesgo: Problemas de SEO por URLs duplicadas**
   - **Probabilidad:** Media
   - **Impacto:** Alto
   - **Mitigación:**
     - Implementar canonical tags correctamente
     - Usar hreflang tags
     - Sitemap multilenguaje

5. **Riesgo: Incompatibilidad con librerías existentes**
   - **Probabilidad:** Baja
   - **Impacto:** Medio
   - **Mitigación:**
     - Testing de integración
     - Revisión de dependencias

---

## 🛠️ HERRAMIENTAS Y SCRIPTS

### Scripts Útiles

```json
// package.json
{
  "scripts": {
    "i18n:validate": "node scripts/validate-i18n.js",
    "i18n:check-missing": "node scripts/check-missing-translations.js",
    "i18n:extract": "node scripts/extract-strings.js",
    "i18n:sort": "node scripts/sort-translations.js"
  }
}
```

### Validate I18n Script
```javascript
// scripts/validate-i18n.js
const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'es', 'it', 'pt'];
const MESSAGES_DIR = path.join(__dirname, '../app/i18n/messages');

function loadMessages(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.ts`);
  // Load and parse messages
  return require(filePath);
}

function validateTranslations() {
  const allMessages = {};
  let hasErrors = false;

  // Load all locales
  LOCALES.forEach(locale => {
    allMessages[locale] = loadMessages(locale);
  });

  // Get all keys from first locale
  const baseLocale = LOCALES[0];
  const baseKeys = Object.keys(allMessages[baseLocale]);

  // Check each locale has all keys
  LOCALES.forEach(locale => {
    const localeKeys = Object.keys(allMessages[locale]);
    
    // Check for missing keys
    baseKeys.forEach(key => {
      if (!localeKeys.includes(key)) {
        console.error(`❌ Missing key "${key}" in ${locale}`);
        hasErrors = true;
      }
    });

    // Check for extra keys
    localeKeys.forEach(key => {
      if (!baseKeys.includes(key)) {
        console.warn(`⚠️  Extra key "${key}" in ${locale}`);
      }
    });
  });

  if (!hasErrors) {
    console.log('✅ All translations are valid!');
  }

  process.exit(hasErrors ? 1 : 0);
}

validateTranslations();
```

### Check Missing Translations Script
```javascript
// scripts/check-missing-translations.js
const fs = require('fs');
const path = require('path');

function findI18nUsages() {
  // Recursively search for intl.formatMessage calls
  // and extract message IDs
}

function checkMissingKeys() {
  // Compare found IDs with message files
  // Report any missing translations
}

checkMissingKeys();
```

---

## 📅 TIMELINE ESTIMADO

### Resumen por Fase

| Fase | Duración | Prioridad | Notas |
|------|----------|-----------|-------|
| **Fase 1:** Auditoría | ✅ Completada | Alta | - |
| **Fase 2:** Reestructuración + Default Locale | 2-3 días | 🔴 **CRÍTICA** | Cambiar EN como default |
| **Fase 3:** Componentes | 5-7 días | Alta | **Empezar con Landing Page** |
| **Fase 4:** Metadata/SEO | 2 días | Alta | EN debe ser canonical |
| **Fase 5:** Validaciones | 1-2 días | Media | - |
| **Fase 6:** Testing | 3-4 días | Alta | Testing en 4 idiomas |
| **Fase 7:** Documentación | 1-2 días | Baja | - |

### Orden de Prioridad de Páginas a Internacionalizar

1. 🥇 **Landing Page (`app/page.tsx`)** - Primera impresión
2. 🥈 **Auth Pages** (`/access`, `/enlist`) - Conversión de usuarios
3. 🥉 **Dashboard** (`/command-center`) - Experiencia principal
4. **Deposits/Withdrawals** - Funcionalidad crítica
5. Resto de páginas

**Total estimado:** 14-20 días laborables

### Calendario Propuesto (Ajustable)

```
Semana 1:
- Lunes: Fase 2 (Cambiar default locale a EN + Reorganización)
- Martes-Jueves: Fase 3 - PRIORITARIO: **Landing Page completa en 4 idiomas**
- Viernes: Testing exhaustivo de Landing Page + Fase 3 (Auth Pages)

Semana 2:
- Lunes-Jueves: Fase 3 (Continuación - Auth + Componentes)
- Viernes: Fase 4 (Metadata/SEO)

Semana 3:
- Lunes: Fase 4 (Continuación) + Fase 5 (Validaciones)
- Martes-Jueves: Fase 6 (Testing)
- Viernes: Fase 7 (Documentación) + Deploy staging

Semana 4:
- Lunes-Martes: Testing final y ajustes
- Miércoles: Deploy a producción
- Jueves-Viernes: Monitoreo y hot fixes
```

---

## ✅ CHECKLIST FINAL PRE-DEPLOYMENT

### Código
- [ ] Todos los textos hardcoded reemplazados por `intl.formatMessage()`
- [ ] Todas las keys tienen traducciones en los 4 idiomas
- [ ] No hay console.errors de keys faltantes
- [ ] Scripts de validación pasan sin errores
- [ ] Code review completado

### Funcionalidad
- [ ] Selector de idioma funciona en todas las páginas
- [ ] Cambio de idioma persiste después de refresh
- [ ] Todas las páginas se muestran correctamente en cada idioma
- [ ] Formularios validan y muestran errores en idioma correcto
- [ ] Toasts aparecen en idioma correcto

### SEO
- [ ] Metadata dinámica por idioma implementada
- [ ] Alternate links configurados
- [ ] Sitemap multilenguaje generado
- [ ] hreflang tags correctos
- [ ] robots.txt actualizado

### Performance
- [ ] Lighthouse score > 90 en todos los idiomas
- [ ] Tiempo de carga < 3s
- [ ] Bundle size incremento aceptable
- [ ] No memory leaks en cambio de idioma

### Accesibilidad
- [ ] lang attribute correcto en <html>
- [ ] Screen readers funcionan correctamente
- [ ] Keyboard navigation OK

### Testing
- [ ] Tests unitarios de componentes i18n
- [ ] Tests de integración
- [ ] Tests E2E por idioma
- [ ] Cross-browser testing completado
- [ ] Mobile testing completado

### Documentación
- [ ] README actualizado
- [ ] Guía de contribución creada
- [ ] Ejemplos de uso documentados
- [ ] FAQ de usuarios actualizado

### Deployment
- [ ] Variables de entorno configuradas
- [ ] Staging deployment exitoso
- [ ] Plan de rollback preparado
- [ ] Monitoring configurado
- [ ] Team notificado

---

## 📞 CONTACTO Y SOPORTE

### Responsables del Proyecto
- **Lead Developer:** [Nombre]
- **i18n Specialist:** [Nombre]
- **QA Lead:** [Nombre]
- **Product Owner:** [Nombre]

### Canales de Comunicación
- **Slack:** #i18n-project
- **GitHub Issues:** Label `i18n`
- **Email:** dev-team@orbitrade.io

---

## 📝 NOTAS ADICIONALES

### Consideraciones Técnicas

1. **React Intl v6+**: El proyecto usa React Intl versión 6, que tiene mejoras de performance sobre v5.

2. **Message Extraction**: Considerar implementar `formatjs` CLI para extracción automática de mensajes si el proyecto crece.

3. **Pluralización**: React Intl soporta reglas ICU para pluralización:
```typescript
intl.formatMessage(
  { id: 'items.count' },
  { count: 5 }
)

// messages:
"items.count": "{count, plural, =0 {No items} one {# item} other {# items}}"
```

4. **Formateo de números y fechas**: Usar siempre los helpers de intl:
```typescript
intl.formatNumber(123456.78, { style: 'currency', currency: 'USD' })
intl.formatDate(new Date(), { year: 'numeric', month: 'long', day: 'numeric' })
```

5. **RTL Support**: Si se planea agregar idiomas RTL (árabe, hebreo), considerar:
   - CSS logical properties
   - Direction detection en layout
   - Mirror de assets si es necesario

### Mejores Prácticas

1. **Evitar concatenación de strings**:
```typescript
// ❌ Mal
{intl.formatMessage({ id: 'hello' })} {name}

// ✅ Bien
{intl.formatMessage({ id: 'greeting' }, { name })}
// messages: "greeting": "Hello {name}!"
```

2. **Usar FormattedMessage cuando sea posible**:
```typescript
// Más declarativo
<FormattedMessage 
  id="welcome.message" 
  values={{ 
    name: <strong>{userName}</strong>,
    count: userCount 
  }} 
/>
```

3. **Namespacing claro**:
```typescript
// Facilita mantenimiento
"components.header.navigation.home"
"components.header.navigation.about"
"components.header.user.profile"
"components.header.user.logout"
```

4. **Comentarios en archivos de traducción**:
```typescript
export const messages = {
  // Dashboard stats
  "dashboard.stats.balance": "Balance",
  "dashboard.stats.earnings": "Earnings",
  
  // Call-to-action buttons
  "cta.deposit": "Deposit Now",
  "cta.withdraw": "Withdraw",
};
```

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DEL DEPLOYMENT

1. **Monitoreo continuo**
   - Configurar alertas para keys faltantes
   - Monitorear performance por idioma
   - Trackear métricas de uso por idioma

2. **Mejora continua**
   - Recopilar feedback de usuarios
   - Iterar sobre traducciones problemáticas
   - Optimizar bundle size si crece mucho

3. **Escalabilidad**
   - Evaluar uso de Translation Management System (TMS)
   - Considerar API de traducción para contenido dinámico
   - Planificar agregado de más idiomas (francés, alemán, etc.)

4. **Automatización**
   - CI/CD checks de traducciones
   - Pre-commit hooks para validación
   - Bot de traducción automática para PRs

---

**Fin del documento de planificación**

*Última actualización: 1 de Febrero, 2026*
