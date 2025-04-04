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
import { useTranslation } from 'react-i18next';

export const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { t } = useTranslation();

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
        <Text color="red.500" mb={4}>{t('error')}: {error}</Text>
        <Button onClick={fetchUsers}>{t('retry')}</Button>
      </Center>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">{t('users_management')}</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAdd}>
          {t('add_user')}
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>{t('avatar')}</Th>
            <Th>{t('name')}</Th>
            <Th>{t('email')}</Th>
            <Th>{t('role')}</Th>
            <Th>{t('status')}</Th>
            <Th>{t('actions')}</Th>
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
              <Td>
                <Badge colorScheme={user.admin ? 'purple' : 'gray'}>
                  {user.admin ? 'Admin' : 'Usuario'}
                </Badge>
              </Td>
              <Td>
                <Badge colorScheme={user.active ? 'green' : 'red'}>
                  {user.active ? 'Activo' : 'Inactivo'}
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