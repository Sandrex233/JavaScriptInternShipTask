import React, { useState } from 'react';
import Garage from './components/Garage/Garage.tsx';
import Winners from './components/Winners/Winners.tsx';

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
      {view === 'garage' && <Garage />}
      {view === 'winners' && <Winners />}
    </div>
  );
};

export default App;
