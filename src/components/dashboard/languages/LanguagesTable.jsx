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
import { fetchLanguages, createLanguage, updateLanguage, deleteLanguage } from '../../../services/languagesService';

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
  
  const { t } = useTranslation();

  const fetchLanguagesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const data = await fetchLanguages(token);
      setLanguages(data);
    } catch (err) {
      setError(err.message);
      setLanguages([]);
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

  useEffect(() => {
    fetchLanguagesHandler();
  }, [fetchLanguagesHandler]);

  const filteredLanguages = languages.filter(
    language => 
      language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      language.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (language.nativeName && language.nativeName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddLanguage = async (newLanguage) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const createdLanguage = await createLanguage(token, newLanguage);
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

  const handleUpdateLanguage = async (updatedLanguage) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const updated = await updateLanguage(token, updatedLanguage.id, updatedLanguage);
      setLanguages(languages.map(language => language.id === updated.id ? updated : language));
      toast({
        title: 'Lenguaje actualizado',
        description: `El lenguaje ${updatedLanguage.name} ha sido actualizado correctamente.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
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

  const handleDeleteLanguage = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await deleteLanguage(token, languageToDelete.id);
      setLanguages(languages.filter(lang => lang.id !== languageToDelete.id));
      toast({
        title: 'Lenguaje eliminado',
        description: `El lenguaje ${languageToDelete.name} ha sido eliminado correctamente.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteDialogOpen(false);
      setLanguageToDelete(null);
    } catch (err) {
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

  const handleToggleActive = async (language) => {
    try {
      const updatedLanguage = { ...language, isActive: !language.isActive };
      const token = localStorage.getItem('token');
      const updated = await updateLanguage(token, language.id, updatedLanguage);
      setLanguages(languages.map(lang => lang.id === updated.id ? updated : lang));
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

  const handleEdit = (language) => {
    setSelectedLanguage(language);
    onOpen();
  };

  const handleCreate = () => {
    setSelectedLanguage(null);
    onOpen();
  };

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
                onClick={fetchLanguagesHandler}
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
              <Button mt={4} onClick={fetchLanguagesHandler}>Reintentar</Button>
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