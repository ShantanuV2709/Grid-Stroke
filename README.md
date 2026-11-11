# GRID STROKE STUDIO (gridstroke.studio)

> Production one-page responsive website for **GRID STROKE STUDIO**, a Gen Z-driven creative studio in Indore, India specializing in bold branding, high-quality visuals, and scroll-stopping content.
> *"We don't just design. We make brands look expensive."*

---

## 🖥️ Architecture & Design System

- **Brand Shell:** Deep Aubergine (`#240528`), Acid Lime (`#BEF24D`), Pure White (`#FFFFFF`).
- **Typography:**
  - Headings: `Bebas Neue` (tall condensed caps in acid lime).
  - Body: `Raleway` & `Montserrat Light` (clean geometric sans).
  - Wordmark: `Plus Jakarta Sans` (heavy rounded geometric sans).
  - Luxury Serif: `Lamora` / `Cormorant Garamond` (Meura apparel case study).
  - Ornate Serif & Script: `Playfair Display` & `Great Vibes` (Corel wedding invitations).
  - Viewport Mono: `JetBrains Mono` (3D Maya viewport and timeline markers).
- **Interaction Layer ("Desktop Portfolio"):**
  - macOS window chrome (traffic-light dots, pill address bars, nav actions).
  - Floating app icons (Illustrator, Photoshop, Premiere Pro, After Effects, Maya, Corel Draw) with drift animations.
  - Frosted-glass global dock navigation with magnification and active-section indicator dots.
  - Responsive mobile behavior: the dock transforms into a bottom sticky tab bar on screens under 640px.

---

## 📁 Directory Structure

```text
├── content/
│   ├── media.json              # Master registry for all gallery items and client metadata
│   ├── raw-videos/             # Drop uncompressed video masters here
│   ├── videos/                 # Auto-encoded 720p H.264 MP4s, posters & preview loops
│   ├── branding/               # Meura & Lotus case study visual assets
│   ├── social/                 # 4:5, 1:1, and 9:16 social artwork
│   ├── ecommerce/              # Sun Drunk full-bleed 1464x600 banners
│   ├── reels/                  # 9:16 vertical reel videos
│   ├── 3d/                     # Maya 3D renders & wireframes
│   ├── invitations/            # Arched ceremony invite cards
│   └── motion/                 # After Effects kinetic logo stingers
├── styles/
│   └── main.css                # Production CSS tokens, animations & client data-themes
├── scripts/
│   ├── app.js                  # Mac-desktop dock, client tabs, scrubbers & form logic
│   ├── encode-videos.ps1       # Windows PowerShell ffmpeg transcoding pipeline
│   ├── encode-videos.sh        # Linux/macOS bash ffmpeg transcoding pipeline
│   └── validate.js             # Automated schema, SEO and accessibility validation test
├── index.html                  # Semantic one-page website with JSON-LD and real table
├── llms.txt                    # Concise LLM crawler knowledge file
├── llms-full.txt               # In-depth LLM crawler knowledge file
├── robots.txt                  # Standard crawler indexing directive
├── sitemap.xml                 # XML sitemap
└── README.md                   # Studio operator documentation
```

---

## 🛠️ Operational Guide

### 1. How to Add a New Client

To add a new client (e.g. `Zenith Athletics`):

1. **Register media items in `content/media.json`**:
   ```json
   {
     "id": "social-zenith-01",
     "client": "Zenith Athletics",
     "section": "social",
     "type": "image",
     "aspect": "4:5",
     "src": "/content/social/zenith-01.webp",
     "poster": "/content/social/zenith-01.webp",
     "width": 1080,
     "height": 1350,
     "duration": 0,
     "alt": "Zenith Athletics performance compression wear launch creative",
     "caption": "High-conversion D2C fitness apparel launch",
     "year": 2024,
     "service": "design",
     "theme": "zenith"
   }
   ```

2. **Add the theme colors to `styles/main.css`**:
   ```css
   [data-theme="zenith"] {
     --theme-bg: #0b171c;
     --theme-accent: #00F5D4;
     --theme-accent-2: #7B2CBF;
     --theme-border: rgba(0, 245, 212, 0.35);
     --theme-text: #FFFFFF;
     --theme-subtext: #80FFE8;
   }
   ```

3. **Add the client tab button in `index.html`** under `#social-design`:
   ```html
   <button class="client-tab-btn px-3.5 py-1.5 rounded-lg border border-transparent bg-black/20 text-white/60 hover:text-white" data-client="zenith">Zenith</button>
   ```

4. **Add client configuration to `scripts/app.js`**:
   ```javascript
   zenith: { theme: 'zenith', badge: 'Activewear D2C', title: 'Zenith Athletics Performance' }
   ```

---

### 2. How to Add and Transcode a New Video

1. Place your raw master video (`.mp4`, `.mov`, `.mkv`) into `content/raw-videos/` (e.g., `client-reel.mp4`).
2. Run the transcoding script:
   - **On Windows (PowerShell):**
     ```powershell
     .\scripts\encode-videos.ps1 -InputDir ./content/raw-videos -OutputDir ./content/reels
     ```
   - **On macOS/Linux:**
     ```bash
     chmod +x scripts/encode-videos.sh
     ./scripts/encode-videos.sh ./content/raw-videos ./content/reels
     ```
3. The script automatically produces:
   - `client-reel-poster.webp`: WebP poster frame extracted at 1.0s
   - `client-reel.mp4`: Web-streamable 720p H.264 file with `+faststart`
   - `client-reel-preview.mp4`: 4-second lightweight muted loop
4. Reference the video in `content/media.json` and insert a `.reel-card` into `index.html`.

---

### 3. How to Edit the FAQ & Structured Data (JSON-LD)

1. **Visible FAQ Accordion:**
   - In `index.html`, locate `<section id="faq">`.
   - Add a new `.faq-item` with `<button class="faq-trigger">` and `<div class="faq-content">`.
2. **Synchronize JSON-LD Schema:**
   - In `<head>` of `index.html`, locate the `"@type": "FAQPage"` block.
   - Add a matching question and answer object into `mainEntity`:
     ```json
     {
       "@type": "Question",
       "name": "Your new question here?",
       "acceptedAnswer": {
         "@type": "Answer",
         "text": "Your authoritative answer here."
       }
     }
     ```

---

### 4. Running the Quality & Validation Suite

Verify all 43 semantic, schema, and manifest requirements with:

```bash
node scripts/validate.js
```

Expected output:
```text
====================================================
TOTAL PASSES: 43
TOTAL FAILS:  0
====================================================
```

---

## ⚡ Performance & Accessibility Standards

- **Core Web Vitals:** Zero render-blocking scripts, asynchronous font loading with `font-display: swap`, and native dimensions to guarantee **CLS < 0.1** and **LCP < 2.5s**.
- **Prefers-Reduced-Motion:** Automatically disables floating icon drift, dock scale springs, and marquee scrolling for users with motion sensitivity.
- **No-JS Fallback:** All sections, services breakdown table, and copy are semantic HTML5 and remain completely readable and functional when JavaScript is disabled.

