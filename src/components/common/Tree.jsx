import React from 'react';
import { Box, Text, Spinner } from '@chakra-ui/react';
import { useCategories } from '../../hooks/useCategories';
import TreeNode from './TreeNode';

const Tree = ({
  selectedId,
  onSelect,
  expandedIds,
  onToggleNode,
  loading,
  error,
  onEdit,
  onDelete
}) => {
  const { categories: categoriesFromHook } = useCategories();

  if (loading) return <Spinner size="md" />;
  if (error) return <Text color="red.500">Error al cargar: {error.message || 'Error desconocido'}</Text>;
  if (!categoriesFromHook || categoriesFromHook.length === 0) return <Text>No hay categorías.</Text>;

  return (
    <Box>
      {categoriesFromHook.map(item => {
        if (!item || typeof item.id === 'undefined') {
          console.warn('Omitiendo renderizado de item de nivel superior inválido:', item);
          return null;
        }
        return (
          <TreeNode
            key={item.id}
            node={item}
            selectedId={selectedId}
            onSelect={onSelect}
            expandedIds={expandedIds}
            onToggleNode={onToggleNode}
            onEdit={onEdit}
            onDelete={onDelete}
            level={0}
          />
        );
      })}
    </Box>
  );
};

export default Tree;