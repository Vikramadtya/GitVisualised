import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { commands } from '../data/commands';
import type { Category } from '../data/commands';
import { Search } from 'lucide-react';
import styles from './Reference.module.css';

const Reference: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const categories = React.useMemo(() => {
    const cats = new Set<string>();
    commands.forEach(cmd => cats.add(cmd.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredCommands = commands.filter(cmd => {
    const matchesSearch = cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cmd.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || cmd.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && focusedIndex >= 0 && focusedIndex < filteredCommands.length) {
        const cmd = filteredCommands[focusedIndex];
        const commandId = cmd.name.replace(/\s+/g, '-');
        window.location.href = `/reference/${commandId}`;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, focusedIndex]);

  React.useEffect(() => {
    setFocusedIndex(-1);
  }, [searchTerm, activeCategory]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Command Reference</h1>
        <p>The definitive guide to Git commands, based on <em>Pro Git</em>.</p>
        
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} size={20} />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search commands... (Press '/' to focus)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filters}>
            {categories.map(cat => (
              <button 
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat as Category | 'all')}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredCommands.length > 0 ? (
          filteredCommands.map((cmd, idx) => {
            const commandId = cmd.name.replace(/\s+/g, '-');
            return (
              <Link 
                key={cmd.name} 
                to={`/reference/${commandId}`} 
                className={`${styles.card} glass-panel`} 
                style={{ 
                  textDecoration: 'none', 
                  border: focusedIndex === idx ? '2px solid var(--color-accent-primary)' : undefined,
                  transform: focusedIndex === idx ? 'scale(1.02)' : 'none'
                }}
              >
                <div className={styles.cardHeader}>
                  <h2 className="text-gradient">{cmd.name}</h2>
                  <span className={`${styles.badge} ${styles[cmd.level]}`}>{cmd.level}</span>
                </div>
                
                <div className={styles.synopsis}>
                  <code>{cmd.synopsis}</code>
                </div>
                
                <p className={styles.description}>{cmd.description}</p>
                
                <div className={styles.readMore}>
                  <span>View Details &rarr;</span>
                </div>
              </Link>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--color-text-muted)' }}>
            <Search size={48} style={{ opacity: 0.2, marginBottom: 'var(--spacing-4)' }} />
            <h3>No commands found</h3>
            <p>Try adjusting your search term or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reference;
