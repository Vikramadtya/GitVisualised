import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { commands } from '../data/commands';
import type { Category } from '../data/commands';
import { Search } from 'lucide-react';
import styles from './Reference.module.css';

const Reference: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const filteredCommands = commands.filter(cmd => {
    const matchesSearch = cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cmd.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || cmd.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Command Reference</h1>
        <p>The definitive guide to Git commands, based on <em>Pro Git</em>.</p>
        
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} size={20} />
            <input 
              type="text" 
              placeholder="Search commands..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filters}>
            {['all', 'basics', 'branching', 'remote', 'history', 'advanced'].map(cat => (
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
        {filteredCommands.map(cmd => {
          const commandId = cmd.name.replace(/\s+/g, '-');
          return (
            <Link key={cmd.name} to={`/reference/${commandId}`} className={`${styles.card} glass-panel`} style={{ textDecoration: 'none' }}>
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
        })}
      </div>
    </div>
  );
};

export default Reference;
