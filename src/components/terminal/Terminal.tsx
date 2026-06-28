import React, { useState, useRef, useEffect } from 'react';
import { useScenarioStore } from '../../store/useScenarioStore';
import styles from './Terminal.module.css';
import { playClickSound, playSuccessSound, playErrorSound } from '../../utils/sounds';

interface TerminalLine {
  id: string;
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

const COMMON_COMMANDS = [
  'git status', 'git log', 'git log --oneline', 'git commit', 'git add .', 
  'git checkout', 'git rebase', 'git merge', 'git push', 'git pull', 'git fetch'
];

const Terminal: React.FC = () => {
  const { submitCommand, graph, activeScenarioIndex, activeStepIndex } = useScenarioStore();
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 'init-1', text: 'Git Visualised v1.0.0', type: 'output' },
    { id: 'init-2', text: 'Type a git command to begin. (Try "help", "git status", "git log")', type: 'output' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isInitialMount = useRef(true);

  // Reset terminal on new scenario or reset
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (activeStepIndex === 0) {
      setLines([
        { id: `init-1-${Date.now()}`, text: 'Git Visualised v1.0.0', type: 'output' },
        { id: `init-2-${Date.now()}`, text: 'Type a git command to begin. (Try "help", "git status", "git log")', type: 'output' }
      ]);
      setHistory([]);
      setHistoryIndex(-1);
    }
  }, [activeScenarioIndex, activeStepIndex]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const branchName = graph.branches.some(b => b.name === graph.HEAD) 
    ? graph.HEAD 
    : (graph.HEAD ? graph.HEAD.substring(0, 7) : 'detached');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playClickSound();

    if (e.key === 'Tab') {
      e.preventDefault();
      const val = inputValue.trim();
      if (!val) return;
      const matches = COMMON_COMMANDS.filter(cmd => cmd.startsWith(val));
      if (matches.length === 1) {
        setInputValue(matches[0]);
      } else if (matches.length > 1) {
        setLines(prev => [...prev, 
          { id: Date.now().toString() + 'in', text: `$ ${inputValue}`, type: 'input' },
          { id: Date.now().toString() + 'out', text: matches.join('  '), type: 'output' }
        ]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputValue(history[history.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputValue(history[history.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;

    const newLines = [...lines, { id: Date.now().toString(), text: `$ ${val}`, type: 'input' as const }];
    setHistory(prev => [...prev, val]);
    setHistoryIndex(-1);
    setInputValue('');

    if (val === 'clear') {
      setLines([]);
      playSuccessSound();
      return;
    }

    if (val === 'help') {
      setLines([...newLines, { id: Date.now().toString() + 'out', text: 'Available commands: git status, git log, clear, help.\nOr follow the scenario instructions!', type: 'output' }]);
      playSuccessSound();
      return;
    }

    if (val === 'git status') {
      const output = [];
      const bn = graph.branches.some(b => b.name === graph.HEAD) ? graph.HEAD : 'HEAD detached at ' + (graph.HEAD ? graph.HEAD.substring(0,7) : 'null');
      output.push(`On branch ${bn}`);
      if (graph.stagingArea && graph.stagingArea.length > 0) {
        output.push('Changes to be committed:');
        graph.stagingArea.forEach(f => output.push(`  modified:   ${f}`));
      }
      if (graph.workingDirectory && graph.workingDirectory.length > 0) {
        output.push('Changes not staged for commit:');
        graph.workingDirectory.forEach(f => output.push(`  modified:   ${f}`));
      }
      if (graph.conflictedFiles && graph.conflictedFiles.length > 0) {
        output.push('Unmerged paths:');
        graph.conflictedFiles.forEach(f => output.push(`  both modified:   ${f}`));
      }
      if ((!graph.stagingArea || graph.stagingArea.length === 0) && (!graph.workingDirectory || graph.workingDirectory.length === 0) && (!graph.conflictedFiles || graph.conflictedFiles.length === 0)) {
        output.push('nothing to commit, working tree clean');
      }
      setLines([...newLines, { id: Date.now().toString() + 'out', text: output.join('\n'), type: 'output' }]);
      playSuccessSound();
      return;
    }

    if (val === 'git log' || val === 'git log --oneline') {
      let currentCommitId = graph.HEAD;
      const branch = graph.branches.find(b => b.name === graph.HEAD);
      if (branch) currentCommitId = branch.target;
      
      const histOutput = [];
      let curr = graph.commits.find(c => c.id === currentCommitId);
      while(curr) {
         histOutput.push(`${curr.id.substring(0,7)} ${curr.message}`);
         if (curr.parents.length > 0) {
           curr = graph.commits.find(c => c.id === curr!.parents[0]);
         } else {
           curr = undefined;
         }
      }
      setLines([...newLines, { id: Date.now().toString() + 'out', text: histOutput.join('\n'), type: 'output' }]);
      playSuccessSound();
      return;
    }

    const result = submitCommand(val);
    
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

    if (result.success) {
      playSuccessSound();
    } else {
      playErrorSound();
    }

    setLines(newLines.slice(-100)); // Cap to 100 lines
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className={`${styles.terminalWrapper} glass-panel`} onClick={focusInput}>
      <div className={styles.terminalHeader}>
        <div className={styles.windowControls}>
          <span className={styles.controlClose}></span>
          <span className={styles.controlMinimize}></span>
          <span className={styles.controlMaximize}></span>
        </div>
        <div className={styles.windowTitle}>bash — 80x24</div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            const text = lines.map(l => l.type === 'input' ? l.text : l.text).join('\n');
            navigator.clipboard.writeText(text);
          }}
          style={{ 
            background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', 
            fontSize: '0.75rem', position: 'absolute', right: '16px', display: 'flex', alignItems: 'center', gap: '4px' 
          }}
          title="Copy output"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Copy
        </button>
      </div>
      <div className={styles.terminalBody}>
        {lines.map((line) => (
          <div key={line.id} className={`${styles.line} ${styles[line.type]}`} style={{ whiteSpace: 'pre-wrap' }}>
            {line.text}
          </div>
        ))}
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <span className={styles.prompt} style={{ color: 'var(--color-accent-secondary)', marginRight: '8px' }}>
            you@git-vis {branchName} $
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
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
