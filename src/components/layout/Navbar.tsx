import React from 'react';
import { NavLink } from 'react-router-dom';
import { GitBranch, BookOpen, Terminal, Code2, Sun, Moon, Trophy } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useProgressStore } from '../../store/useProgressStore';
import { concepts } from '../../data/concepts';
import { scenarios } from '../../data/scenarios';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { completedConceptIds, completedScenarioIds } = useProgressStore();
  
  const totalItems = concepts.length + scenarios.length;
  const completedItems = completedConceptIds.length + completedScenarioIds.length;
  const progressPct = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return (
    <nav className={`${styles.navbar} glass-panel`}>
      <div className={styles.navBrand}>
        <GitBranch className={styles.brandIcon} size={24} />
        <span className={`${styles.brandText} text-gradient`}>Git Visualised</span>
      </div>
      
      <div className={styles.navLinks}>
        <NavLink 
          to="/learn" 
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <BookOpen size={18} />
          <span>Curriculum</span>
        </NavLink>
        
        <NavLink 
          to="/playground" 
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <Terminal size={18} />
          <span>Playground</span>
        </NavLink>

        <NavLink 
          to="/reference" 
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <Code2 size={18} />
          <span>Reference</span>
        </NavLink>

        <NavLink 
          to="/cheatsheet" 
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <Code2 size={18} />
          <span>Cheatsheet</span>
        </NavLink>

        <button 
          className={styles.themeToggle} 
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className={styles.progressRingWrapper} title={`${completedItems} / ${totalItems} Mastered`}>
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="var(--color-border-subtle)" strokeWidth="3" />
            <circle 
              cx="18" cy="18" r="16" 
              fill="none" 
              stroke="var(--color-accent-success)" 
              strokeWidth="3" 
              strokeDasharray={`${2 * Math.PI * 16}`}
              strokeDashoffset={`${2 * Math.PI * 16 * (1 - progressPct / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          <div className={styles.progressIcon}>
            <Trophy size={14} color={progressPct === 100 ? 'var(--color-accent-success)' : 'var(--color-text-secondary)'} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
