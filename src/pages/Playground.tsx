import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import Terminal from '../components/terminal/Terminal';
import GitGraph from '../components/graph/GitGraph';
import { useScenarioStore } from '../store/useScenarioStore';
import { scenarios } from '../data/scenarios';
import { commands } from '../data/commands';
import { CheckCircle } from 'lucide-react';
import styles from './Playground.module.css';

const Playground: React.FC = () => {
  const { activeScenarioIndex, activeStepIndex, isCompleted, nextScenario, resetScenario, setScenario } = useScenarioStore();
  const currentScenario = scenarios[activeScenarioIndex];
  const currentStep = currentScenario?.steps[activeStepIndex];
  const [showHint, setShowHint] = React.useState(false);

  // Reset hint when step changes
  React.useEffect(() => {
    setShowHint(false);
  }, [activeStepIndex, activeScenarioIndex]);

  return (
    <div className={styles.playgroundGrid}>
      
      {/* Pane 1 (Left): Instructions & Progress */}
      <div className={`glass-panel ${styles.paneLeft}`}>
        <div style={{ marginBottom: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-accent-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
              Scenario {activeScenarioIndex + 1} of {scenarios.length}
            </span>
            <select 
              value={currentScenario.id}
              onChange={(e) => setScenario(e.target.value)}
              style={{
                background: 'var(--color-bg-overlay)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 8px',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {scenarios.map((s, idx) => (
                <option key={s.id} value={s.id}>
                  {idx + 1}. {s.title}
                </option>
              ))}
            </select>
          </div>
          <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>{currentScenario.title}</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>{currentScenario.description}</p>
        </div>
        
        <div style={{ 
          flex: 1, 
          background: 'var(--color-bg-surface)', 
          padding: 'var(--spacing-5)', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-subtle)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {isCompleted ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-2)', overflowY: 'auto' }}>
              <h3 style={{ color: 'var(--color-accent-success)', marginBottom: 'var(--spacing-4)' }}>Scenario Completed! 🎉</h3>
              
              {currentScenario.relatedCommands && currentScenario.relatedCommands.length > 0 && (
                <div style={{ textAlign: 'left', background: 'var(--color-bg-overlay)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-6)' }}>
                  <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-4)', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--spacing-2)' }}>Command Usecase Tricks</h4>
                  {currentScenario.relatedCommands.map(cmdName => {
                    const commandInfo = commands.find(c => c.name === cmdName);
                    if (!commandInfo) return null;
                    return (
                      <div key={cmdName} style={{ marginBottom: 'var(--spacing-4)' }}>
                        <h5 style={{ color: 'var(--color-accent-primary)', fontSize: '1.1rem', marginBottom: 'var(--spacing-2)' }}><code>{commandInfo.name}</code></h5>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--spacing-2)' }}>{commandInfo.description}</p>
                        {commandInfo.tip && (
                          <div style={{ background: 'rgba(56, 189, 248, 0.1)', borderLeft: '3px solid var(--color-accent-secondary)', padding: 'var(--spacing-2) var(--spacing-3)', fontSize: '0.85rem', marginBottom: 'var(--spacing-2)' }}>
                            <strong>Tip:</strong> {commandInfo.tip}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--spacing-4)', justifyContent: 'center' }}>
                <button 
                  onClick={resetScenario}
                  style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--color-border-default)', color: 'var(--color-text-primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                >
                  Restart
                </button>
                {activeScenarioIndex < scenarios.length - 1 && (
                  <button 
                    onClick={nextScenario}
                    style={{ padding: '8px 16px', background: 'var(--color-accent-secondary)', border: 'none', color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Next Scenario
                  </button>
                )}
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ flex: 1, overflowY: 'auto' }}
              >
                {currentStep && (
                  <>
                    <ReactMarkdown>{currentStep.instructionMarkdown}</ReactMarkdown>
                    
                    <div style={{ marginTop: 'var(--spacing-6)', padding: 'var(--spacing-4)', background: 'var(--color-bg-overlay)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--color-border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Stuck?</span>
                        <button 
                          onClick={() => setShowHint(!showHint)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-accent-primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          {showHint ? 'Hide Hint' : 'Show Hint'}
                        </button>
                      </div>
                      {showHint && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          style={{ marginTop: 'var(--spacing-3)', fontSize: '0.85rem', color: 'var(--color-text-primary)' }}
                        >
                          Try examining the expected command pattern: 
                          <code style={{ display: 'block', marginTop: '8px', padding: '8px', background: 'var(--color-bg-surface)', borderRadius: '4px', wordBreak: 'break-all' }}>
                            {currentStep.expectedCommandRegex.toString().replace(/^\/\^/, '').replace(/\$\/i?$/, '').replace(/\\/g, '')}
                          </code>
                        </motion.div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Redesigned Progress Dots */}
          {!isCompleted && (
            <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              {currentScenario.steps.map((_, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                  <div 
                    style={{ 
                      width: idx === activeStepIndex ? '28px' : '20px', 
                      height: idx === activeStepIndex ? '28px' : '20px', 
                      borderRadius: '50%',
                      background: idx < activeStepIndex ? 'var(--color-accent-success)' : (idx === activeStepIndex ? 'var(--color-accent-primary)' : 'var(--color-bg-surface)'),
                      border: idx >= activeStepIndex ? `2px solid ${idx === activeStepIndex ? 'var(--color-accent-primary)' : 'var(--color-border-subtle)'}` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: idx === activeStepIndex ? '#fff' : 'var(--color-text-muted)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      boxShadow: idx === activeStepIndex ? '0 0 10px rgba(235, 77, 43, 0.4)' : 'none'
                    }}
                  >
                    {idx < activeStepIndex ? <CheckCircle size={14} color="#fff" /> : (idx + 1)}
                  </div>
                  {idx < currentScenario.steps.length - 1 && (
                    <div style={{ 
                      width: '24px', 
                      height: '2px', 
                      background: idx < activeStepIndex ? 'var(--color-accent-success)' : 'var(--color-border-subtle)',
                      marginLeft: '12px',
                      transition: 'background 0.3s ease'
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pane 2 (Top Right): Visualizer */}
      <div className={`glass-panel ${styles.paneTopRight}`}>
        <div style={{ position: 'absolute', top: 10, left: 15, zIndex: 10, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Git Graph Visualizer
        </div>
        <GitGraph />
      </div>

      {/* Pane 3 (Bottom Right): Terminal */}
      <div className={`glass-panel ${styles.paneBottomRight}`}>
        <Terminal />
      </div>
    </div>
  );
};

export default Playground;
