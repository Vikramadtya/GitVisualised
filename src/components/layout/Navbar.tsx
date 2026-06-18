import React from 'react';
import { NavLink } from 'react-router-dom';
import { GitBranch, BookOpen, Terminal, Code2, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

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

        <button 
          className={styles.themeToggle} 
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
