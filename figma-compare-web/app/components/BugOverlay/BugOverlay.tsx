import { Bug } from '../../types';
import styles from './BugOverlay.module.css';

interface BugOverlayProps {
  bugs: Bug[];
  selectedBugId: number | null;
  onBugSelect: (bugId: number | null) => void;
  visible: boolean;
  imageRef?: React.RefObject<HTMLImageElement | null>;
}

export default function BugOverlay({ bugs, selectedBugId, onBugSelect, visible, imageRef }: BugOverlayProps) {
  if (!visible || bugs.length === 0) return null;

  // Use natural dimensions if available, otherwise fallback to 1000 (assuming 1:1 mapping if no image)
  // Gemini typically returns coordinates normalized to 1000x1000
  const naturalWidth = imageRef?.current?.naturalWidth || 1000;
  const naturalHeight = imageRef?.current?.naturalHeight || 1000;

  const scaleX = naturalWidth / 1000;
  const scaleY = naturalHeight / 1000;

  return (
    <div className={styles.container}>
      {bugs.map((bug) => {
        const [y1, x1, y2, x2] = bug.bounding_box;
        const isSelected = selectedBugId === bug.id;
        
        // Convert normalized coordinates (0-1000) to actual pixels
        const pixelY1 = y1 * scaleY;
        const pixelX1 = x1 * scaleX;
        const pixelY2 = y2 * scaleY;
        const pixelX2 = x2 * scaleX;

        return (
          <div
            key={bug.id}
            className={`${styles.box} ${styles[bug.severity.toLowerCase()]} ${isSelected ? styles.selected : ''}`}
            style={{
              top: `${pixelY1}px`,
              left: `${pixelX1}px`,
              width: `${pixelX2 - pixelX1}px`,
              height: `${pixelY2 - pixelY1}px`,
            }}
            onClick={() => onBugSelect(isSelected ? null : bug.id)}
            title={`${bug.type.replace(/_/g, ' ')} - ${bug.severity}`}
          >
            {isSelected && (
              <div className={styles.badge}>
                #{bug.id}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
