import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Terminal from '../components/terminal/Terminal';
import GitGraph from '../components/graph/GitGraph';
import { useScenarioStore } from '../store/useScenarioStore';
import { scenarios } from '../data/scenarios';
import { commands } from '../data/commands';

const Playground: React.FC = () => {
  const { activeScenarioIndex, activeStepIndex, isCompleted, nextScenario, resetScenario } = useScenarioStore();
  const currentScenario = scenarios[activeScenarioIndex];
  const currentStep = currentScenario.steps[activeStepIndex];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '380px 1fr', 
      gridTemplateRows: '55% 45%', 
      gap: 'var(--spacing-4)', 
      height: 'calc(100vh - 80px)', 
      padding: 'var(--spacing-4)',
      boxSizing: 'border-box'
    }}>
      
      {/* Pane 1 (Left): Instructions & Progress */}
      <div className="glass-panel" style={{ 
        gridColumn: '1', 
        gridRow: '1 / span 2', 
        padding: 'var(--spacing-6)', 
        display: 'flex', 
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: 'var(--spacing-6)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-accent-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Scenario {activeScenarioIndex + 1} of {scenarios.length}
          </span>
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
                    style={{ padding: '8px 16px', background: 'white', border: 'none', color: 'black', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', cursor: 'pointer' }}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ flex: 1 }}
                dangerouslySetInnerHTML={{ __html: currentStep.instructionMarkdown.replace(/\n/g, '<br/>') }} 
              />
            </AnimatePresence>
          )}

          {/* Progress Bar */}
          {!isCompleted && (
            <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-4)', display: 'flex', gap: '4px' }}>
              {currentScenario.steps.map((_, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    flex: 1, 
                    height: '4px', 
                    background: idx <= activeStepIndex ? 'var(--color-accent-secondary)' : 'var(--color-border-default)',
                    borderRadius: '2px'
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pane 2 (Top Right): Visualizer */}
      <div className="glass-panel" style={{ 
        gridColumn: '2', 
        gridRow: '1', 
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--color-border-subtle)'
      }}>
        <div style={{ position: 'absolute', top: 10, left: 15, zIndex: 10, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Git Graph Visualizer
        </div>
        <GitGraph />
      </div>

      {/* Pane 3 (Bottom Right): Terminal */}
      <div className="glass-panel" style={{ 
        gridColumn: '2', 
        gridRow: '2', 
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--color-border-subtle)'
      }}>
        <Terminal />
      </div>
    </div>
  );
};

export default Playground;
