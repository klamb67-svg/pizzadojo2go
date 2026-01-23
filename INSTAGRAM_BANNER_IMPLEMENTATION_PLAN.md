# Instagram Banner Implementation - Code Review

## Overview
This document contains all proposed code changes for implementing the Instagram in-app browser detection banner.

---

## NEW FILE: `js/instagram-banner.js`

**Location:** `pizzadojo2go/js/instagram-banner.js`

**Full Code:**

```javascript
/**
 * Instagram In-App Browser Detection Banner
 * Shows a minimal banner with action button to open in external browser
 */

(function() {
  'use strict';

  // Detect Instagram's in-app browser
  function isInstagramBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /Instagram|FBAN|FBAV/i.test(userAgent);
  }

  // Detect iOS
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  // Detect Android
  function isAndroid() {
    return /Android/.test(navigator.userAgent);
  }

  // Copy URL to clipboard (iOS)
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        () => true,
        () => false
      );
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return Promise.resolve(true);
      } catch (err) {
        document.body.removeChild(textArea);
        return Promise.resolve(false);
      }
    }
  }

  // Attempt Android intent:// redirect
  function attemptAndroidRedirect() {
    const currentUrl = window.location.href;
    const intentUrl = 'intent://' + currentUrl.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;end';
    
    // Try to redirect
    window.location.href = intentUrl;
    
    // If still here after a short delay, redirect failed
    setTimeout(function() {
      showTooltip('Failed - try manually');
    }, 500);
  }

  // Show tooltip message
  function showTooltip(message) {
    const tooltip = document.createElement('div');
    tooltip.id = 'instagram-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(212, 175, 55, 0.95);
      color: #000;
      padding: 0.8rem 1.5rem;
      border-radius: 0.4rem;
      font-family: 'Varela Round', sans-serif;
      font-size: 0.9rem;
      z-index: 10001;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      animation: slideDown 0.3s ease;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(tooltip);
    
    // Remove after 3 seconds
    setTimeout(function() {
      if (tooltip.parentNode) {
        tooltip.style.animation = 'slideDown 0.3s ease reverse';
        setTimeout(function() {
          if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
          }
        }, 300);
      }
    }, 3000);
  }

  // Handle action button click
  function handleActionClick() {
    if (isIOS()) {
      // iOS: Copy to clipboard
      copyToClipboard(window.location.href).then(function(success) {
        if (success) {
          showTooltip('Copied! Paste in Safari');
        } else {
          showTooltip('Failed to copy');
        }
      });
    } else if (isAndroid()) {
      // Android: Attempt intent redirect
      attemptAndroidRedirect();
    }
  }

  // Create and show banner
  function showBanner() {
    // Check if already dismissed in this session
    if (sessionStorage.getItem('instagram-banner-dismissed') === 'true') {
      return;
    }

    // Create banner container
    const banner = document.createElement('div');
    banner.id = 'instagram-banner';
    banner.style.cssText = `
      position: fixed;
      top: 60px;
      left: 0;
      width: 100%;
      background: rgba(0, 0, 0, 0.9);
      border-bottom: 2px solid #d4af37;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.8rem 1rem;
      box-sizing: border-box;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    `;

    // Create text container
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      min-width: 0;
    `;

    // Create text
    const text = document.createElement('span');
    text.textContent = 'For best experience, open in Safari/Chrome';
    text.style.cssText = `
      font-family: 'Varela Round', sans-serif;
      font-size: 0.95rem;
      color: #f5e6d3;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;

    // Create action button
    const actionButton = document.createElement('button');
    actionButton.textContent = 'Open in Browser';
    actionButton.style.cssText = `
      padding: 0.5rem 1rem;
      font-family: 'Bangers', cursive;
      font-size: 1rem;
      color: #f5e6d3;
      background: rgba(212, 175, 55, 0.3);
      border: 1.5px solid #d4af37;
      border-radius: 0.3rem;
      cursor: pointer;
      transition: all 0.2s ease;
      letter-spacing: 0.05em;
      white-space: nowrap;
      flex-shrink: 0;
    `;
    actionButton.onmouseover = function() {
      this.style.background = '#d4af37';
      this.style.color = '#000';
    };
    actionButton.onmouseout = function() {
      this.style.background = 'rgba(212, 175, 55, 0.3)';
      this.style.color = '#f5e6d3';
    };
    actionButton.onclick = handleActionClick;

    // Create dismiss button (X)
    const dismissButton = document.createElement('button');
    dismissButton.innerHTML = '&times;';
    dismissButton.style.cssText = `
      padding: 0.3rem 0.6rem;
      font-family: 'Varela Round', sans-serif;
      font-size: 1.5rem;
      color: #f5e6d3;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      line-height: 1;
      flex-shrink: 0;
      margin-left: 0.5rem;
    `;
    dismissButton.onmouseover = function() {
      this.style.color = '#d4af37';
      this.style.transform = 'scale(1.2)';
    };
    dismissButton.onmouseout = function() {
      this.style.color = '#f5e6d3';
      this.style.transform = 'scale(1)';
    };
    dismissButton.onclick = function() {
      dismissBanner();
    };

    // Assemble banner
    textContainer.appendChild(text);
    textContainer.appendChild(actionButton);
    banner.appendChild(textContainer);
    banner.appendChild(dismissButton);

    // Add to page
    document.body.appendChild(banner);

    // Adjust body padding to account for banner
    const bannerHeight = banner.offsetHeight;
    document.body.style.paddingTop = bannerHeight + 'px';

    // Auto-dismiss after 10 seconds
    setTimeout(function() {
      if (banner.parentNode) {
        dismissBanner();
      }
    }, 10000);

    // Dismiss function
    function dismissBanner() {
      if (banner.parentNode) {
        banner.style.animation = 'slideUp 0.3s ease';
        setTimeout(function() {
          if (banner.parentNode) {
            banner.parentNode.removeChild(banner);
            document.body.style.paddingTop = '';
            sessionStorage.setItem('instagram-banner-dismissed', 'true');
          }
        }, 300);
      }
    }

    // Add slide-up animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUp {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-100%);
        }
      }
    `;
    if (!document.getElementById('instagram-banner-styles')) {
      style.id = 'instagram-banner-styles';
      document.head.appendChild(style);
    }
  }

  // Initialize
  if (isInstagramBrowser()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
```

---

## HTML FILE MODIFICATIONS

### 1. `index.html`

**Location:** After line 11 (after `<link rel="stylesheet" href="layout.css">`)

**BEFORE:**
```html
  <link rel="stylesheet" href="layout.css">

  <style>
```

**AFTER:**
```html
  <link rel="stylesheet" href="layout.css">
  
  <!-- Instagram In-App Browser Banner -->
  <script src="js/instagram-banner.js"></script>

  <style>
```

---

### 2. `shop.html`

**Location:** After line 13 (after `<link rel="stylesheet" href="css/shop.css">`)

**BEFORE:**
```html
  <link rel="stylesheet" href="css/shop.css">
</head>
```

**AFTER:**
```html
  <link rel="stylesheet" href="css/shop.css">
  
  <!-- Instagram In-App Browser Banner -->
  <script src="js/instagram-banner.js"></script>
</head>
```

---

### 3. `menu.html`

**Location:** After line 13 (after `<link rel="stylesheet" href="css/menu.css">`)

**BEFORE:**
```html
  <link rel="stylesheet" href="css/menu.css">
</head>
```

**AFTER:**
```html
  <link rel="stylesheet" href="css/menu.css">
  
  <!-- Instagram In-App Browser Banner -->
  <script src="js/instagram-banner.js"></script>
</head>
```

---

### 4. `about.html`

**Location:** After line 13 (after `<link rel="stylesheet" href="css/about.css">`)

**BEFORE:**
```html
  <link rel="stylesheet" href="css/about.css">
</head>
```

**AFTER:**
```html
  <link rel="stylesheet" href="css/about.css">
  
  <!-- Instagram In-App Browser Banner -->
  <script src="js/instagram-banner.js"></script>
</head>
```

---

### 5. `contact.html`

**Location:** After line 13 (after `<link rel="stylesheet" href="css/contact.css">`)

**BEFORE:**
```html
  <link rel="stylesheet" href="css/contact.css">
</head>
```

**AFTER:**
```html
  <link rel="stylesheet" href="css/contact.css">
  
  <!-- Instagram In-App Browser Banner -->
  <script src="js/instagram-banner.js"></script>
</head>
```

---

### 6. `events.html`

**Location:** After line 13 (after `<link rel="stylesheet" href="css/events.css">`)

**BEFORE:**
```html
  <link rel="stylesheet" href="css/events.css">
</head>
```

**AFTER:**
```html
  <link rel="stylesheet" href="css/events.css">
  
  <!-- Instagram In-App Browser Banner -->
  <script src="js/instagram-banner.js"></script>
</head>
```

---

### 7. `gallery.html`

**Location:** After line 16 (after the EXIF.js script)

**BEFORE:**
```html
  <!-- EXIF.js for reading image metadata -->
  <script src="https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js"></script>
</head>
```

**AFTER:**
```html
  <!-- EXIF.js for reading image metadata -->
  <script src="https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js"></script>
  
  <!-- Instagram In-App Browser Banner -->
  <script src="js/instagram-banner.js"></script>
</head>
```

---

### 8. `privacy-policy.html`

**Location:** After line 17 (after `</style>`)

**BEFORE:**
```html
    </style>
</head>
```

**AFTER:**
```html
    </style>
    
    <!-- Instagram In-App Browser Banner -->
    <script src="js/instagram-banner.js"></script>
</head>
```

---

## SUMMARY OF CHANGES

### Files Created:
- `pizzadojo2go/js/instagram-banner.js` (302 lines)

### Files Modified:
1. `pizzadojo2go/index.html` - Add 3 lines in `<head>`
2. `pizzadojo2go/shop.html` - Add 3 lines in `<head>`
3. `pizzadojo2go/menu.html` - Add 3 lines in `<head>`
4. `pizzadojo2go/about.html` - Add 3 lines in `<head>`
5. `pizzadojo2go/contact.html` - Add 3 lines in `<head>`
6. `pizzadojo2go/events.html` - Add 3 lines in `<head>`
7. `pizzadojo2go/gallery.html` - Add 3 lines in `<head>`
8. `pizzadojo2go/privacy-policy.html` - Add 3 lines in `<head>`

### Total Changes:
- 1 new file (302 lines)
- 8 files modified (3 lines each = 24 lines added total)

---

## BANNER BEHAVIOR SPECIFICATIONS

✅ **Detection:** Checks user agent for Instagram/FBAN/FBAV  
✅ **Position:** Fixed below nav bar (top: 60px, small gap)  
✅ **Design:** Dark background (rgba(0,0,0,0.9)), gold border (#d4af37), compact single line  
✅ **Content:** "For best experience, open in Safari/Chrome" + "Open in Browser" button + X dismiss  
✅ **Auto-dismiss:** After 10 seconds AND on X click (both work)  
✅ **iOS Behavior:** Button copies URL to clipboard, shows "Copied! Paste in Safari" tooltip  
✅ **Android Behavior:** Button attempts `intent://` redirect, shows "Failed - try manually" if fails  
✅ **Session Memory:** Dismissed state stored in sessionStorage (won't show again this session)  
✅ **Responsive:** Banner adjusts body padding to prevent content overlap  

---

## IMPLEMENTATION STATUS

⚠️ **NOT YET IMPLEMENTED** - Code is ready for review and approval.

Once approved, the changes will be:
1. JavaScript file created
2. Script tags added to all 8 HTML files
3. Committed and pushed to GitHub

---

## NOTES FOR REVIEW

- All styling is inline (no external CSS file needed)
- Banner uses existing site fonts (Bangers, Varela Round)
- Banner uses existing site colors (dojo-gold, dojo-cream)
- No dependencies required (vanilla JavaScript)
- Graceful fallbacks for older browsers
- Non-intrusive design (doesn't block content, auto-dismisses)
