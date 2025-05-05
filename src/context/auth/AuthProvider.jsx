import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { login as loginService } from '../../services/authService';
import { getUserByEmail } from '../../services/usersService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la aplicación
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true); // Actualizar si hay datos válidos al cargar
      } catch (error) {
        setIsAuthenticated(false);
        setError('Error al parsear datos de usuario '+error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginService({ email, password });
      localStorage.setItem('token', data.token);
      // Obtener datos completos del usuario usando el email
      const userData = await getUserByEmail(data.token, email);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      setError('');
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      setError(error.message);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false); // Actualizar cuando se cierra sesión
  };

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};