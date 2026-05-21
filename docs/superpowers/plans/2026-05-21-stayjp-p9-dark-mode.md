# StayJP P9 — Dark Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]`.

**Goal:** Light / dark / system theme support. Toggle in /settings. Persists in `theme_pref` MMKV field + syncs to web. Mirrors web's `data-theme="dark"` palette from `index.html` `:root` and `[data-theme="dark"]` CSS vars.

**Palettes (verified from web CSS):**

| Token | Light | Dark |
|---|---|---|
| bg | `#FAF9F6` | `#1C1C1E` |
| card | `#FFFFFF` | `#2C2C2E` |
| chip | `#F3F1ED` | `#242426` |
| text | `#2C2C2C` | `#E5E5E5` |
| textMuted | `#7A7A7A` | `#8E8E93` |
| textSubtle | `#ACACAC` | `#636366` |
| primary | `#D4654A` | `#E8734A` |
| primaryActive | `#B85440` | `#C25E3F` |
| secondary | `#4A7FD4` | `#6BA8F5` |
| border | `#E8E5E0` | `#3A3A3C` |
| shadowOpacity | 0.05 | 0 (dark removes shadows) |
| noteBg | `#FFF8F0` | `#2A2218` |
| noteText | `#92400E` | `#D4A574` |

**Architecture:**
- `src/theme.ts` exports `lightColors`, `darkColors`, `type ColorPalette`.
- `src/theme/ThemeContext.tsx` provides `useTheme()` hook returning current `{ colors, scheme: "light" | "dark", pref: "light" | "dark" | "system" }`.
- ThemeProvider wraps app in `app/_layout.tsx`. Listens to RN `useColorScheme()` for "system" pref.
- `prefsStore` adds `theme_pref` field; pushes to webSync.
- All inline `colors.xxx` usages refactor to `const { colors } = useTheme();` at top of each component.
- NativeWind `tailwind.config.js` adds `darkMode: "class"` + dark variants for brand tokens. Class applied to root View via NativeWind's vars-driven system.
- Toggle UI in `/settings` route: Pills (淺色 / 深色 / 跟隨系統).

**Scope decision: refactor `colors.xxx` inline usages via mechanical sweep.** ~30-50 components need editing. No shortcuts; partial dark mode looks worse than light-only.

**Out of scope:**
- Animated theme transition (fade) → P9.1
- Per-screen theme override → never
- Custom theme builder → never

---

## File Structure

```
stayjp-app/
├── src/theme/
│   ├── colors.ts            # light + dark palettes (renamed from theme.ts; keep theme.ts as re-export for back-compat)
│   ├── ThemeContext.tsx     # Provider + useTheme hook
├── src/theme.ts             # MODIFY — re-export from theme/colors.ts for back-compat
├── src/stores/prefsStore.ts # MODIFY — add theme_pref
├── src/lib/webSync.ts       # MODIFY — add theme_pref field
├── tailwind.config.js       # MODIFY — darkMode: "class" + brand-dark tokens
├── app/_layout.tsx          # MODIFY — wrap in ThemeProvider; apply scheme class
├── app/settings.tsx         # MODIFY — add 主題 pills
└── (all components using inline colors.xxx) — sweep
```

---

### Task 1: Palette extraction + types

**Files:**
- Modify: `src/theme.ts` → split into `src/theme/colors.ts` + back-compat re-export

- [ ] **Step 1: New file `src/theme/colors.ts`**

