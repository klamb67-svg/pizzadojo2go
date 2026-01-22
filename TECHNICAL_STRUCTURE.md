# Pizza Dojo 2Go Website - Technical Structure Summary

## Overview
The Pizza Dojo 2Go website is a static HTML/CSS/JavaScript site with a modular CSS architecture. It uses a consistent design system with Japanese dojo-inspired aesthetics, featuring dark backgrounds, gold accents, and a fixed navigation bar.

**Base URL:** `pizzadojo2go.com`  
**Deployment:** GitHub Pages (automatic via `main` branch)  
**Technology Stack:** Vanilla HTML5, CSS3, JavaScript (ES6+)

---

## Directory Structure

```
pizzadojo2go/
├── index.html              # Homepage (landing page)
├── about.html              # About Us page
├── contact.html            # Contact Us page
├── events.html             # Events page
├── gallery.html            # Gallery page (dynamic image gallery)
├── menu.html               # Menu page (pizza menu with images)
├── shop.html               # Shop page (Fourthwall iframe embed)
├── layout.css              # Global layout styles (nav, variables, utilities)
├── css/
│   ├── base.css            # Minimal global resets
│   ├── about.css           # About page-specific styles
│   ├── contact.css          # Contact page-specific styles
│   ├── events.css           # Events page-specific styles
│   ├── gallery.css          # Gallery page-specific styles
│   ├── menu.css             # Menu page-specific styles
│   └── shop.css             # Shop page-specific styles
├── assets/
│   └── images/
│       ├── background.png              # Desktop homepage background
│       ├── Mobilebackground.png       # Mobile homepage background
│       ├── InsideBackground.png       # Desktop interior page background
│       ├── MobileInsideBackground.png # Mobile interior page background
│       ├── CBsp.png                   # Menu item image
│       ├── CH.png                     # Menu item image
│       ├── Pep.png                    # Menu item image
│       ├── SA.png                     # Menu item image
│       ├── WI.png                     # Menu item image
│       ├── MBSub.png                  # Menu item image
│       └── gallery/
│           ├── gallery.json           # JSON list of gallery images
│           └── [236 JPG files]        # Gallery images
└── scripts/
    └── generate-gallery-list.js       # Utility script for gallery
```

---

## CSS Architecture (Modular Approach)

### Three-Tier CSS System

1. **`css/base.css`** - Minimal global resets
   - Box-sizing reset
   - Basic html/body margin/padding
   - No page-specific styles

2. **`layout.css`** - Global layout and shared components
   - CSS variables (color palette, sizing)
   - Navigation menu styles
   - Utility classes
   - Background video/image styles (for homepage)

3. **Page-specific CSS files** (`css/[page].css`) - Page-specific styles
   - Page-level CSS variables (overlay opacity)
   - html/body styles for that page (background, overflow, etc.)
   - `.overlay` styles (gradient overlay)
   - `.container` styles (content wrapper)
   - `.headline` styles (page title)
   - Page-specific content styles

### CSS Variable System

**Global Variables (in `layout.css`):**
```css
--dojo-gold: #d4af37;
--dojo-gold-light: #f4d03f;
--dojo-gold-dark: #b8941f;
--dojo-brown: #8b6f47;
--dojo-cream: #f5e6d3;
--dojo-wood: #5d4037;
--dojo-text: #fff;
```

**Page-Level Variables (in page-specific CSS):**
```css
--overlay-top: 0.25;  /* Top overlay opacity */
--overlay-bot: 0.65;  /* Bottom overlay opacity */
```

---

## Page Structure Pattern

Every page (except `index.html`) follows this consistent structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] - Pizza Dojo 2Go</title>
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Varela+Round&display=swap" rel="stylesheet">
  
  <!-- CSS Files (in order) -->
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="layout.css">
  <link rel="stylesheet" href="css/[page].css">
</head>
<body>
  <!-- Fixed Navigation -->
  <nav class="nav-menu" aria-label="Main navigation">
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="menu.html">Menu</a></li>
      <li><a href="events.html">Events</a></li>
      <li><a href="shop.html">Shop</a></li>
      <li><a href="contact.html">Contact Us</a></li>
      <li><a href="about.html">About Us</a></li>
      <li><a href="gallery.html">Gallery</a></li>
    </ul>
  </nav>

  <!-- Gradient Overlay -->
  <div class="overlay" aria-hidden="true"></div>

  <!-- Main Content Container -->
  <div class="container">
    <main>
      <h1 class="headline">[Page Title]</h1>
      <!-- Page-specific content -->
    </main>
  </div>
