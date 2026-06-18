import React, { useState, useRef, useEffect } from 'react';
import { useScenarioStore } from '../../store/useScenarioStore';
import styles from './Terminal.module.css';

interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 'init-1', text: 'Git Visualised v1.0.0', type: 'output' },
    { id: 'init-2', text: 'Type a git command to begin.', type: 'output' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const { submitCommand } = useScenarioStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newLines = [...lines, { id: Date.now().toString(), text: `$ ${inputValue}`, type: 'input' as const }];
    
    const result = submitCommand(inputValue);
    
    if (result.output) {
      newLines.push({ 
        id: Date.now().toString() + 'out', 
        text: result.output, 
        type: result.success ? 'output' as const : 'error' as const 
      });
    }
    
    if (result.message) {
      newLines.push({
        id: Date.now().toString() + 'msg',
        text: result.message,
        type: 'success' as const
      });
    }

    setLines(newLines);
    setInputValue('');
  };

  return (
    <div className={`${styles.terminalWrapper} glass-panel`}>
      <div className={styles.terminalHeader}>
        <div className={styles.windowControls}>
          <span className={styles.controlClose}></span>
          <span className={styles.controlMinimize}></span>
          <span className={styles.controlMaximize}></span>
        </div>
        <div className={styles.windowTitle}>bash — 80x24</div>
      </div>
      <div className={styles.terminalBody}>
        {lines.map((line) => (
          <div key={line.id} className={`${styles.line} ${styles[line.type]}`}>
            {line.text}
          </div>
        ))}
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <span className={styles.prompt}>$</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.inputField}
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Terminal;