```ts
// src/theme/colors.ts
export interface ColorPalette {
  bg: string;
  card: string;
  chip: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  primary: string;
  primaryActive: string;
  secondary: string;
  border: string;
  shadow: string;
  noteBg: string;
  noteText: string;
  emText: string;
  calL1: string;
  calL2: string;
}

export const lightColors: ColorPalette = {
  bg: "#FAF9F6",
  card: "#FFFFFF",
  chip: "#F3F1ED",
  text: "#2C2C2C",
  textMuted: "#7A7A7A",
  textSubtle: "#ACACAC",
  primary: "#D4654A",
  primaryActive: "#B85440",
  secondary: "#4A7FD4",
  border: "#E8E5E0",
  shadow: "rgba(0,0,0,0.05)",
  noteBg: "#FFF8F0",
  noteText: "#92400E",
  emText: "#B45309",
  calL1: "rgba(212,101,74,0.3)",
  calL2: "rgba(212,101,74,0.6)",
};

export const darkColors: ColorPalette = {
  bg: "#1C1C1E",
  card: "#2C2C2E",
  chip: "#242426",
  text: "#E5E5E5",
  textMuted: "#8E8E93",
  textSubtle: "#636366",
  primary: "#E8734A",
  primaryActive: "#C25E3F",
  secondary: "#6BA8F5",
  border: "#3A3A3C",
  shadow: "transparent",
  noteBg: "#2A2218",
  noteText: "#D4A574",
  emText: "#E8A060",
  calL1: "rgba(232,115,74,0.3)",
  calL2: "rgba(232,115,74,0.6)",
};

export const radii = { sm: 8, md: 12, lg: 14, xl: 20 } as const;
```

- [ ] **Step 2: `src/theme.ts` becomes re-export**

Replace content of `src/theme.ts` with:

```ts
// Back-compat shim. New code should import from "./theme/colors" or use useTheme().
export { lightColors as colors, lightColors, darkColors, radii } from "./theme/colors";
export type { ColorPalette } from "./theme/colors";
```

This means existing `import { colors } from "../theme"` continues to work with LIGHT colors only. Mark this as the "static fallback" — components that need to switch must use `useTheme()`.

- [ ] **Step 3: Commit**

```bash
cd ~/Documents/GitHub/stayjp-app
git add src/theme/ src/theme.ts
git commit -m "feat(theme): extract light + dark palettes + back-compat shim"
```

---

### Task 2: ThemeContext + Provider + useTheme hook

**Files:**
- Create: `src/theme/ThemeContext.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/theme/ThemeContext.tsx
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import { lightColors, darkColors, type ColorPalette } from "./colors";
import { getPref, setPref } from "../stores/prefsStore";

export type ThemePref = "system" | "light" | "dark";
export type ResolvedScheme = "light" | "dark";

interface ThemeContextValue {
  colors: ColorPalette;
  scheme: ResolvedScheme;
  pref: ThemePref;
  setPref: (p: ThemePref) => void;
}

const Ctx = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();              // "light" | "dark" | null
  const [pref, setPrefState] = useState<ThemePref>(() => (getPref("theme_pref") as ThemePref) || "system");

  const scheme: ResolvedScheme = pref === "system" ? (system === "dark" ? "dark" : "light") : pref;
  const colors = scheme === "dark" ? darkColors : lightColors;

  function updatePref(p: ThemePref) {
    setPrefState(p);
    setPref("theme_pref", p);
  }

  const value = useMemo<ThemeContextValue>(() => ({
    colors, scheme, pref, setPref: updatePref,
  }), [colors, scheme, pref]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeContextValue {
  const v = useContext(Ctx);
  if (!v) {
    // Fallback for tests or if used outside provider — default light.
    return { colors: lightColors, scheme: "light", pref: "system", setPref: () => {} };
  }
  return v;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/theme/ThemeContext.tsx
git commit -m "feat(theme): ThemeContext + useTheme + system color scheme listener"
```

---

### Task 3: prefsStore + webSync support theme_pref

**Files:**
- Modify: `src/stores/prefsStore.ts`
- Modify: `src/lib/webSync.ts`

- [ ] **Step 1: Extend prefsStore**

In `prefsStore.ts`, extend `PrefKey` to include `"theme_pref"`, add to DEFAULTS as `"system"`.

```ts
export type PrefKey = "base_level" | "goal_level" | "exam_date" | "theme_pref";

const DEFAULTS = {
  base_level: "none" as BaseLevel,
  goal_level: "" as Level | "",
  exam_date: "",
  theme_pref: "system" as "system" | "light" | "dark",
} as const;
```

(Adjust the type signatures if `setPref` generic was tight; loosen as needed.)

- [ ] **Step 2: Extend webSync**

In `webSync.ts`, add `theme_pref?: string` to `WebUserDoc`. No merger needed; treat as last-write-wins (cloud overwrites local on bootSync, since user explicitly toggled).

