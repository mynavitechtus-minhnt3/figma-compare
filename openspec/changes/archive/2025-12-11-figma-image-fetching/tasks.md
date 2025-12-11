# Tasks: Figma Image Fetching

## Status: ✓ Complete

### Backend Tasks

- [x] Create /image endpoint
  - [x] Add GET route handler
  - [x] Parse and validate Figma URL
  - [x] Extract file ID and node ID
  - [x] Handle missing/invalid URL errors

- [x] Integrate with Figma API
  - [x] Install axios dependency
  - [x] Configure FIGMA_TOKEN environment variable
  - [x] Call Figma API with proper headers
  - [x] Convert node ID format (hyphen to colon)
  - [x] Extract image URL from response
  - [x] Handle API errors

- [x] Return response to frontend
  - [x] Return JSON with error and image fields
  - [x] Handle success and error cases
  - [x] Add proper error logging

### Frontend Tasks

- [x] Add input mode toggle
  - [x] Create state for inputMode ("file" | "url")
  - [x] Add radio button group UI
  - [x] Toggle between file upload and URL input

- [x] Create URL input interface
  - [x] Add URL input field with placeholder
  - [x] Add "Fetch Image" button with icon
  - [x] Handle Enter key submission
  - [x] Add loading state (spinning icon, disabled input)

- [x] Implement fetch logic
  - [x] Create fetchFigmaImage() function in lib/api.ts
  - [x] Call backend /image endpoint
  - [x] Parse JSON response
  - [x] Fetch image from CDN URL
  - [x] Convert blob to File object

- [x] Integrate with existing flow
  - [x] Clear previous analysis results on fetch
  - [x] Load fetched image into comparison viewer
  - [x] Resize actual image if it exists
  - [x] Show preview with remove button

- [x] Error handling
  - [x] Validate empty URL
  - [x] Handle backend errors
  - [x] Handle CDN fetch errors
  - [x] Display user-friendly error messages

### Configuration Tasks

- [x] Environment setup
  - [x] Add FIGMA_TOKEN to .env
  - [x] Document token generation process
  - [x] Update README with Figma integration info

### Testing Checklist

- [x] Mode toggle switches correctly
- [x] URL input accepts valid Figma URLs
- [x] Fetch button triggers API call
- [x] Loading state displays during fetch
- [x] Success case loads image correctly
- [x] Error cases show appropriate messages
- [x] Image resizing works with fetched images
- [x] Remove button clears fetched image
