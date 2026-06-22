import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import { PageTransition } from './components/layout/PageTransition';
import DynamicBackground from './components/layout/DynamicBackground';
import CommandPalette from './components/CommandPalette';
import styles from './App.module.css';

// Lazy loaded pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Curriculum = React.lazy(() => import('./pages/Curriculum'));
const Reference = React.lazy(() => import('./pages/Reference'));
const CommandDetail = React.lazy(() => import('./pages/CommandDetail'));
const Playground = React.lazy(() => import('./pages/Playground'));
const ConceptDetail = React.lazy(() => import('./pages/ConceptDetail'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Simple loading fallback
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--color-text-secondary)' }}>
    Loading...
  </div>
);

function App() {
  const location = useLocation();

  return (
    <div className={styles.appContainer}>
      <DynamicBackground />
      <CommandPalette />
      <Navbar />
      <main className={styles.mainContent}>
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
              <Route path="/learn" element={<PageTransition><Curriculum /></PageTransition>} />
              <Route path="/learn/concept/:conceptId" element={<PageTransition><ConceptDetail /></PageTransition>} />
              <Route path="/reference" element={<PageTransition><Reference /></PageTransition>} />
              <Route path="/reference/:commandId" element={<PageTransition><CommandDetail /></PageTransition>} />
              <Route path="/playground" element={<PageTransition><Playground /></PageTransition>} />
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