</body>
</html>
```

### Navigation Structure
- **Fixed position** at top of page (`position: fixed`, `z-index: 1000`)
- **Responsive:** Font sizes and spacing adjust on mobile
- **Active state:** Current page link has `.active` class
- **Styling:** Dojo wood background with gold border and hover effects

---

## Typography

### Fonts Used

1. **Bangers** (Google Fonts)
   - Used for: Page titles (`.headline`), navigation menu, buttons
   - Style: Display font, all caps, bold appearance

2. **Varela Round** (Google Fonts)
   - Used for: Body text, paragraphs, descriptions, email addresses
   - Style: Sans-serif, regular sentence case, readable

### Font Application Pattern
- **Titles/Headings:** Bangers font, uppercase
- **Body Text:** Varela Round font, normal case
- **Navigation:** Bangers font
- **Buttons:** Bangers font

---

## Background System

### Homepage (`index.html`)
- **Desktop:** `assets/images/background.png`
- **Mobile:** `assets/images/Mobilebackground.png`
- **Note:** Homepage uses inline styles (not refactored to modular CSS yet)

### Interior Pages (all other pages)
- **Desktop:** `assets/images/InsideBackground.png`
  - `background-size: 100% auto`
  - `background-attachment: fixed`
- **Mobile:** `assets/images/MobileInsideBackground.png`
  - `background-size: cover`
  - `background-attachment: fixed`
- **Fallback:** `background-color: #000` (black)

### Overlay System
Every interior page has a gradient overlay:
```css
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, var(--overlay-top)),  /* 0.25 opacity at top */
    rgba(0, 0, 0, var(--overlay-bot))   /* 0.65 opacity at bottom */
  );
  z-index: 1;
  pointer-events: none;
}
```

---

## Page-Specific Details

### 1. Homepage (`index.html`)
- **Status:** Uses inline styles (not yet refactored)
- **Structure:** Centered title, tagline, and action buttons
- **Background:** Different from interior pages
- **Navigation:** Same nav structure

### 2. About Us (`about.html`)
- **Content:** Personal story and mission statement
- **Typography:** Varela Round for paragraphs, Bangers for headings
- **Structure:** Two sections with `.section` class

### 3. Contact Us (`contact.html`)
- **Content:** Email address (`pizzadojo2go@gmail.com`)
- **Typography:** Varela Round for body text
- **Email Link:** Styled with mailto: protocol

### 4. Events (`events.html`)
- **Content:** Event catering information
- **Typography:** Varela Round for body, Bangers for title
- **Contact:** Email link to `pizzadojo2go@gmail.com`
- **Layout:** Centered contact section

### 5. Menu (`menu.html`)
- **Content:** Static menu grid with pizza images
- **Structure:** Two-column grid (`.menu-grid`) with menu items
- **Images:** PNG files in `assets/images/` (CBsp.png, CH.png, Pep.png, SA.png, WI.png, MBSub.png)
- **Styling:** Transparent backgrounds, responsive grid

### 6. Shop (`shop.html`)
- **Content:** Fourthwall merchandise store embedded via iframe
- **Iframe URL:** `https://pizza-dojo-shop.fourthwall.com/?embed=true`
- **Level 2 Embed:** Keeps users on pizzadojo2go.com during checkout
- **Wrapper:** Styled with dojo aesthetic (dark background, gold border)
- **JavaScript:** Handles iframe resize messages (if supported by Fourthwall)
- **Attributes:** `allow="payment"` for checkout functionality

### 7. Gallery (`gallery.html`)
- **Content:** Dynamic image gallery with EXIF date sorting
- **Data Source:** `assets/images/gallery/gallery.json` (JSON array of image filenames)
- **Sorting:** Newest first (by EXIF DateTimeOriginal)
- **Features:**
  - Lazy loading (native `loading="lazy"`)
  - Portrait image rotation (90° for portrait images)
  - EXIF.js library for metadata extraction
  - Fade-in animation on image load
- **JavaScript:** Complex gallery initialization with EXIF date parsing
- **Date Parsing:** Converts EXIF format (`"2024:12:07 21:02:34"`) to ISO format for Date parsing

---

## Responsive Design

### Breakpoints
- **Desktop:** `min-width: 769px`
- **Mobile:** `max-width: 768px`
- **Small Mobile:** `max-width: 480px` (navigation only)

### Mobile Adjustments
- Font sizes reduced
- Padding/margins adjusted
- Background images switched to mobile versions
- Navigation font sizes and spacing adjusted
- Container padding reduced

### Container Structure
```css
.container {
  position: relative;
  min-height: calc(100vh - 80px);  /* Desktop nav height */
  z-index: 2;  /* Above overlay */
  padding: 1rem 2rem;
  padding-top: calc(1rem + 80px);  /* Account for fixed nav */
}
```

---

## Key Features

