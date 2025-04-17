import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

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
      // Primera llamada - login
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Error en la autenticación');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);

      // Segunda llamada - obtener datos del usuario
      const userResponse = await fetch(`http://localhost:8080/api/v1/users/email/${email}`, {
        headers: {
          'Authorization': `Bearer ${data.token}`,
        },
      });
      
      if (!userResponse.ok) {
        throw new Error('Error al obtener datos del usuario');
      }
      
      const userData = await userResponse.json();
      
      // Guardar los datos del usuario en localStorage Y en el estado
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData); // Asegurarnos de que el estado se actualiza
      setIsAuthenticated(true); // Actualizar cuando el login es exitoso
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