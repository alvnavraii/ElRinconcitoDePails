import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  useToast,
  Text,
  Switch,
  Box,
  Flex,
  Textarea
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { updateCategory } from '../../../services/categoriesService';

// --- 1. Función auxiliar para aplanar el árbol con indentación ---
const flattenTreeForSelect = (nodes, level = 0, prefix = ' -- ') => {
  let list = [];
  if (!nodes) return list; // Manejar caso de nodos indefinidos o nulos

  nodes.forEach(node => {
    if (!node || !node.id) return; // Omitir nodos inválidos

    // Añadir el nodo actual a la lista con el prefijo de indentación
    list.push({
      value: node.id,
      label: `${prefix.repeat(level)}${node.name || node.displayName || `ID: ${node.id}`}` // Usar nombre o ID
    });

    // Si el nodo tiene hijos, procesarlos recursivamente
    if (node.children && node.children.length > 0) {
      list = list.concat(flattenTreeForSelect(node.children, level + 1, prefix));
    }
  });
  return list;
};

const EditCategoryModal = ({ isOpen, onClose, category, onSuccess, categories = [] }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
    description: '',
    parentId: '',
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar el formulario cuando se selecciona una categoría para editar
  useEffect(() => {
    if (category) {
      console.log('Actualizando formulario con categoría:', JSON.stringify(category, null, 2));
      setFormData({
        id: category.id,
        name: category.name || category.displayName || '',
        slug: category.slug || '',
        description: category.description || '',
        parentId: category.parentId ? String(category.parentId) : (category.parent ? String(category.parent.id) : ''),
        isActive: category.isActive !== undefined ? category.isActive : true
      });
    }
  }, [category]);

  // --- 2. Generar la lista aplanada para el Select usando useMemo ---
  const flattenedCategoriesForSelect = useMemo(() => {
    console.log("Generando lista aplanada para Select...");
    // Asegurarse de que 'categories' sea un array antes de aplanar
    const treeNodes = Array.isArray(categories) ? categories : [];
    const flatList = flattenTreeForSelect(treeNodes);
    // Filtrar la categoría que se está editando para que no pueda ser su propio padre
    return flatList.filter(catOption => String(catOption.value) !== String(formData.id));
  }, [categories, formData.id]); // Recalcular si las categorías o el ID editado cambian

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleSubmit = async () => {
    if (!formData.name?.trim()) {
      toast({
        title: t('error'),
        description: t('name_required'),
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    // Generar slug si está vacío
    if (!formData.slug?.trim()) {
      const newSlug = generateSlug(formData.name);
      setFormData(prev => ({
        ...prev,
        slug: newSlug
      }));
      formData.slug = newSlug;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      
      // Asegurarse de que el ID sea un número
      const categoryId = parseInt(formData.id, 10);
      if (isNaN(categoryId)) {
        throw new Error(`ID de categoría inválido: ${formData.id}`);
      }
      
      // Preparar los datos para enviar al servidor
      const dataToSend = {
        name: formData.name || null,
        slug: formData.slug,
        description: formData.description || null,
        isActive: formData.isActive,
        parentId: formData.parentId && formData.parentId !== '' ? parseInt(formData.parentId, 10) : null
      };
      
      // Validar que parentId convertido sea un número si no es null
      if (dataToSend.parentId !== null && isNaN(dataToSend.parentId)) {
          console.error("Error: parentId inválido después de la conversión:", formData.parentId);
          throw new Error(t('invalid_parent_category'));
      }
      
      console.log('Datos a enviar en la petición PUT:', JSON.stringify(dataToSend, null, 2));
      
      // Realizar la petición PUT
      const updated = await updateCategory(token, categoryId, dataToSend);
      
      console.log('Respuesta del servidor - Actualización exitosa:', updated);
      
      // Mostrar mensaje de éxito
      toast({
        title: t('success'),
        description: t('category_updated'),
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      // Cerrar el modal
      onClose();
      
      // Actualizar la lista de categorías
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      
      // Mostrar mensaje de error
      toast({
        title: t('error'),
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('edit_category_title')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>{t('name')}</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('enter_category_name')}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>{t('slug')}</FormLabel>
            <Input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder={t('enter_category_slug')}
            />
            <Text fontSize="sm" color="gray.500">
              {t('slug_description')}
            </Text>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>{t('description')}</FormLabel>
            <Textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder={t('enter_category_description')}
              rows={3}
            />
            <Text fontSize="sm" color="gray.500">
              {t('description_optional')}
            </Text>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>{t('parent_category')}</FormLabel>
            <Select
              name="parentId"
              value={String(formData.parentId || '')}
              onChange={handleChange}
              placeholder={t('select_parent_category')}
            >
              <option value="">{t('root_level')}</option>
              {flattenedCategoriesForSelect.map(catOption => (
                <option key={catOption.value} value={String(catOption.value)}>
                  {catOption.label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <Flex alignItems="center">
              <FormLabel mb="0">{t('active')}</FormLabel>
              <Switch
                name="isActive"
                isChecked={formData.isActive}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isActive: e.target.checked
                }))}
              />
            </Flex>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {t('save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCategoryModal;