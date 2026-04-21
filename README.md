# The Chella Quest 🎀

A playable, mobile-first birthday adventure for **Ella**, made by **Chad**.
Five whimsical levels, collectible Memory Gems, achievements, a tiny mascot named **Twinkle**, a sparkle cursor trail, and a confetti-fireworks finale.

Built with **Next.js 14 · Tailwind CSS · Framer Motion**.

## ✨ Local setup

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production:
```bash
npm run build
npm start
```

## 🧁 Where to edit stuff

Almost everything Ella reads lives in **one file**:

### `content/messages.json`
All text, wishes, gem messages, the final letter, level timings, and achievement labels. Edit and reload — no restart needed in dev.

Top-level keys:
- `meta` — names, mascot name, domain
- `loading` — the envelope screen intro
- `title` — the press-start screen
- `hub` — chapter-select cards
- `levels.catch` — Level 1 (timer, goal, success/fail text, gem reward)
- `levels.boxes` — Level 2 (the six wish boxes)
- `levels.memory` — Level 3
- `levels.constellation` — Level 4
- `levels.cake` — Level 5
- `finale` — the final letter to Ella (body is an array of paragraphs)
- `achievements` — popup labels keyed by internal name

### Colors & palette
- `tailwind.config.ts` — the whole candy palette (`blush`, `cream`, `peach`, `lilac`, `gold`), custom animations, gradients, shadows.
- `app/globals.css` — the dreamy gradients, the starfield background, candy-button gloss, selection color.

### Sounds
- `lib/sounds.ts` — all SFX are generated with the Web Audio API (no audio files). Tweak the frequencies in `play()` to change the vibe, or wire up real mp3s if you want.

### Game flow / level order
- `components/Game.tsx` — which screen is rendered for each state.
- `lib/game-state.tsx` — state, localStorage save, achievements, gems.
- `content/messages.json › hub.levels` — the order shown on the chapter-select screen.

## 🧠 Architecture at a glance

```
app/
  layout.tsx           ← HTML shell, Google fonts, metadata
  page.tsx             ← renders <Game />
  globals.css          ← palette, backgrounds, candy button gloss

components/
  Game.tsx             ← GameProvider + AnimatePresence screen router
  screens/
    LoadingScreen.tsx         ← envelope-open intro
    TitleScreen.tsx           ← "Press Start, Birthday Girl"
    Hub.tsx                   ← chapter-select with locks + gems
    LevelShell.tsx            ← shared top bar for every level
    Level1Catch.tsx           ← catch floating sparkles (timed)
    Level2Boxes.tsx           ← open 6 wish boxes
    Level3Memory.tsx          ← 4×3 memory match
    Level4Constellation.tsx   ← connect numbered stars
    Level5Cake.tsx            ← design cake + blow candles
    Finale.tsx                ← confetti + love letter
  ui/
    CandyButton.tsx     ← glossy rounded button
    Confetti.tsx        ← canvas confetti/fireworks
    FloatingDecor.tsx   ← drifting background decor
    GemReward.tsx       ← level-complete modal
    Icons.tsx           ← all SVG icons (inline, no image files)
    Mascot.tsx          ← Twinkle, the pink-star guide
    ProgressBar.tsx     ← shimmery progress bar
    Screen.tsx          ← animated full-viewport wrapper
    SoundToggle.tsx     ← corner mute button
    SparkleTrail.tsx    ← cursor/touch sparkle trail

lib/
  content.ts            ← typed re-export of messages.json
  game-state.tsx        ← React context + localStorage
  sounds.ts             ← Web Audio SFX
content/
  messages.json         ← all editable text
```

## 💖 Features

- 5 unique, hand-built mini-games — no stock game loops
- Light progression + locked levels
- 9 achievements + popup notifications
- Persistent progress (localStorage)
- Sound toggle with synthesised SFX (no audio files)
- Sparkle cursor / touch trail
- Two hidden easter-egg buttons (hub + finale)
- Reduced-motion support baked in
- Zero external images — all SVG, gradients, and procedurally drawn art
- Mobile-first, touch-friendly, looks lovely on desktop

## 🧭 Deploying to chella.co.za

Any static-friendly host will do:

- **Vercel** — import this GitHub repo, no config needed. Then add `chella.co.za` as a custom domain under Project Settings → Domains.
- **Netlify** — same, `npm run build` and deploy. Add the domain in Site Settings.
- **Cloudflare Pages** — build command `npm run build`, output `.next`.

Point `chella.co.za` at the host per its DNS guide and Ella can visit it from her browser.

## 🌈 Three optional upgrades you could add later

1. **Postcards mode** — after the finale, generate a shareable image of her completed cake + achievement list via `html-to-image` so she can save/share a "proof of quest."
2. **Daily surprise door** — one hidden button per day after the birthday that unlocks a new micro-message (seed by date). Keeps the site alive past the actual day.
3. **Voice sparkle** — swap the synthesised SFX for ambient music + a short voice note from you that plays on the finale (add to `public/` and wire into `lib/sounds.ts`).

## 🔐 Notes

- No real photos, no private details. Safe for the public internet by design.
- All content is editable in one JSON file.
- The GitHub PAT used for the initial push should be rotated after — treat it as exposed.

— With love, for Ella 🎀
