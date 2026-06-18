import React, { useEffect, useState } from 'react';
import styles from './DynamicBackground.module.css';

const DynamicBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.gridOverlay} />
      <div 
        className={styles.mouseSpotlight}
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(88, 166, 255, 0.08), transparent 40%)`
        }}
      />
    </div>
  );
};

export default DynamicBackground;
