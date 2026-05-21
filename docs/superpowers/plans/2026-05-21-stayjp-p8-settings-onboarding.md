# StayJP P8 — Settings Split + Goal Onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]`.

**Problem (from user, 2026-05-21):** Base level / goal level / exam date pickers are buried inside the Flashcard 速習 modal. A first-time user lands on the 今日 tab seeing "目標 (未設定)" / "尚未設定考試日期" with no obvious path to fix it. Also a returning user wanting to bump their goal from N3 to N2 has to open 速習 to find the setting.

**Goal:**
1. Extract base/goal/exam pickers into a reusable `LearnPrefsForm` component
2. Add a dedicated `/settings` push route (full screen, back button)
3. Add a "學習設定" row to Profile → navigates to `/settings`
4. On 今日 tab, when `goal_level === ""`, show a prominent CTA card pushing to `/settings`
5. Keep the form ALSO inside Flashcard SettingsPanel (don't break existing flow)

**Architecture:**
- `LearnPrefsForm` reads + writes via existing `getPref` / `setPref` from `prefsStore` — no new state plumbing
- Form component is dumb/stateless; reads prefs on mount, writes on each change (debounced sync already via `schedulePushField`)
- `/settings` route is a thin shell wrapping `LearnPrefsForm` in a header + scroll
- Profile row uses the existing `useRouter().push("/settings")`
- 今日 empty-goal CTA replaces (or augments) the existing "尚未設定目標" muted text

**Non-goals:**
- Full first-run onboarding overlay → P8.1
- Notification permission ask → later
- Account/subscription settings → later
- Theme toggle → later

---

## File Structure

```
stayjp-app/
├── app/
│   ├── settings.tsx                   # NEW — push route
│   └── _layout.tsx                    # MODIFY — declare settings screen in Stack
├── app/(tabs)/
│   ├── today.tsx                      # MODIFY — show "設定目標" CTA card when goal empty
│   └── profile.tsx                    # MODIFY — add 學習設定 row
├── src/
│   └── prefs/
│       └── LearnPrefsForm.tsx         # NEW — shared form (level/count? NO — only learn prefs)
├── src/flashcard/
│   └── SettingsPanel.tsx              # MODIFY — replace inline base/goal/exam pickers with <LearnPrefsForm />
```

---

### Task 1: Extract LearnPrefsForm

**Files:**
- Create: `src/prefs/LearnPrefsForm.tsx`

This component renders:
- 目前程度 pills (零基礎 / N5 已學完 / N4 / N3 / N2)
- 目標級別 pills (N5 / N4 / N3 / N2 / N1)
- 考試日期 — list of upcoming JLPT exam dates + 不設定

- [ ] **Step 1: Implement**

```tsx
// src/prefs/LearnPrefsForm.tsx
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { allLevels } from "../lib/content";
import { getPref, setPref } from "../stores/prefsStore";
import { getUpcomingJlptDates } from "../flashcard/exam-dates";
import { colors } from "../theme";
import type { Level } from "../types/content";
import type { BaseLevel } from "../srs/stats";

interface Props {
  /** Optional compact mode for embedding (no large titles). */
  compact?: boolean;
}

export function LearnPrefsForm({ compact = false }: Props) {
  const [base, setBase] = useState<BaseLevel>(getPref("base_level"));
  const [goal, setGoal] = useState<Level | "">(getPref("goal_level"));
  const [exam, setExam] = useState<string>(getPref("exam_date"));
  const upcoming = useMemo(() => getUpcomingJlptDates(6), []);

  function pickBase(v: BaseLevel) { setBase(v); setPref("base_level", v); }
  function pickGoal(v: Level | "") { setGoal(v); setPref("goal_level", v); }
  function pickExam(v: string) { setExam(v); setPref("exam_date", v); }

  const baseOpts: { v: BaseLevel; label: string }[] = [
    { v: "none", label: "零基礎" },
    { v: "n5", label: "N5 已學完" },
    { v: "n4", label: "N4 已學完" },
    { v: "n3", label: "N3 已學完" },
    { v: "n2", label: "N2 已學完" },
  ];
  const goalOpts: { v: Level | ""; label: string }[] = [
    { v: "", label: "未設定" },
    ...allLevels.map(l => ({ v: l, label: l.toUpperCase() })),
  ];

  return (
    <View>
      {!compact && <Text className="text-2xl font-bold mt-2 mb-1" style={{ color: colors.text }}>學習設定</Text>}

      <Pills label="目前程度" value={base}
        options={baseOpts.map(o => ({ v: o.v, label: o.label }))}
        onChange={(v) => pickBase(v as BaseLevel)} />

      <Pills label="目標級別" value={goal}
        options={goalOpts.map(o => ({ v: o.v, label: o.label }))}
        onChange={(v) => pickGoal(v as Level | "")} />

      <Text className="text-sm font-semibold mt-3 mb-2" style={{ color: colors.text }}>考試日期</Text>
      <View className="gap-2">
        <Pressable onPress={() => pickExam("")}
          className="px-3 py-2 rounded-xl"
          style={{ backgroundColor: exam === "" ? "#FBEEE8" : colors.chip }}>
          <Text style={{ color: exam === "" ? colors.primaryActive : colors.text, fontWeight: exam === "" ? "600" : "400" }}>不設定</Text>
        </Pressable>
        {upcoming.map(u => (
          <Pressable key={u.iso} onPress={() => pickExam(u.iso)}
            className="px-3 py-2 rounded-xl"
            style={{ backgroundColor: exam === u.iso ? "#FBEEE8" : colors.chip }}>
            <Text style={{ color: exam === u.iso ? colors.primaryActive : colors.text, fontWeight: exam === u.iso ? "600" : "400" }}>{u.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function Pills({ label, value, options, onChange }:
  { label: string; value: string; options: { v: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <View className="mt-3">
      <Text className="text-sm font-semibold mb-2" style={{ color: colors.text }}>{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map(o => {
          const on = o.v === value;
          return (
            <Pressable key={o.v} onPress={() => onChange(o.v)}
              className="px-4 py-1.5 rounded-full"
              style={{ backgroundColor: on ? colors.primary : colors.chip }}>
              <Text style={{ color: on ? "white" : colors.text, fontWeight: on ? "600" : "400", fontSize: 13 }}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/Documents/GitHub/stayjp-app
git add src/prefs/LearnPrefsForm.tsx
git commit -m "feat(prefs): LearnPrefsForm — shared base/goal/exam form"
```

---

### Task 2: /settings push route

**Files:**
- Create: `app/settings.tsx`
- Modify: `app/_layout.tsx` (declare in Stack)

- [ ] **Step 1: Implement settings.tsx**

```tsx
// app/settings.tsx
import { ScrollView, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LearnPrefsForm } from "../src/prefs/LearnPrefsForm";
import { colors } from "../src/theme";

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top, paddingBottom: 12, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", backgroundColor: colors.bg }}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "700", marginLeft: 8 }}>學習設定</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: 16 }}>
          設定你的目前程度與目標,App 會根據這些幫你估算進度與每日建議。
        </Text>
        <LearnPrefsForm />
      </ScrollView>
    </View>
  );
}
```

- [ ] **Step 2: Declare in Stack**

In `app/_layout.tsx`, the Stack already lists `flashcard-session`, `word`, `grammar`. Add:

```tsx
<Stack.Screen name="settings" />
```

- [ ] **Step 3: Commit**

```bash
git add app/settings.tsx app/_layout.tsx
git commit -m "feat(settings): /settings route with LearnPrefsForm"
```

---

### Task 3: Profile 學習設定 row

**Files:**
- Modify: `app/(tabs)/profile.tsx`

- [ ] **Step 1: Add a row card**

Between the Account header card and the StreakCalendar, insert a settings entry:

```tsx
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// inside Profile, get router (already imported per Profile)
// in JSX, after Account header card and before StreakCalendar:
<StayCard className="p-0">
  <Pressable
    onPress={() => router.push("/settings")}
    className="flex-row items-center px-5 py-4"
  >
    <View className="w-9 h-9 rounded-full items-center justify-center mr-3" style={{ backgroundColor: "#FBEEE8" }}>
      <Ionicons name="settings-outline" size={18} color={colors.primaryActive} />
    </View>
    <View className="flex-1 min-w-0">
      <Text className="text-base font-semibold" style={{ color: colors.text }}>學習設定</Text>
      <Text className="text-xs" style={{ color: colors.textMuted }} numberOfLines={1}>
        目前程度 · 目標 · 考試日期
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={colors.textSubtle} />
  </Pressable>
</StayCard>
```

- [ ] **Step 2: Commit**

```bash
git add app/\(tabs\)/profile.tsx
git commit -m "feat(profile): 學習設定 row links to /settings"
```

---

### Task 4: 今日 tab CTA when goal empty

**Files:**
- Modify: `app/(tabs)/today.tsx`

- [ ] **Step 1: Detect missing goal, render prominent CTA**

At the top of the today scroll (right after StreakCalendar or as the first hero card if goal is empty), conditionally render:

```tsx
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";

const router = useRouter();
const [goal, setGoalState] = useState(getPref("goal_level"));

// Re-read goal on focus (in case user just set it in /settings)
useFocusEffect(useCallback(() => {
  setGoalState(getPref("goal_level"));
}, []));

// in JSX, before LevelProgressCard / quick-launch buttons:
{!goal && (
  <StayCard className="p-5 mb-3">
    <View className="flex-row items-center">
      <View className="w-12 h-12 rounded-full items-center justify-center mr-3" style={{ backgroundColor: "#FBEEE8" }}>
        <Ionicons name="flag" size={22} color={colors.primary} />
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-base font-bold" style={{ color: colors.text }}>設定你的目標</Text>
        <Text className="text-xs mt-1" style={{ color: colors.textMuted }}>
          選 N5~N1 + 考試日期,App 才能算每日要背幾個。
        </Text>
      </View>
    </View>
    <Pressable onPress={() => router.push("/settings")}
      className="mt-3 px-4 py-3 rounded-xl items-center"
      style={{ backgroundColor: colors.primary }}>
      <Text style={{ color: "white", fontWeight: "600" }}>前往設定 →</Text>
    </Pressable>
  </StayCard>
)}
```

If `goal` is already set, this block doesn't render — clean for returning users.

- [ ] **Step 2: Commit**

```bash
git add app/\(tabs\)/today.tsx
git commit -m "feat(today): prompt to set goal when goal_level empty"
```

---

### Task 5: Flashcard SettingsPanel uses LearnPrefsForm

**Files:**
- Modify: `src/flashcard/SettingsPanel.tsx`

Currently SettingsPanel has inline base/goal/exam pickers. Replace them with the shared component for consistency.

- [ ] **Step 1: Replace inline pickers**

Find the section in `SettingsPanel.tsx` that has the base/goal/exam pickers. Replace with:

```tsx
import { LearnPrefsForm } from "../prefs/LearnPrefsForm";

// in JSX where the old pickers were:
<View className="mt-4 mb-2">
  <LearnPrefsForm compact />
</View>
```

Remove the now-unused `useState` for base/goal/exam from this file (they live inside LearnPrefsForm). Keep the local state for level/count/range/exam (the SESSION pickers — those are different from learning prefs).

Actually re-read SettingsPanel carefully: it has:
- 級別 / 張數 / 範圍 — these are SESSION pickers, keep them
- 目前程度 / 目標 / 考試日期 — these are LEARNING PREFS, replace with form

Make sure you only swap the prefs portion. Keep the session pickers as-is.

The summary card at the bottom ("還要背 X 個") that uses `base`/`goal`/`exam` values — update it to read fresh via `getPref()` each render. Or accept that user has to close and reopen the modal to see updated summary. Simplest: re-read via getPref() in render scope.

- [ ] **Step 2: Verify tests + tsc**

```bash
pnpm test
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/flashcard/SettingsPanel.tsx
git commit -m "refactor(flashcard): SettingsPanel uses LearnPrefsForm (compact mode)"
```

---

### Task 6: Verify end-to-end

- [ ] **Step 1: Tests + tsc**

```bash
pnpm test
npx tsc --noEmit
```

Expected: 103/103 still PASS (no test changes — UI only).

- [ ] **Step 2: Manual smoke**

1. Fresh sign-in (or sign-out + sign-in) → 今日 tab shows big "設定你的目標" CTA card on top
2. Tap CTA → /settings push route opens
3. Pick N3 / N2 / set exam date
4. Tap back arrow → return to 今日 tab → CTA gone, normal layout
5. Profile tab → 學習設定 row → /settings → values preselected (matches what you just set)
6. 單字 → 速習 → SettingsPanel still shows compact LearnPrefsForm + session pickers
7. Change goal in /settings → re-enter 速習 → summary "還要背 X 個" reflects new goal

## Done Criteria

- 5 implementation tasks committed
- `pnpm test` passes
- `npx tsc --noEmit` 0 errors
- New users sign-in → guided to set goal
- Existing users can change goal from Profile without diving into 速習

## Out of Scope (P8.1+)

- Full first-run modal overlay (a "Welcome to 日本再留計劃" splash) — current solution is a passive CTA
- Settings: notification preferences, theme toggle, language toggle
- Onboarding tutorial (tooltips on each tab)
- Account / subscription settings page

## Open Questions

(none — every store and route exists)
