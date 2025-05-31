import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../utils/auth';
import type { JSX } from 'react';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    verifyToken().then(isValid => {
      setAuthenticated(isValid);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!authenticated) return <Navigate to="/login" />;
  return children;
}