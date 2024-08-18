import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [numberType, setNumberType] = useState('even');
  const [windowState, setWindowState] = useState([]);
  const [prevWindowState, setPrevWindowState] = useState([]);
  const [fetchedNumbers, setFetchedNumbers] = useState([]);
  const [average, setAverage] = useState(0);

  const windowSize = 10;

  const fetchNumbers = async () => {
    try {
      // Use a relative URL since proxy is configured
      const response = await axios.get(`/test/${numberType}`, {
        timeout: 500,
        headers: {
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN' // If needed
        }
      });
      const newNumbers = response.data.numbers.filter(num => !windowState.includes(num));
      setFetchedNumbers(newNumbers);

      if (newNumbers.length > 0) {
        setPrevWindowState([...windowState]);

        const updatedWindowState = [...windowState, ...newNumbers].slice(-windowSize);
        setWindowState(updatedWindowState);

        const avg = updatedWindowState.reduce((acc, curr) => acc + curr, 0) / updatedWindowState.length;
        setAverage(avg.toFixed(2));
      }
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, [numberType]);

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      <div>
        <label>Select Number Type: </label>
        <select value={numberType} onChange={(e) => setNumberType(e.target.value)}>
          <option value="primes">Prime</option>
          <option value="fibo">Fibonacci</option>
          <option value="even">Even</option>
          <option value="rand">Random</option>
        </select>
        <button onClick={fetchNumbers}>Fetch Numbers</button>
      </div>
      <div>
        <h2>Results</h2>
        <p>Previous Window State: {JSON.stringify(prevWindowState)}</p>
        <p>Current Window State: {JSON.stringify(windowState)}</p>
        <p>Fetched Numbers: {JSON.stringify(fetchedNumbers)}</p>
        <p>Average: {average}</p>
      </div>
    </div>
  );
}

export default App;