- [ ] **Step 3: bootSync pulls theme_pref**

In `app/_layout.tsx` bootSync, after existing prefs blocks:

```ts
if (remote.theme_pref) setPref("theme_pref", remote.theme_pref as ThemePref);
```

- [ ] **Step 4: Commit**

```bash
git add src/stores/prefsStore.ts src/lib/webSync.ts app/_layout.tsx
git commit -m "feat(theme): persist theme_pref via prefs + webSync"
```

---

### Task 4: Wrap app in ThemeProvider

**Files:**
- Modify: `app/_layout.tsx`

- [ ] **Step 1: Add provider**

In `RootLayout`'s return JSX, wrap inside the existing GestureHandlerRootView + SafeAreaProvider:

```tsx
import { ThemeProvider } from "../src/theme/ThemeContext";

return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* existing screens */}
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);
```

- [ ] **Step 2: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat(theme): wrap app in ThemeProvider"
```

---

### Task 5: Refactor inline `colors.xxx` usages

**Files:** all files with `import { colors } from "../theme"` or similar — sweep them.

Goal: each file that uses `colors.xxx` in JSX should `const { colors } = useTheme();` at top of the component and use that instead.

- [ ] **Step 1: Grep all usages**

```bash
grep -rln "from \"../theme\"" src app
grep -rln "from \"../../theme\"" src app
grep -rln "from \"../../../theme\"" src app
grep -rln "colors\\." src app | head -50
```

- [ ] **Step 2: Mechanical refactor**

For each component file that uses inline `colors.xxx`:

1. Remove `import { colors } from "../theme";` (or similar path)
2. Add `import { useTheme } from "../theme/ThemeContext";` (or correct path)
3. Inside the component body, at the top, add `const { colors } = useTheme();`
4. Existing `colors.xxx` references work as-is

**Pure utility files** (non-component, e.g., `srsDotColor.ts`): keep `import { colors } from "../theme"`. Pure functions can't use hooks. They'll always use light palette. **Acceptable** because dot colors are semantic (red/amber/emerald) that work in both modes.

**StayCard.tsx**, **StreakCalendar.tsx**, **WordCard.tsx**, **GrammarCard.tsx**, **all other components** — convert to useTheme.

After conversion, files with only this color-related theme import should have NO `from "../theme"` line remaining (unless they import `radii` separately — keep that).

- [ ] **Step 3: Verify**

```bash
pnpm test
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/ app/
git commit -m "refactor(theme): components consume colors via useTheme hook"
```

(Single big commit OK — mechanical refactor.)

---

### Task 6: NativeWind dark variants

**Files:**
- Modify: `tailwind.config.js`
- Modify: `global.css`

NativeWind v4 supports `dark:` variants via media query OR class. We use class so we can override system.

- [ ] **Step 1: Update tailwind.config.js**

Add `darkMode: "class"` at top level. Extend `colors.brand` with `dark` variants:

```js
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#D4654A",
          active: "#B85440",
          bg: "#FAF9F6",
          chip: "#F3F1ED",
          border: "#E8E5E0",
          muted: "#7A7A7A",
          ink: "#2C2C2C",
          subtle: "#ACACAC",
        },
        "brand-dark": {
          DEFAULT: "#E8734A",
          active: "#C25E3F",
          bg: "#1C1C1E",
          chip: "#242426",
          card: "#2C2C2E",
          border: "#3A3A3C",
          muted: "#8E8E93",
          ink: "#E5E5E5",
          subtle: "#636366",
        },
        kana: "#4A7FD4",
        "kana-dark": "#6BA8F5",
      },
      fontFamily: { /* keep existing */ },
    },
  },
};
```

- [ ] **Step 2: Apply dark class to root**

In `ThemeProvider`, render a wrapping `<View>` that toggles `className="dark"` when scheme is dark. NativeWind v4 reads the class from the topmost element.

Update `ThemeProvider`:

```tsx
import { View } from "react-native";
import { vars } from "nativewind";

