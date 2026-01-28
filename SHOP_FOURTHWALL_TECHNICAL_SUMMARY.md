# Shop Page - Fourthwall Integration Technical Summary

## Overview

The Shop page (`shop.html`) implements a **Level 3 integration** with Fourthwall, displaying custom product cards that maintain the pizzadojo2go.com aesthetic while linking directly to Fourthwall product pages for checkout. This approach provides full design control while leveraging Fourthwall's e-commerce infrastructure.

---

## Integration Level: Level 3 (Custom Product Cards)

### What is Level 3?
- **Level 1:** Simple link to Fourthwall store (redirects away from site)
- **Level 2:** Iframe embed (keeps users on site, but limited styling control)
- **Level 3:** Custom product cards with direct links (full design control, checkout on Fourthwall)

The current implementation uses **Level 3**, which means:
- Product cards are fully custom HTML/CSS
- Product images are served via Fourthwall's image proxy
- "Buy Now" buttons link directly to individual Fourthwall product pages
- Checkout happens on Fourthwall's domain (opens in new tab)
- Full control over styling, layout, and user experience

---

## File Structure

### HTML File: `shop.html`
- **Location:** `pizzadojo2go/shop.html`
- **Structure:** Standard page layout with navigation, overlay, container, and main content
- **Products:** Three product cards in a responsive grid

### CSS File: `css/shop.css`
- **Location:** `pizzadojo2go/css/shop.css`
- **Purpose:** All shop page-specific styling
- **Dependencies:** Inherits from `css/base.css` and `layout.css`

---

## Product Data Structure

### Current Products (in order displayed)

1. **Pizza Dojo Dragon Hoodie**
   - Price: $45.00
   - Image: Fourthwall imgproxy URL
   - Product URL: `https://pizza-dojo-shop.fourthwall.com/products/pizza-dojo-dragon-hoodie`

2. **Pizza Dojo Baseball Hat**
   - Price: $25.00
   - Image: Fourthwall imgproxy URL
   - Product URL: `https://pizza-dojo-shop.fourthwall.com/products/pizza-dojo-baseball-hat`

3. **Pizza Dojo Dragon T-Shirt**
   - Price: $30.00
   - Image: Fourthwall imgproxy URL
   - Product URL: `https://pizza-dojo-shop.fourthwall.com/products/pizza-dojo-dragon-t-shirt`

---

## HTML Implementation

### Product Card Structure

Each product card follows this HTML structure:

```html
<div class="product-card">
  <div class="product-image">
    <img src="[FOURTHWALL_IMGPROXY_URL]" alt="[PRODUCT_NAME]" loading="lazy">
  </div>
  <div class="product-info">
    <h2 class="product-name">[PRODUCT_NAME]</h2>
    <p class="product-price">$[PRICE]</p>
    <a href="[FOURTHWALL_PRODUCT_URL]" target="_blank" class="btn buy-btn">Buy Now</a>
  </div>
</div>
```

### Key HTML Elements

1. **Product Grid Container** (`.products-grid`)
   - Wraps all product cards
   - Uses CSS Grid for layout
   - Responsive: 3 columns (desktop) → 1 column (mobile)

2. **Product Card** (`.product-card`)
   - Individual product container
   - Contains image and product info sections
   - Styled with dojo aesthetic (dark background, gold border)

3. **Product Image** (`.product-image`)
   - Container for product image
   - Fixed height (300px desktop, 250px mobile)
   - Uses `object-fit: cover` for consistent sizing

4. **Product Image Tag** (`<img>`)
   - Source: Fourthwall imgproxy URL
   - `loading="lazy"` for performance
   - Alt text for accessibility

5. **Product Info** (`.product-info`)
   - Contains product name, price, and buy button
   - Flexbox layout for vertical alignment

6. **Buy Now Button** (`.buy-btn`)
   - Links to Fourthwall product page
   - `target="_blank"` opens in new tab
   - Styled to match dojo aesthetic

---

## CSS Implementation

### Grid Layout

```css
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columns desktop */
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 2rem 0;
  padding: 0 1rem;
}
```

**Mobile Responsive:**
```css
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr; /* 1 column mobile */
    gap: 1.5rem;
    padding: 0 0.5rem;
  }
}
```

