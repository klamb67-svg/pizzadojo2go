# Pizza Dojo 2Go – File & Folder Flow (Brief Summary for Claude)

**Site:** pizzadojo2go.com  
**Stack:** Static HTML5, CSS3, JavaScript. Deployed via GitHub Pages (`main` branch).

---

## Directory & File Flow

```
pizzadojo2go/
│
├── index.html              # Homepage – inline styles, Mobilebackground.png on mobile (overlay hidden on mobile)
├── about.html              # About Us
├── contact.html            # Contact Us
├── events.html             # Events
├── gallery.html            # Gallery – loads images from gallery.json, EXIF-based ordering
├── menu.html               # Menu – pizza grid
├── shop.html               # Shop – Fourthwall Level 3 product cards (no iframe)
├── privacy-policy.html      # Privacy policy
│
├── layout.css              # Global: nav, CSS variables, utilities (dojo palette)
├── layout-*.css            # Backups (layout-backup-before-phase2.css, etc.)
├── style.css               # Legacy / misc
├── template.html           # Page template reference
├── responsive-test.html     # Dev/test
│
├── css/
│   ├── base.css            # Minimal global resets (box-sizing, html/body)
│   ├── about.css           # About page: body bg, overlay, container, content
│   ├── contact.css         # Contact page styles
│   ├── events.css          # Events page styles
│   ├── gallery.css         # Gallery page + overlay; mobile uses MobileInsideBackground
│   ├── menu.css            # Menu page + overlay
│   └── shop.css            # Shop page + product grid + overlay
│
├── js/
│   └── instagram-banner.js # Detects Instagram in-app browser; shows “Open in Browser” banner
│
├── scripts/
│   └── generate-gallery-list.js   # Node script: scans assets/images/gallery, writes gallery.json
│
├── assets/
│   └── images/
│       ├── background.png           # Desktop homepage background
│       ├── Mobilebackground.png     # Mobile homepage background (no overlay on mobile)
│       ├── InsideBackground.png     # Desktop interior pages background
│       ├── MobileInsideBackground.png  # Mobile interior pages background
│       ├── [menu images: CBsp, CH, Pep, SA, WI, MBSub, etc.].png
│       └── gallery/
│           ├── gallery.json         # List of image filenames for gallery (script-generated)
│           └── *.jpg                # Gallery photos (filenames referenced in gallery.json)
│
├── hidden/                 # Optional / legacy (e.g. pizzaclub index)
│
├── README.md
├── TECHNICAL_STRUCTURE.md   # Full technical doc
├── SHOP_FOURTHWALL_TECHNICAL_SUMMARY.md   # Fourthwall shop integration details
├── INSTAGRAM_BANNER_IMPLEMENTATION_PLAN.md # Instagram banner spec
└── FILE_FOLDER_FLOW.md     # This file
```

---

## Flow Summary

| Area | Flow |
|------|------|
| **Pages** | Each HTML page loads `css/base.css` → `layout.css` → `css/[page].css`. Shared nav; page-specific body background + overlay + content. |
| **Homepage** | `index.html` uses inline `<style>`. Desktop: `background.png` + overlay. Mobile: `Mobilebackground.png`, overlay hidden (`display: none` in media query). |
| **Interior pages** | Body background: desktop `InsideBackground.png`, mobile `MobileInsideBackground.png` (in each page’s CSS). All use `.overlay` gradient (25% → 65% black). |
| **Gallery** | `gallery.html` fetches `assets/images/gallery/gallery.json`, renders images; EXIF/orientation handled in JS. Add images to `gallery/` and run `generate-gallery-list.js` to update `gallery.json`. |
| **Shop** | `shop.html` has a product grid; each card links to Fourthwall product URL and uses imgproxy image URLs. No backend; static links. |
| **Instagram** | `instagram-banner.js` in `<head>` on all main pages; detects in-app browser, shows dismissible banner with “Open in Browser” (copy URL on iOS, intent on Android). |

---

## Key Conventions

- **Breakpoint:** Mobile = `max-width: 768px`; desktop = `min-width: 769px`.
- **Overlay:** `.overlay` is a fixed full-screen gradient (top 0.25 → bottom 0.65 black). On homepage only, it’s hidden on mobile.
- **Nav:** Same `<nav class="nav-menu">` fragment on every page; styles in `layout.css`.
- **Assets:** Images under `assets/images/`; gallery list in `assets/images/gallery/gallery.json`.

Use this as the file/folder and flow reference for pizzadojo2go when working with Claude.
