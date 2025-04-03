import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la aplicación
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error de autenticación');
      }

      const data = await response.json();
      
      // Guardar el token en localStorage
      localStorage.setItem('token', data.token);
      
      // Obtener los datos completos del usuario usando la ruta correcta
      const userResponse = await fetch(`http://localhost:8080/api/v1/users/email/${email}`, {
        headers: {
          'Authorization': `Bearer ${data.token}`,
        },
      });
      
      if (!userResponse.ok) {
        throw new Error('Error al obtener datos del usuario');
      }
      
      const userData = await userResponse.json();
      
      // Guardar los datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Actualizar el estado
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Error de login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};