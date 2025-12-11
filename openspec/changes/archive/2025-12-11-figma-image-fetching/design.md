# Design: Figma Image Fetching

## User Interface

### Input Mode Toggle
Radio button group in the Figma Design upload section:
- **Upload File**: Traditional file upload (default)
- **Figma URL**: URL input field

### URL Input Interface
When "Figma URL" mode is selected:
- Text input field with placeholder: `https://www.figma.com/design/...`
- "Fetch Image" button with download icon
- Loading state: spinning refresh icon + "Fetching..." text
- Enter key triggers fetch

### States
1. **Empty**: Input field and fetch button
2. **Loading**: Disabled input, spinning icon, "Fetching..." text
3. **Success**: Image preview with remove button (same as file upload)
4. **Error**: Alert message with error details

## API Flow

### Frontend → Backend
**Endpoint**: `GET /image?url={figmaUrl}`

**Request**: Query parameter with encoded Figma URL

**Response**:
```json
{
  "error": null | "error message",
  "image": "https://figma-cdn.com/..." | null
}
```

### Backend → Figma API
**Endpoint**: `GET https://api.figma.com/v1/images/{fileId}?ids={nodeId}&format=png`

**Headers**: 
- `X-Figma-Token`: Figma access token from environment variable

**Response**:
```json
{
  "err": null,
  "images": {
    "{nodeId}": "https://figma-cdn.com/..."
  }
}
```

## URL Parsing

### Expected Format
`https://www.figma.com/design/{fileId}/...?node-id={nodeId}`

### Extraction Logic
1. Parse URL using `new URL()`
2. Extract file ID from pathname: `pathname.split('/')[2]`
3. Extract node ID from query params: `searchParams.get('node-id')`
4. Validate both exist, return error if not

### Node ID Format
- URL format: `123-456` (hyphen-separated)
- API format: `123:456` (colon-separated)
- Conversion: `nodeId.replaceAll('-', ':')`

## Image Processing

### Fetch Flow
1. Backend receives Figma URL
2. Parse and validate URL
3. Call Figma API with file ID and node ID
4. Receive image URL from Figma CDN
5. Return image URL to frontend
6. Frontend fetches image from CDN
7. Convert blob to File object
8. Load into comparison viewer

### Error Handling
- **Invalid URL**: "Url invalid" error
- **Missing URL**: "Missing url" error  
- **Figma API Error**: "Failed to fetch image from URL"
- **CDN Fetch Error**: "Failed to fetch image from Figma CDN"

## Environment Configuration

### Backend (.env)
```env
FIGMA_TOKEN=your_figma_access_token
```

### Token Generation
Users must create a Figma access token from:
https://www.figma.com/developers/api#access-tokens

## Integration Points

### Frontend (page.tsx)
- State: `inputMode`, `figmaUrl`, `isFetchingUrl`
- Handler: `handleFetchFigmaImage()`
- API call: `fetchFigmaImage(url)` from `lib/api.ts`

### Backend (index.js)
- Route: `GET /image`
- Dependencies: axios, dotenv
- Environment: `FIGMA_TOKEN`
