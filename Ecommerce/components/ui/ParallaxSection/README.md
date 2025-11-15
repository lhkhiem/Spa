# ParallaxSection Component

A reusable component that implements **TRUE Duda-style parallax scrolling effect** using pure CSS.

## ✅ What This Does

- **Desktop (≥1024px)**: Background image stays FIXED while content scrolls over it (parallax effect)
- **Mobile/Tablet (<1024px)**: Normal scrolling (no parallax, prevents mobile browser bugs)
- **Pure CSS**: No JavaScript scroll listeners, no performance issues
- **Reusable**: Works with any background image and content

## 🎯 Key Features

✅ Single block structure (no stacked elements)  
✅ Background via CSS `background-image` on the section  
✅ Uses `background-attachment: fixed` for desktop parallax  
✅ Mobile fallback with `background-attachment: scroll`  
✅ No transform/scale/translateY animations  
✅ No visible gaps or glitches during scroll  
✅ Customizable overlay opacity  
✅ Responsive height options  

## 📖 Usage

### Basic Example

```tsx
import ParallaxSection from '@/components/ui/ParallaxSection/ParallaxSection';

<ParallaxSection backgroundImage="/images/hero.jpg">
  <h1>Your Title Here</h1>
  <p>Your content here</p>
  <button>Call to Action</button>
</ParallaxSection>
```

### Full Example with Props

```tsx
<ParallaxSection 
  backgroundImage="https://images.unsplash.com/photo-1234567890"
  minHeight="tall"
  overlay={true}
  overlayOpacity={50}
  className="my-custom-class"
>
  <div className="text-center text-white">
    <h1 className="text-5xl font-bold mb-4">
      Welcome to Our Site
    </h1>
    <p className="text-xl mb-8">
      Discover amazing products
    </p>
    <Button>Shop Now</Button>
  </div>
</ParallaxSection>
```

## 🔧 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `backgroundImage` | `string` | **Required** | URL of the background image |
| `children` | `React.ReactNode` | **Required** | Content to display inside the section |
| `minHeight` | `'full' \| 'tall' \| 'medium' \| 'short'` | `'tall'` | Height preset |
| `overlay` | `boolean` | `true` | Show dark overlay for better text visibility |
| `overlayOpacity` | `number` | `50` | Overlay opacity (0-100) |
| `className` | `string` | `''` | Additional CSS classes |

### Height Options

- `'full'`: 100vh (full screen)
- `'tall'`: 60vh on desktop, 50vh on mobile
- `'medium'`: 50vh on desktop, 40vh on mobile
- `'short'`: 40vh on desktop, 30vh on mobile

## 🎨 How It Works

### Desktop (Parallax Active)

```css
.parallax-section {
  background-attachment: fixed; /* Background stays in place */
  background-position: center;
  background-size: cover;
}

.parallax-inner {
  /* Content scrolls normally */
  position: relative;
  z-index: 20;
}
```

When you scroll:
- ✅ Background image stays FIXED (doesn't move)
- ✅ Content scrolls normally over the background
- ✅ Creates the "parallax" effect

### Mobile (Parallax Disabled)

```css
@media (max-width: 1024px) {
  .parallax-section {
    background-attachment: scroll; /* Normal scrolling */
  }
}
```

## ⚠️ Important Notes

1. **Desktop Only**: Parallax effect only works on screens ≥1024px
2. **No JavaScript**: Pure CSS implementation for best performance
3. **Single Block**: Don't nest multiple ParallaxSections inside each other
4. **High-Res Images**: Use high-quality images (1920x1080 or larger) for best results

## 🐛 Troubleshooting

### "Background and content move together"

**Problem**: This means `background-attachment: fixed` isn't applied.

**Solution**:
1. Check you're testing on desktop (≥1024px screen)
2. Clear browser cache (Ctrl + Shift + R)
3. Make sure `globals.css` is imported in your layout

### "Gaps appear during scroll"

**Problem**: Mobile browsers don't support `background-attachment: fixed` well.

**Solution**: The component automatically uses `scroll` on mobile. Make sure you're using the latest version.

### "Image looks blurry"

**Problem**: Image resolution too low for the viewport.

**Solution**: Use images at least 1920x1080 or larger.

## 📝 Example Use Cases

### Hero Section
```tsx
<ParallaxSection 
  backgroundImage="/images/hero.jpg"
  minHeight="full"
  overlayOpacity={40}
>
  <h1>Welcome to Banyco</h1>
  <p>Your trusted spa equipment supplier</p>
</ParallaxSection>
```

### About Page Header
```tsx
<ParallaxSection 
  backgroundImage="/images/about.jpg"
  minHeight="medium"
  overlayOpacity={60}
>
  <h1>"Our business is good when your business is better."</h1>
</ParallaxSection>
```

### Call-to-Action Section
```tsx
<ParallaxSection 
  backgroundImage="/images/cta.jpg"
  minHeight="short"
  overlay={false}
>
  <div className="bg-white/90 p-8 rounded-lg">
    <h2>Ready to get started?</h2>
    <Button>Contact Us</Button>
  </div>
</ParallaxSection>
```

## 🔗 Related

- `components/home/HeroSlider/HeroSlider.tsx` - Uses parallax effect
- `app/(main)/about/page.tsx` - Example implementation
- `app/globals.css` - Contains `.parallax-section` CSS
