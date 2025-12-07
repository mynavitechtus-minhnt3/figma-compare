/**
 * Reads an image file and returns an HTMLImageElement and its dimensions.
 */
export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Resizes an image file to match a target width while maintaining aspect ratio.
 * Returns a new File object and a data URL for preview.
 */
export const resizeImageToMatchWidth = async (
  file: File,
  targetWidth: number
): Promise<{ file: File; previewUrl: string; width: number; height: number }> => {
  const img = await loadImage(file);
  
  if (img.width === targetWidth) {
    // If width matches, just return original (but maybe compress? no, keep original)
    return {
      file,
      previewUrl: img.src,
      width: img.width,
      height: img.height
    };
  }

  const scale = targetWidth / img.width;
  const targetHeight = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Use high quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas to Blob failed'));
          return;
        }
        
        // Create new File object
        const newFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(blob);
        
        resolve({
          file: newFile,
          previewUrl,
          width: targetWidth,
          height: targetHeight
        });
      },
      file.type,
      0.95 // quality
    );
  });
};
