import { useContext } from 'react';
import { CategoryContext } from '../context/categories/context';

export function useCategories() {
  const context = useContext(CategoryContext);
  
  if (context === undefined) {
    console.error('❌ useCategories debe ser usado dentro de un CategoryProvider');
    throw new Error('useCategories debe ser usado dentro de un CategoryProvider');
  }
  
  console.log('🔄 useCategories - Contexto obtenido:', 
    `categorías: ${context.categories?.length || 0}`, 
    `cargando: ${context.isLoading}`, 
    `error: ${context.error}`
  );
  
  return context;
} 