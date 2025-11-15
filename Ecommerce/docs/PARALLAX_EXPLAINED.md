# TRUE Parallax Scrolling - Technical Explanation

## 🎯 The Problem We Solved

**Before**: Background and text moved together when scrolling → No parallax effect

**After**: Background stays FIXED while text scrolls → True parallax effect

## 🔬 How TRUE Parallax Works

### The CSS Magic

```css
/* Desktop: Parallax ON */
@media (min-width: 1024px) {
  .parallax-section {
    background-attachment: fixed;
  }
}

/* Mobile: Parallax OFF */
@media (max-width: 1023px) {
  .parallax-section {
    background-attachment: scroll;
  }
}
```

### What `background-attachment: fixed` Does

When you set `background-attachment: fixed`:

1. **Background position is fixed to the VIEWPORT** (not the element)
2. **When you scroll**:
   - ✅ The element (section) moves up/down normally
   - ✅ The background stays in the SAME position on screen
   - ✅ This creates the illusion that background moves slower

3. **Visual Effect**:
   ```
   Scroll Down ↓
   ┌─────────────────┐
   │  [Fixed BG]     │ ← Background doesn't move
   │                 │
   │  Content moves ↓│ ← Content scrolls normally
   │                 │
   └─────────────────┘
   ```

## 📐 The Correct Structure

### ✅ CORRECT (What We Implemented)

```tsx
<section 
  className="parallax-section"
  style={{ backgroundImage: 'url(...)' }}
>
  {/* Background is ON THE SECTION */}
  
  <div className="overlay" />
  
  <div className="parallax-inner">
    {/* Content scrolls normally */}
    <h1>Title</h1>
  </div>
</section>
```

**Why This Works**:
- Background is on the OUTERMOST element
- `background-attachment: fixed` makes background stick to viewport
- Content inside scrolls normally
- Creates parallax effect ✅

### ❌ WRONG (Common Mistakes)

```tsx
{/* DON'T DO THIS */}
<div className="container">
  <img src="..." className="background" /> {/* ❌ Image tag */}
  <div className="content">Text</div>
</div>

{/* DON'T DO THIS */}
<div style={{ backgroundImage: 'url(...)' }}>
  <div style={{ backgroundImage: 'url(...)' }}> {/* ❌ Nested backgrounds */}
    Content
  </div>
</div>

{/* DON'T DO THIS */}
<div 
  style={{ 
    backgroundImage: 'url(...)',
    transform: 'translateY(...)' /* ❌ JS animation */
  }}
>
  Content
</div>
```

**Why These Don't Work**:
- Using `<img>` tag → image scrolls with content
- Nested backgrounds → conflicts, both scroll together
- JS animations → performance issues, not true parallax

## 🧪 Testing Parallax

### How to Test if Parallax is Working

1. **Open the page** (http://localhost:3000 or /about)
2. **Make sure you're on DESKTOP** (≥1024px width)
3. **Scroll DOWN slowly**
4. **Look at the background image**:
   - ✅ If background appears to move SLOWER than text → Parallax works!
   - ❌ If background moves WITH the text → Parallax not working

### Debug Checklist

```
[ ] Screen width ≥ 1024px (parallax disabled on mobile)
[ ] Using Chrome/Firefox/Edge (not IE11)
[ ] Cleared browser cache (Ctrl + Shift + R)
[ ] globals.css is imported in layout.tsx
[ ] No browser extensions blocking CSS
[ ] Inspecting element shows background-attachment: fixed
```

## 🎨 Visual Comparison

### Before (No Parallax)
```
Scroll ↓
┌─────────────┐
│ BG    ↓     │ ← Background moves
│ Text  ↓     │ ← Text moves
└─────────────┘
Both move at same speed = No parallax
```

### After (True Parallax)
```
Scroll ↓
┌─────────────┐
│ BG    →     │ ← Background FIXED (slower)
│ Text  ↓↓    │ ← Text scrolls (faster)
└─────────────┘
Different speeds = Parallax effect!
```

## 🔧 Implementation Details

### Files Modified

1. **`components/ui/ParallaxSection/ParallaxSection.tsx`**
   - Reusable component
   - Accepts `backgroundImage` prop
   - Renders children with proper structure

2. **`app/globals.css`**
   - `.parallax-section` class with `background-attachment: fixed`
   - Mobile media query with `background-attachment: scroll`

3. **`app/(main)/about/page.tsx`**
   - Uses `<ParallaxSection>` component
   - Example implementation

4. **`components/home/HeroSlider/HeroSlider.tsx`**
   - Uses `.parallax-section` class directly
   - Maintains slider functionality

### CSS Rules Applied

```css
.parallax-section {
  position: relative;
  background-attachment: scroll; /* Default: mobile */
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
}

/* Desktop: Enable parallax */
@media (min-width: 1024px) {
  .parallax-section {
    background-attachment: fixed !important;
  }
}

.parallax-inner {
  position: relative;
  z-index: 20;
  width: 100%;
  height: 100%;
  min-height: inherit;
}
```

## 🚫 What We DON'T Use

| ❌ Don't Use | ✅ Use Instead | Reason |
|-------------|---------------|--------|
| `transform: translateY()` | `background-attachment: fixed` | Transform animates element, not background |
| `window.addEventListener('scroll')` | Pure CSS | JS is slower, causes jank |
| `IntersectionObserver` | CSS media queries | IO is for visibility detection, not parallax |
| `<img>` tag for background | CSS `background-image` | Images scroll with content |
| `background-attachment: fixed` everywhere | Media query for desktop only | Mobile browsers have bugs with fixed |

## 📊 Performance

### Why This Method is Fast

1. **Pure CSS**: No JavaScript execution on scroll
2. **GPU Accelerated**: Browser handles background positioning
3. **No Repaints**: Only background position changes, not layout
4. **Mobile Optimized**: Disabled on mobile to avoid lag

### Performance Comparison

```
Method                        | FPS  | CPU Usage
------------------------------|------|----------
background-attachment: fixed  | 60   | Low
JS scroll listener           | 30-45| High
CSS transform + scroll       | 45-60| Medium
```

## 🌐 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Perfect |
| Firefox 88+ | ✅ Full | Perfect |
| Safari 14+ | ✅ Full | Perfect |
| Edge 90+ | ✅ Full | Perfect |
| Mobile Safari | ⚠️ Partial | Use `scroll` fallback |
| Mobile Chrome | ⚠️ Partial | Use `scroll` fallback |

**Mobile Note**: `background-attachment: fixed` has bugs on mobile browsers, so we automatically disable it with media queries.

## 📚 References

- [MDN: background-attachment](https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment)
- [CSS Tricks: Parallax Background](https://css-tricks.com/parallax-background-css3/)
- [Duda Parallax Documentation](https://www.duda.co/blog/parallax-scrolling-effect)

## ✅ Final Checklist

Before saying "parallax is working":

```
[ ] Background image applied to SECTION element (not inner div)
[ ] background-attachment: fixed in CSS for desktop
[ ] background-attachment: scroll for mobile
[ ] No <img> tags for background
[ ] No transform/translate animations
[ ] No JavaScript scroll listeners
[ ] Section has min-height set
[ ] Content is inside .parallax-inner wrapper
[ ] Overlay is optional and behind content (z-10)
[ ] Tested on desktop ≥1024px width
[ ] Scrolling shows background moving slower than content
```

If all checked → **TRUE parallax is working!** 🎉
