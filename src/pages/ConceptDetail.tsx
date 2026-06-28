import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Terminal as TerminalIcon, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { concepts } from '../data/concepts';
import { commands } from '../data/commands';
import { scenarios } from '../data/scenarios';
import { useScenarioStore } from '../store/useScenarioStore';
import { useProgressStore } from '../store/useProgressStore';
import ConceptIllustration from './ConceptIllustration';
import InteractiveQuiz from '../components/InteractiveQuiz';
import styles from './ConceptDetail.module.css';

const ConceptDetail: React.FC = () => {
  const { conceptId } = useParams<{ conceptId: string }>();
  const navigate = useNavigate();
  const setScenario = useScenarioStore(state => state.setScenario);
  const markConceptCompleted = useProgressStore(state => state.markConceptCompleted);
  
  const conceptIndex = concepts.findIndex(c => c.id === conceptId);
  const concept = concepts[conceptIndex];

  const prevConcept = conceptIndex > 0 ? concepts[conceptIndex - 1] : null;
  const nextConcept = conceptIndex < concepts.length - 1 ? concepts[conceptIndex + 1] : null;

  const [scrollProgress, setScrollProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
      
      // Mark as read if scrolled near bottom
      if (Number(scroll) > 0.9 && conceptId) {
        markConceptCompleted(conceptId);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [conceptId, markConceptCompleted]);

  if (!concept) {
    return (
      <div className={styles.container}>
        <h2>Concept not found</h2>
        <Link to="/learn" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Curriculum
        </Link>
      </div>
    );
  }

  const handleStartScenario = (scenarioId: string) => {
    setScenario(scenarioId);
    navigate('/playground');
  };

  const tableOfContents = React.useMemo(() => {
    const lines = concept.markdownContent.split('\n');
    const toc: { id: string, title: string, level: number }[] = [];
    lines.forEach(line => {
      const match = line.match(/^(#{2,3})\s+(.*)/);
      if (match) {
        toc.push({
          level: match[1].length,
          title: match[2].trim(),
          id: match[2].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
      }
    });
    return toc;
  }, [concept.markdownContent]);

  // Split markdown to inject illustration after the first real paragraph
  const { introMarkdown, remainingMarkdown } = React.useMemo(() => {
    const paragraphs = concept.markdownContent.trim().split('\n\n');
    let firstParagraphIndex = 0;
    for (let i = 0; i < paragraphs.length; i++) {
      if (!paragraphs[i].trim().startsWith('#')) {
        firstParagraphIndex = i;
        break;
      }
    }
    return {
      introMarkdown: paragraphs.slice(0, firstParagraphIndex + 1).join('\n\n'),
      remainingMarkdown: paragraphs.slice(firstParagraphIndex + 1).join('\n\n')
    };
  }, [concept.markdownContent]);

  // Custom Markdown Renderers for Cinematic Scroll & Alerts
  const motionVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const MarkdownComponents: any = {
    p: ({ node, ...props }: any) => <motion.p variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} {...props} />,
    h1: ({ node, ...props }: any) => <motion.h1 variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} {...props} />,
    h2: ({ node, children, ...props }: any) => {
      const text = String(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <motion.h2 id={id} variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} {...props}>{children}</motion.h2>;
    },
    h3: ({ node, children, ...props }: any) => {
      const text = String(children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return <motion.h3 id={id} variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} {...props}>{children}</motion.h3>;
    },
    ul: ({ node, ...props }: any) => <motion.ul variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} {...props} />,
    pre: ({ node, ...props }: any) => <motion.pre variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} {...props} />,
    blockquote: ({ node, children, ...props }: any) => {
      const extractText = (nodes: any): string => {
        let text = '';
        React.Children.forEach(nodes, child => {
          if (typeof child === 'string') text += child;
          else if (child?.props?.children) text += extractText(child.props.children);
        });
        return text;
      };

      const stripAlertTag = (nodes: any): any => {
        return React.Children.map(nodes, child => {
          if (typeof child === 'string') return child.replace(/\[!(TIP|IMPORTANT|WARNING|CAUTION|NOTE)\]/g, '');
          if (child?.props?.children) {
            return React.cloneElement(child, {}, stripAlertTag(child.props.children));
          }
          return child;
        });
      };

      const textContent = extractText(children);
      const isTip = textContent.includes('[!TIP]');
      const isImportant = textContent.includes('[!IMPORTANT]') || textContent.includes('[!WARNING]');

      if (isTip) {
        return (
          <motion.div 
            variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className={styles.proTip}
          >
            <div className={styles.proTipHeader}>💡 Pro Tip</div>
            <div className={styles.proTipContent}>{stripAlertTag(children)}</div>
          </motion.div>
        );
      }
      
      if (isImportant) {
        return (
          <motion.div 
            variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className={styles.warningTip}
          >
            <div className={styles.warningTipHeader}>⚠️ Important</div>
            <div className={styles.proTipContent}>{stripAlertTag(children)}</div>
          </motion.div>
        );
      }
      
      return <motion.blockquote variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} {...props}>{children}</motion.blockquote>;
    }
  };

  return (
    <div className={styles.container}>
      <div 
        style={{ 
          position: 'fixed', top: 0, left: 0, height: '4px', background: 'var(--color-accent-primary)',
          width: `${scrollProgress * 100}%`, zIndex: 100, transition: 'width 0.1s ease-out' 
        }} 
      />
      
      <Link to="/learn" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Curriculum
      </Link>
      
      <div className={styles.layout}>
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1>{concept.title}</h1>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <Clock size={14} />
                <span>{(concept as any).readingTime || concept.readTime}</span>
              </div>
              <div className={styles.metaItem}>
                <BookOpen size={14} />
                <span>{(concept as any).level || 'Beginner'}</span>
              </div>
            </div>
          </div>
          
          <ReactMarkdown components={MarkdownComponents}>{introMarkdown}</ReactMarkdown>
        
          {concept.illustrationId && (
            <ConceptIllustration illustrationId={concept.illustrationId} />
          )}
          
          <ReactMarkdown components={MarkdownComponents}>{remainingMarkdown}</ReactMarkdown>

          {concept.quiz && (
            <InteractiveQuiz 
              question={concept.quiz.question}
              options={concept.quiz.options}
              correctIndex={concept.quiz.correctIndex}
              explanation={concept.quiz.explanation}
            />
          )}

          {(concept.relatedConcepts || concept.relatedCommands || concept.relatedScenarios) && (
            <div className={styles.relatedSection}>
              
              {concept.relatedScenarios && concept.relatedScenarios.length > 0 && (
                <div className={styles.relatedGroup}>
                  <h3 className="text-gradient">Practice this Concept</h3>
                  <div className={styles.grid}>
                    {concept.relatedScenarios.map(scenId => {
                      const scenario = scenarios.find(s => s.id === scenId);
                      if (!scenario) return null;
                      return (
                        <motion.div 
                          key={scenId} 
                          className={`${styles.card} ${styles.labCard} glass-panel`}
                          style={{ border: '2px solid var(--color-accent-primary)', background: 'var(--color-bg-overlay)' }}
                          onClick={() => handleStartScenario(scenId)}
                          whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(235, 77, 43, 0.3)' }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={styles.labIconWrapper}>
                            <TerminalIcon size={24} className={styles.labIcon} color="var(--color-accent-primary)" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ color: 'var(--color-accent-primary)', marginBottom: '4px' }}>Interactive Lab: {scenario.title}</h4>
                            <p>Launch the terminal simulator to practice this concept live.</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>
                            Try it out <Play size={20} />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {concept.relatedConcepts && concept.relatedConcepts.length > 0 && (
                <div className={styles.relatedGroup}>
                  <h3>Related Concepts</h3>
                  <div className={styles.grid}>
                    {concept.relatedConcepts.map(id => {
                      const related = concepts.find(c => c.id === id);
                      if (!related) return null;
                      return (
                        <Link key={id} to={`/learn/concept/${id}`} className={`${styles.card} glass-panel`}>
                          <BookOpen size={18} className={styles.cardIcon} />
                          <div>
                            <h4>{related.title}</h4>
                            <p>{related.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {concept.relatedCommands && concept.relatedCommands.length > 0 && (
                <div className={styles.relatedGroup}>
                  <h3>Related Commands</h3>
                  <div className={styles.grid}>
                    {concept.relatedCommands.map(cmdName => {
                      const cmd = commands.find(c => c.name === cmdName);
                      if (!cmd) return null;
                      return (
                        <div key={cmdName} className={`${styles.card} glass-panel`} style={{ cursor: 'default' }}>
                          <TerminalIcon size={18} className={styles.cardIcon} />
                          <div>
                            <h4><code>{cmd.name}</code></h4>
                            <p>{cmd.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Links */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-8)', borderTop: '1px solid var(--color-border-muted)', paddingTop: 'var(--spacing-6)' }}>
            {prevConcept ? (
              <Link to={`/learn/concept/${prevConcept.id}`} className={styles.backLink}>
                &larr; {prevConcept.title}
              </Link>
            ) : <div />}
            
            {nextConcept ? (
              <Link to={`/learn/concept/${nextConcept.id}`} className={styles.backLink}>
                {nextConcept.title} &rarr;
              </Link>
            ) : <div />}
          </div>
        </div>
        
        {/* Table of Contents sidebar */}
        {tableOfContents.length > 0 && (
          <div className={styles.tocWrapper}>
            <div className={styles.tocSticky}>
              <h4>On this page</h4>
              <ul>
                {tableOfContents.map(h => (
                  <li key={h.id} style={{ marginLeft: h.level === 3 ? '1rem' : 0 }}>
                    <a href={`#${h.id}`}>{h.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConceptDetail;
