import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthGuard({ children, redirectTo = '/' }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo]);

  const token = localStorage.getItem('token');
  return token ? children : null;
}