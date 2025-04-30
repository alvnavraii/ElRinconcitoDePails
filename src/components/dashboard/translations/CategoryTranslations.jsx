import React from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';

// Estructura estática adaptada a la tabla category_translations
const CategoryTranslations = () => {
  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Mantenimiento de traducciones de categorías</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Category ID</Th>
            <Th>Language Code</Th>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Created At</Th>
            <Th>Updated At</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* Fila de ejemplo */}
          <Tr>
            <Td>1</Td>
            <Td>10</Td>
            <Td>es</Td>
            <Td>Nombre de ejemplo</Td>
            <Td>Descripción de ejemplo</Td>
            <Td>2025-04-30</Td>
            <Td>2025-04-30</Td>
            <Td>
              <Button size="sm" colorScheme="blue">Editar</Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default CategoryTranslations;
