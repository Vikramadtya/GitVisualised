import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Terminal as TerminalIcon, Command as CommandIcon } from 'lucide-react';
import { concepts } from '../data/concepts';
import { commands } from '../data/commands';
import { scenarios } from '../data/scenarios';
import { useScenarioStore } from '../store/useScenarioStore';
import { playClickSound } from '../utils/sounds';
import styles from './CommandPalette.module.css';

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const setScenario = useScenarioStore(state => state.setScenario);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setSearchQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const allItems = [
    ...concepts.map(c => ({ type: 'concept', id: c.id, title: c.title, icon: <BookOpen size={16} /> })),
    ...scenarios.map(s => ({ type: 'scenario', id: s.id, title: s.title, icon: <TerminalIcon size={16} /> })),
    ...commands.map(cmd => ({ type: 'command', id: cmd.name, title: `git ${cmd.name}`, icon: <CommandIcon size={16} /> }))
  ];

  const filteredItems = allItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8); // Show max 8 results

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleSelect = (item: any) => {
    playClickSound();
    setIsOpen(false);
    if (item.type === 'concept') {
      navigate(`/learn/concept/${item.id}`);
    } else if (item.type === 'scenario') {
      setScenario(item.id);
      navigate('/playground');
    } else if (item.type === 'command') {
      navigate(`/reference/${item.id}`);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div 
            className={styles.paletteContainer}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input
                ref={inputRef}
                className={styles.searchInput}
                placeholder="Search concepts, commands, or labs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleListKeyDown}
              />
            </div>
            
            <div className={styles.resultsList}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <div 
                    key={`${item.type}-${item.id}`}
                    className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ''}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className={styles.itemIcon}>{item.icon}</span>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.itemType}>{item.type}</span>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>No results found for "{searchQuery}"</div>
              )}
            </div>
            <div className={styles.footer}>
              <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
              <span><kbd>↵</kbd> to select</span>
              <span><kbd>esc</kbd> to close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
