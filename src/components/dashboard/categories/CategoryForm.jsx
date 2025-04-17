import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Textarea, Switch,
  VStack, HStack, useToast, Card, CardBody, Text, useColorModeValue, Flex, useDisclosure
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../../../hooks/useCategories';
import Tree from '../../common/Tree';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import EditCategoryModal from './EditCategoryModal';

export const CategoryForm = () => {
  const { categories, fetchCategories, loading } = useCategories();
  const [selectedParentId, setSelectedParentId] = useState(null);
  const initialFormData = {
    name: '',
    slug: '',
    description: '',
    isActive: true,
    parentId: null
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState([]);
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  
  const bgCard = useColorModeValue('white', 'gray.700');
  
  const handleSelectParent = (categoryId) => {
    console.log(`CategoryForm handleSelectParent: Setting selectedParentId to ${categoryId}`);
    setSelectedParentId(categoryId);
    setFormData(prev => ({
      ...prev,
      parentId: categoryId
    }));
  };
  
  const handleToggleNode = (nodeId) => {
    setExpandedNodes(prevExpandedNodes => {
      if (prevExpandedNodes.includes(nodeId)) {
        return prevExpandedNodes.filter(id => id !== nodeId);
      } else {
        return [...prevExpandedNodes, nodeId];
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    console.log("CategoryForm: Iniciando handleSubmit...");
    
    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        isActive: formData.isActive,
        parentId: selectedParentId
      };
      console.log("CategoryForm: Enviando datos:", categoryData);
      
      const response = await fetch('http://localhost:8080/api/v1/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(categoryData)
      });
      
      console.log("CategoryForm: Respuesta del POST recibida:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido al crear la categoría' }));
        throw new Error(errorData.message || `Error ${response.status}`);
      }
      
      console.log("CategoryForm: Categoría creada exitosamente. Llamando a fetchCategories...");
      await fetchCategories();
      console.log("CategoryForm: fetchCategories completado.");
      
      toast({
        title: t('success'),
        description: t('category_created'),
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      console.log("CategoryForm: Reseteando formulario...");
      setFormData(initialFormData);
      setSelectedParentId(null);
      console.log("CategoryForm: Formulario reseteado.");

    } catch (error) {
      console.error("CategoryForm: Error en handleSubmit:", error);
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsSubmitting(false);
      console.log("CategoryForm: handleSubmit finalizado.");
    }
  };
  
  const handleEdit = (categoryId) => {
    console.log(`CategoryForm handleEdit: Received ID=${categoryId}. Finding category...`);
    const category = findCategoryById(categories, categoryId);

    if (!category) {
      console.error("No se encontró la categoría a editar:", categoryId);
      toast({ title: t('error'), description: t('category_not_found'), status: 'error' });
      return;
    }
    console.log(`CategoryForm handleEdit: Found category, opening modal for`, category);
    setCategoryToEdit(category);
    onEditModalOpen();
  };
  
  const handleDeleteRequest = (categoryId) => {
    console.log("Solicitud para eliminar categoría con ID:", categoryId);

    const category = findCategoryById(categories, categoryId);

    if (!category) {
      console.error("No se encontró la categoría a eliminar:", categoryId);
      toast({ title: t('error'), description: t('category_not_found'), status: 'error' });
      return;
    }

    const hasChildren = !!(category.children && category.children.length > 0);
    const itemName = category.name || t('this_category');
    const message = hasChildren
      ? t('delete_confirmation_message_with_children', { item: itemName })
      : t('delete_confirmation_message', { item: itemName });
    const confirmButtonText = t('delete');
    const cancelButtonText = t('cancel');
    const title = t('delete_confirmation_title');

    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`SweetAlert confirmado para eliminar ID=${categoryId}`);
        handleConfirmDelete(categoryId);
      } else {
        console.log(`SweetAlert cancelado para eliminar ID=${categoryId}`);
      }
    });
  };
  
  const handleConfirmDelete = async (categoryId) => {
    console.log("Confirmado eliminar categoría con ID:", categoryId);

    try {
      const response = await fetch(`http://localhost:8080/api/v1/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `Error ${response.status} al eliminar la categoría`);
      }

      console.log("Categoría eliminada exitosamente. Recargando...");
      await fetchCategories();

      toast({
        title: t('success'),
        description: t('category_deleted'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (selectedParentId === categoryId) {
          setSelectedParentId(null);
      }

    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  useEffect(() => {
    console.log("CategoryForm: Las categorías del contexto han cambiado:", categories);
  }, [categories]);
  
  return (
    <>
      <Card bg={bgCard}>
        <CardBody>
          <Flex direction={{ base: 'column', md: 'row' }} align="start" justify="space-between">
            <Box flex="1" mr={{ md: 4 }}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>{t('name')}</FormLabel>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{t('slug')}</FormLabel>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>{t('description')}</FormLabel>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">{t('active')}</FormLabel>
                    <Switch
                      isChecked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                  </FormControl>
                  <Button type="submit" isLoading={isSubmitting} colorScheme="blue" alignSelf="flex-start">
                    {t('create')}
                  </Button>
                </VStack>
              </form>
            </Box>
            <Box flex="1" maxH="400px" overflowY="auto" border="1px solid" borderColor={useColorModeValue('gray.200', 'gray.600')} p={4} borderRadius="md" ml={{ md: 4 }} mt={{ base: 4, md: 0 }}>
              <Text fontWeight="bold" mb={2}>{t('select_parent_category')}</Text>
              {loading ? (
                <Text>{t('loading_categories')}</Text>
              ) : categories.length === 0 ? (
                <Text>{t('no_categories_available')}</Text>
              ) : (
                <Tree
                  selectedId={selectedParentId}
                  onSelect={handleSelectParent}
                  expandedNodes={expandedNodes}
                  toggleNode={handleToggleNode}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                />
              )}
            </Box>
          </Flex>
        </CardBody>
      </Card>

      {categoryToEdit && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            onEditModalClose();
            setCategoryToEdit(null);
          }}
          category={categoryToEdit}
          onSuccess={() => {
            console.log("EditCategoryModal onSuccess: Calling fetchCategories");
            fetchCategories();
            onEditModalClose();
            setCategoryToEdit(null);
          }}
          categories={categories}
        />
      )}
    </>
  );
};

const findCategoryById = (nodes, id) => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findCategoryById(node.children, id);
            if (found) return found;
        }
    }
    return null;
};

export default CategoryForm;