import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './providers/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-poll"
            element={
              <PrivateRoute>
                <div>Create Poll Page (Coming Soon)</div>
              </PrivateRoute>
            }
          />

          <Route
            path="/poll/:id"
            element={
              <PrivateRoute>
                <div>Poll Detail Page (Coming Soon)</div>
              </PrivateRoute>
            }
          />

          <Route
            path="/results/:id"
            element={
              <PrivateRoute>
                <div>Results Page (Coming Soon)</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;