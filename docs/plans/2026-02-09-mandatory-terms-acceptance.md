# Mandatory Terms & Conditions Acceptance at Registration

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make accepting Terms & Conditions mandatory during registration before a user can sign up.

**Architecture:** Add a checkbox to Step 2 of the registration form (`RegistroForm.tsx`) that links to `/terms`. Block form submission client-side if unchecked. Also validate server-side in the API route (`/api/auth/register`). Store `accepted_terms_at` timestamp in Supabase user metadata. Add i18n keys for all 4 languages.

**Tech Stack:** React, Next.js 16 App Router, Supabase Auth (user_metadata), react-intl, Zustand, Sonner (toasts)

---

### Task 1: Add i18n Translation Keys (All 4 Languages)

**Files:**
- Modify: `app/i18n/messages/en.ts`
- Modify: `app/i18n/messages/es.ts`
- Modify: `app/i18n/messages/it.ts`
- Modify: `app/i18n/messages/pt.ts`

**Step 1: Add English keys**

In `app/i18n/messages/en.ts`, add after the `register.accessCommandCenter` line:

```typescript
"register.acceptTerms": "I accept the",
"register.termsAndConditions": "Terms & Conditions",
"register.mustAcceptTerms": "You must accept the Terms & Conditions to register",
```

**Step 2: Add Spanish keys**

In `app/i18n/messages/es.ts`, add after the `register.title` line (or with the other register.* keys):

```typescript
"register.acceptTerms": "Acepto los",
"register.termsAndConditions": "Términos y Condiciones",
"register.mustAcceptTerms": "Debes aceptar los Términos y Condiciones para registrarte",
```

**Step 3: Add Italian keys**

In `app/i18n/messages/it.ts`, add with the other register.* keys:

```typescript
"register.acceptTerms": "Accetto i",
"register.termsAndConditions": "Termini e Condizioni",
"register.mustAcceptTerms": "Devi accettare i Termini e Condizioni per registrarti",
```

**Step 4: Add Portuguese keys**

In `app/i18n/messages/pt.ts`, add with the other register.* keys:

```typescript
"register.acceptTerms": "Aceito os",
"register.termsAndConditions": "Termos e Condições",
"register.mustAcceptTerms": "Você deve aceitar os Termos e Condições para se registrar",
```

**Step 5: Commit**

```bash
git add app/i18n/messages/en.ts app/i18n/messages/es.ts app/i18n/messages/it.ts app/i18n/messages/pt.ts
git commit -m "feat(i18n): add terms acceptance translation keys for all languages"
```

---

### Task 2: Add Terms Checkbox to Registration Form (Client-Side)

**Files:**
- Modify: `app/enlist/RegistroForm.tsx`

**Step 1: Add `acceptedTerms` state**

In `RegistroForm.tsx`, after line 18 (`const [referredBy, setReferredBy] = useState('');`), add:

```typescript
const [acceptedTerms, setAcceptedTerms] = useState(false);
```

**Step 2: Add terms validation to `handleRegister`**

In `RegistroForm.tsx`, inside `handleRegister`, after the password mismatch check (line 39-41), add this block:

```typescript
if (!acceptedTerms) {
  toast.error(intl.formatMessage({ id: 'register.mustAcceptTerms' }));
  return;
}
```

**Step 3: Pass `acceptedTerms` to the API**

In `RegistroForm.tsx`, update the `JSON.stringify` body in the fetch call (line 48-49) to include `acceptedTerms`:

```typescript
body: JSON.stringify({
  name, email, password, phone, referredBy, acceptedTerms
}),
```

**Step 4: Add checkbox UI to Step 2**

In `RegistroForm.tsx`, inside the Step 2 section (`{step === 2 && ...}`), add the checkbox between the confirm password field and the buttons div. After the closing `</div>` of the confirm password field (after line 353) and before the buttons `<div className="flex gap-3 mt-6">` (line 356), add:

```tsx
<div className="flex items-start gap-3 mt-4">
  <input
    type="checkbox"
    id="acceptTerms"
    checked={acceptedTerms}
    onChange={(e) => setAcceptedTerms(e.target.checked)}
    className="mt-1 w-4 h-4 rounded accent-miner-green cursor-pointer"
    style={{
      accentColor: '#13f187',
    }}
  />
  <label
    htmlFor="acceptTerms"
    className="text-sm font-mono text-cosmic-gray cursor-pointer select-none"
  >
    {intl.formatMessage({ id: 'register.acceptTerms' })}{' '}
    <Link
      href="/terms"
      target="_blank"
      className="text-miner-green hover:text-cyber-cyan underline transition-colors duration-300"
    >
      {intl.formatMessage({ id: 'register.termsAndConditions' })}
    </Link>
  </label>
</div>
```

Note: `Link` is already imported at the top of the file (`import Link from 'next/link';`).

**Step 5: Verify the build compiles**

Run: `pnpm build`
Expected: Build succeeds with no errors related to the new code.

**Step 6: Commit**

```bash
git add app/enlist/RegistroForm.tsx
git commit -m "feat(register): add mandatory terms acceptance checkbox to signup form"
```

---

### Task 3: Add Server-Side Validation in API Route

**Files:**
- Modify: `app/api/auth/register/route.ts`

**Step 1: Add `acceptedTerms` to the destructured body**

In `app/api/auth/register/route.ts`, line 6, update the destructuring:

```typescript
const { email, password, name, referredBy, phone, acceptedTerms } = await req.json();
```

**Step 2: Add validation for `acceptedTerms`**

After the existing required fields check (line 8-13), add:

```typescript
if (!acceptedTerms) {
  return NextResponse.json(
    { error: 'Must accept terms and conditions' },
    { status: 400 }
  );
}
```

**Step 3: Store `accepted_terms_at` in user metadata**

Update the `supabase.auth.signUp` options data (line 22) to include the timestamp:

```typescript
data: { name, phone, password, referredby: referredBy, accepted_terms_at: new Date().toISOString() },
```

**Step 4: Verify the build compiles**

Run: `pnpm build`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add app/api/auth/register/route.ts
git commit -m "feat(api): validate terms acceptance server-side and store timestamp in user metadata"
```

---

### Task 4: Manual Testing Checklist

**No files to modify — manual QA only.**

**Step 1: Test form cannot submit without checkbox**

1. Go to `/enlist`
2. Fill in Step 1 fields (name, email, phone)
3. Go to Step 2, fill in password + confirm
4. Do NOT check the terms checkbox
5. Click "Join Colony"
6. Expected: Toast error "You must accept the Terms & Conditions to register"

**Step 2: Test terms link opens in new tab**

1. On Step 2 of the register form
2. Click "Terms & Conditions" link text
3. Expected: `/terms` page opens in a new tab

**Step 3: Test successful registration with terms accepted**

1. Fill in all fields and check the terms checkbox
2. Click "Join Colony"
3. Expected: Registration succeeds, user metadata includes `accepted_terms_at` timestamp

**Step 4: Test all 4 languages render correctly**

1. Switch language to es, it, pt
2. Verify the checkbox label and error message appear correctly in each language

**Step 5: Commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix(register): address issues found during manual testing"
```
