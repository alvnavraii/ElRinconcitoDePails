import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormErrorMessage,
  Spinner,
  IconButton,
  useColorModeValue,
  Flex,
  Text,
  Switch,
} from '@chakra-ui/react';
import { MdLaunch, MdSave, MdCancel } from "react-icons/md";
import { FaUnlink } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '../../../hooks/useCategories';
import Tree from '../../common/Tree';

// Función simple para generar slugs (puedes mejorarla si necesitas)
const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/[^\w-]+/g, '') // Eliminar caracteres no alfanuméricos excepto guiones
    .replace(/--+/g, '-'); // Reemplazar múltiples guiones con uno solo
};

// Función auxiliar recursiva para buscar una categoría por ID en el árbol
const findCategoryByIdRecursive = (categories, id) => {
  if (!id) return null;
  for (const category of categories) {
    if (category.id === id) {
      return category;
    }
    if (category.children) {
      const found = findCategoryByIdRecursive(category.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

export const CategoryForm = () => {
  const { id } = useParams();
  const { categories: allCategories, fetchCategories, loading: loadingCategories } = useCategories();
  const { register, handleSubmit, setValue, reset, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      active: true,
      name: '',
      description: '',
      slug: '',
    }
  });
  const [selectedParentId, setSelectedParentId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [expandedIds, setExpandedIds] = useState(new Set());
  
  const toast = useToast();
  const navigate = useNavigate();
  
  // Observar el campo 'name'
  const categoryName = watch('name');

  // useEffect para generar y actualizar el slug cuando 'name' cambie
  useEffect(() => {
    const generated = generateSlug(categoryName);
    setValue('slug', generated, { shouldValidate: true });
  }, [categoryName, setValue]);

  useEffect(() => {
    if (id) {
      const category = findCategoryByIdRecursive(allCategories, parseInt(id, 10));
      if (category) {
        setValue('name', category.name);
        setValue('description', category.description || '');
        setSelectedParentId(category.parentId);
      } else {
        reset({ active: true, name: '', description: '', slug: '' });
        setSelectedParentId(null);
      }
    } else {
      reset({ active: true, name: '', description: '', slug: '' });
      setSelectedParentId(null);
    }
  }, [id, allCategories, reset, setValue]);

  const onSubmit = async (data) => {
    const categoryData = {
      ...data,
      parentId: selectedParentId,
    };

    const apiUrl = id
      ? `http://localhost:8080/api/v1/categories/${id}`
      : 'http://localhost:8080/api/v1/categories';
    const method = id ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      toast({
        title: `Categoría ${id ? 'actualizada' : 'creada'}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchCategories();
      navigate('/dashboard/categories');

    } catch (error) {
      toast({
        title: 'Error al guardar',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSelectParent = (parentId) => {
    console.log('handleSelectParent called with ID:', parentId, 'Current selectedParentId:', selectedParentId);
    setSelectedParentId(parentId);
    console.log('State updated. New selectedParentId should be:', parentId);
  };

  const handleSelectParentInModal = (parentId) => {
    console.log('handleSelectParentInModal called with ID:', parentId, 'Current selectedParentId:', selectedParentId);
    handleSelectParent(parentId);
    onClose();
  };


  const handleToggleNode = useCallback((nodeId) => {
    setExpandedIds(prevExpandedIds => {
      const newExpandedIds = new Set(prevExpandedIds);
      if (newExpandedIds.has(nodeId)) {
        newExpandedIds.delete(nodeId);
      } else {
        newExpandedIds.add(nodeId);
      }
      return newExpandedIds;
    });
  }, []);

  // Manejador para desvincular la categoría padre seleccionada
  const handleUnlinkParent = (e) => {
    e.stopPropagation(); // Evita que el clic se propague
    handleSelectParent(null); // Llama al manejador de selección con null
  };

  // --- Función para resetear el estado del formulario ---
  const resetForm = () => {
    setSelectedParentId(null);
    reset({ active: true, name: '', description: '', slug: '' });
  };

  // --- NUEVA FUNCIÓN handleCancel ---
  const handleCancel = () => {
    resetForm(); // Llama a la función que limpia los estados
    navigate('/dashboard/categories'); // Navega de vuelta a la lista
  };

  if (loadingCategories) {
    return <Spinner />;
  }

  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const treeBorderColor = useColorModeValue('gray.200', 'gray.600');
  const formBg = useColorModeValue('white', 'gray.800'); // Añadido para el fondo del formulario

  console.log('Renderizando CategoryForm. selectedParentId actual:', selectedParentId);

  // --- Log para depurar ---
  console.log('Render - isOpen:', isOpen);

  return (
    <>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} p={5} borderWidth="1px" borderRadius="lg" boxShadow="sm" bg={formBg}>
        <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
          <VStack flex="1" spacing={4} align="stretch">
            <FormControl isInvalid={errors.name}>
              <FormLabel htmlFor="name">Nombre</FormLabel>
              <Input id="name" {...register('name', { required: 'El nombre es obligatorio' })} />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.slug}>
              <FormLabel htmlFor="slug">Slug (Generado)</FormLabel>
              <Input
                id="slug"
                {...register('slug')}
                isReadOnly
                bg={inputBg}
              />
              <FormErrorMessage>{errors.slug?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.description}>
              <FormLabel htmlFor="description">Descripción (Opcional)</FormLabel>
              <Input id="description" {...register('description')} />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="active" mb="0">
                Activo
              </FormLabel>
              <Switch id="active" {...register('active')} />
            </FormControl>
          </VStack>
          <Box flex="1">
            <FormControl id="parentCategory">
              <FormLabel htmlFor="parentCategory">
                <Flex align="center" justify="space-between">
                  <Text mr={2}>Categoría Padre</Text>
                  <IconButton
                    aria-label="Seleccionar categoría padre en modal"
                    icon={<MdLaunch />}
                    size="sm"
                    variant="ghost"
                    onClick={onOpen}
                  />
                </Flex>
              </FormLabel>
              <Box border="1px" borderColor="gray.200" borderRadius="md" p={2} minH="200px" overflowY="auto">
                <Tree
                  selectedId={selectedParentId}
                  onSelect={handleSelectParent}
                  expandedIds={expandedIds}
                  onToggleNode={handleToggleNode}
                />
              </Box>
            </FormControl>
          </Box>
        </Flex>
        <Flex justify="flex-end" mt={6} gap={3}>
          <Button onClick={handleCancel} variant="outline" leftIcon={<MdCancel />}>
            Cancelar
          </Button>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting} leftIcon={<MdSave />}>
            {id ? 'Actualizar Categoría' : 'Crear Categoría'}
          </Button>
        </Flex>
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Seleccionar Categoría Padre</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tree
              selectedId={selectedParentId}
              onSelect={handleSelectParentInModal}
              expandedIds={expandedIds}
              onToggleNode={handleToggleNode}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaUnlink />}
              variant="ghost"
              onClick={handleUnlinkParent}
              isDisabled={!selectedParentId}
              mr={3}
            >
              Deseleccionar
            </Button>
            <Button colorScheme='blue' onClick={onClose}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CategoryForm;