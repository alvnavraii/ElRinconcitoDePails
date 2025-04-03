import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  useDisclosure,
  IconButton,
  Box,
  Badge,
  Avatar,
  Flex,
  Heading,
  Spinner,
  Center,
  Text,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useState, useEffect, useCallback } from 'react';
import { UserModal } from './UserModal';

export const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar usuarios');
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (error) {
      console.error('Error detallado:', error);
      setError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleAdd = () => {
    setSelectedUser(null);
    onOpen();
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar usuario');
        }
        
        toast({
          title: 'Usuario eliminado',
          description: 'El usuario ha sido eliminado correctamente',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        fetchUsers();
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Error al eliminar usuario',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="50vh" flexDirection="column">
        <Text color="red.500" mb={4}>Error: {error}</Text>
        <Button onClick={fetchUsers}>Reintentar</Button>
      </Center>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Usuarios</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={handleAdd}
        >
          Añadir Usuario
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Avatar</Th>
            <Th>Nombre</Th>
            <Th>Email</Th>
            <Th>Teléfono</Th>
            <Th>Estado</Th>
            <Th>Rol</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>
                <Avatar 
                  size="sm" 
                  name={`${user.firstName} ${user.lastName}`} 
                  src={user.avatarUrl} 
                />
              </Td>
              <Td>{`${user.firstName} ${user.lastName}`}</Td>
              <Td>{user.email}</Td>
              <Td>{user.phone || '-'}</Td>
              <Td>
                <Badge colorScheme={user.active ? 'green' : 'red'}>
                  {user.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </Td>
              <Td>
                <Badge colorScheme={user.admin ? 'purple' : 'gray'}>
                  {user.admin ? 'Admin' : 'Usuario'}
                </Badge>
              </Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    icon={<EditIcon />}
                    onClick={() => handleEdit(user)}
                    aria-label="Editar"
                    size="sm"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(user.id)}
                    aria-label="Eliminar"
                    size="sm"
                    colorScheme="red"
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <UserModal
        isOpen={isOpen}
        onClose={onClose}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </Box>
  );
}; 