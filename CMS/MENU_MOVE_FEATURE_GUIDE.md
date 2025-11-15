# Menu Item Move Feature Guide

## 🚀 Overview

The menu system now supports **flexible movement** of menu items between different levels and groups. Users can easily reorganize their menu structure by moving items to become:
- Top-level items (Level 1)
- Sub-menu items under any Level 1 item (Level 2)
- Sub-sub-menu items under any Level 2 item (Level 3)

## ✨ Features

### 1. Visual Move Button
- 📍 Located in the actions area of each menu item
- Icon: `MoveVertical` (⇕)
- Tooltip: "Move to different level/group"
- Style: Secondary button (gray background)

### 2. Interactive Move Modal
- **Current Position Indicator**: Highlights where the item currently is
- **Available Destinations**: Shows all valid parent options
- **Visual Hierarchy**: Indentation and prefixes (└─) show structure
- **Depth Validation**: Automatically disables invalid moves
- **Level Preview**: Shows what level the item will become

### 3. Smart Validation
- ✅ Prevents moves that would exceed 3-level depth
- ✅ Prevents moving item to itself
- ✅ Shows clear feedback for invalid destinations
- ✅ Real-time validation based on menu structure

## 🎯 Use Cases

### Example 1: Move Level 2 to Level 1
**Before:**
```
Products (L1)
└─ Electronics (L2)  ← Move this
```

**Action:** Click Move → Select "Top Level (Level 1)"

**After:**
```
Products (L1)
Electronics (L1)  ← Now at top level
```

### Example 2: Move Level 2 to Different Group
**Before:**
```
Products (L1)
└─ Electronics (L2)  ← Move this

Services (L1)
```

**Action:** Click Move → Select "Services"

**After:**
```
Products (L1)

Services (L1)
└─ Electronics (L2)  ← Now under Services
```

### Example 3: Move Level 1 to Level 2
**Before:**
```
Products (L1)
Electronics (L1)  ← Move this
```

**Action:** Click Move → Select "Products"

**After:**
```
Products (L1)
└─ Electronics (L2)  ← Now a child of Products
```

### Example 4: Move Level 2 to Level 3
**Before:**
```
Products (L1)
└─ Electronics (L2)
└─ Phones (L2)  ← Move this
```

**Action:** Click Move → Select "Electronics"

**After:**
```
Products (L1)
└─ Electronics (L2)
   └─ Phones (L3)  ← Now Level 3
```

## 🎨 UI Components

### Move Modal Structure

```
┌───────────────────────────────────────────────┐
│ Move Menu Item: Electronics                  │
│                                               │
│ Choose a new parent to change level/group... │
│                                               │
│ ┌─────────────────────────────────────────┐  │
│ │ Top Level (Level 1)            [Current]│  │ ← If currently L1
│ └─────────────────────────────────────────┘  │
│                                               │
│ ┌─────────────────────────────────────────┐  │
│ │ Products                                │  │ ← L1 item
│ │ Will become Level 2                     │  │
│ └─────────────────────────────────────────┘  │
│                                               │
│ ┌─────────────────────────────────────────┐  │
│ │   └─ Clothing                           │  │ ← L2 item (indented)
│ │   Will become Level 3                   │  │
│ └─────────────────────────────────────────┘  │
│                                               │
│ ┌─────────────────────────────────────────┐  │
│ │      └──── Shirts (Max depth)           │  │ ← L3 item (disabled)
│ │      Max depth reached - cannot be parent│  │
│ └─────────────────────────────────────────┘  │
│                                               │
│              [Cancel]                         │
└───────────────────────────────────────────────┘
```

### Visual Indicators

#### Current Position
- **Border**: `border-primary` (blue)
- **Background**: `bg-primary/10` (light blue)
- **Badge**: "Current" in primary color

#### Valid Destination
- **Border**: `border-border` (default gray)
- **Hover**: `hover:border-primary/50` (blue on hover)
- **Background**: `hover:bg-accent` (subtle highlight)

#### Invalid Destination
- **Disabled**: Grayed out and not clickable
- **Background**: `bg-muted/50`
- **Text**: "Max depth reached - cannot be parent"

## 🔧 Technical Implementation

### Frontend Function

