import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { playSuccessSound, playErrorSound, playClickSound } from '../utils/sounds';
import styles from './InteractiveQuiz.module.css';

interface QuizProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const InteractiveQuiz: React.FC<QuizProps> = React.memo(({ question, options, correctIndex, explanation }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (index: number) => {
    if (!isSubmitted) {
      playClickSound();
      setSelectedIndex(index);
    }
  };

  const handleSubmit = () => {
    if (selectedIndex !== null) {
      setIsSubmitted(true);
      if (selectedIndex === correctIndex) {
        playSuccessSound();
      } else {
        playErrorSound();
      }
    }
  };

  const handleTryAgain = () => {
    playClickSound();
    setSelectedIndex(null);
    setIsSubmitted(false);
  };

  const isCorrect = selectedIndex === correctIndex;

  return (
    <div className={styles.quizContainer}>
      <h3 className={styles.quizHeader}>Knowledge Check</h3>
      <p className={styles.questionText}>{question}</p>
      
      <div className={styles.optionsList}>
        {options.map((option, index) => {
          let optionClass = styles.optionCard;
          if (selectedIndex === index) optionClass += ` ${styles.selected}`;
          if (isSubmitted) {
            if (index === correctIndex) optionClass += ` ${styles.correct}`;
            else if (index === selectedIndex) optionClass += ` ${styles.incorrect}`;
          }

          return (
            <motion.div
              key={index}
              className={optionClass}
              onClick={() => handleSelect(index)}
              whileHover={!isSubmitted ? { scale: 1.01 } : {}}
              whileTap={!isSubmitted ? { scale: 0.99 } : {}}
            >
              <div className={styles.radioCircle}>
                {selectedIndex === index && <div className={styles.radioInner} />}
              </div>
              <span>{option}</span>
              
              {isSubmitted && index === correctIndex && (
                <CheckCircle className={styles.statusIcon} color="var(--color-success)" size={20} />
              )}
              {isSubmitted && index === selectedIndex && index !== correctIndex && (
                <XCircle className={styles.statusIcon} color="var(--color-danger)" size={20} />
              )}
            </motion.div>
          );
        })}
      </div>

      {!isSubmitted && (
        <button 
          className={styles.submitBtn} 
          onClick={handleSubmit}
          disabled={selectedIndex === null}
        >
          Check Answer
        </button>
      )}

      <AnimatePresence>
        {isSubmitted && (
          <motion.div 
            className={`${styles.feedbackContainer} ${isCorrect ? styles.feedbackSuccess : styles.feedbackDanger}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h4>{isCorrect ? 'Correct!' : 'Incorrect'}</h4>
            <p>{explanation}</p>
            {!isCorrect && (
              <button 
                onClick={handleTryAgain}
                style={{ marginTop: 'var(--spacing-3)', padding: '6px 12px', background: 'transparent', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                Try Again
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default InteractiveQuiz;
