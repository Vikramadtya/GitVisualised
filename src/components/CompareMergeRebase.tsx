import React from 'react';
import GitGraph from './graph/GitGraph';
import type { GraphState } from '../store/useScenarioStore';
import styles from './CompareMergeRebase.module.css';

const MERGE_GRAPH: GraphState = {
  commits: [
    { id: 'c1', parents: [], message: 'Initial' },
    { id: 'c2', parents: ['c1'], message: 'Feature' },
    { id: 'c3', parents: ['c1'], message: 'Master Update' },
    { id: 'c4', parents: ['c3', 'c2'], message: 'Merge branch' }
  ],
  branches: [
    { name: 'master', target: 'c4' },
    { name: 'feature', target: 'c2' }
  ],
  HEAD: 'master',
  stagingArea: [],
  workingDirectory: []
};

const REBASE_GRAPH: GraphState = {
  commits: [
    { id: 'c1', parents: [], message: 'Initial' },
    { id: 'c3', parents: ['c1'], message: 'Master Update' },
    { id: 'c2_p', parents: ['c3'], message: 'Feature' }
  ],
  branches: [
    { name: 'master', target: 'c3' },
    { name: 'feature', target: 'c2_p' }
  ],
  HEAD: 'feature',
  stagingArea: [],
  workingDirectory: []
};

const CompareMergeRebase: React.FC = React.memo(() => {
  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <div className={styles.header}>
          <h3 className={styles.title}>3-Way Merge</h3>
          <p className={styles.description}>Preserves exact chronological history, creating a diamond shape with a merge commit.</p>
        </div>
        <div className={styles.graphWrapper}>
          <GitGraph customGraph={MERGE_GRAPH} />
        </div>
      </div>
      
      <div className={styles.column}>
        <div className={styles.header}>
          <h3 className={styles.title}>Rebase</h3>
          <p className={styles.description}>Rewrites history by moving feature commits to the tip of master, creating a clean linear path.</p>
        </div>
        <div className={styles.graphWrapper}>
          <GitGraph customGraph={REBASE_GRAPH} />
        </div>
      </div>
    </div>
  );
});

export default CompareMergeRebase;
