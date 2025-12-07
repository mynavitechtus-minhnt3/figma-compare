import { ComparisonResult, Bug } from '../../types';
import styles from './ResultsPanel.module.css';

interface ResultsPanelProps {
  results: ComparisonResult;
  selectedBugId: number | null;
  onBugSelect: (bugId: number | null) => void;
  onClose: () => void;
}

export default function ResultsPanel({ results, selectedBugId, onBugSelect, onClose }: ResultsPanelProps) {
  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h2>Analysis Results</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          <span className="material-icons">close</span>
        </button>
      </div>
      
      <div className={styles.body}>
        {/* Analysis Summary */}
        <div className={styles.summary}>
          <p className={styles.log}>{results.analysis_log}</p>
          <div className={styles.stats}>
            <span className={`${styles.statusBadge} ${results.is_pass ? styles.pass : styles.fail}`}>
              {results.is_pass ? '✓ PASS' : '✗ FAIL'}
            </span>
            <span className={styles.bugCount}>
              {results.total_bugs} {results.total_bugs === 1 ? 'Bug' : 'Bugs'} Found
            </span>
          </div>
        </div>

        {/* Bugs List */}
        {results.bugs && results.bugs.length > 0 ? (
          <ul className={styles.bugsList}>
            {results.bugs.map((bug: Bug) => (
              <li 
                key={bug.id} 
                className={`${styles.bugItem} ${styles[bug.severity.toLowerCase()]} ${selectedBugId === bug.id ? styles.selected : ''}`}
                onClick={() => onBugSelect(selectedBugId === bug.id ? null : bug.id)}
              >
                <div className={styles.bugHeader}>
                  <span className={styles.bugId}>#{bug.id}</span>
                  <span className={styles.bugType}>{bug.type.replace(/_/g, ' ')}</span>
                  <span className={styles.bugSeverity}>{bug.severity}</span>
                </div>
                <p className={styles.bugDescription}>{bug.description}</p>
                {bug.bounding_box && (
                  <p className={styles.boundingBox}>
                    📍 Location: [{bug.bounding_box.join(', ')}]
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.noIssues}>
            <span className="material-icons">check_circle</span>
            <p>No visual drift detected! Perfect match.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
