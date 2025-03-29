import { useState, useEffect } from 'react';

export function useAuth(authKey: string) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const isAuth = sessionStorage.getItem(authKey) === 'true';
        setIsAuthenticated(isAuth);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [authKey]);

  const login = () => {
    sessionStorage.setItem(authKey, 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem(authKey);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
}
