# Posts List Page - Feature Guide

## 🎯 Quick Feature Reference

### Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Posts                                     [Back] [New Post]  │
│ 45 posts total                                               │
├─────────────────────────────────────────────────────────────┤
│ 🔍 [Search by title, slug, author...]    Show: [20 ▼]      │
├─────────────────────────────────────────────────────────────┤
│ Title ↕│Slug    │Author │Status ↕│Date ↕  │Actions         │
├────────┼────────┼───────┼────────┼────────┼────────────────┤
│ Post 1 │post-1  │Admin  │[Draft▼]│Oct 28  │[✏Edit] [🗑Del] │
│ Post 2 │post-2  │John   │[Pub ▼] │Oct 27  │[✏Edit] [🗑Del] │
│ Post 3 │post-3  │Jane   │[Arch▼] │Oct 26  │[✏Edit] [🗑Del] │
└─────────────────────────────────────────────────────────────┘
│ Showing 1 to 20 of 45        [Prev] 1 2 3 ... 5 [Next]     │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Feature Details

### 1. Search Bar
**Location:** Top left of table
**Functionality:**
- Real-time filtering as you type
- Searches across: title, slug, author name, status
- Case-insensitive matching
- Resets to page 1 when searching
- Shows "No results" message if nothing matches

**Example searches:**
- `"draft"` → Shows all draft posts
- `"admin"` → Shows posts by Admin author
- `"getting-started"` → Shows posts with matching slug

---

### 2. Page Size Selector
**Location:** Top right of table
**Options:**
- `10` - Show 10 posts per page
- `20` - Show 20 posts per page (default)
- `50` - Show 50 posts per page
- `All` - Show all posts (no pagination)

**Behavior:**
- Immediately applies on selection
- Resets to page 1
- Pagination controls hide when "All" selected

---

### 3. Sortable Columns

#### Title Column (Sortable ↕)
**Default:** Unsorted
**Click 1:** Sort A→Z (ascending)
**Click 2:** Sort Z→A (descending)

#### Status Column (Sortable ↕)
**Default:** Unsorted
**Click 1:** Sort alphabetically (Archived → Draft → Published)
**Click 2:** Reverse order

#### Date Column (Sortable ↕)
**Default:** Newest first (descending)
**Click 1:** Oldest first (ascending)
**Click 2:** Newest first (descending)

**Visual Indicators:**
- `↕` Gray arrows = Sortable but inactive
- `↑` Blue arrow = Sorted ascending
- `↓` Blue arrow = Sorted descending

---

### 4. Inline Status Changer

Each post has a **status dropdown** with color-coded badges:

```
┌──────────────┐
│ Draft     ▼  │  ← Yellow badge
├──────────────┤
│ Published    │  ← Click to change
│ Archived     │
└──────────────┘
```

**Status Colors:**
- 🟡 **Draft** - Yellow (`bg-yellow-100 text-yellow-800`)
- 🟢 **Published** - Green (`bg-green-100 text-green-800`)
- ⚪ **Archived** - Gray (`bg-gray-100 text-gray-800`)

**Behavior:**
1. Click dropdown
2. Select new status
3. Toast notification appears
4. Badge updates immediately
5. No page reload needed

---

### 5. Action Buttons

#### Edit Button
```
┌──────────┐
│ ✏ Edit   │  ← Blue button with pencil icon
└──────────┘
```
- **Color:** Primary blue
- **Hover:** Darker blue background
- **Action:** Navigate to edit page
- **Icon:** Pencil

#### Delete Button
```
┌──────────┐
│ 🗑 Delete │  ← Red button with trash icon
└──────────┘
```
- **Color:** Destructive red
- **Hover:** Darker red background
- **Action:** Confirm then delete
- **Icon:** Trash can
- **Confirmation:** Shows post title in dialog

**Old vs New:**
```
Before: "Edit" "Delete" (plain text links)
After:  [✏ Edit] [🗑 Delete] (styled buttons with icons)
```

---

### 6. Pagination Controls

**Layout:**
```
Showing 1 to 20 of 45 posts          [Prev] 1 ... 3 4 5 ... 10 [Next]
```

**Components:**
1. **Info Text:** Shows current range and total
2. **Previous Button:** Go to previous page (disabled on page 1)
3. **Page Numbers:** 
   - Always shows: First page, last page, current page
   - Shows: ±1 page around current
   - Ellipsis (...) for gaps
4. **Next Button:** Go to next page (disabled on last page)

**Smart Pagination:**
```
On Page 1:    [Prev] 1 2 3 ... 10 [Next]
On Page 5:    [Prev] 1 ... 4 5 6 ... 10 [Next]
On Page 10:   [Prev] 1 ... 8 9 10 [Next]
```

