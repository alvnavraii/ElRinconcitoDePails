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
  Card,
  CardBody,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Input,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useState, useEffect, useCallback } from 'react';
import { UserModal } from './UserModal';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiEdit, FiSearch, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

export const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const bgCard = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

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

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(user => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Card bg={bgCard} mb={6} boxShadow="md">
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Heading size="lg" color={textColor}>{t('users_management')}</Heading>
            <Flex>
              <Button 
                leftIcon={<FiRefreshCw />} 
                colorScheme="blue" 
                variant="outline" 
                mr={2}
                onClick={fetchUsers}
                isLoading={isLoading}
              >
                {t('refresh')}
              </Button>
              <Button 
                leftIcon={<FiPlus />} 
                colorScheme="blue" 
                onClick={handleAdd}
              >
                {t('add_user')}
              </Button>
            </Flex>
          </Flex>

          <InputGroup mb={6}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder={t('search_user')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {isLoading && !users.length ? (
            <Flex justify="center" align="center" height="200px">
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : error ? (
            <Box textAlign="center" p={4} color="red.500">
              <Text>{error}</Text>
              <Button mt={4} onClick={fetchUsers}>{t('retry')}</Button>
            </Box>
          ) : (
            <Box overflowX="auto">
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
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
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
                            {user.admin ? t('admin') : t('user')}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={user.active ? 'green' : 'red'}>
                            {user.active ? t('active') : t('inactive')}
                          </Badge>
                        </Td>
                        <Td>
                          <Flex>
                            <IconButton
                              icon={<FiEdit />}
                              aria-label={t('edit_user')}
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => handleEdit(user)}
                              mr={2}
                            />
                            <IconButton
                              icon={<FiTrash2 />}
                              aria-label={t('delete_user')}
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleDelete(user.id)}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={6} textAlign="center" py={4}>
                        {t('no_users_found')}
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      <UserModal
        isOpen={isOpen}
        onClose={onClose}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </Box>
  );
}; 