import React, { useState } from 'react';
import Garage from './components/Garage/Garage.tsx';
import Winners from './components/Winners/Winners.tsx';
import { AppProvider } from './context/AppContext.tsx';
import './App.css';

const App: React.FC = () => {
  const [view, setView] = useState<'garage' | 'winners'>('garage');

  return (
    <div>
      <div className="switch-buttons">
        <button
          type="button"
          className={`switch-button ${view === 'garage' ? 'active' : ''}`}
          onClick={() => setView('garage')}
        >
          Garage
        </button>
        <button
          type="button"
          className={`switch-button ${view === 'winners' ? 'active' : ''}`}
          onClick={() => setView('winners')}
        >
          Winners
        </button>
      </div>
      <AppProvider>
        {view === 'garage' && <Garage />}
        {view === 'winners' && <Winners />}
      </AppProvider>
    </div>
  );
};

export default App;
