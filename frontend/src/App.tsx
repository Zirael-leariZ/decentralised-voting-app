import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import VoteCreation from './pages/VoteCreation';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './providers/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { MetaMaskProvider } from './context/MetaMaskContext';
import WalletConnection from './components/WalletConnection';

function App() {
  return (
    <MetaMaskProvider>
      <AuthProvider>
        <WalletConnection />
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
                  <VoteCreation />
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
    </MetaMaskProvider>
  );
}

export default App;