import React from 'react';
import { commands } from '../data/commands';
import styles from './Cheatsheet.module.css';
import { Printer } from 'lucide-react';

const Cheatsheet: React.FC = () => {
  const categories = React.useMemo(() => {
    const cats = new Set<string>();
    commands.forEach(cmd => cats.add(cmd.category));
    return Array.from(cats);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Git Cheatsheet</h1>
          <p>A quick reference guide for essential Git commands.</p>
        </div>
        <button className={styles.printBtn} onClick={handlePrint}>
          <Printer size={18} /> Print
        </button>
      </div>

      <div className={styles.grid}>
        {categories.map(category => {
          const catCommands = commands.filter(c => c.category === category);
          return (
            <div key={category} className={`${styles.categorySection} glass-panel`}>
              <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
              <table className={styles.cmdTable}>
                <tbody>
                  {catCommands.map(cmd => (
                    <tr key={cmd.name}>
                      <td className={styles.cmdName}><code>{cmd.name}</code></td>
                      <td className={styles.cmdDesc}>{cmd.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cheatsheet;
