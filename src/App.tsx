/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';

function App() {
  const [count, setCount] = useState<number>(0);

  const increaseCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decreaseCount = () => {
    setCount((prevCount) => prevCount - 1);
  };

  return (
    <div>
      <h1>
        count is:
        {count}
      </h1>
      <button type="button" onClick={increaseCount}>
        increase
      </button>
      <button type="button" onClick={decreaseCount}>
        decrease
      </button>
    </div>
  );
}

export default App;
