import { Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="navbar">
        <h1>Car Inventory</h1>
      </header>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<div className="placeholder">Dashboard (Vehicle List)</div>} />
          <Route path="/login" element={<div className="placeholder">Login Page</div>} />
          <Route path="/register" element={<div className="placeholder">Register Page</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;