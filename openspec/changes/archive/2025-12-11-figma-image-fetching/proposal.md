# Proposal: Figma Image Fetching

## Why
Users should be able to directly fetch design images from Figma URLs instead of manually downloading and uploading them. This streamlines the workflow and reduces friction in the comparison process.

## What Changes
Add the ability to fetch images directly from Figma by pasting a Figma design URL. The system will use the Figma API to retrieve the image and load it into the comparison viewer.

## Context
Currently, users must:
1. Open Figma
2. Export the design as an image
3. Download the image
4. Upload it to the comparison tool

This is cumbersome. By integrating with the Figma API, users can simply copy the Figma URL and paste it directly into the application.

## Solution
- Add a URL input mode toggle in the Figma Design upload section
- Allow users to switch between "Upload File" and "Figma URL" modes
- Parse Figma URLs to extract file ID and node ID
- Call Figma API to get the image URL for the specific node
- Fetch the image from Figma's CDN and convert it to a File object
- Load the fetched image into the comparison viewer

## Risks
- **API Rate Limits**: Figma API has rate limits that could affect heavy users
- **Authentication**: Requires a Figma access token to be configured
- **URL Format Changes**: Figma might change their URL structure
- **Network Errors**: Fetching could fail due to network issues or invalid URLs
