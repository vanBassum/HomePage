Here’s a polished `README.md` that matches your project setup, conventions, and UI structure 👇
# 🖋️ FontEditor

👉 **Live Demo:** [https://vanbassum.github.io/FontEditor/](https://vanbassum.github.io/FontEditor/)

FontEditor is a browser-based tool for creating and editing custom bitmap fonts used in embedded C applications.  
It’s built with **React**, **TypeScript**, **Vite**, and **shadcn/ui**, and automatically deploys to **GitHub Pages** from the `main` branch.

---

## ✨ Features

- 🧠 **Live bidirectional editing**  
  Update C font code directly or modify glyphs visually — both stay in sync.

- 🎨 **Pixel-perfect glyph editor**  
  Edit characters using a grid-based pixel interface (with optional grid overlay).

- 🔤 **Interactive character list**  
  Add, delete, select, and drag characters to reorder them.

- 🧩 **Preview panel**  
  Type text to see how it renders with your custom font.

- ⚡ **Real-time parsing and validation**  
  The parser reads `FontDef` C structures, with error highlighting when syntax is invalid.

- 🪶 **Responsive layout**  
  The entire UI fits neatly on one screen — no window scroll, only internal card scrolling.

---

## 🧱 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [React](https://react.dev/) + [Vite](https://vitejs.dev/) |
| Language | TypeScript |
| UI Library | [shadcn/ui](https://ui.shadcn.com/) + Tailwind CSS |
| Deployment | GitHub Pages via GitHub Actions |
| State Management | Local React state (hooks) |
| Parsing | Custom C font lexer & serializer (`parseCFont` / `toCFont`) |

---

## 🧰 Project Structure

```

src/
├─ components/
│  ├─ FontCodeEditor.tsx        # C code editor with bidirectional sync
│  ├─ FontCharacterList.tsx     # Scrollable, draggable list of characters
│  ├─ FontCharacterEditor.tsx   # Pixel grid editor for selected character
│  ├─ FontPreviewCard.tsx       # Live text preview
│  ├─ FontDefDetails.tsx        # Displays FontDef parameters
│  └─ FontCharacterIcon.tsx     # Renders single glyph at small scale
│
├─ lib/
│  └─ fontParser.ts             # parseCFont() + toCFont() utilities
│
├─ types/
│  └─ font.ts                   # FontDef and CharacterDef interfaces
│
├─ pages/
│  └─ HomePage.tsx              # Main layout combining all components
│
└─ App.tsx                      # Root layout with sidebar & header

```

---

## 🚀 Getting Started

### 1️⃣ Clone and install

```bash
git clone https://github.com/vanbassum/FontEditor.git
cd FontEditor
npm install
````

### 2️⃣ Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 3️⃣ Build for production

```bash
npm run build
npm run preview
```

---

## 🔧 Deployment

The project is deployed automatically via GitHub Actions.

* Pushes to the `main` branch trigger a build.
* The build output from `/dist` is published to the `gh-pages` branch.
* Hosted at **[https://vanbassum.github.io/FontEditor/](https://vanbassum.github.io/FontEditor/)**.

---

## 🧩 Font Format

The editor supports simple ASCII fonts defined in C as:

```c
#pragma once
#include <stdint.h>
#include "FontDef.h"

static const uint8_t font5x7[96][5] = {
    {0x00,0x00,0x00,0x00,0x00}, // ' '
    {0x00,0x00,0x5F,0x00,0x00}, // '!'
    ...
};

static const FontDef Font5x7 = {
    .table = (const uint8_t*)font5x7,
    .width = 5,
    .height = 7,
    .firstChar = 32,
    .lastChar = 127,
};
```

---

## 📜 License

MIT © 2025 [vanbassum](https://github.com/vanbassum)
