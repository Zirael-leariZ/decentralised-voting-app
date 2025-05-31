// Update App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Simple auth context (replace with real auth later)
const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/create-poll" 
          element={isAuthenticated() ? <div>Create Poll Page (Coming Soon)</div> : <Navigate to="/login" />} 
        />
        <Route 
          path="/poll/:id" 
          element={isAuthenticated() ? <div>Poll Detail Page (Coming Soon)</div> : <Navigate to="/login" />} 
        />
        <Route 
          path="/results/:id" 
          element={isAuthenticated() ? <div>Results Page (Coming Soon)</div> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;