### 1. Fixed Navigation
- Always visible at top
- Responsive font sizing
- Active page highlighting
- Hover effects with gold accent

### 2. Gradient Overlay
- Darkens background for text readability
- Lighter at top, darker at bottom
- Page-specific opacity variables

### 3. Gallery System
- Dynamic loading from JSON
- EXIF date extraction and sorting
- Portrait image auto-rotation
- Lazy loading for performance

### 4. Shop Integration
- Fourthwall Level 2 iframe embed
- Maintains site navigation during checkout
- Responsive iframe wrapper
- Payment processing enabled

### 5. Modular CSS
- No inline styles (except homepage)
- Page-specific CSS files
- Shared global styles in `layout.css`
- Easy to maintain and update

---

## JavaScript Usage

### Gallery Page (`gallery.html`)
- **EXIF.js:** External library for image metadata
- **Functions:**
  - `parseExifDate()`: Converts EXIF date format to ISO
  - `initGallery()`: Main initialization
  - `loadImageList()`: Fetches gallery.json
  - `loadImagesWithExif()`: Extracts EXIF data
  - `renderGallery()`: Renders gallery grid

### Shop Page (`shop.html`)
- **PostMessage Listener:** Handles iframe resize messages
- **Origin Verification:** Security check for Fourthwall domain

---

## Image Assets

### Menu Images
- Format: PNG
- Location: `assets/images/`
- Files: `CBsp.png`, `CH.png`, `Pep.png`, `SA.png`, `WI.png`, `MBSub.png`
- Background: Transparent

### Gallery Images
- Format: JPG
- Location: `assets/images/gallery/`
- Count: 236 images
- Metadata: EXIF DateTimeOriginal for sorting
- List: `gallery.json` contains array of filenames

### Background Images
- Desktop: `background.png`, `InsideBackground.png`
- Mobile: `Mobilebackground.png`, `MobileInsideBackground.png`
- Format: PNG
- Usage: Fixed attachment for parallax effect

---

## Deployment

### GitHub Pages
- **Repository:** Connected to GitHub
- **Branch:** `main` branch
- **Auto-deploy:** Changes pushed to `main` automatically deploy
- **URL:** `pizzadojo2go.com` (via GitHub Pages)

### Workflow
1. Make changes locally
2. Test locally
3. `git add .`
4. `git commit -m "[message]"`
5. `git push origin main`
6. Automatic deployment via GitHub Pages

---

## Important Notes

### Homepage Exception
- `index.html` still uses inline styles
- Not yet refactored to modular CSS architecture
- Uses different background images than interior pages

### CSS File Loading Order
**Critical:** CSS files must be loaded in this order:
1. `css/base.css` (resets)
2. `layout.css` (global styles, variables)
3. `css/[page].css` (page-specific, can override)

### Email Address
- **Contact Email:** `pizzadojo2go@gmail.com`
- Used on: Contact page, Events page

### Shop Integration
- **Store URL:** `pizza-dojo-shop.fourthwall.com`
- **Embed Type:** Level 2 (stays on pizzadojo2go.com)
- **Embed URL:** `https://pizza-dojo-shop.fourthwall.com/?embed=true`

### Gallery Date Format
- **EXIF Format:** `"YYYY:MM:DD HH:mm:ss"` (colons in date)
- **Conversion:** Replaces first two colons with hyphens for Date parsing
- **Sort Order:** Newest first (descending)

---

## Color Palette

```css
/* Primary Colors */
--dojo-gold: #d4af37;        /* Primary accent */
--dojo-gold-light: #f4d03f;  /* Hover states */
--dojo-gold-dark: #b8941f;   /* Darker gold */

/* Neutral Colors */
--dojo-brown: #8b6f47;       /* Secondary accent */
--dojo-wood: #5d4037;        /* Navigation background */
--dojo-cream: #f5e6d3;       /* Text color */
--dojo-text: #fff;           /* White text */

/* Background */
background-color: #000;       /* Black fallback */
```

---

## Best Practices

1. **No Inline Styles:** All styles in CSS files (except homepage)
2. **Consistent Structure:** All pages follow same HTML pattern
3. **Modular CSS:** Page-specific styles in dedicated files
4. **Responsive First:** Mobile breakpoints at 768px
5. **Accessibility:** ARIA labels, semantic HTML
6. **Performance:** Lazy loading for gallery images
7. **Security:** Origin verification for iframe messages

---

## Future Considerations

- Refactor `index.html` to use modular CSS
- Consider adding a build process if complexity grows
- Potential for adding more interactive features
- Gallery could support filtering/tagging
- Menu could be dynamic (JSON-driven)

---

**Last Updated:** January 2025  
**Maintained By:** Development Team  
**Documentation Version:** 1.0
