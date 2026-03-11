# InstaConnect Nearby

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Instagram ID sharing community app
- Users can voluntarily submit their Instagram username + their area/city
- Browse page showing all shared Instagram IDs, filterable by area
- Each card shows: Instagram username (clickable link to instagram.com/username), area, and time shared
- Simple form to add your Instagram ID (name, instagram username, area/city selection)
- Delete own entry option (by entering a secret pin set at creation time)
- Search/filter by area or username

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: Store Instagram entries with fields: id, name, instagramUsername, area, pin (hashed), timestamp
2. Backend APIs: addEntry, getAllEntries, deleteEntry, getEntriesByArea
3. Frontend: Home page with browse grid + search, Add Entry modal/form, area filter tabs
