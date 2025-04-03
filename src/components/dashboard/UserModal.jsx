import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export const UserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    avatarUrl: '',
    active: true,
    admin: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '', // No mostrar contraseña existente
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || '',
        active: user.active !== undefined ? user.active : true,
        admin: user.admin !== undefined ? user.admin : false
      });
    } else {
      // Resetear el formulario para un nuevo usuario
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        avatarUrl: '',
        active: true,
        admin: false
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const url = user
        ? `http://localhost:8080/api/v1/users/${user.id}`
        : 'http://localhost:8080/api/v1/users';
      
      const method = user ? 'PUT' : 'POST';

      // Si estamos editando y no se ha cambiado la contraseña, la eliminamos del payload
      const payload = { ...formData };
      if (user && !payload.password) {
        delete payload.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar la solicitud');
      }
      
      toast({
        title: user ? 'Usuario actualizado' : 'Usuario creado',
        description: user ? 'El usuario ha sido actualizado correctamente' : 'El usuario ha sido creado correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Llamar a la función que actualiza la lista de usuarios
      if (onSuccess) {
        onSuccess();
      }
      
      // Cerrar el modal
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Ha ocurrido un error al procesar la solicitud',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl id="firstName" isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Nombre"
                />
              </FormControl>
              
              <FormControl id="lastName" isRequired>
                <FormLabel>Apellido</FormLabel>
                <Input 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Apellido"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl id="email" isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <Input 
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
              />
            </FormControl>
            
            <FormControl id="password" isRequired={!user} mt={4}>
              <FormLabel>{user ? 'Nueva Contraseña (dejar en blanco para mantener)' : 'Contraseña'}</FormLabel>
              <Input 
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
              />
            </FormControl>
            
            <FormControl id="phone" mt={4}>
              <FormLabel>Teléfono</FormLabel>
              <Input 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Número de teléfono"
              />
            </FormControl>
            
            <FormControl id="avatarUrl" mt={4}>
              <FormLabel>URL de Avatar</FormLabel>
              <Input 
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/avatar.jpg"
              />
            </FormControl>
            
            <SimpleGrid columns={2} spacing={4} mt={4}>
              <FormControl id="active">
                <Checkbox 
                  name="active"
                  isChecked={formData.active}
                  onChange={handleChange}
                >
                  Usuario Activo
                </Checkbox>
              </FormControl>
              
              <FormControl id="admin">
                <Checkbox 
                  name="admin"
                  isChecked={formData.admin}
                  onChange={handleChange}
                >
                  Administrador
                </Checkbox>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              colorScheme="blue" 
              type="submit"
              isLoading={isLoading}
              loadingText={user ? "Actualizando..." : "Creando..."}
            >
              {user ? 'Actualizar' : 'Crear'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}; 