### Product Card Styling

```css
.product-card {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(212, 175, 55, 0.4); /* Dojo gold */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  transition: all 0.3s ease;
}
```

**Hover Effect:**
```css
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 24px rgba(212, 175, 55, 0.5);
  border-color: rgba(212, 175, 55, 0.7);
}
```

### Typography

- **Product Name:** Bangers font (matches site headers)
- **Product Price:** Varela Round font (matches body text)
- **Buy Button:** Bangers font

### Color Scheme

- **Background:** `rgba(0, 0, 0, 0.5)` (semi-transparent black)
- **Border:** `rgba(212, 175, 55, 0.4)` (dojo gold, 40% opacity)
- **Product Name:** `var(--dojo-gold)` (#d4af37)
- **Price:** `var(--dojo-cream)` (#f5e6d3)
- **Button Hover:** Gold background with dark text

---

## Fourthwall Integration Details

### Image Proxy Service

**URL Format:**
```
https://imgproxy.fourthwall.com/[HASH]/w:[WIDTH]/sm:1/enc/[ENCODED_PATH]
```

**Parameters:**
- `w:[WIDTH]`: Image width (e.g., `w:720`, `w:1920`)
- `sm:1`: Smart mode enabled (automatic optimization)
- `enc/[ENCODED_PATH]`: Encoded image path (secure, prevents direct access)

**Example:**
```
https://imgproxy.fourthwall.com/eCEO8Mk22aMjwDQ1cEjj5tWxAtM8WLGUPKbSt-Vj-KU/w:720/sm:1/enc/7alboQef2u-QER0t/...
```

**Benefits:**
- Automatic image optimization
- CDN delivery for fast loading
- Secure image URLs
- Responsive sizing support

### Product URLs

**Format:**
```
https://pizza-dojo-shop.fourthwall.com/products/[PRODUCT_SLUG]
```

**Product Slugs:**
- `pizza-dojo-dragon-hoodie`
- `pizza-dojo-baseball-hat`
- `pizza-dojo-dragon-t-shirt`

**Behavior:**
- Opens in new tab (`target="_blank"`)
- Full Fourthwall checkout experience
- User returns to pizzadojo2go.com after purchase (if they close tab)

---

## User Flow

1. **User visits** `pizzadojo2go.com/shop.html`
2. **Sees** custom product cards with images, names, prices
3. **Clicks** "Buy Now" button on desired product
4. **Opens** Fourthwall product page in new tab
5. **Completes** checkout on Fourthwall
6. **Returns** to pizzadojo2go.com (original tab still open)

---

## Performance Optimizations

### Lazy Loading
- Product images use `loading="lazy"` attribute
- Images load only when scrolled into viewport
- Reduces initial page load time

### Image Optimization
- Fourthwall imgproxy automatically optimizes images
- Responsive sizing via URL parameters
- CDN delivery for fast global access

### CSS Transitions
- Smooth hover effects with `transition: all 0.3s ease`
- No JavaScript required for animations
- Hardware-accelerated transforms

---

## Responsive Design

### Desktop (≥769px)
- 3-column grid layout
- Product image height: 300px
- Full padding and spacing
- Larger font sizes

### Mobile (≤768px)
- 1-column grid layout
- Product image height: 250px
- Reduced padding and spacing
- Smaller font sizes for readability
- Touch-friendly button sizes

---

## Maintenance & Updates

### Adding a New Product

1. **Get product data from Fourthwall:**
   - Product image URL (imgproxy)
   - Product name
   - Product price
   - Product URL (slug)

2. **Add HTML card to `shop.html`:**
   ```html
   <div class="product-card">
     <div class="product-image">
       <img src="[NEW_IMGPROXY_URL]" alt="[PRODUCT_NAME]" loading="lazy">
     </div>
     <div class="product-info">
       <h2 class="product-name">[PRODUCT_NAME]</h2>
       <p class="product-price">$[PRICE]</p>
       <a href="[FOURTHWALL_PRODUCT_URL]" target="_blank" class="btn buy-btn">Buy Now</a>
     </div>
   </div>
   ```

3. **Place in `.products-grid` container**

4. **Test on desktop and mobile**

### Updating Product Information

- **Price:** Update `<p class="product-price">` text
- **Name:** Update `<h2 class="product-name">` text
- **Image:** Replace imgproxy URL in `<img src="">`
- **URL:** Update `href` in buy button

### Removing a Product

- Delete the entire `.product-card` div from HTML
- Grid will automatically adjust

---

## Advantages of Level 3 Integration

1. **Full Design Control**
   - Complete control over layout, colors, fonts, spacing
   - Matches site aesthetic perfectly
   - No iframe limitations

2. **Performance**
   - No iframe overhead
   - Direct image loading
   - Lazy loading support

3. **SEO Benefits**
   - Product content is in HTML (not iframe)
   - Search engines can index product names and prices
   - Better accessibility

4. **User Experience**
   - Seamless integration with site design
   - Fast page loads
   - Clear product presentation

5. **Maintenance**
   - Easy to update products
   - Simple HTML structure
   - No complex JavaScript required

---

## Limitations & Considerations

### Checkout Experience
- **Limitation:** Checkout happens on Fourthwall domain (new tab)
- **Impact:** User leaves pizzadojo2go.com for purchase
- **Mitigation:** Original tab remains open, user can return

### Price Updates
- **Manual:** Prices must be updated in HTML if they change on Fourthwall
- **Solution:** Regular review of product prices
- **Future:** Could implement API integration for automatic price sync (not currently implemented)

### Product Availability
- **Manual:** No automatic detection of out-of-stock items
- **Solution:** Fourthwall will handle availability on their product pages
- **Future:** Could add API integration to hide unavailable products

### Image URLs
- **Static:** Image URLs are hardcoded in HTML
- **Impact:** If Fourthwall changes image URLs, they must be updated manually
- **Solution:** Image URLs are typically stable, but should be verified periodically

---

## Technical Dependencies

### CSS Files (loaded in order)
1. `css/base.css` - CSS resets and base styles
2. `layout.css` - Global layout, navigation, variables
3. `css/shop.css` - Shop page-specific styles

### Fonts (Google Fonts)
- **Bangers:** Product names, buy buttons, page title
- **Varela Round:** Product prices, body text

### No JavaScript Required
- Pure HTML/CSS implementation
- No external libraries needed
- No API calls required

---

## Testing Checklist

### Desktop Testing
- [ ] All 3 products display correctly
- [ ] Images load properly
- [ ] Hover effects work
- [ ] Buy buttons link to correct Fourthwall pages
- [ ] Links open in new tab
- [ ] Grid layout is 3 columns
- [ ] Spacing and alignment look correct

### Mobile Testing
- [ ] Grid layout is 1 column
- [ ] Images are properly sized
- [ ] Text is readable
- [ ] Buttons are touch-friendly
- [ ] No horizontal scrolling
- [ ] Spacing is appropriate

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Testing
- [ ] Images lazy load correctly
- [ ] Page load time is acceptable
- [ ] No layout shift during image loading

---

## Future Enhancement Possibilities

1. **API Integration**
   - Fetch product data from Fourthwall API
   - Automatic price updates
   - Dynamic product availability

2. **Product Search/Filter**
   - Add search functionality
   - Filter by category or price range

3. **Product Details Modal**
   - Show product details without leaving page
   - Quick view functionality

4. **Wishlist/Favorites**
   - Save products for later
   - Share wishlist functionality

5. **Analytics Integration**
   - Track product views
   - Track click-through rates
   - Conversion tracking

---

## Summary

The Shop page uses a **Level 3 Fourthwall integration** with custom product cards that:
- Display products with full design control
- Link directly to Fourthwall product pages
- Maintain the pizzadojo2go.com aesthetic
- Provide excellent performance with lazy loading
- Work seamlessly on desktop and mobile
- Require no JavaScript or complex dependencies

The implementation is simple, maintainable, and provides a great user experience while leveraging Fourthwall's robust e-commerce infrastructure for checkout and fulfillment.

---

**Last Updated:** January 2026  
**Integration Level:** Level 3 (Custom Product Cards)  
**Store URL:** `pizza-dojo-shop.fourthwall.com`  
**Current Products:** 3 (Hoodie, Hat, T-Shirt)
