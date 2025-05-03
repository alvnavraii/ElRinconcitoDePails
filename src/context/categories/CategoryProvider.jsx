import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CategoryContext } from './context';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { fetchCategories as fetchCategoriesApi } from '../../services/categoriesService';

// Proveedor del contexto (componente)
export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { t } = useTranslation();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró token de autenticación');
      setIsLoading(false);
      setCategories([]);
      toast({
        title: t('error'),
        description: t('noAuthToken'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const data = await fetchCategoriesApi(token);
      setCategories(data);
      setError(null);
    } catch (err) {
      const errorMessage = err.message || t('unknownError');
      setError(errorMessage);
      setCategories([]);
      toast({
        title: t('error'),
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    console.log('🚀 CategoryProvider montado, llamando a fetchCategories');
    fetchCategories();
  }, [fetchCategories]);

  const contextValue = useMemo(() => ({
    categories,
    isLoading,
    error,
    fetchCategories
  }), [categories, isLoading, error, fetchCategories]);

  console.log('🔄 Renderizando CategoryProvider con:', { categorías: contextValue.categories?.length ?? 0, cargando: contextValue.isLoading, error: contextValue.error });

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  );
}