// inside provider return:
return (
  <Ctx.Provider value={value}>
    <View style={{ flex: 1 }} className={scheme === "dark" ? "dark" : ""}>
      {children}
    </View>
  </Ctx.Provider>
);
```

(If `vars()` API needed for runtime CSS var swap, consult NativeWind docs — but simpler `className="dark"` works for `dark:` variant resolution in v4.)

- [ ] **Step 3: Sweep dark variants in NativeWind classes**

For each NativeWind-styled view, add `dark:` variants for brand colors. Examples:
- `bg-brand-bg` → `bg-brand-bg dark:bg-brand-dark-bg`
- `text-brand-ink` → `text-brand-ink dark:text-brand-dark-ink`
- `bg-brand` → `bg-brand dark:bg-brand-dark`
- `text-brand-muted` → `text-brand-muted dark:text-brand-dark-muted`
- `border-brand-border` → `border-brand-border dark:border-brand-dark-border`
- `bg-brand-chip` → `bg-brand-chip dark:bg-brand-dark-chip`
- `text-kana` → `text-kana dark:text-kana-dark`

This is grep + mechanical edit. Files to touch are all NativeWind-styled components: StayCard, WordCard, GrammarCard, CategorySectionHeader, LevelProgressCard, TodayBatchCard, StreakCalendar, etc.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js src/theme/ThemeContext.tsx src app
git commit -m "feat(theme): NativeWind dark variants applied across components"
```

---

### Task 7: Toggle UI in /settings

**Files:**
- Modify: `app/settings.tsx` OR `src/prefs/LearnPrefsForm.tsx`

Recommend: add a separate section in `/settings` rather than embedding in LearnPrefsForm (LearnPrefsForm is also used in Flashcard modal where theme toggle doesn't belong).

- [ ] **Step 1: Add 主題 section to settings.tsx**

In `app/settings.tsx`, after the LearnPrefsForm, add:

```tsx
import { useTheme } from "../src/theme/ThemeContext";

// inside Settings component:
const { pref, setPref: setThemePref } = useTheme();

// in JSX, after LearnPrefsForm:
<View className="mt-6">
  <Text style={{ color: colors.text, fontSize: 14, fontWeight: "600", marginBottom: 8 }}>主題</Text>
  <View className="flex-row flex-wrap gap-2">
    {(["system", "light", "dark"] as const).map(p => {
      const on = pref === p;
      const labelMap = { system: "跟隨系統", light: "淺色", dark: "深色" };
      return (
        <Pressable key={p} onPress={() => setThemePref(p)}
          className="px-4 py-1.5 rounded-full"
          style={{ backgroundColor: on ? colors.primary : colors.chip }}>
          <Text style={{ color: on ? "white" : colors.text, fontWeight: on ? "600" : "400", fontSize: 13 }}>
            {labelMap[p]}
          </Text>
        </Pressable>
      );
    })}
  </View>
</View>
```

(`colors` here comes from `useTheme()` — make sure Settings now uses the hook too.)

- [ ] **Step 2: Commit**

```bash
git add app/settings.tsx
git commit -m "feat(settings): theme toggle (跟隨系統 / 淺色 / 深色)"
```

---

### Task 8: Verify

- [ ] **Step 1: tsc + tests**

```bash
pnpm test
npx tsc --noEmit
```

Should be ≥103 PASS. No tests added unless you write a `useTheme` snapshot — optional.

- [ ] **Step 2: Manual smoke**

1. /settings → 深色 → entire app turns dark (cards, text, bg)
2. 淺色 → entire app turns warm cream
3. 跟隨系統 → matches device setting
4. Switch device color scheme externally → app updates if pref=system
5. Sign out + sign in → theme_pref persists from cloud
6. Open a 單字 row → dark card with light text, blue kana brightens to `#6BA8F5`
7. Heatmap calendar swaps to dark variant of terracotta cells

## Done Criteria

- 7 implementation tasks committed
- `pnpm test` passes
- `npx tsc --noEmit` 0 errors
- Manual: dark mode works across all 5 tabs + modal + push routes
- Theme_pref syncs with web

## Out of Scope (P9.1)

- Smooth animated theme transition (color crossfade)
- Per-tab theme override
- Custom palette builder
- Apple Watch widget colors

## Open Questions

(none — palette from web CSS verified; NativeWind v4 `dark:` works as documented)
