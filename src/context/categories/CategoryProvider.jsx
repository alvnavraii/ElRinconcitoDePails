import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CategoryContext } from './context';
import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

// Proveedor del contexto (componente)
export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { t } = useTranslation();

  const fetchCategories = useCallback(async () => {
    console.log('🔍 Iniciando fetchCategories');
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    console.log('🔑 Token encontrado:', !!token);

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
      const apiUrl = 'http://localhost:8080/api/v1/categories';
      console.log('🌐 Realizando solicitud a la API de categorías');
      console.log('URL:', apiUrl);
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log(`📊 Respuesta recibida: ${response.status}`);

      if (!response.ok) {
        let errorBody = await response.text();
        console.error('❌ Error Body:', errorBody);
        try {
          const errorJson = JSON.parse(errorBody);
          errorBody = errorJson.message || errorJson.error || JSON.stringify(errorJson);
        } catch(e) {
          errorBody = errorBody.substring(0, 100) + (errorBody.length > 100 ? '...' : '');
        }
        throw new Error(`Error ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      console.log('📦 Datos recibidos de la API:', data);
      setCategories(data);
      setError(null);

    } catch (err) {
      console.error('❌ Error fetching categories:', err);
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
      console.log('🏁 fetchCategories completado');
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