# Implementation Tasks

## 1. Update File Validation
- [x] 1.1 Update file size limit constant from 10MB to 20MB in `app/page.tsx`
- [x] 1.2 Update error message to reflect new 20MB limit

## 2. Remove Onion Skin Mode
- [x] 2.1 Remove "onion-skin" from `ComparisonMode` type definition
- [x] 2.2 Remove `onionZoom` and `opacity` state variables
- [x] 2.3 Remove Onion Skin rendering logic from `app/page.tsx`
- [x] 2.4 Remove Onion Skin button from mode selector
- [x] 2.5 Remove `handleZoom` case for "onion"

## 3. Clean Up Styles
- [x] 3.1 Remove `.onion-view`, `.onion-container`, `.onion-image` styles from `app/globals.css`
- [x] 3.2 Remove `.opacity-control`, `.opacity-slider`, `.opacity-label` styles

## 4. Testing
- [x] 4.1 Verify file upload accepts 15MB file
- [x] 4.2 Verify file upload rejects 21MB file
- [x] 4.3 Verify only "2-up" and "Swipe" modes are available
- [x] 4.4 Verify switching between remaining modes works correctly
