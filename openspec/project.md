# Project Context

## Purpose
Tạo ra web cho phép so sánh hình ảnh từ Figma (expected output) và hình ảnh từ thực tế (actual output) để tìm ra các lỗi UI trong quá trình code của developer. Các lỗi bao gồm:
- Lỗi layout, sai bố cục, sai alignment
- Lỗi sai color
- Lỗi sai kích thước và font size
- Lỗi sai icon
- Lỗi sai text

## Tech Stack
- Typescript
- NestJS
- NextJS

## Project Conventions

### Code Style
- **TypeScript**: Strict mode enabled, prefer type safety over `any`
- **Naming Conventions**:
  - Components: PascalCase (e.g., `CompareButton`, `ImageViewer`)
  - Files: kebab-case for CSS (e.g., `globals.css`), camelCase for TS/TSX (e.g., `page.tsx`)
  - Variables/Functions: camelCase (e.g., `handleFileSelect`, `figmaPreview`)
  - CSS Classes: kebab-case (e.g., `sidebar-header`, `upload-box`)
- **Formatting**: 
  - 2 spaces indentation
  - Single quotes for strings in TypeScript
  - Semicolons required
- **React Conventions**:
  - Use functional components with hooks
  - Prefer `const` over `let`
  - Use descriptive state variable names

### Architecture Patterns
- **Frontend (Next.js)**:
  - Client-side rendering with "use client" directive
  - Component-based architecture
  - State management using React hooks (useState, useRef, useEffect)
  - CSS modules approach with global styles
  - Responsive design with mobile-first approach
- **Backend (NestJS)**:
  - RESTful API architecture
  - Controller-Service pattern
  - File upload handling with Multer
  - CORS enabled for cross-origin requests
- **Communication**:
  - Frontend calls backend via fetch API
  - FormData for multipart file uploads
  - JSON response format

### Testing Strategy
- **Unit Testing**: Test individual components and functions
- **Integration Testing**: Test API endpoints and file upload flow
- **Manual Testing**: UI/UX testing for image comparison features
- **Browser Compatibility**: Test on modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive Testing**: Test on different screen sizes (desktop, tablet, mobile)

### Git Workflow
- Branch name must be in format: `feat/{feature-name}` or `fix/{fix-name}`
- Commit message must be in format: `feat: {commit-message}` or `fix: {commit-message}` or `chore: {commit-message}`
- Always pull latest changes before creating new branch
- Create PR for code review before merging to main

## Domain Context
- **Image Comparison**: The app compares two images (Figma design vs actual implementation) to identify UI discrepancies
- **Comparison Modes**:
  - **2-up**: Side-by-side view for direct comparison
  - **Swipe**: Interactive slider to overlay and compare images
  - **Onion Skin**: Opacity-based overlay to see differences
- **Zoom Functionality**: Users can zoom in/out (50%-200%) to inspect details
- **AI Analysis**: Uses Google Gemini AI (gemini-2.5-flash) to analyze differences and provide structured feedback
- **Error Categories**: Layout, color, size, icon, text, spacing, alignment issues
- **Severity Levels**: Low, medium, high based on impact

## Important Constraints
- **File Size Limit**: Maximum 10MB per image upload
- **Image Formats**: PNG, JPG supported
- **API Rate Limits**: Google Gemini API has rate limits (consider implementing retry logic)
- **Browser Requirements**: Modern browsers with ES6+ support required
- **CORS**: Backend must enable CORS for frontend to communicate (localhost:3001 → localhost:3000)
- **Performance**: Large images may impact comparison speed and AI analysis time
- **Aspect Ratio**: Images maintain aspect ratio, fit-height approach for proper display

## External Dependencies
- **Google Gemini API**: 
  - Model: `gemini-2.5-flash`
  - Used for AI-powered image comparison and analysis
  - Requires API key: `AIzaSyAtN-7UA1Z5N6u7rYWJV2ViJgpiT8wfmbo` (should be moved to environment variables)
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- **Google Fonts**: 
  - Roboto font family for typography
  - Material Icons for UI icons
- **Node Packages**:
  - Frontend: React, Next.js, TypeScript
  - Backend: NestJS, Multer (file upload), Axios (HTTP client)
- **Development Tools**:
  - npm for package management
  - TypeScript compiler
  - ESLint for code linting
