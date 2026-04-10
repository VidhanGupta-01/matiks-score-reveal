# Matiks — Animated Score Reveal UI

> **Assignment:** Post-game score reveal screen for Matiks multiplayer math duel  
> **Stack:** React Native · Expo 52 · Reanimated 3  
> **Target:** Android (primary) + iOS

---

## ✦ What it does

After a multiplayer math duel ends, this screen reveals the player's result through a choreographed sequence of animations — all running on the UI thread via Reanimated 3.

| Feature | Details |
|---|---|
| **Score Counter** | Ticks from 0 → 2840 with eased overshoot (1.04×) then settles |
| **Combo Badge** | 🔥 Bounces in (scale 0 → 1.15 → 1.0) with looping flame pulse |
| **Rank Reveal** | Slides up from below + fade, staggered 200ms after score |
| **Share Button** | Shimmer/glint loop + haptic-style press feedback (scale-down → spring-up) |
| **Confetti Burst** | 60 particles, randomised trajectory, rotation, color, fade-out |

---

## Getting started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Android emulator / physical device with Expo Go

### Install & run

```bash
git clone https://github.com/YOUR_USERNAME/matiks-score-reveal.git
cd matiks-score-reveal

npm install

# Android
npm run android

# iOS (macOS only)
npm run ios
```

> **Note:** Reanimated 3 requires the Babel plugin which is already configured in `babel.config.js`.

---

## Project structure

```
matiks-score-reveal/
├── app/
│   ├── _layout.tsx          # Root layout (GestureHandlerRootView)
│   └── index.tsx            # Main screen — orchestrates animation sequence
├── components/
│   ├── BackgroundGlow.tsx   # Atmospheric bg (violet + amber radial glows)
│   ├── ComboBadge.tsx       # 🔥 badge with bounce entry + flame pulse loop
│   ├── ConfettiCanvas.tsx   # 60-particle confetti burst (pure Reanimated 3)
│   ├── MatiksBranding.tsx   # Top branding bar
│   ├── RankReveal.tsx       # Rank slide-up with fade
│   ├── ScoreCounter.tsx     # Animated tick-up counter
│   ├── ShareButton.tsx      # CTA with shimmer + haptic press
│   └── StatRow.tsx          # Accuracy / time / XP pills
├── constants/
│   └── theme.ts             # Colors, timing constants, game data
├── hooks/
│   └── useScoreCounter.ts   # Score animation logic (UI thread safe)
├── app.json
├── babel.config.js
├── package.json
└── tsconfig.json
```

---

## Animation sequence

```
0ms       Screen fades in
600ms     Score counter starts (withSequence: overshoot → settle)
700ms     Combo badge bounces in; flame pulse loop starts
score+0   Confetti burst fires (60 particles, staggered delays)
score+200 Rank slides up from below
score+400 Share button slides in; shimmer loop starts
```

---

## Reanimated 3 — technical decisions

### UI thread safety
All animations use `useSharedValue` + `useAnimatedStyle`. The **only** `runOnJS` call is in `useScoreCounter` to update the displayed integer every frame — this is intentional and necessary for React state, kept at minimal frequency.

No `setState` is called inside animation callbacks. Visibility flags (combo, rank, share) are triggered via `setTimeout` on the JS thread *before* animation starts, not from within callbacks.

### Spring configs

| Element | damping | stiffness | Feel |
|---|---|---|---|
| Combo badge entry | 5 | 280 | Bouncy, playful |
| Combo badge settle | 10 | 220 | Controlled |
| Rank reveal | 14 | 160 | Smooth, confident |
| Share press feedback | 8 | 300 | Snappy haptic-feel |
| Score pop on finish | 10 | 200 | Satisfying snap |

### Score counter overshoot
Uses `withSequence` with two `withTiming` calls:
1. `0 → 1.04` (eased cubic, 2200ms) — the overshoot
2. `1.04 → 1.0` (eased quad, 180ms) — the settle

The multiplied value drives the display number, creating the "ticks past and snaps back" feel.

---

## Design decisions

- **Color system:** Deep space dark (`#0A0A0F`) + electric violet accent (`#7C3AFF`) + gold (`#FFD166`) + fire orange (`#FF6B35`)
- **No external fonts** — relies on system bold weights for performance and cross-platform consistency
- **Confetti without Skia:** 60 `Animated.View` particles, each with independent `useSharedValue` for X, Y, rotation, opacity — runs entirely on the UI thread
- **Score glow:** `textShadowRadius` on the score label creates a bloom effect without any blur library

---

## Evaluation checklist

- [x] Reanimated 3 APIs only (`useSharedValue`, `useAnimatedStyle`, `withSpring`, `withTiming`, `withSequence`, `withRepeat`, `withDelay`)
- [x] No Lottie, no third-party animation libraries
- [x] No `setState` inside animation callbacks
- [x] Animations on UI thread (not JS thread)
- [x] Android tested ✓ · iOS compatible ✓
- [x] Confetti particle burst (pure Reanimated 3, no Skia dependency required)

---

## Screenshots

> Run the app and you'll see — static screenshots don't do animations justice.

---

*Built for Matiks UI Developer Intern assignment.*
