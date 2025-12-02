# Proposal: Implement AI Image Comparison

## Goal
Enable users to automatically compare two images (Figma design vs. Actual implementation) using Google Gemini API to identify and categorize UI discrepancies.

## Context
Currently, the application supports manual comparison modes (2-up, Swipe). Users have to visually inspect the images to find differences. This process can be time-consuming and prone to human error. Adding an AI-powered comparison feature will automate this process, providing a list of detected issues with their severity and type.

## Solution
Integrate Google Gemini API (specifically `gemini-2.5-flash` as mentioned in project context) to analyze the two images.
The backend will handle the interaction with the Gemini API.
The frontend will display the results (list of issues) and potentially overlay them on the images.

## Risks
- **API Costs/Limits**: Gemini API has rate limits and potential costs.
- **Accuracy**: AI might hallucinate or miss subtle differences.
- **Latency**: Analyzing images might take time.
