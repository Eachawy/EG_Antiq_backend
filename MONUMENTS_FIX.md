# Monuments Management Page - Field Name Fix

## Issue Summary

The Monuments Management page was displaying "-" for all data columns because the frontend was using incorrect field names that didn't match the API response structure.

## Root Cause

The API returns field names like `monumentNameEn`, `monumentNameAr`, `lat`, `lng`, `mDate`, `monumentsTypeId`, but the frontend was looking for `nameEn`, `nameAr`, `latitude`, `longitude`, `monumentDate`, `typeId`.

## Files Modified

### 1. `/src/main/webapp/app/modules/pages/monuments/Monuments.tsx`

**Changes Made:**

- ✅ Updated table column fields to match API response
- ✅ Added helper functions for nested data display (Era, Dynasty)
- ✅ Enhanced body templates for better data rendering

**Field Mappings Fixed:**

- `nameEn` → `monumentNameEn`
- `nameAr` → `monumentNameAr`
- `monumentDate` → `mDate`
- `typeId` → `monumentsTypeId`
- Added `eraBodyTemplate` to display era names
- Added `dynastyBodyTemplate` to display dynasty names
- Added columns for Era and Dynasty in the table

**Helper Functions Added:**

```typescript
getEraName(eraId: number)       // Gets era name by ID
getDynastyName(dynastyId: number)  // Gets dynasty name by ID
```

**Body Templates Updated:**

```typescript
typeBodyTemplate(rowData); // Now uses monumentType.nameEn or falls back to lookup
eraBodyTemplate(rowData); // Uses era.nameEn or falls back to lookup
dynastyBodyTemplate(rowData); // Uses dynasty.nameEn or falls back to lookup
```

### 2. `/src/main/webapp/app/modules/pages/monuments/MonumentFormDialog.tsx`

**Changes Made:**

- ✅ Updated all form fields to match API requirements
- ✅ Fixed field names in value bindings and onChange handlers

**Field Mappings Fixed:**
| Old Field Name | New Field Name | Type |
|----------------|----------------|------|
| `nameEn` | `monumentNameEn` | string |
| `nameAr` | `monumentNameAr` | string |
| `biographyEn` | `monumentBiographyEn` | string |
| `biographyAr` | `monumentBiographyAr` | string |
| `latitude` | `lat` | string |
| `longitude` | `lng` | string |
| `monumentDate` | `mDate` | string |
| `typeId` | `monumentsTypeId` | number |
| `monumentImage` | `image` | string |

## API Response Structure

The monuments API (`GET /api/v1/monuments`) returns:

```json
{
  "data": [
    {
      "id": 9,
      "monumentNameEn": "Abu Simbel Temple",
      "monumentNameAr": "معبد أبو سمبل",
      "monumentBiographyEn": "Biography text...",
      "monumentBiographyAr": "نص السيرة...",
      "lat": "22.337222",
      "lng": "31.625833",
      "image": "/images/abu-simbel.jpg",
      "mDate": "31/12/2025",
      "monumentsTypeId": 1,
      "eraId": 1,
      "dynastyId": 1,
      "zoom": "12",
      "center": "22.337222,31.625833",
      "createdAt": "2025-12-31T13:08:50.890Z",
      "monumentType": {
        "id": 1,
        "nameAr": "العواصم",
        "nameEn": "Capital Cities"
      },
      "era": {
        "id": 1,
        "nameAr": "الفرعونية",
        "nameEn": "Pharaonic",
        "dateFrom": "5500 BC",
        "dateTo": "332 BC"
      },
      "dynasty": {
        "id": 1,
        "nameAr": "ما قبل الأسرات",
        "nameEn": "pre dynastic",
        "dateFrom": "5500 BC",
        "dateTo": "3100 BC"
      }
    }
  ]
}
```

## Testing Checklist

After these fixes, verify:

- ✅ Monuments table displays all data correctly (no more "-" symbols)
- ✅ Monument names show in both English and Arabic
- ✅ Type, Era, and Dynasty columns display related data
- ✅ Date column shows monument dates
- ✅ Create monument form accepts and saves data correctly
- ✅ Edit monument form loads existing data correctly
- ✅ All form fields map to correct API fields
- ✅ API creates/updates monuments successfully

## Expected Result

**Before Fix:**

```
Name (English) | Name (Arabic) | Type | Date
----------------|---------------|------|-----
-              | -             | -    | -
-              | -             | -    | -
```

**After Fix:**

```
Name (English)     | Name (Arabic)      | Type           | Era        | Dynasty         | Date
-------------------|-------------------|----------------|------------|-----------------|------------
Abu Simbel Temple  | معبد أبو سمبل     | Capital Cities | Pharaonic  | pre dynastic    | 31/12/2025
wdsadasd          | asdasdaasd        | Cemeteries     | Roman      | Second Dynasty  | asdasdsa
```

## Additional Notes

- The fix maintains backward compatibility by checking for old field names as fallbacks
- Example: `rowData.monumentNameEn || rowData.nameEn || rowData.name_en || "-"`
- This ensures the table works even if the API response format changes or old data exists
- All nested objects (monumentType, era, dynasty) are now properly displayed
- Added two new columns (Era and Dynasty) to provide more comprehensive monument information

## Developer Reference

For future development, always refer to:

1. **API Documentation**: See `/Volumes/Data/Ancient/Antiq/EG_Antiq/API_FIELD_REFERENCE.md`
2. **Backend DTO**: `/Volumes/Data/Ancient/Antiq/EG_Antiq/apps/api/src/modules/monuments/dto/create-monument.dto.ts`
3. **Database Schema**: `/Volumes/Data/Ancient/Antiq/EG_Antiq/packages/database/prisma/schema.prisma` (Monument model)

## Date Fixed

December 31, 2025
