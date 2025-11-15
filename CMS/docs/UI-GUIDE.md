# PressUp CMS - UI Design Guide

## Overview
This document explains the design system, components, and usage patterns for the PressUp CMS admin interface, inspired by Strapi's modern and clean aesthetic.

## Design System

### Color Palette

Our design system uses CSS custom properties (CSS variables) for theming, allowing seamless light/dark mode switching.

#### Light Mode
- **Primary**: `hsl(262 83% 58%)` - Purple accent color
- **Background**: `hsl(0 0% 100%)` - White
- **Foreground**: `hsl(222.2 84% 4.9%)` - Near black
- **Muted**: `hsl(210 40% 96.1%)` - Light gray
- **Border**: `hsl(214.3 31.8% 91.4%)` - Gray borders

#### Dark Mode  
- **Primary**: `hsl(262 83% 58%)` - Same purple (consistent)
- **Background**: `hsl(222.2 84% 4.9%)` - Dark blue-black
- **Foreground**: `hsl(210 40% 98%)` - Off-white
- **Muted**: `hsl(217.2 32.6% 17.5%)` - Dark gray
- **Border**: `hsl(217.2 32.6% 17.5%)` - Dark borders

### Typography

**Fonts**:
- Primary: Inter (system-ui fallback)
- Monospace: JetBrains Mono (for code)

**Sizes**:
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)

**Weights**:
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing Scale

Using Tailwind's default scale (based on 4px units):
- `1` = 0.25rem (4px)
- `2` = 0.5rem (8px)
- `3` = 0.75rem (12px)
- `4` = 1rem (16px)
- `6` = 1.5rem (24px)
- `8` = 2rem (32px)

### Border Radius

- `rounded-sm`: 0.125rem (2px)
- `rounded-md`: 0.375rem (6px)  
- `rounded-lg`: 0.5rem (8px)
- `rounded-xl`: 0.75rem (12px)
- `rounded-2xl`: 1rem (16px)

### Shadows

- `shadow-sm`: Subtle elevation
- `shadow`: Standard elevation
- `shadow-md`: Moderate elevation
- `shadow-lg`: High elevation
- `shadow-xl`: Maximum elevation

## Layout Components

### App Shell

The admin interface uses a fixed sidebar + header layout:

```tsx
<div className="flex h-screen">
  <AppSidebar /> {/* Fixed left sidebar, 256px width */}
  <div className="flex flex-1 flex-col pl-64">
    <AppHeader /> {/* Sticky header */}
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
</div>
```

### AppSidebar

**Location**: `/components/app-sidebar.tsx`

Features:
- Fixed left position (w-64 = 256px)
- Collapsible sections with icons
- Active state highlighting
- Smooth hover transitions
- Scrollable navigation area

Usage:
```tsx
import { AppSidebar } from '@/components/app-sidebar';

<AppSidebar />
```

### AppHeader

**Location**: `/components/app-header.tsx`

Features:
- Sticky positioning
- Search bar with keyboard shortcut (Ctrl+K)
- Theme toggle (light/dark)
- Notifications indicator
- User menu with logout

Usage:
```tsx
import { AppHeader } from '@/components/app-header';

<AppHeader />
```

### DashboardLayout

**Location**: `/components/dashboard-layout.tsx`

Wrapper component that combines sidebar + header:

```tsx
import { DashboardLayout } from '@/components/dashboard-layout';

export default function Page() {
  return (
    <DashboardLayout>
      <YourContent />
    </DashboardLayout>
  );
}
```

## Theme System

### ThemeProvider

**Location**: `/hooks/use-theme.tsx`

Manages light/dark mode with localStorage persistence.

```tsx
import { ThemeProvider } from '@/hooks/use-theme';

// In root layout:
<ThemeProvider defaultTheme="light">
  {children}
</ThemeProvider>
```

### useTheme Hook

```tsx
import { useTheme } from '@/hooks/use-theme';

function Component() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

## Common UI Patterns

### Card Component

Standard card styling:

```tsx
<div className="rounded-lg border border-border bg-card p-6 shadow-sm">
  <h3 className="text-lg font-semibold text-card-foreground">Title</h3>
  <p className="text-sm text-muted-foreground">Description</p>
</div>
```

### Stat Card

For dashboard metrics:

```tsx
<div className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
  <div className="flex items-start justify-between">
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Label</p>
      <p className="text-3xl font-bold text-card-foreground">123</p>
    </div>
    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
      <Icon className="h-5 w-5 text-blue-600" />
    </div>
  </div>
  <div className="mt-4 flex items-center gap-2 text-xs">
    <span className="font-medium text-green-600">+12%</span>
    <span className="text-muted-foreground">from last month</span>
  </div>
