# Pizza Dojo 2Go Website - Technical File Structure and Format

## Directory Structure

```
pizzadojo2go/
├── index.html              # Homepage (landing page)
├── menu.html               # Menu page
├── events.html             # Events page
├── shop.html               # Shop page
├── contact.html            # Contact page
├── about.html              # About Us page
├── gallery.html            # Gallery page
├── privacy-policy.html     # Privacy policy page
├── template.html           # Template (reference only)
├── responsive-test.html    # Testing page
├── layout.css              # Universal CSS stylesheet (shared navigation, colors, etc.)
├── style.css               # Additional styles (if used)
├── README.md               # Project documentation
└── assets/
    └── images/
        ├── background.png              # Desktop homepage background
        ├── Mobilebackground.png        # Mobile homepage background
        ├── InsideBackground.png        # Desktop interior pages background
        ├── MobileInsideBackground.png  # Mobile interior pages background
        ├── oven2.jpg                   # Oven image (if used)
        └── oven3.mp4                   # Background video (if used)
```

## Standard HTML Page Format

### Basic Structure Pattern

All pages follow this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] - Pizza Dojo 2Go</title>

  <!-- Font Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bangers&display=swap" rel="stylesheet">
  
  <!-- Shared CSS -->
  <link rel="stylesheet" href="layout.css">

  <style>
    /* Page-specific inline styles */
    :root {
      --overlay-top: 0.25;
      --overlay-bot: 0.65;
    }
    
    /* Body and background styles */
    /* Container and content styles */
    /* Mobile media queries */
  </style>
</head>

<body>
  <!-- Fixed Navigation Menu -->
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
      <!-- Page-specific content -->
    </main>
  </div>
</body>
</html>
```

## Navigation Pattern

### Standard Navigation Menu Structure

**Location**: Fixed at top of all pages (z-index: 1000)

**HTML Structure**:
```html
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
```

**Active State**: Add `class="active"` to the current page link:
```html
<li><a href="about.html" class="active">About Us</a></li>
```

**CSS Classes** (defined in `layout.css`):
- `.nav-menu` - Fixed navigation container
- `.nav-menu ul` - Flexbox container for menu items
- `.nav-menu a` - Link styles
- `.nav-menu a.active` - Active page indicator (gold color + underline)

## Background Image Patterns

### Homepage (index.html)

**Desktop**:
```css
body {
  background-image: url('assets/images/background.png');
  background-size: 100% auto;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
```

**Mobile** (max-width: 768px):
```css
body {
  background-image: url('assets/images/Mobilebackground.png');
  background-size: 100% auto;
  background-position: center center;
  background-attachment: scroll;
}
```

### Interior Pages (menu.html, events.html, shop.html, contact.html, about.html, gallery.html)

**Desktop**:
```css
body {
  background-image: url('assets/images/InsideBackground.png');
  background-size: 100% auto;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
```

**Mobile** (max-width: 768px):
```css
body {
  background-image: url('assets/images/MobileInsideBackground.png');
  background-size: 100% auto;
  background-position: center center;
  background-attachment: scroll;
}
```

## CSS Color Variables (from layout.css)

```css
:root {
  /* Overlay opacity */
  --overlay-top: 0.25;
  --overlay-bot: 0.65;
  
  /* Color Palette */
  --dojo-gold: #d4af37;
  --dojo-gold-light: #f4d03f;
  --dojo-gold-dark: #b8941f;
  --dojo-brown: #8b6f47;
  --dojo-brown-light: #a68b5b;
  --dojo-brown-dark: #6b5433;
  --dojo-cream: #f5e6d3;
  --dojo-cream-light: #faf5ed;
  --dojo-wood: #5d4037;
  --dojo-text: #fff;
  --dojo-text-shadow: rgba(0, 0, 0, 0.8);
}
```

## Standard Overlay Pattern

All pages include a gradient overlay for text readability:

```html
<div class="overlay" aria-hidden="true"></div>
```

**CSS** (can be in `<style>` or `layout.css`):
```css
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, var(--overlay-top)),
    rgba(0, 0, 0, var(--overlay-bot))
  );
  z-index: 1;
  pointer-events: none;
}
```

## Container Patterns

### Homepage Container (index.html)
```css
.container {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15rem;
  padding: 3vh 5vw;
  z-index: 2;
}
```

### Interior Pages Container (scrollable content)
```css
.container {
  position: relative;
  min-height: 50vh;
  max-height: 50vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 2;
  padding: 1rem 2rem;
  padding-top: calc(1rem + 80px); /* Account for fixed nav */
  overflow-y: auto;
}
```

**Mobile Adjustment** (max-width: 768px):
```css
.container {
  min-height: 45vh;
  max-height: 45vh;
  padding: 0.75rem 1.5rem;
  padding-top: calc(0.75rem + 70px);
}
```

## Typography

**Font Family**: 'Bangers', cursive (Google Fonts)

**Font Loading**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bangers&display=swap" rel="stylesheet">
```

