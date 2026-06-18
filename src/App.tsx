import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Curriculum from './pages/Curriculum';
import Reference from './pages/Reference';
import CommandDetail from './pages/CommandDetail';
import Playground from './pages/Playground';
import ConceptDetail from './pages/ConceptDetail';
import { PageTransition } from './components/layout/PageTransition';
import DynamicBackground from './components/layout/DynamicBackground';
import CommandPalette from './components/CommandPalette';
import styles from './App.module.css';

function App() {
  const location = useLocation();

  return (
    <div className={styles.appContainer}>
      <DynamicBackground />
      <CommandPalette />
      <Navbar />
      <main className={styles.mainContent}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
            <Route path="/learn" element={<PageTransition><Curriculum /></PageTransition>} />
            <Route path="/learn/concept/:conceptId" element={<PageTransition><ConceptDetail /></PageTransition>} />
            <Route path="/reference" element={<PageTransition><Reference /></PageTransition>} />
            <Route path="/reference/:commandId" element={<PageTransition><CommandDetail /></PageTransition>} />
            <Route path="/playground" element={<PageTransition><Playground /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
