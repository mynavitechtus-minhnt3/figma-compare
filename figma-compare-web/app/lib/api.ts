import { API_ENDPOINTS } from '../constants';
import { ComparisonResult } from '../types';

/**
 * Fetch image from Figma URL
 */
export async function fetchFigmaImage(url: string): Promise<File> {
  const response = await fetch(`${API_ENDPOINTS.GET_IMAGE}?url=${encodeURIComponent(url)}`);

  if (!response.ok) {
    throw new Error('Failed to fetch image from URL');
  }

  // Parse JSON response
  const data = await response.json();

  // Check for errors in response
  if (data.error) {
    throw new Error(data.error);
  }

  // Check if image URL exists
  if (!data.image) {
    throw new Error('No image URL returned from API');
  }

  // Fetch the actual image from the URL
  const imageResponse = await fetch(data.image);

  if (!imageResponse.ok) {
    throw new Error('Failed to fetch image from Figma CDN');
  }

  const blob = await imageResponse.blob();
  return new File([blob], 'figma-design.png', { type: blob.type });
}

/**
 * Parse comparison response - handles both direct JSON and markdown-wrapped JSON
 */
export function parseComparisonResponse(data: any): ComparisonResult {
  let parsedData = data.data;

  // If analysis_log is a string containing JSON (from markdown code block)
  if (typeof parsedData.analysis_log === 'string' && parsedData.analysis_log.includes('```json')) {
    try {
      // Extract JSON from markdown code block
      const jsonMatch = parsedData.analysis_log.match(/```json\s*\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        parsedData = JSON.parse(jsonMatch[1]);
      }
    } catch (parseError) {
      console.error('Failed to parse JSON from markdown:', parseError);
      // Fall back to original data if parsing fails
    }
  }

  return parsedData;
}

/**
 * Compare two images using the API
 */
export async function compareImages(
  expectedFile: File,
  actualFile: File,
  options: { timeout?: number } = {}
): Promise<ComparisonResult> {
  const { timeout = 90000 } = options;

  const formData = new FormData();
  formData.append('expected', expectedFile);
  formData.append('actual', actualFile);

  // Create abort controller with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(API_ENDPOINTS.COMPARE, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Analysis failed');
    }

    const data = await response.json();
    return parseComparisonResponse(data);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout / 1000} seconds`);
    }

    throw error;
  }
}