**Common Text Styles**:
- Headlines: `var(--dojo-gold)` or `var(--dojo-gold-light)`, large font sizes
- Body text: `var(--dojo-cream)`, readable sizes
- Text shadows: `0 2px 14px rgba(0,0,0,.6)` for headlines
- Letter spacing: `0.05em` for headings, `0.02em` for body

## Button Pattern

```css
.btn {
  border: 2px solid var(--dojo-gold);
  padding: .7rem 1.6rem;
  text-decoration: none;
  color: var(--dojo-cream);
  font-size: 1.1rem;
  font-weight: 400;
  font-family: 'Bangers', cursive;
  letter-spacing: 0.05em;
  transition: all .25s ease;
  border-radius: .4rem;
  background: rgba(93, 64, 55, 0.4);
  backdrop-filter: blur(2px);
}

.btn:hover {
  background: var(--dojo-gold);
  color: var(--dojo-wood);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
}
```

## Mobile Responsive Patterns

### Media Query Breakpoints

**Primary Breakpoint**: `@media (max-width: 768px)`
- Mobile navigation adjustments
- Background image switching
- Font size scaling
- Container padding adjustments

**Secondary Breakpoint**: `@media (max-width: 480px)`
- Further navigation fine-tuning
- Additional spacing adjustments

### Navigation Mobile Adjustments (from layout.css)

```css
@media (max-width: 768px) {
  .nav-menu {
    padding: 0.9rem 0;
  }
  
  .nav-menu ul {
    flex-wrap: wrap;
    gap: 0.4rem 1rem;
    justify-content: space-between;
    padding: 0.3rem 1rem;
  }
  
  .nav-menu li {
    flex: 0 0 auto;
  }
  
  .nav-menu a {
    font-size: 1.9rem;
    padding: 0.35rem 0.5rem;
    white-space: nowrap;
  }
}
```

## Page-Specific Variations

### Homepage (index.html)
- **Background**: `background.png` / `Mobilebackground.png`
- **Layout**: Centered vertical layout with `height: 100vh`
- **Content**: Minimal content, focuses on hero title and call-to-action
- **Overflow**: `overflow: hidden` on desktop, `overflow-y: auto` on mobile

### Interior Pages (menu, events, shop, contact, about, gallery)
- **Background**: `InsideBackground.png` / `MobileInsideBackground.png`
- **Layout**: Scrollable container with `max-height: 50vh` (45vh on mobile)
- **Content**: Structured content in `<main>` element
- **Overflow**: `overflow-y: auto` on container

### About Page (about.html)
- **Special Feature**: Hidden scrollbar on container
  ```css
  .container {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  .container::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  ```

## File List with Purpose

| File | Purpose |
|------|---------|
| `index.html` | Homepage/landing page |
| `menu.html` | Menu page (currently "Coming Soon") |
| `events.html` | Events page |
| `shop.html` | Shop page |
| `contact.html` | Contact information page |
| `about.html` | About Us page with mission statement and story |
| `gallery.html` | Image gallery page |
| `privacy-policy.html` | Privacy policy page |
| `layout.css` | **CRITICAL**: Universal stylesheet for navigation, colors, and shared styles |
| `template.html` | Template/reference file (not deployed) |
| `responsive-test.html` | Testing/debugging page (not deployed) |

## Key Technical Notes

1. **Navigation is Fixed**: Always at `top: 0`, `z-index: 1000`
2. **Overlay is Fixed**: Always at `z-index: 1`
3. **Content is Relative**: Container at `z-index: 2`
4. **Background Images**: All use `background-attachment: fixed` on desktop, `scroll` on mobile
5. **Viewport Meta**: `width=device-width, initial-scale=1.0` on all pages
6. **Font Loading**: Preconnect + Google Fonts for performance
7. **CSS Architecture**: Shared styles in `layout.css`, page-specific styles in `<style>` tags
8. **Mobile-First**: Breakpoints at 768px and 480px for responsive design
9. **Instagram WebView Compatible**: Recent fixes removed `display: block` from navigation links for better WebView compatibility

## Common Content Patterns

### Headline Pattern
```html
<h1 class="headline">Page Title</h1>
```

### Section Pattern
```html
<div class="section">
  <h2 class="section-title">Section Title</h2>
  <p>Section content...</p>
</div>
```

### Coming Soon Pattern
```html
<h1 class="headline">Menu</h1>
<p class="coming-soon">Our menu is being crafted...</p>
```
