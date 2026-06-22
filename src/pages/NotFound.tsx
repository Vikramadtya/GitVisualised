import React from 'react';
import { Link } from 'react-router-dom';
import { GitBranch } from 'lucide-react';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <GitBranch size={64} className={styles.icon} />
      <h1 className="text-gradient">fatal: remote ref not found</h1>
      <p>The branch or page you are looking for does not exist in this repository.</p>
      <Link to="/" className={styles.btn}>
        git checkout main
      </Link>
    </div>
  );
};

export default NotFound;
