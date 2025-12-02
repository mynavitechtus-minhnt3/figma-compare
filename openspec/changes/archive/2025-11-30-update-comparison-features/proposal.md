# Change: Update Comparison Features

## Why
- **Remove Onion Skin Mode**: User feedback indicates that Onion Skin mode is rarely used and complicates the UI. Removing it will simplify the interface and reduce maintenance overhead.
- **Increase File Size Limit**: High-fidelity Figma exports and retina screenshots often exceed the current 10MB limit. Increasing the limit to 20MB will support higher quality comparisons.

## What Changes
- **Remove**: Onion Skin comparison mode logic, UI components, and styles.
- **Update**: File upload validation to accept images up to 20MB (increased from 10MB).
- **Update**: Mode selector to only show "2-up" and "Swipe" options.

## Impact
- **Affected specs**: `image-comparison` (File Upload, Onion Skin Comparison Mode, Mode Selection)
- **Affected code**:
  - `app/page.tsx`: Remove Onion Skin state/logic, update file size check.
  - `app/globals.css`: Remove Onion Skin styles.
- **Breaking changes**: Users who relied on Onion Skin mode will no longer have access to it.

## Rollout Plan
1. Update file size validation logic.
2. Remove Onion Skin mode from UI and logic.
3. Clean up unused CSS.
4. Verify 2-up and Swipe modes still work correctly.
5. Test uploading files between 10MB and 20MB.
