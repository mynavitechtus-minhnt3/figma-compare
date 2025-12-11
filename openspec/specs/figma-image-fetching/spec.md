# figma-image-fetching Specification

## Purpose
Streamline the workflow by allowing users to fetch Figma design images directly from Figma URLs instead of manually downloading and uploading them. The system integrates with Figma API to retrieve images from specific design nodes, reducing friction in the comparison process.
## Requirements
### Requirement: Input Mode Selection
The system SHALL allow users to choose between file upload and Figma URL input for the Figma Design.

#### Scenario: Mode toggle display
- **WHEN** the Figma Design upload section is displayed
- **THEN** a radio button group SHALL be shown with "Upload File" and "Figma URL" options
- **AND** "Upload File" SHALL be selected by default

#### Scenario: Switch to URL mode
- **WHEN** user selects "Figma URL" option
- **THEN** the file upload interface SHALL be hidden
- **AND** a URL input field and "Fetch Image" button SHALL be displayed

#### Scenario: Switch to file mode
- **WHEN** user selects "Upload File" option
- **THEN** the URL input interface SHALL be hidden
- **AND** the file upload interface SHALL be displayed

### Requirement: Figma URL Input
The system SHALL provide an interface for users to input and submit Figma design URLs.

#### Scenario: URL input field
- **WHEN** "Figma URL" mode is active
- **THEN** a text input field SHALL be displayed
- **AND** the placeholder SHALL be "https://www.figma.com/design/..."

#### Scenario: Fetch button
- **WHEN** "Figma URL" mode is active
- **THEN** a "Fetch Image" button with download icon SHALL be displayed
- **AND** clicking it SHALL trigger the image fetch process

#### Scenario: Enter key submission
- **WHEN** user presses Enter key in the URL input field
- **THEN** the fetch process SHALL be triggered
- **AND** it SHALL behave the same as clicking the "Fetch Image" button

#### Scenario: Empty URL validation
- **WHEN** user clicks "Fetch Image" with an empty URL
- **THEN** an alert SHALL display "Please enter a Figma URL"
- **AND** no API request SHALL be made

### Requirement: URL Fetching Process
The system SHALL fetch images from Figma using the provided URL.

#### Scenario: Loading state
- **WHEN** fetch process starts
- **THEN** the input field SHALL be disabled
- **AND** the button SHALL show a spinning refresh icon and "Fetching..." text

#### Scenario: Successful fetch
- **WHEN** image is successfully fetched from Figma
- **THEN** the URL input interface SHALL be replaced with an image preview
- **AND** a remove button SHALL be displayed
- **AND** the image SHALL be loaded into the comparison viewer

#### Scenario: Failed fetch
- **WHEN** fetch process fails
- **THEN** an alert SHALL display the error message
- **AND** the URL input field SHALL remain visible and enabled

#### Scenario: Clear previous results
- **WHEN** a new image is fetched successfully
- **THEN** any previous AI analysis results SHALL be cleared
- **AND** the results panel SHALL be hidden

### Requirement: URL Parsing and Validation
The system SHALL parse and validate Figma URLs before making API requests.

#### Scenario: Valid URL format
- **WHEN** a valid Figma URL is provided
- **THEN** the file ID SHALL be extracted from the pathname
- **AND** the node ID SHALL be extracted from query parameters
- **AND** both SHALL be sent to the backend

#### Scenario: Invalid URL format
- **WHEN** URL is missing file ID or node ID
- **THEN** backend SHALL return "Url invalid" error
- **AND** frontend SHALL display error to user

#### Scenario: Missing URL
- **WHEN** URL parameter is not provided to backend
- **THEN** backend SHALL return "Missing url" error with 400 status

### Requirement: Figma API Integration
The system SHALL integrate with Figma API to retrieve design images.

#### Scenario: API request
- **WHEN** backend receives a valid Figma URL
- **THEN** it SHALL call Figma API endpoint `/v1/images/{fileId}`
- **AND** include node ID and format=png as query parameters
- **AND** include Figma access token in X-Figma-Token header

#### Scenario: Node ID conversion
- **WHEN** making Figma API request
- **THEN** node ID SHALL be converted from hyphen format (123-456) to colon format (123:456)

#### Scenario: API response handling
- **WHEN** Figma API returns successfully
- **THEN** the image URL SHALL be extracted from the response
- **AND** returned to the frontend

#### Scenario: API error handling
- **WHEN** Figma API request fails
- **THEN** the error SHALL be caught and logged
- **AND** a 500 status with error message SHALL be returned to frontend

### Requirement: Image Download from CDN
The system SHALL download images from Figma's CDN and convert them to usable format.

#### Scenario: CDN fetch
- **WHEN** frontend receives image URL from backend
- **THEN** it SHALL fetch the image from Figma's CDN
- **AND** convert the blob to a File object

#### Scenario: File conversion
- **WHEN** image blob is received
- **THEN** it SHALL be converted to a File with name "figma-design.png"
- **AND** the file type SHALL match the blob type

#### Scenario: CDN fetch failure
- **WHEN** fetching from CDN fails
- **THEN** error "Failed to fetch image from Figma CDN" SHALL be thrown
- **AND** displayed to the user

### Requirement: Image Resizing Integration
The system SHALL integrate fetched images with the existing image resizing logic.

#### Scenario: Resize actual image
- **WHEN** a Figma image is fetched and actual image already exists
- **THEN** the actual image SHALL be resized to match the Figma image width
- **AND** both images SHALL be displayed in the viewer

#### Scenario: Fetch after actual upload
- **WHEN** actual image exists and then Figma image is fetched
- **THEN** the actual image SHALL be automatically resized
- **AND** comparison SHALL be ready immediately

### Requirement: Environment Configuration
The system SHALL require proper configuration to access Figma API.

#### Scenario: Figma token requirement
- **WHEN** backend starts
- **THEN** it SHALL load FIGMA_TOKEN from environment variables
- **AND** use it for all Figma API requests

#### Scenario: Missing token
- **WHEN** FIGMA_TOKEN is not configured
- **THEN** Figma API requests SHALL fail
- **AND** appropriate error SHALL be returned to user

