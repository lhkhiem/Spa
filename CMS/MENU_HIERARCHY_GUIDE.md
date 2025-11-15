# Menu Hierarchy System (3 Levels Max)

## 📋 Overview

The menu system supports **hierarchical menus with a maximum of 3 levels**:
- **Level 1**: Root menu items  
- **Level 2**: Sub-menu items (children of Level 1)
- **Level 3**: Sub-sub-menu items (children of Level 2)

## 🎯 Features

### Backend Validation
- ✅ Automatic depth calculation when creating/updating menu items
- ✅ Prevents creating items beyond level 3
- ✅ Returns user-friendly error messages
- ✅ Validates parent_id changes to prevent depth violations

### Frontend Features
- ✅ Visual depth indicators with badges (Level 2, Level 3)
- ✅ Indentation based on depth (ml-8 for L2, ml-16 for L3)
- ✅ Color-coded level badges:
  - Level 2: Blue (`bg-blue-100 text-blue-700`)
  - Level 3: Purple (`bg-purple-100 text-purple-700`)
- ✅ Disabled parent selection when max depth reached
- ✅ Visual tree structure in parent dropdown (└─, └────)
- ✅ Helper text showing level limits

## 🔧 Technical Implementation

### Backend (`menuItemController.ts`)

#### Depth Calculation Function
```typescript
async function getMenuItemDepth(parentId: string | null): Promise<number> {
  if (!parentId) return 1; // Root level
  
  let depth = 1;
  let currentId = parentId;
  
  while (currentId && depth < 4) {
    const query = `SELECT parent_id FROM menu_items WHERE id = :id`;
    const result = await sequelize.query(query, {
      replacements: { id: currentId },
      type: QueryTypes.SELECT
    });
    
    if (result.length === 0 || !result[0].parent_id) break;
    currentId = result[0].parent_id;
    depth++;
  }
  
  return depth + 1; // +1 for the new item
}
```

#### Validation in Create
```typescript
// Validate depth (max 3 levels)
const depth = await getMenuItemDepth(parent_id || null);
if (depth > 3) {
  return res.status(400).json({ 
    error: 'Maximum menu depth exceeded',
    message: 'Menu items can only be nested up to 3 levels deep'
  });
}
```

#### Validation in Update
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

### Frontend (`app/dashboard/menus/[id]/page.tsx`)

#### Depth Calculation
```typescript
function calculateDepth(item: MenuItem, items: MenuItem[]): number {
  if (!item.parent_id) return 1;
  
  let depth = 1;
  let currentParentId = item.parent_id;
  
  while (currentParentId && depth < 4) {
    const parent = items.find(i => i.id === currentParentId);
    if (!parent || !parent.parent_id) break;
    currentParentId = parent.parent_id;
    depth++;
  }
  
  return depth + 1;
}
```

#### Can Have Children Check
```typescript
function canHaveChildren(item: MenuItem, items: MenuItem[]): boolean {
  const depth = calculateDepth(item, items);
  return depth < 3;
}
```

#### Visual Rendering
```typescript
const depth = item.depth || calculateDepth(item, items);
const indentClass = depth === 1 ? '' : depth === 2 ? 'ml-8' : 'ml-16';
const depthLabel = depth === 1 ? '' : depth === 2 ? 'Level 2' : 'Level 3';
const depthColor = depth === 1 ? '' : 
                   depth === 2 ? 'bg-blue-100 text-blue-700' : 
                   'bg-purple-100 text-purple-700';
```

#### Parent Dropdown
```typescript
<select id="parent_id">
  <option value="">None (Top Level)</option>
  {items
    .filter(i => !editingItem || i.id !== editingItem.id)
    .map(item => {
      const depth = calculateDepth(item, items);
      const canBeParent = canHaveChildren(item, items);
      const prefix = depth === 1 ? '' : depth === 2 ? '└─ ' : '└──── ';
      return (
        <option 
          key={item.id} 
          value={item.id}
          disabled={!canBeParent}
        >
          {prefix}{item.title} 
          {!canBeParent ? '(Max depth reached)' : `(Level ${depth})`}
        </option>
      );
    })
  }
</select>
```

## 📊 Example Structure

```
Header Menu
├─ Home (Level 1)
├─ Products (Level 1)
│  └─ Electronics (Level 2)
│     └─ Phones (Level 3) ← Max depth
│     └─ Laptops (Level 3) ← Max depth
│  └─ Clothing (Level 2)
│     └─ Men (Level 3)
│     └─ Women (Level 3)
└─ Contact (Level 1)
```

## 🚫 Validation Examples

### ✅ Valid Operations
- Create Level 1 item with no parent
- Create Level 2 item with Level 1 parent
- Create Level 3 item with Level 2 parent
- Move Level 2 item to become Level 1
- Move Level 3 item to become Level 2

### ❌ Invalid Operations
- Create Level 4 item (rejected with error)
- Move Level 1 item under Level 3 (would create Level 4)
- Set Level 2 item as parent for Level 3 that has children

## 🎨 UI States

### Menu Item Display
```
┌────────────────────────────────────────┐
│ [≡] Home                              │ Level 1
├────────────────────────────────────────┤
│    [≡] Electronics [Level 2]          │ Level 2 (indented)
├────────────────────────────────────────┤
│        [≡] Phones [Level 3]           │ Level 3 (more indented)
└────────────────────────────────────────┘
```

### Parent Selection Dropdown
```
None (Top Level)
Home (Level 1)
Products (Level 1)
└─ Electronics (Level 2)
└──── Phones (Max depth reached) [disabled]
└─ Clothing (Level 2)
Contact (Level 1)
```

## 🔍 Error Messages

### When Creating Level 4
```json
{
  "error": "Maximum menu depth exceeded",
  "message": "Menu items can only be nested up to 3 levels deep"
}
```

Frontend displays:
```
Toast Error: Menu items can only be nested up to 3 levels deep
```

## 💡 Best Practices

1. **Plan your structure** - Design menu hierarchy before implementation
2. **Keep it simple** - Most menus work well with 2 levels
3. **Use Level 3 sparingly** - Reserve for mega-menus or complex navigation
4. **Consider UX** - Deep nesting can confuse users
5. **Test navigation** - Ensure users can easily find content

## 🧪 Testing

### Test Cases
1. ✅ Create top-level item
2. ✅ Create 2nd level item
3. ✅ Create 3rd level item
4. ✅ Try to create 4th level (should fail)
5. ✅ Move item between levels
6. ✅ Verify depth badges display correctly
7. ✅ Verify disabled options in dropdown

## 📝 Notes

- Depth is calculated dynamically, not stored in database
- Validation happens on both frontend and backend
- UI provides clear feedback about depth limits
- Drag-and-drop preserves depth constraints






































