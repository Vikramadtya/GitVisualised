import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Lightbulb } from 'lucide-react';
import { commands } from '../data/commands';
import CompareMergeRebase from '../components/CompareMergeRebase';
import styles from './CommandDetail.module.css';

const CommandDetail: React.FC = () => {
  const { commandId } = useParams<{ commandId: string }>();
  const navigate = useNavigate();

  // Find the command
  const commandName = commandId?.replace(/-/g, ' ');
  const command = commands.find(c => c.name.toLowerCase() === commandName?.toLowerCase());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [commandId]);

  if (!command) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h2>Command not found</h2>
          <p>We couldn't find a command matching "{commandName}".</p>
          <button className={styles.backBtn} onClick={() => navigate('/reference')}>
            <ArrowLeft size={18} />
            Back to Reference
          </button>
        </div>
      </div>
    );
  }

  // Check if we need a visual guide
  const needsVisualGuide = command.name === 'git merge' || command.name === 'git rebase';

  return (
    <div className={styles.container}>
      <Link to="/reference" className={styles.backLink}>
        <ArrowLeft size={18} />
        Back to Reference
      </Link>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className="text-gradient">{command.name}</h1>
          <span className={`${styles.badge} ${styles[command.level]}`}>{command.level}</span>
        </div>
        <div className={styles.synopsis}>
          <code>{command.synopsis}</code>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Description</h2>
          <p className={styles.descriptionText}>{command.description}</p>
        </section>

        {command.flags.length > 0 && (
          <section className={styles.section}>
            <h2>Common Flags</h2>
            <ul className={styles.flagList}>
              {command.flags.map(f => (
                <li key={f.flag} className="glass-panel">
                  <code>{f.flag}</code>
                  <span>{f.description}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {command.examples.length > 0 && (
          <section className={styles.section}>
            <h2>Examples</h2>
            <div className={styles.examplesList}>
              {command.examples.map((ex, idx) => (
                <div key={idx} className={styles.exampleItem}>
                  <div className={styles.exampleCommand}>
                    <code>$ {ex.command}</code>
                  </div>
                  <p className={styles.exampleExplanation}>{ex.explanation}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {command.dangers && (
          <div className={`${styles.alert} ${styles.danger}`}>
            <AlertTriangle size={24} className={styles.alertIcon} />
            <div>
              <strong>Warning</strong>
              <p>{command.dangers}</p>
            </div>
          </div>
        )}

        {command.tip && (
          <div className={`${styles.alert} ${styles.tip}`}>
            <Lightbulb size={24} className={styles.alertIcon} />
            <div>
              <strong>Pro Tip</strong>
              <p>{command.tip}</p>
            </div>
          </div>
        )}

        {needsVisualGuide && (
          <section className={styles.section} style={{ marginTop: 'var(--spacing-8)' }}>
            <h2>Visual Guide</h2>
            <p className={styles.descriptionText}>
              Understanding the difference between 3-way merging and rebasing is critical. 
              Here is a side-by-side comparison of how this operation affects repository history.
            </p>
            <CompareMergeRebase />
          </section>
        )}

        {command.relatedCommands && command.relatedCommands.length > 0 && (
          <section className={styles.section}>
            <h2>Related Commands</h2>
            <div className={styles.relatedTags}>
              {command.relatedCommands.map(related => (
                <Link 
                  key={related} 
                  to={`/reference/${related.replace(/\s+/g, '-')}`}
                  className={styles.relatedTag}
                >
                  {related}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CommandDetail;
