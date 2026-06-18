import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Terminal as TerminalIcon, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { concepts } from '../data/concepts';
import { commands } from '../data/commands';
import { scenarios } from '../data/scenarios';
import { useScenarioStore } from '../store/useScenarioStore';
import ConceptIllustration from './ConceptIllustration';
import InteractiveQuiz from '../components/InteractiveQuiz';
import styles from './ConceptDetail.module.css';

const ConceptDetail: React.FC = () => {
  const { conceptId } = useParams<{ conceptId: string }>();
  const navigate = useNavigate();
  const setScenario = useScenarioStore(state => state.setScenario);
  
  const concept = concepts.find(c => c.id === conceptId);

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

  // Split markdown to inject illustration after the first real paragraph
  const paragraphs = concept.markdownContent.trim().split('\n\n');
  let firstParagraphIndex = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    if (!paragraphs[i].trim().startsWith('#')) {
      firstParagraphIndex = i;
      break;
    }
  }

  const introMarkdown = paragraphs.slice(0, firstParagraphIndex + 1).join('\n\n');
  const remainingMarkdown = paragraphs.slice(firstParagraphIndex + 1).join('\n\n');

  // Custom Markdown Renderers for Cinematic Scroll & Alerts
  const motionVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const MarkdownComponents: any = {
    p: ({ node, ...props }: any) => <motion.p variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} {...props} />,
    h1: ({ node, ...props }: any) => <motion.h1 variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} {...props} />,
    h2: ({ node, ...props }: any) => <motion.h2 variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} {...props} />,
    h3: ({ node, ...props }: any) => <motion.h3 variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} {...props} />,
    ul: ({ node, ...props }: any) => <motion.ul variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} {...props} />,
    pre: ({ node, ...props }: any) => <motion.pre variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }} {...props} />,
    blockquote: ({ node, children, ...props }: any) => {
      // Check if this is a GitHub style alert e.g. > [!TIP]
      const textContent = React.Children.toArray(children).map((c: any) => c.props?.children || c).join('');
      if (typeof textContent === 'string' && textContent.includes('[!TIP]')) {
        return (
          <motion.div 
            variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className={styles.proTip}
          >
            <div className={styles.proTipHeader}>💡 Pro Tip</div>
            <div className={styles.proTipContent}>{children}</div>
          </motion.div>
        );
      }
      if (typeof textContent === 'string' && (textContent.includes('[!IMPORTANT]') || textContent.includes('[!WARNING]'))) {
        return (
          <motion.div 
            variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className={styles.warningTip}
          >
            <div className={styles.warningTipHeader}>⚠️ Important</div>
            <div className={styles.proTipContent}>{children}</div>
          </motion.div>
        );
      }
      return <motion.blockquote variants={motionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} {...props}>{children}</motion.blockquote>;
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/learn" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Curriculum
      </Link>

      <div className={styles.header}>
        <div className={styles.preheading}>Key concepts</div>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Clock size={14} /> {concept.readTime} read
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <ReactMarkdown components={MarkdownComponents}>{introMarkdown}</ReactMarkdown>
        
        {concept.illustrationId && (
          <ConceptIllustration illustrationId={concept.illustrationId} />
        )}
        
        <ReactMarkdown components={MarkdownComponents}>{remainingMarkdown}</ReactMarkdown>
      </div>

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
                      onClick={() => handleStartScenario(scenId)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={styles.labIconWrapper}>
                        <TerminalIcon size={24} className={styles.labIcon} />
                      </div>
                      <div>
                        <h4>Interactive Lab: {scenario.title}</h4>
                        <p>Launch the terminal simulator to practice.</p>
                      </div>
                      <Play size={20} className={styles.playIcon} />
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
    </div>
  );
};

export default ConceptDetail;
