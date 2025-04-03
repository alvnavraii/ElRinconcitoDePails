import React, { useState, useEffect, useCallback } from 'react';
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
  Switch,
  Badge,
  IconButton,
  useToast,
  useColorModeValue,
  Card,
  CardBody,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Image
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiSearch, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import LanguageModal from './LanguageModal';
import { useTranslation } from 'react-i18next';

export const LanguagesTable = () => {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bgCard = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [languageToDelete, setLanguageToDelete] = useState(null);
  const cancelRef = React.useRef();
  
  // Obtener el token directamente de localStorage
  const token = localStorage.getItem('token');
  
  // Mostrar información de depuración
  console.log('Contexto de autenticación:', { token });

  // Añadir hook de traducción
  const { t } = useTranslation();

  // Envolver fetchLanguages con useCallback
  const fetchLanguages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentToken = localStorage.getItem('token');
      
      // Usar la URL exacta que funciona con CURL
      const url = 'http://localhost:8080/api/v1/languages';
      console.log('Intentando recuperar lenguajes desde:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        }
      });
      
      console.log('Respuesta de la API:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta:', errorText);
        throw new Error(`Error al cargar los lenguajes: ${response.status} ${response.statusText}`);
      }
      
      // Modificación para manejar respuesta vacía o null
      let data;
      const responseText = await response.text();
      console.log('Texto de respuesta:', responseText);
      
      try {
        // Solo intentar parsear si hay contenido
        if (responseText && responseText.trim()) {
          data = JSON.parse(responseText);
        } else {
          data = [];
        }
      } catch (jsonError) {
        console.warn('Error al parsear JSON:', jsonError);
        // Si hay error al parsear JSON, usar array vacío
        data = [];
      }
      
      // Verificar si data es null o undefined o no es un array
      if (data === null || data === undefined) {
        data = [];
      } else if (!Array.isArray(data)) {
        // Si la respuesta no es un array, verificar si es un objeto con una propiedad que contenga el array
        if (data.content && Array.isArray(data.content)) {
          data = data.content;
        } else if (data.data && Array.isArray(data.data)) {
          data = data.data;
        } else {
          console.warn('La respuesta no es un array:', data);
          data = []; // Convertir a array vacío si no podemos extraer los datos
        }
      }
      
      console.log('Datos procesados:', data);
      setLanguages(data);
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Ahora es seguro incluir fetchLanguages como dependencia
  useEffect(() => {
    fetchLanguages();
  }, [fetchLanguages]);

  // Filtrar lenguajes según el término de búsqueda
  const filteredLanguages = languages.filter(
    language => 
      language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      language.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (language.nativeName && language.nativeName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Función para manejar la creación de un nuevo lenguaje
  const handleAddLanguage = async (newLanguage) => {
    try {
      setIsLoading(true);
      const currentToken = localStorage.getItem('token');
      
      // Usar la URL completa como en el GET
      const url = 'http://localhost:8080/api/v1/languages';
      console.log('Creando lenguaje en:', url);
      console.log('Datos a enviar:', newLanguage);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(newLanguage),
      });
      
      console.log('Respuesta de la API (POST):', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta (POST):', errorText);
        throw new Error(`Error al crear el lenguaje: ${response.status} ${response.statusText}`);
      }
      
      // Manejar la respuesta de manera similar al GET
      const responseText = await response.text();
      console.log('Texto de respuesta (POST):', responseText);
      
      let createdLanguage;
      try {
        if (responseText && responseText.trim()) {
          createdLanguage = JSON.parse(responseText);
        } else {
          throw new Error('Respuesta vacía del servidor');
        }
      } catch (jsonError) {
        console.warn('Error al parsear JSON (POST):', jsonError);
        throw new Error('Error al procesar la respuesta del servidor');
      }
      
      console.log('Lenguaje creado:', createdLanguage);
      setLanguages([...languages, createdLanguage]);
      
      toast({
        title: 'Lenguaje añadido',
        description: `El lenguaje ${newLanguage.name} ha sido añadido correctamente.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (err) {
      console.error('Error completo (POST):', err);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar la actualización de un lenguaje
  const handleUpdateLanguage = async (updatedLanguage) => {
    try {
      setIsLoading(true);
      const currentToken = localStorage.getItem('token');
      
      // Usar la URL completa
      const url = `http://localhost:8080/api/v1/languages/${updatedLanguage.id}`;
      console.log('Actualizando lenguaje en:', url);
      console.log('Datos a enviar:', updatedLanguage);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(updatedLanguage),
      });
      
      console.log('Respuesta de la API (PUT):', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta (PUT):', errorText);
        throw new Error(`Error al actualizar el lenguaje: ${response.status} ${response.statusText}`);
      }
      
      // Manejar la respuesta de manera similar al GET y POST
      const responseText = await response.text();
      console.log('Texto de respuesta (PUT):', responseText);
      
      let updated;
      try {
        if (responseText && responseText.trim()) {
          updated = JSON.parse(responseText);
        } else {
          throw new Error('Respuesta vacía del servidor');
        }
      } catch (jsonError) {
        console.warn('Error al parsear JSON (PUT):', jsonError);
        throw new Error('Error al procesar la respuesta del servidor');
      }
      
      console.log('Lenguaje actualizado:', updated);
      setLanguages(languages.map(language => 
        language.id === updated.id ? updated : language
      ));
      
      toast({
        title: 'Lenguaje actualizado',
        description: `El lenguaje ${updatedLanguage.name} ha sido actualizado correctamente.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (err) {
      console.error('Error completo (PUT):', err);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cambiar el estado activo/inactivo
  const handleToggleActive = async (language) => {
    try {
      const updatedLanguage = { ...language, isActive: !language.isActive };
      const currentToken = localStorage.getItem('token');
      
      // Usar la URL completa
      const url = `http://localhost:8080/api/v1/languages/${language.id}`;
      console.log('Actualizando estado en:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(updatedLanguage),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el estado del lenguaje');
      }
      
      const updated = await response.json();
      
      setLanguages(languages.map(lang => 
        lang.id === updated.id ? updated : lang
      ));
      
      toast({
        title: 'Estado actualizado',
        description: `El lenguaje ${language.name} ha sido ${updated.isActive ? 'activado' : 'desactivado'}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Abrir modal para editar
  const handleEdit = (language) => {
    setSelectedLanguage(language);
    onOpen();
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setSelectedLanguage(null);
    onOpen();
  };

  // Función para manejar la eliminación de un lenguaje
  const handleDeleteLanguage = async () => {
    try {
      setIsLoading(true);
      const currentToken = localStorage.getItem('token');
      
      // Usar la URL completa
      const url = `http://localhost:8080/api/v1/languages/${languageToDelete.id}`;
      console.log('Eliminando lenguaje:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        }
      });
      
      console.log('Respuesta de la API (DELETE):', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta (DELETE):', errorText);
        throw new Error(`Error al eliminar el lenguaje: ${response.status} ${response.statusText}`);
      }
      
      // Eliminar el lenguaje de la lista local
      setLanguages(languages.filter(lang => lang.id !== languageToDelete.id));
      
      toast({
        title: 'Lenguaje eliminado',
        description: `El lenguaje ${languageToDelete.name} ha sido eliminado correctamente.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Cerrar el diálogo de confirmación
      setIsDeleteDialogOpen(false);
      setLanguageToDelete(null);
    } catch (err) {
      console.error('Error completo (DELETE):', err);
      toast({
        title: 'Error',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir diálogo de confirmación para eliminar
  const openDeleteDialog = (language) => {
    setLanguageToDelete(language);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Box>
      <Card bg={bgCard} mb={6} boxShadow="md">
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Heading size="lg" color={textColor}>{t('languages_management')}</Heading>
            <Flex>
              <Button 
                leftIcon={<FiRefreshCw />} 
                colorScheme="blue" 
                variant="outline" 
                mr={2}
                onClick={fetchLanguages}
                isLoading={isLoading}
              >
                {t('refresh')}
              </Button>
              <Button 
                leftIcon={<FiPlus />} 
                colorScheme="blue" 
                onClick={handleCreate}
              >
                {t('new_language')}
              </Button>
            </Flex>
          </Flex>
          
          <InputGroup mb={6}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder={t('search_language')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          {isLoading && !languages.length ? (
            <Flex justify="center" align="center" height="200px">
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : error ? (
            <Box textAlign="center" p={4} color="red.500">
              <Text>{error}</Text>
              <Button mt={4} onClick={fetchLanguages}>Reintentar</Button>
            </Box>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>{t('code')}</Th>
                    <Th>{t('flag')}</Th>
                    <Th>{t('name')}</Th>
                    <Th>{t('native_name')}</Th>
                    <Th>{t('status')}</Th>
                    <Th>{t('creation_date')}</Th>
                    <Th>{t('actions')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredLanguages.length > 0 ? (
                    filteredLanguages.map((language) => (
                      <Tr key={language.id}>
                        <Td fontWeight="bold">{language.code}</Td>
                        <Td>
                          {language.flagUrl ? (
                            <Image 
                              src={language.flagUrl} 
                              alt={`Bandera de ${language.name}`} 
                              maxH="30px"
                              fallback={<Box w="30px" h="20px" bg="gray.200" />}
                            />
                          ) : (
                            <Box w="30px" h="20px" bg="gray.200" />
                          )}
                        </Td>
                        <Td>{language.name}</Td>
                        <Td>{language.nativeName || '-'}</Td>
                        <Td>
                          <Flex alignItems="center">
                            <Switch 
                              colorScheme="green" 
                              isChecked={language.isActive} 
                              onChange={() => handleToggleActive(language)}
                              mr={2}
                            />
                            <Badge colorScheme={language.isActive ? 'green' : 'red'}>
                              {language.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </Flex>
                        </Td>
                        <Td>{new Date(language.audit.createdAt).toLocaleDateString()}</Td>
                        <Td>
                          <Flex>
                            <IconButton
                              icon={<FiEdit />}
                              aria-label="Editar lenguaje"
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => handleEdit(language)}
                              mr={2}
                            />
                            <IconButton
                              icon={<FiTrash2 />}
                              aria-label="Eliminar lenguaje"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => openDeleteDialog(language)}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7} textAlign="center" py={4}>
                        {t('no_languages_found')}
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>
      
      <LanguageModal 
        isOpen={isOpen} 
        onClose={onClose} 
        language={selectedLanguage} 
        onSave={selectedLanguage ? handleUpdateLanguage : handleAddLanguage}
        isLoading={isLoading}
      />

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('delete_language')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t('delete_confirmation')} 
              {languageToDelete?.name}? 
              {t('delete_confirmation_action')}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDeleteLanguage} 
                ml={3}
                isLoading={isLoading}
              >
                {t('delete')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default LanguagesTable;