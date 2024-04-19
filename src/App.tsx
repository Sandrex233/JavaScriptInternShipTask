import React, { useState } from 'react';
import Garage from './components/Garage/Garage.tsx';
import Winners from './components/Winners/Winners.tsx';
import { AppProvider } from './context/AppContext.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<'garage' | 'winners'>('garage');

  return (
    <div>
      <div>
        <button type="button" onClick={() => setView('garage')}>
          Garage
        </button>
        <button type="button" onClick={() => setView('winners')}>
          Winners
        </button>
      </div>
      <AppProvider>
        {view === 'garage' && (
        <Garage />
        )}
        {view === 'winners' && <Winners />}
      </AppProvider>
    </div>
  );
};

export default App;
