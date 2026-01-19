# Gallery Setup Instructions

## Adding Images to the Gallery

1. **Add your images** to this folder (`assets/images/gallery/`)
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.bmp`
   - Images will be automatically sorted by EXIF `DateTimeOriginal` metadata (newest first)

2. **Generate the image list** by running:
   ```bash
   node scripts/generate-gallery-list.js
   ```
   This creates/updates `gallery.json` with all image filenames.

3. **Refresh the gallery page** in your browser to see the new images.

## How It Works

- The gallery automatically loads all images listed in `gallery.json`
- Images are sorted by EXIF `DateTimeOriginal` (if available), with newest photos appearing first
- If EXIF data is missing, images fall back to file modification date or filename order
- Click any image to open it in a full-screen lightbox
- Use arrow buttons or keyboard arrows (← →) to navigate between images
- Press `Esc` or click the × button to close the lightbox

## Manual Setup (Alternative)

If you prefer not to use the script, you can manually edit `gallery.json`:

```json
{
  "images": [
    "pizza1.jpg",
    "pizza2.jpg",
    "pizza3.jpg"
  ]
}
```

## Notes

- Images are displayed in a responsive two-column grid (single column on mobile)
- The gallery matches the Pizza Dojo aesthetic with brown/gold color scheme
- All images are lazy-loaded for better performance
