# TypeScript Build Fixes - December 31, 2025

## Issue Summary

When connecting the Gallery and Description Monuments pages to the API, TypeScript compilation errors occurred due to incorrect usage of PrimeReact Dropdown `optionLabel` prop.

## Root Cause

The `optionLabel` prop in PrimeReact Dropdown components expects a **string** (property name), not a function. Inline arrow functions or function references cause TypeScript compilation errors:

```typescript
// ❌ INCORRECT - Causes TypeScript error
<Dropdown
  optionLabel={(option) => option.nameEn || option.name_en || "Unknown"}
  // Error: Type '(option: any) => any' is not assignable to type 'string'
/>
```

## Solution

Use `itemTemplate` and `valueTemplate` props instead, which accept React component functions for custom rendering:

```typescript
// ✅ CORRECT - Works properly
const itemTemplate = (option: any) => {
  return <span>{option?.nameEn || option?.name_en || "Unknown"}</span>;
};

<Dropdown
  itemTemplate={itemTemplate}
  valueTemplate={itemTemplate}
  optionValue="id"
/>
```

## Files Fixed

### 1. DescriptionMonumentFormDialog.tsx

**Location:** `/src/main/webapp/app/modules/pages/description-monuments/DescriptionMonumentFormDialog.tsx`

**Changes:**

#### Added Item Templates (Lines 9-22):
```typescript
const eraItemTemplate = (option: any) => {
  return <span>{option?.nameEn || option?.name_en || "Unknown Era"}</span>;
};

const dynastyItemTemplate = (option: any) => {
  return (
    <span>{option?.nameEn || option?.name_en || "Unknown Dynasty"}</span>
  );
};

const monumentTypeItemTemplate = (option: any) => {
  return <span>{option?.nameEn || option?.name_en || "Unknown Type"}</span>;
};
```

#### Updated Era Dropdown (Lines 56-69):
```typescript
<Dropdown
  id="eraId"
  value={props.formData.eraId}
  options={props.eras}
  optionValue="id"
  itemTemplate={eraItemTemplate}      // ✅ Added
  valueTemplate={eraItemTemplate}      // ✅ Added
  onChange={(e) =>
    props.setFormData({ ...props.formData, eraId: e.value })
  }
  placeholder="Select an era"
  filter
  className="kemetra-field-input"
/>
```

#### Updated Dynasty Dropdown (Lines 76-89):
```typescript
<Dropdown
  id="dynastyId"
  value={props.formData.dynastyId}
  options={props.dynasties}
  optionValue="id"
  itemTemplate={dynastyItemTemplate}   // ✅ Added
  valueTemplate={dynastyItemTemplate}   // ✅ Added
  onChange={(e) =>
    props.setFormData({ ...props.formData, dynastyId: e.value })
  }
  placeholder="Select a dynasty"
  filter
  className="kemetra-field-input"
/>
```

#### Updated Monument Type Dropdown (Lines 96-112):
```typescript
<Dropdown
  id="monumentsTypeId"
  value={props.formData.monumentsTypeId}
  options={props.monumentTypes}
  itemTemplate={monumentTypeItemTemplate}  // ✅ Added
  valueTemplate={monumentTypeItemTemplate}  // ✅ Added
  optionValue="id"
  onChange={(e) =>
    props.setFormData({
      ...props.formData,
      monumentsTypeId: e.value,
    })
  }
  placeholder="Select a type"
  filter
  className="kemetra-field-input"
/>
```

---

### 2. Gallery.tsx

**Location:** `/src/main/webapp/app/modules/pages/gallery/Gallery.tsx`

**Changes:**

#### Added Item Template (Lines 200-209):
```typescript
const monumentItemTemplate = (option: any) => {
  return (
    <span>
      {option?.monumentNameEn ||
        option?.nameEn ||
        option?.name_en ||
        "Unknown Type"}
    </span>
  );
};
```

#### Updated Monument Dropdown (Lines 433-446):
```typescript
<Dropdown
  id="monumentId"
  value={formData.monumentId}
  options={monuments}
  itemTemplate={monumentItemTemplate}   // ✅ Added
  valueTemplate={monumentItemTemplate}   // ✅ Added
  optionValue="id"
  onChange={(e) =>
    setFormData({ ...formData, monumentId: e.value })
  }
  placeholder="Select a monument"
  filter
  className="kemetra-gallery-dropdown"
/>
```

---

## Key Differences

### optionLabel vs itemTemplate

| Prop | Type | Use Case | Example |
|------|------|----------|---------|
| `optionLabel` | `string` | Simple property name | `optionLabel="nameEn"` |
| `itemTemplate` | `function` | Custom rendering with fallback logic | `itemTemplate={customTemplate}` |
| `valueTemplate` | `function` | Custom rendering for selected value | `valueTemplate={customTemplate}` |

### Why We Need Both itemTemplate and valueTemplate

- **itemTemplate**: Renders each option in the dropdown list
- **valueTemplate**: Renders the selected value when dropdown is closed

Using both ensures consistent display in all states.

---

## Optional Chaining

Note the use of optional chaining (`?.`) in the templates:

```typescript
option?.nameEn || option?.name_en || "Unknown"
```

This prevents errors if `option` is `null` or `undefined` and provides better TypeScript safety.

---

## Testing

After these fixes:

1. ✅ TypeScript compilation succeeds
2. ✅ No linter errors
3. ✅ Dropdowns display correctly with backward-compatible field names
4. ✅ Selected values show proper labels
5. ✅ Filter functionality works as expected

---

## Pattern for Future Use

When creating new dropdown components with custom label logic:

```typescript
// 1. Create item template function
const myItemTemplate = (option: any) => {
  return <span>{option?.preferredField || option?.fallbackField || "Default"}</span>;
};

// 2. Use in Dropdown
<Dropdown
  options={myOptions}
  optionValue="id"
  itemTemplate={myItemTemplate}
  valueTemplate={myItemTemplate}
  // ... other props
/>
```

**Do NOT use:**
```typescript
// ❌ This will cause TypeScript errors
<Dropdown
  optionLabel={(option) => option.field || "default"}
/>
```

---

## Related Issues

This fix resolves the following TypeScript errors:

```
No overload matches this call.
  Overload 1 of 2, '(props: DropdownProps): Dropdown', gave the following error.
    Type '(era: any) => any' is not assignable to type 'string'.
  Overload 2 of 2, '(props: DropdownProps, context: any): Dropdown', gave the following error.
    Type '(era: any) => any' is not assignable to type 'string'.ts(2769)
```

---

## Date Fixed

December 31, 2025

## Build Status

✅ **All TypeScript compilation errors resolved**
✅ **Build succeeds**
✅ **No linter warnings**