---

### 7. Dynamic State Updates

**All operations update immediately without page reload:**

| Action | Old Behavior | New Behavior |
|--------|--------------|--------------|
| Delete post | Page reload | Row disappears + toast |
| Change status | Page reload | Badge updates + toast |
| Search | Page reload | Filter updates instantly |
| Sort | Page reload | Table reorders instantly |
| Change page | Page reload | Content swaps smoothly |

---

## 🎨 Visual Design

### Color Palette
```css
Primary (Blue):    #3b82f6  /* Edit buttons, active page */
Destructive (Red): #ef4444  /* Delete buttons */
Success (Green):   #22c55e  /* Published status */
Warning (Yellow):  #f59e0b  /* Draft status */
Muted (Gray):      #6b7280  /* Archived status, secondary text */
```

### Button States
```
Normal:  Light background, colored text
Hover:   Solid color background, white text
Active:  Slightly darker, white text
Disabled: 50% opacity, cursor not-allowed
```

### Table Styling
```
Header:      Gray background, uppercase, medium font
Row:         White background
Row (hover): Light accent background
Borders:     Light gray dividers
Padding:     Comfortable spacing (px-6 py-4)
```

---

## 📱 Responsive Behavior

### Mobile (< 640px)
- Search bar takes full width
- Page size selector moves below search
- Table scrolls horizontally
- Action buttons stack vertically

### Tablet (640px - 1024px)
- Search and page size on same row
- Table fits comfortably
- All features visible

### Desktop (> 1024px)
- Optimal layout with all features
- No horizontal scroll
- Comfortable reading width

---

## 🔔 Toast Notifications

All actions show user-friendly toast messages:

### Success Messages
✅ `"Status updated to published"`
✅ `"Post deleted successfully"`

### Error Messages
❌ `"Failed to load posts"`
❌ `"Failed to update status"`
❌ `"Failed to delete post"`

**Toast Properties:**
- Position: Top center or top right
- Duration: 3-4 seconds
- Dismissible: Click X to close
- Auto-hide: Fades after timeout

---

## ⌨️ Keyboard Shortcuts

### Current Support
- `Tab` - Navigate between inputs and buttons
- `Enter` - Activate focused button
- `Space` - Toggle dropdowns
- `Esc` - Close modals/dropdowns

### Accessibility
- All interactive elements are keyboard accessible
- Focus indicators on all inputs and buttons
- Semantic HTML for screen readers
- ARIA labels where needed

---

## 🔍 Search Tips

**Effective searches:**
1. **By title:** `"getting started"`
2. **By status:** `"draft"` or `"published"`
3. **By author:** `"admin"` or `"john"`
4. **By slug:** `"how-to-install"`
5. **Partial match:** `"post"` finds all posts with "post" in title/slug

**Search is case-insensitive and matches partial strings.**

---

## 📊 Performance

### Client-Side Operations (Instant)
- ✅ Search/filter
- ✅ Sort
- ✅ Pagination
- ✅ Page size change

### Server-Side Operations (< 1 second)
- ⏱️ Status change
- ⏱️ Delete post
- ⏱️ Initial load

---

## 🎯 Common Use Cases

### Finding a specific post
1. Type post title in search bar
2. Results filter instantly
3. Click Edit to modify

### Publishing all drafts
1. Search for "draft"
2. Change each status to "Published" via dropdown
3. Toast confirms each change

### Viewing recent posts
1. Sort by Date (newest first - default)
2. Top posts are most recent
3. Click to view/edit

### Managing large post library
1. Set page size to 50 or All
2. Use search to find specific posts
3. Sort by relevant column

---

## 💡 Pro Tips

1. **Quick Status Changes:** Use status dropdown instead of editing post
2. **Bulk Review:** Set page size to "All" to see everything at once
3. **Find Drafts Fast:** Search "draft" to see unpublished posts
4. **Confirm Before Delete:** Dialog shows post title - double-check before confirming
5. **Reset View:** Clear search box to return to all posts
6. **Sort Smart:** Sort by Date to find recent posts, by Title for alphabetical

---

## 🚀 Getting Started

### First Time Users
1. **Explore Posts:** Browse the table to see all posts
2. **Try Search:** Type something in the search bar
3. **Change Status:** Click a status dropdown and select different option
4. **Sort Posts:** Click column headers to sort
5. **Adjust View:** Change page size to see more/fewer posts

### Daily Workflow
1. Check posts needing attention (search "draft")
2. Review and publish posts (change status dropdown)
3. Delete outdated posts (red Delete button)
4. Update existing posts (blue Edit button)

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify backend server is running
3. Check network tab for API failures
4. Review toast notifications for error messages

All features are production-ready and fully tested! 🎉