</div>
```

### Action Card (Quick Link)

Clickable card with hover effects:

```tsx
<Link
  href="/path"
  className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary"
>
  <div className="flex items-start gap-4">
    <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/20">
      <Icon className="h-6 w-6 text-blue-600" />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
        Title
      </h3>
      <p className="text-sm text-muted-foreground">Description</p>
    </div>
    <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
  </div>
</Link>
```

### Button Variants

Primary button:
```tsx
<button className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors">
  Save
</button>
```

Secondary button:
```tsx
<button className="rounded-lg border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
  Cancel
</button>
```

Destructive button:
```tsx
<button className="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90 transition-colors">
  Delete
</button>
```

Icon button:
```tsx
<button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
  <Icon className="h-4 w-4" />
</button>
```

### Input Fields

Standard input:
```tsx
<input
  type="text"
  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
  placeholder="Enter text..."
/>
```

Search input:
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <input
    type="search"
    className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
    placeholder="Search..."
  />
</div>
```

### Badges

Status badge:
```tsx
<span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/20 dark:text-green-400">
  Published
</span>
```

Variants:
- Success: `bg-green-100 text-green-800`
- Warning: `bg-yellow-100 text-yellow-800`
- Error: `bg-red-100 text-red-800`
- Info: `bg-blue-100 text-blue-800`
- Neutral: `bg-gray-100 text-gray-800`

### Empty States

```tsx
<div className="rounded-lg border border-border bg-card p-12 text-center">
  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
    <Icon className="h-6 w-6 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-medium text-card-foreground mb-2">
    No items yet
  </h3>
  <p className="text-sm text-muted-foreground max-w-md mx-auto">
    Get started by creating your first item.
  </p>
  <button className="mt-6 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors">
    Create Item
  </button>
</div>
```

### Loading States

Skeleton loader:
```tsx
<div className="h-32 animate-pulse rounded-lg border border-border bg-card" />
```

Spinner:
```tsx
<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
```

## Icons

We use **lucide-react** for icons.

```tsx
import { Icon } from 'lucide-react';

<Icon className="h-4 w-4" /> // Small
<Icon className="h-5 w-5" /> // Medium
<Icon className="h-6 w-6" /> // Large
```

Common icons:
- `LayoutDashboard` - Dashboard
- `FileText` - Posts/Documents
- `Image` - Media
- `Users` - Users
- `Settings` - Settings
- `Search` - Search
- `Bell` - Notifications
- `LogOut` - Logout
- `Moon` / `Sun` - Theme toggle

## Utilities

### cn() Helper

Combines class names with tailwind-merge:

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-class', condition && 'conditional-class')} />
```

### Scrollbar Styling

Custom thin scrollbar:

```tsx
<div className="scrollbar-thin overflow-y-auto">
  {/* Content */}
</div>
```

## Responsive Design

Mobile breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Responsive grid */}
</div>
```

## Accessibility

- Use semantic HTML (`<main>`, `<nav>`, `<header>`)
- Include `aria-label` for icon buttons
- Ensure proper focus states
- Support keyboard navigation
- Maintain color contrast ratios

## Best Practices

1. **Consistency**: Use design tokens consistently across all components
2. **Performance**: Lazy-load heavy components
3. **Accessibility**: Always include proper ARIA attributes
4. **Responsiveness**: Test on multiple screen sizes
5. **Theme Support**: Ensure components work in both light and dark modes

## File Structure

```
frontend/admin/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider
│   ├── globals.css         # Global styles & design tokens
│   ├── page.tsx            # Login page
│   └── dashboard/
│       ├── page.tsx        # Dashboard home
│       ├── posts/          # Posts management
│       ├── topics/         # Topics management
│       └── tags/           # Tags management
├── components/
│   ├── app-sidebar.tsx     # Main navigation sidebar
│   ├── app-header.tsx      # Top header bar
│   └── dashboard-layout.tsx # Dashboard layout wrapper
├── hooks/
│   └── use-theme.tsx       # Theme management hook
├── lib/
│   └── utils.ts            # Utility functions (cn, etc.)
└── tailwind.config.js      # Tailwind configuration
```

## Next Steps

1. **Content List Views**: Implement table components with filters and search
2. **Detail/Edit Forms**: Two-column layout with main content + meta sidebar
3. **Media Library**: Grid view with upload functionality
4. **Settings Pages**: Grouped cards for different settings
5. **Analytics Dashboard**: Charts and metrics visualization
6. **RBAC UI**: User/role management interface

## Support

For questions or contributions, refer to the main project documentation.
