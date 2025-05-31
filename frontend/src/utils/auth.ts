import axios from 'axios';

export const verifyToken = async (): Promise<boolean> => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const response = await axios.get('http://localhost:4000/api/v1/users/verify', {
      headers: { 'x-auth-token': token }
    });
    return response.data.valid === true;
  } catch {
    localStorage.removeItem('token'); // Optional: clean up invalid tokens
    return false;
  }
};