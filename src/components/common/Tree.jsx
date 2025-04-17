import React, { useState } from 'react';
import {
  Box,
  Button,
  Icon,
  IconButton,
  Flex,
  Spacer,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiChevronRight, FiChevronDown, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useCategories } from '../../hooks/useCategories';

const TreeItem = ({ item, level = 0, onSelect, selectedId, expandedNodes, toggleNode, onEdit, onDelete }) => {
  const bgHover = useColorModeValue('gray.100', 'gray.600');
  const bgSelected = useColorModeValue('blue.50', 'blue.900');
  const iconColor = useColorModeValue('gray.600', 'gray.400');
  const disabledIconColor = useColorModeValue('gray.300', 'gray.600');

  if (!item || !item.id) {
    console.error('TreeItem recibió un item inválido:', item);
    return null;
  }
  
  const isExpanded = expandedNodes.includes(item.id);
  const isSelected = item.id === selectedId;

  console.log(`TreeItem Render: ID=${item.id}, Name=${item.name}, isSelected=${isSelected}, selectedId=${selectedId}`);

  const handleEditClick = (e) => {
    console.log(`handleEditClick: Fired for ID=${item.id}, isSelected=${isSelected}`);
    e.stopPropagation();
    if (!isSelected) {
      console.log(`handleEditClick: Aborting (not selected)`);
      return;
    }
    console.log(`handleEditClick: Calling onEdit for ID=${item.id}`);
    onEdit(item.id);
  };

  const handleDeleteClick = (e) => {
    console.log(`handleDeleteClick: Fired for ID=${item.id}, isSelected=${isSelected}`);
    e.stopPropagation();
    if (!isSelected) {
      console.log(`handleDeleteClick: Aborting (not selected)`);
      return;
    }
    console.log(`handleDeleteClick: Calling onDelete for ID=${item.id}`);
    onDelete(item.id);
  };

  return (
    <Box>
      <Flex
        align="center"
        width="full"
        pl={`${level * 1.5 + 1}rem`}
        pr={2}
        _hover={{ bg: !isSelected ? bgHover : undefined }}
        bg={isSelected ? bgSelected : 'transparent'}
        borderRadius="md"
        cursor="pointer"
        onClick={() => {
          console.log(`Flex Row onClick: Calling onSelect for ID=${item.id}`);
          onSelect(item.id);
        }}
      >
        {item.children && item.children.length > 0 ? (
          <Icon
            as={isExpanded ? FiChevronDown : FiChevronRight}
            onClick={(e) => {
              console.log(`Expand/Collapse Icon onClick: Fired for ID=${item.id}`);
              e.stopPropagation();
              toggleNode(item.id);
            }}
            mr={2}
            boxSize={4}
            color={iconColor}
            _hover={{ color: useColorModeValue('gray.800', 'white') }}
          />
        ) : (
          <Box w={4} mr={2} />
        )}
        <Box
          flex="1"
          fontWeight={isSelected ? 'bold' : 'normal'}
          p={1}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {item.name || 'Sin nombre'}
        </Box>
        <IconButton
          aria-label="Editar categoría"
          icon={<FiEdit />}
          size="xs"
          variant="ghost"
          color={isSelected ? iconColor : disabledIconColor}
          onClick={handleEditClick}
          isDisabled={!isSelected}
          ml={1}
        />
        <IconButton
          aria-label="Eliminar categoría"
          icon={<FiTrash2 />}
          size="xs"
          variant="ghost"
          color={isSelected ? 'red.500' : disabledIconColor}
          onClick={handleDeleteClick}
          isDisabled={!isSelected}
          ml={1}
        />
      </Flex>
      {isExpanded && item.children && item.children.length > 0 && item.children.map(child => {
        if (!child || !child.id) {
          console.warn('Omitiendo renderizado de hijo inválido:', child);
          return null;
        }
        return (
          <TreeItem
            key={child.id}
            item={child}
            level={level + 1}
            onSelect={onSelect}
            selectedId={selectedId}
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </Box>
  );
};

const Tree = ({ onSelect, selectedId, expandedNodes, toggleNode = () => {}, onEdit = () => {}, onDelete = () => {} }) => {
  const { categories } = useCategories();
  
  console.log('Tree - categories:', categories);

  if (!categories || categories.length === 0) {
    return <Box>No hay datos disponibles para mostrar.</Box>;
  }

  return (
    <Box>
      {categories.map(item => {
        if (!item || !item.id) {
          console.warn('Omitiendo renderizado de item de nivel superior inválido:', item);
          return null;
        }
        return (
          <TreeItem
            key={item.id}
            item={item}
            onSelect={onSelect}
            selectedId={selectedId}
            expandedNodes={expandedNodes || []}
            toggleNode={toggleNode}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </Box>
  );
};

export default Tree; 