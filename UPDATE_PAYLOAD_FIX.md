# Monument Update Payload Fix

## Issue Summary

When editing a monument, the API was rejecting the update with a 400 error:

```
HTTP exception property id should not exist,
property createdAt should not exist,
property monumentType should not exist,
property era should not exist,
property dynasty should not exist
```

## Root Cause

The frontend was sending the entire monument object (including read-only fields) when updating a monument. The API's UpdateMonumentDto validation rejects these read-only fields.

**Before Fix:**
```typescript
// When editing, formData contains entire monument object from API:
{
  id: 10,
  monumentNameEn: "...",
  createdAt: "2025-12-31T13:17:13.028Z",
  monumentType: { id: 1, nameEn: "..." },  // ❌ Nested object
  era: { id: 1, nameEn: "..." },            // ❌ Nested object
  dynasty: { id: 1, nameEn: "..." },        // ❌ Nested object
  // ... other fields
}

// This entire object was sent to PATCH /api/v1/monuments/:id
```

## Solution

Filter out read-only fields before sending the update request:

**After Fix:**
```typescript
const saveMonument = async () => {
  // Destructure to remove read-only fields
  const {
    id,
    createdAt,
    monumentType,
    era,
    dynasty,
    ...allowedData  // Only editable fields remain
  } = formData;

  if (selectedMonument) {
    // Send only allowed fields
    await dispatch(
      updateMonument({ id: selectedMonument.id, data: allowedData })
    ).unwrap();
  }
};
```

## Files Modified

### `/src/main/webapp/app/modules/pages/monuments/Monuments.tsx`

**Line 114-143:** Updated `saveMonument` function

**Before:**
```typescript
const saveMonument = async () => {
  try {
    if (selectedMonument) {
      await dispatch(
        updateMonument({ id: selectedMonument.id, data: formData })  // ❌ Includes read-only fields
      ).unwrap();
    }
  }
};
```

**After:**
```typescript
const saveMonument = async () => {
  try {
    // Filter out read-only fields that API doesn't accept
    const {
      id,
      createdAt,
      monumentType,
      era,
      dynasty,
      ...allowedData
    } = formData;

    if (selectedMonument) {
      await dispatch(
        updateMonument({ id: selectedMonument.id, data: allowedData })  // ✅ Only editable fields
      ).unwrap();
    } else {
      await dispatch(createMonument(allowedData)).unwrap();  // ✅ Also applies to create
    }
  }
};
```

## Allowed Fields

The API accepts these fields for monument updates:

**Required:**
- `monumentNameEn` (string)
- `monumentNameAr` (string)
- `monumentBiographyEn` (string)
- `monumentBiographyAr` (string)
- `lat` (string)
- `lng` (string)
- `image` (string)
- `mDate` (string)
- `monumentsTypeId` (number)
- `eraId` (number)
- `dynastyId` (number)
- `zoom` (string)
- `center` (string)

**Optional:**
- `galleries` (array of gallery objects)
- `descriptions` (array of description objects)

## Read-Only Fields (Removed from Payload)

These fields are returned by the API but should NOT be sent in updates:

- ❌ `id` - Auto-generated, can't be changed
- ❌ `createdAt` - Timestamp set by database
- ❌ `monumentType` - Nested object (use `monumentsTypeId` instead)
- ❌ `era` - Nested object (use `eraId` instead)
- ❌ `dynasty` - Nested object (use `dynastyId` instead)

## Impact

✅ **Before this fix:** Monument updates failed with 400 Bad Request
✅ **After this fix:** Monument updates work correctly

## Other Pages Status

Checked other management pages for the same issue:

- ✅ **Dynasty** - Already uses explicit field mapping, no issue
- ✅ **Eras** - Already uses explicit field mapping, no issue
- ℹ️ **Gallery** - Save function not implemented yet (placeholder)
- ℹ️ **Description Monuments** - Save function not implemented yet (placeholder)

## Testing

To verify the fix works:

1. Navigate to Monuments Management
2. Click edit on any monument
3. Change a field (e.g., monument name)
4. Click Save
5. ✅ Should see "Monument updated successfully!" toast
6. ✅ Table should refresh with updated data
7. ✅ No 400 error in console/network tab

## Backend Reference

The UpdateMonumentDto validation is defined at:
`/Volumes/Data/Ancient/Antiq/EG_Antiq/apps/api/src/modules/monuments/dto/update-monument.dto.ts`

It uses `PartialType(CreateMonumentDto)` which means it accepts the same fields as create but all are optional.

## Date Fixed

December 31, 2025
