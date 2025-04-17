import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { processCategories } from './categoryUtils';
import { CategoryContext } from './context';

// Proveedor del contexto (componente)
export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { t } = useTranslation();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      
      const response = await fetch('http://localhost:8080/api/v1/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      setCategories(processCategories(data));
      setError(null);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError(error.message);
      
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <CategoryContext.Provider value={{ categories, isLoading, error, fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
}