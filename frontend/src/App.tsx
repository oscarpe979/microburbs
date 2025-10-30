import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/')
      .then(response => response.json())
      .then(data => setMessage(data.Hello));
  }, []);

  return (
    <>
      <h1>Microburbs Dashboard</h1>
      <div className="card">
        <p>{message}</p>
      </div>
    </>
  );
}

export default App;