import React from 'react';
import { Box, IconButton, Text, Flex } from '@chakra-ui/react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

const TreeNode = ({ node, selectedId, onSelect, expandedIds, onToggleNode, level = 0 }) => {
  console.log(`TreeNode ID: ${node.id}, Received selectedId: ${selectedId}, Type of node.id: ${typeof node.id}, Type of selectedId: ${typeof selectedId}`);

  const isSelected = Number(selectedId) === Number(node.id);
  const isExpanded = expandedIds.has(Number(node.id));
  const hasChildren = node.children && node.children.length > 0;

  console.log(`Node ${node.id} - isSelected: ${isSelected}`);

  const handleToggleClick = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleNode(Number(node.id));
    }
  };

  const handleSelectClick = () => {
    console.log(`Clicked on Node ID: ${node.id}. Calling onSelect.`);
    onSelect(Number(node.id));
  };

  return (
    <Box>
      <Flex
        align="center"
        mb={1}
        pl={level * 4}
        py={1}
        pr={2}
        bg={isSelected ? 'blue.100' : 'transparent'}
        borderRadius="md"
        cursor="pointer"
        onClick={handleSelectClick}
        _hover={{
          bg: isSelected ? 'blue.200' : 'gray.100',
        }}
        role="button"
        aria-pressed={isSelected}
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleSelectClick();
          }
        }}
        transition="background-color 0.2s ease-in-out"
      >
        <IconButton
          icon={hasChildren ? (isExpanded ? <FaChevronDown /> : <FaChevronRight />) : <Box w="24px" />}
          size="xs"
          variant="ghost"
          onClick={handleToggleClick}
          aria-label={isExpanded ? `Colapsar ${node.name}` : `Expandir ${node.name}`}
          isDisabled={!hasChildren}
          mr={1}
          zIndex={1}
          tabIndex={-1}
        />
        <Text
          fontWeight={isSelected ? 'bold' : 'normal'}
          flexGrow={1}
          noOfLines={1}
          title={node.name}
        >
          {node.name}
        </Text>
      </Flex>
      {isExpanded && hasChildren && (
        <Box>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggleNode={onToggleNode}
              level={level + 1}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TreeNode;
