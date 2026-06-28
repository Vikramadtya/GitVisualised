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
  const [recentItems, setRecentItems] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('recentPaletteItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
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

  const allItems = React.useMemo(() => [
    ...concepts.map(c => ({ type: 'concept', id: c.id, title: c.title, icon: <BookOpen size={16} /> })),
    ...scenarios.map(s => ({ type: 'scenario', id: s.id, title: s.title, icon: <TerminalIcon size={16} /> })),
    ...commands.map(cmd => ({ type: 'command', id: cmd.name, title: cmd.name.startsWith('git ') ? cmd.name : `git ${cmd.name}`, icon: <CommandIcon size={16} /> }))
  ], []);

  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return recentItems.length > 0 ? recentItems : allItems.slice(0, 8);
    }

    const fuzzyMatch = (pattern: string, str: string) => {
      let pIdx = 0, sIdx = 0;
      while (pIdx < pattern.length && sIdx < str.length) {
        if (pattern[pIdx].toLowerCase() === str[sIdx].toLowerCase()) pIdx++;
        sIdx++;
      }
      return pIdx === pattern.length;
    };

    return allItems.filter(item => fuzzyMatch(searchQuery, item.title)).slice(0, 8);
  }, [searchQuery, allItems, recentItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleSelect = (item: any) => {
    playClickSound();
    setIsOpen(false);
    
    // Save to recents
    setRecentItems(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      // Exclude icon from storage to avoid React element serialization issues
      const itemToSave = { type: item.type, id: item.id, title: item.title };
      const updated = [itemToSave, ...filtered].slice(0, 5);
      localStorage.setItem('recentPaletteItems', JSON.stringify(updated));
      return updated;
    });

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
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
            onKeyDown={(e) => {
              // Basic Focus Trap
              if (e.key === 'Tab') {
                e.preventDefault();
              }
            }}
          >
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={20} aria-hidden="true" />
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Search commands, concepts, or labs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleListKeyDown}
                className={styles.searchInput}
                aria-label="Search"
                aria-autocomplete="list"
                aria-controls="palette-results"
                aria-activedescendant={filteredItems[selectedIndex] ? `result-${filteredItems[selectedIndex].id}` : undefined}
              />
            </div>
            
            <div className={styles.resultsList}>
              {filteredItems.length > 0 ? (
                <div className={styles.resultsList} id="palette-results" role="listbox">
                  {!searchQuery.trim() && recentItems.length > 0 && (
                    <div style={{ padding: '8px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }} aria-hidden="true">
                      Recent Items
                    </div>
                  )}
                  {filteredItems.map((item, idx) => {
                    // Re-attach icons for recents
                    let icon = item.icon;
                    if (!icon) {
                      if (item.type === 'concept') icon = <BookOpen size={16} />;
                      else if (item.type === 'scenario') icon = <TerminalIcon size={16} />;
                      else icon = <CommandIcon size={16} />;
                    }

                    return (
                      <div 
                        key={item.id}
                        id={`result-${item.id}`}
                        role="option"
                        aria-selected={idx === selectedIndex}
                        className={`${styles.resultItem} ${idx === selectedIndex ? styles.selected : ''}`}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <span className={styles.itemIcon} aria-hidden="true">{icon}</span>
                        <span className={styles.itemTitle}>{item.title}</span>
                        <span className={styles.itemType}>{item.type}</span>
                      </div>
                    );
                  })}
                </div>
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
