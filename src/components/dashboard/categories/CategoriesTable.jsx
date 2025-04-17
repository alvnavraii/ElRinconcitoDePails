import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Heading,
  useDisclosure,
  IconButton,
  useColorModeValue,
  Card,
  CardBody,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Badge,
  Collapse,
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiSearch, FiRefreshCw, FiTrash2, FiInfo, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../../hooks/useCategories';
import EditCategoryModal from './EditCategoryModal';
import Swal from 'sweetalert2';

export const CategoriesTable = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  
  // Usar el contexto de categorías
  const { categories, isLoading, setIsLoading, error, fetchCategories } = useCategories();
  
  // Logs detallados para depuración
  console.log('🔍 CategoriesTable - Renderizando');
  console.log('📦 CategoriesTable - categories:', categories);
  console.log('⏳ CategoriesTable - isLoading:', isLoading);
  console.log('❌ CategoriesTable - error:', error);
  
  // Verificar si hay categorías
  useEffect(() => {
    if (categories.length === 0 && !isLoading && !error) {
      console.log('⚠️ No hay categorías cargadas, intentando cargar...');
      fetchCategories();
    }
  }, [categories, isLoading, error, fetchCategories]);
  
  // Solo mantener el modal para editar
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const bgCard = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');


  // Función para formatear fechas según el idioma actual
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      // Opciones para formatear la fecha según el idioma
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      
      // Obtener el idioma actual
      const currentLanguage = i18n.language || 'es';
      
      // Formatear la fecha según el idioma
      return new Intl.DateTimeFormat(
        currentLanguage === 'en' ? 'en-US' : 
        currentLanguage === 'fr' ? 'fr-FR' : 
        'es-ES', 
        options
      ).format(date);
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return dateString;
    }
  };

  const handleEdit = (category) => {
    console.log('Editando categoría:', JSON.stringify(category, null, 2));
    
    // Asegurarse de que la categoría tenga todos los campos necesarios
    const categoryToEdit = {
      ...category,
      // Si name es null, usar displayName o slug
      name: category.name || category.displayName || category.slug,
      // Asegurarse de que parentId esté correctamente establecido
      parentId: category.parentId || (category.parent ? category.parent.id : null)
    };
    
    setSelectedCategory(categoryToEdit);
    onEditOpen(); // Abrir el modal de edición
  };

  const handleDelete = async (id, name) => {
    try {
      const result = await Swal.fire({
        title: t('confirm_delete'),
        text: `${t('delete_category_confirmation')} "${name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: t('yes_delete'),
        cancelButtonText: t('cancel')
      });
      
      if (result.isConfirmed) {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`http://localhost:8080/api/v1/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${await response.text()}`);
        }
        
        await Swal.fire({
          title: t('deleted'),
          text: t('category_deleted'),
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        fetchCategories();
      }
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      
      Swal.fire({
        title: t('error'),
        text: error.message,
        icon: 'error',
        confirmButtonText: t('ok')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filtrar categorías según el término de búsqueda
  const filteredCategories = categories.filter(category => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (category.name && category.name.toLowerCase().includes(searchTermLower)) ||
      (category.slug && category.slug.toLowerCase().includes(searchTermLower)) ||
      (category.description && category.description.toLowerCase().includes(searchTermLower))
    );
  });

  // Función para construir el árbol de categorías
  const buildCategoryTree = (cats, parentId = null, level = 0) => {
    const result = [];
    
    // Filtrar categorías por parentId
    const filteredCats = cats.filter(cat => 
      (parentId === null && !cat.parentId) || 
      (cat.parentId === parentId)
    );
    
    // Ordenar categorías por nombre
    const sortedCats = [...filteredCats].sort((a, b) => {
      const nameA = a.displayName || a.name || a.slug || '';
      const nameB = b.displayName || b.name || b.slug || '';
      return nameA.localeCompare(nameB);
    });
    
    // Construir filas para cada categoría
    sortedCats.forEach(category => {
      result.push(
        <React.Fragment key={category.id}>
          <Tr>
            <Td>
              <Flex alignItems="center">
                <IconButton
                  icon={expandedRows[category.id] ? <FiChevronUp /> : <FiChevronDown />}
                  variant="ghost"
                  size="sm"
                  aria-label="Expandir/Contraer"
                  onClick={() => toggleRowExpansion(category.id)}
                  mr={2}
                />
                <Text pl={level * 4} fontWeight={level === 0 ? 'bold' : 'normal'}>
                  {category.displayName || category.name || category.slug}
                </Text>
              </Flex>
            </Td>
            <Td>{category.slug}</Td>
            <Td>
              {category.description ? (
                <Text noOfLines={2}>{category.description}</Text>
              ) : (
                <Text color="gray.500" fontStyle="italic">{t('no_description')}</Text>
              )}
            </Td>
            <Td>
              {category.parentId ? (
                categories.find(c => c.id === category.parentId)?.displayName || 
                categories.find(c => c.id === category.parentId)?.name || 
                categories.find(c => c.id === category.parentId)?.slug || 
                '-'
              ) : '-'}
            </Td>
            <Td>
              <Badge colorScheme={category.isActive ? 'green' : 'red'}>
                {category.isActive ? t('active') : t('inactive')}
              </Badge>
            </Td>
            <Td>
              <Flex>
                <IconButton
                  icon={<FiEdit />}
                  aria-label={t('edit_category')}
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => handleEdit(category)}
                  mr={2}
                />
                <IconButton
                  icon={<FiTrash2 />}
                  aria-label={t('delete_category')}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleDelete(category.id, category.displayName || category.name || category.slug)}
                  isDisabled={isLoading}
                />
              </Flex>
            </Td>
          </Tr>
          
          {/* Fila expandible con información de auditoría */}
          <Tr>
            <Td colSpan={6} p={0}>
              <Collapse in={expandedRows[category.id]} animateOpacity>
                <Box p={4} bg="gray.50">
                  <Text fontWeight="bold" mb={2}>{t('audit_information')}</Text>
                  <Flex flexWrap="wrap" gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">{t('created_at')}:</Text>
                      <Text fontSize="sm">{formatDate(category.audit?.createdAt)}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">{t('created_by')}:</Text>
                      <Text fontSize="sm">{category.audit?.createdBy || '-'}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">{t('updated_at')}:</Text>
                      <Text fontSize="sm">{formatDate(category.audit?.updatedAt)}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">{t('updated_by')}:</Text>
                      <Text fontSize="sm">{category.audit?.updatedBy || '-'}</Text>
                    </Box>
                  </Flex>
                </Box>
              </Collapse>
            </Td>
          </Tr>
        </React.Fragment>
      );
      
      // Añadir subcategorías recursivamente
      const children = buildCategoryTree(cats, category.id, level + 1);
      result.push(...children);
    });
    
    return result;
  };

  // Función para navegar a la página de añadir categoría
  const handleAddCategory = () => {
    navigate('/dashboard/categories/new');
  };

  // Función para editar una categoría
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    // Si usas un modal para editar:
    // onEditOpen();
    // Si prefieres navegar a una página de edición:
    navigate(`/dashboard/categories/edit/${category.id}`);
  };

  return (
    <Card bg={bgCard} boxShadow="sm" borderRadius="lg">
      <CardBody>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading as="h2" size="lg" color={textColor}>
            {t('categories_management')}
          </Heading>
          <Flex>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={handleAddCategory}
              mr={2}
            >
              {t('add_category')}
            </Button>
            <IconButton
              icon={<FiRefreshCw />}
              aria-label={t('refresh')}
              onClick={fetchCategories}
              isLoading={isLoading}
              ml={2}
            />
          </Flex>
        </Flex>
        
        <InputGroup mb={4}>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder={t('search_categories')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        
        {error ? (
          <Box p={4} bg="red.50" color="red.500" borderRadius="md">
            <Text>{error}</Text>
          </Box>
        ) : isLoading && categories.length === 0 ? (
          <Flex justifyContent="center" alignItems="center" p={8}>
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>{t('name')}</Th>
                  <Th>{t('slug')}</Th>
                  <Th>{t('description')}</Th>
                  <Th>{t('parent_category')}</Th>
                  <Th>{t('status')}</Th>
                  <Th>{t('actions')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {categories.length > 0 ? (
                  searchTerm ? 
                    // Si hay término de búsqueda, mostrar resultados filtrados
                    filteredCategories.map(category => (
                      <React.Fragment key={category.id}>
                        <Tr>
                          <Td>
                            <Flex alignItems="center">
                              <IconButton
                                icon={expandedRows[category.id] ? <FiChevronUp /> : <FiChevronDown />}
                                variant="ghost"
                                size="sm"
                                aria-label="Expandir/Contraer"
                                onClick={() => toggleRowExpansion(category.id)}
                                mr={2}
                              />
                              <Text>
                                {category.displayName || category.name || category.slug}
                              </Text>
                            </Flex>
                          </Td>
                          <Td>{category.slug}</Td>
                          <Td>
                            {category.description ? (
                              <Text noOfLines={2}>{category.description}</Text>
                            ) : (
                              <Text color="gray.500" fontStyle="italic">{t('no_description')}</Text>
                            )}
                          </Td>
                          <Td>
                            {category.parentId ? (
                              categories.find(c => c.id === category.parentId)?.displayName || 
                              categories.find(c => c.id === category.parentId)?.name || 
                              categories.find(c => c.id === category.parentId)?.slug || 
                              '-'
                            ) : '-'}
                          </Td>
                          <Td>
                            <Badge colorScheme={category.isActive ? 'green' : 'red'}>
                              {category.isActive ? t('active') : t('inactive')}
                            </Badge>
                          </Td>
                          <Td>
                            <Flex>
                              <IconButton
                                icon={<FiEdit />}
                                aria-label={t('edit_category')}
                                colorScheme="blue"
                                variant="ghost"
                                onClick={() => handleEdit(category)}
                                mr={2}
                              />
                              <IconButton
                                icon={<FiTrash2 />}
                                aria-label={t('delete_category')}
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDelete(category.id, category.displayName || category.name || category.slug)}
                                isDisabled={isLoading}
                              />
                            </Flex>
                          </Td>
                        </Tr>
                        
                        {/* Fila expandible con información de auditoría */}
                        <Tr>
                          <Td colSpan={6} p={0}>
                            <Collapse in={expandedRows[category.id]} animateOpacity>
                              <Box p={4} bg="gray.50">
                                <Text fontWeight="bold" mb={2}>{t('audit_information')}</Text>
                                <Flex flexWrap="wrap" gap={4}>
                                  <Box>
                                    <Text fontSize="sm" fontWeight="medium">{t('created_at')}:</Text>
                                    <Text fontSize="sm">{formatDate(category.audit?.createdAt)}</Text>
                                  </Box>
                                  <Box>
                                    <Text fontSize="sm" fontWeight="medium">{t('created_by')}:</Text>
                                    <Text fontSize="sm">{category.audit?.createdBy || '-'}</Text>
                                  </Box>
                                  <Box>
                                    <Text fontSize="sm" fontWeight="medium">{t('updated_at')}:</Text>
                                    <Text fontSize="sm">{formatDate(category.audit?.updatedAt)}</Text>
                                  </Box>
                                  <Box>
                                    <Text fontSize="sm" fontWeight="medium">{t('updated_by')}:</Text>
                                    <Text fontSize="sm">{category.audit?.updatedBy || '-'}</Text>
                                  </Box>
                                </Flex>
                              </Box>
                            </Collapse>
                          </Td>
                        </Tr>
                      </React.Fragment>
                    ))
                  : 
                    // Si no hay término de búsqueda, mostrar estructura de árbol
                    buildCategoryTree(categories)
                ) : (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={4}>
                      {t('no_categories_found')}
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </CardBody>
      
      {/* Modal para editar categorías */}
      {selectedCategory && (
        <EditCategoryModal 
          isOpen={isEditOpen} 
          onClose={onEditClose} 
          category={selectedCategory} 
          onSuccess={fetchCategories}
        />
      )}
    </Card>
  );
};

export default CategoriesTable; 