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
        // Defensive: ensure bounding_box is an iterable of 4 numbers
        if (!Array.isArray(bug.bounding_box) || bug.bounding_box.length < 4) {
          return null;
        }
        // Explicitly destructure as [ymin, xmin, ymax, xmax] per API contract
        let [ymin, xmin, ymax, xmax] = bug.bounding_box;
        
        // Validation & Clamping (0-1000)
        ymin = Math.max(0, Math.min(1000, ymin));
        xmin = Math.max(0, Math.min(1000, xmin));
        ymax = Math.max(0, Math.min(1000, ymax));
        xmax = Math.max(0, Math.min(1000, xmax));

        const isSelected = selectedBugId === bug.id;
        
        // Convert normalized coordinates (0-1000) to actual pixels
        // Ensure robust calculation even if coordinates are flipped
        const top = Math.min(ymin, ymax) * scaleY;
        const left = Math.min(xmin, xmax) * scaleX;
        const width = Math.abs(xmax - xmin) * scaleX;
        const height = Math.abs(ymax - ymin) * scaleY;

        return (
          <div
            key={bug.id}
            className={`${styles.box} ${styles[bug.severity.toLowerCase()]} ${isSelected ? styles.selected : ''}`}
            style={{
              top: `${top}px`,
              left: `${left}px`,
              width: `${width}px`,
              height: `${height}px`,
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