```typescript
const handleMoveItem = async (newParentId: string | null) => {
  if (!movingItem) return;

  try {
    setSubmitting(true);
    const response = await fetch(`${API_BASE}/api/menu-items/${movingItem.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        parent_id: newParentId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to move menu item');
    }

    toast.success('Menu item moved successfully');
    setMovingItem(null);
    fetchMenuItems();
  } catch (error: any) {
    toast.error(error.message || 'Failed to move menu item');
  } finally {
    setSubmitting(false);
  }
};
```

### Backend Validation

The backend automatically validates depth when changing `parent_id`:

```typescript
if (parent_id !== undefined) {
  // Validate depth when changing parent
  const depth = await getMenuItemDepth(parent_id);
  if (depth > 3) {
    return res.status(400).json({ 
      error: 'Maximum menu depth exceeded',
      message: 'Menu items can only be nested up to 3 levels deep'
    });
  }
  updateFields.push('parent_id = :parent_id');
  replacements.parent_id = parent_id;
}
```

## 📊 Movement Matrix

| From Level | To Level | Action                    | Valid? |
|-----------|----------|---------------------------|--------|
| 1         | 1        | Select "Top Level"        | ✅ Yes |
| 1         | 2        | Select any L1 item        | ✅ Yes |
| 1         | 3        | Select any L2 item        | ✅ Yes |
| 2         | 1        | Select "Top Level"        | ✅ Yes |
| 2         | 2        | Select different L1 item  | ✅ Yes |
| 2         | 3        | Select any L2 item        | ✅ Yes |
| 3         | 1        | Select "Top Level"        | ✅ Yes |
| 3         | 2        | Select any L1 item        | ✅ Yes |
| 3         | 3        | Select different L2 item  | ✅ Yes |
| Any       | 4        | Select L3 item            | ❌ No  |

## 🎬 User Flow

1. **Initiate Move**
   - User clicks Move button (⇕) on menu item
   - Move modal opens showing current item name

2. **Review Options**
   - Modal displays all possible destinations
   - Current position is highlighted
   - Invalid options are grayed out
   - Each option shows resulting level

3. **Select Destination**
   - User clicks on desired parent (or "Top Level")
   - Confirmation happens immediately
   - No additional confirmation needed

4. **Completion**
   - Success toast appears
   - Modal closes automatically
   - Menu list refreshes
   - Item appears in new position with correct level badge

## ✅ Validation Rules

### Allowed Moves
1. ✅ Any item → Top Level (becomes L1)
2. ✅ Any item → Under L1 item (becomes L2)
3. ✅ Any item → Under L2 item (becomes L3)
4. ✅ Move between different parent groups
5. ✅ Move up/down levels freely

### Blocked Moves
1. ❌ Item → Under L3 item (would create L4)
2. ❌ Item → Itself (meaningless operation)

### Visual Feedback
- **Disabled button**: Cannot be clicked
- **Gray background**: Clearly shows it's unavailable
- **Explanatory text**: "Max depth reached - cannot be parent"

## 🎯 Benefits

### For Users
1. **Flexible Reorganization** - Easy to restructure menus
2. **Visual Feedback** - Clear indication of current and target positions
3. **No Mistakes** - Invalid moves are prevented
4. **One-Click Operation** - Quick and efficient

### For Developers
1. **Reuses Existing API** - PATCH endpoint with parent_id
2. **Backend Validation** - Depth checking happens server-side
3. **Consistent UI** - Matches existing modal patterns
4. **Error Handling** - Comprehensive error messages

## 💡 Best Practices

### When to Use Move
- Reorganizing menu structure
- Changing item hierarchy
- Moving items between menu groups
- Promoting/demoting items

### When NOT to Use Move
- Reordering items at same level → Use drag & drop instead
- Changing item content → Use Edit instead
- Deleting items → Use Delete button

## 🧪 Testing Checklist

- [ ] Move L1 → L2
- [ ] Move L2 → L1
- [ ] Move L2 → L3
- [ ] Move L3 → L1
- [ ] Move L3 → L2
- [ ] Move between different parent groups
- [ ] Try to move to L3 item (should be disabled)
- [ ] Cancel move operation
- [ ] Verify depth badges update correctly
- [ ] Verify indentation updates correctly
- [ ] Verify tree structure in parent dropdown reflects changes

## 🚨 Error Scenarios

### Depth Exceeded
```json
{
  "error": "Maximum menu depth exceeded",
  "message": "Menu items can only be nested up to 3 levels deep"
}
```

**User sees:**
```
Toast Error: Menu items can only be nested up to 3 levels deep
```

### Network Error
**User sees:**
```
Toast Error: Failed to move menu item
```

## 📝 Notes

- Move operation only changes `parent_id`, not `sort_order`
- Item maintains its position among siblings
- All child items move with parent (if any)
- Changes are reflected immediately after successful API call
- Frontend prevents invalid moves before API call
- Backend double-validates for security






































