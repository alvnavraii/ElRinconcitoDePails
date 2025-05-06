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
  IconButton,
  useToast,
  useColorModeValue,
  Card,
  CardBody,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  FormControl,
  FormLabel,
  Select
} from '@chakra-ui/react';
import { FiPlus, FiEdit, FiSearch, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import CategoryTranslationModal from './CategoryTranslationModal';
import { fetchCategoryTranslations, createCategoryTranslation, updateCategoryTranslation, deleteCategoryTranslation } from '../../../../services/categoryTranslationsService';
import { fetchLanguages } from '../../../../services/languagesService';
import { useCategories } from '../../../../hooks/useCategories';

const CategoryTranslationsTable = () => {
  const [translations, setTranslations] = useState([]);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bgCard = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [translationToDelete, setTranslationToDelete] = useState(null);
  const cancelRef = React.useRef();
  const { t } = useTranslation();

  const { categories, fetchCategories } = useCategories();
  const [languages, setLanguages] = useState([]);

  const fetchLanguagesHandler = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const langs = await fetchLanguages(token);
      setLanguages(langs);
    } catch (err) {
      setLanguages([]);
    }
  }, []);

  const fetchTranslationsHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const data = await fetchCategoryTranslations(token);
      setTranslations(data);
    } catch (err) {
      setError(err.message);
      setTranslations([]);
      toast({
        title: t('error'),
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchTranslationsHandler();
  }, [fetchTranslationsHandler]);

  useEffect(() => {
    fetchLanguagesHandler();
  }, [fetchLanguagesHandler]);

  const filteredTranslations = translations.filter(
    tr =>
      (tr.name && tr.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tr.description && tr.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddTranslation = async (newTranslation) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const created = await createCategoryTranslation(token, newTranslation);
      setTranslations([...translations, created]);
      toast({
        title: t('category_translation_added'),
        description: t('category_translation_added_desc', { name: newTranslation.name }),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      toast({
        title: t('error'),
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTranslation = async (updatedTranslation) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const updated = await updateCategoryTranslation(token, updatedTranslation.id, updatedTranslation);
      setTranslations(translations.map(tr => tr.id === updated.id ? updated : tr));
      toast({
        title: t('category_translation_updated'),
        description: t('category_translation_updated_desc', { name: updatedTranslation.name }),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      toast({
        title: t('error'),
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTranslation = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await deleteCategoryTranslation(token, translationToDelete.id);
      setTranslations(translations.filter(tr => tr.id !== translationToDelete.id));
      toast({
        title: t('category_translation_deleted'),
        description: t('category_translation_deleted_desc', { name: translationToDelete.name }),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsDeleteDialogOpen(false);
      setTranslationToDelete(null);
    } catch (err) {
      toast({
        title: t('error'),
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (translation) => {
    setSelectedTranslation(translation);
    onOpen();
  };

  const handleCreate = () => {
    setSelectedTranslation(null);
    onOpen();
  };

  const openDeleteDialog = (translation) => {
    setTranslationToDelete(translation);
    setIsDeleteDialogOpen(true);
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : '-';
  };
  const getLanguageName = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  return (
    <Box>
      <Card bg={bgCard} mb={6} boxShadow="md">
        <CardBody>
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Heading size="lg" color={textColor}>{t('category_translations_management')}</Heading>
            <Flex>
              <Button
                leftIcon={<FiRefreshCw />}
                colorScheme="blue"
                variant="outline"
                mr={2}
                onClick={fetchTranslationsHandler}
                isLoading={isLoading}
              >
                {t('refresh')}
              </Button>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="blue"
                onClick={handleCreate}
              >
                {t('new_category_translation')}
              </Button>
            </Flex>
          </Flex>

          <InputGroup mb={6}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder={t('search_category_translation')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {isLoading && !translations.length ? (
            <Flex justify="center" align="center" height="200px">
              <Spinner size="xl" color="blue.500" />
            </Flex>
          ) : error ? (
            <Box textAlign="center" p={4} color="red.500">
              <Text>{error}</Text>
              <Button mt={4} onClick={fetchTranslationsHandler}>{t('retry')}</Button>
            </Box>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>{t('language_code')}</Th>
                    <Th>{t('translated_name')}</Th>
                    <Th>{t('description')}</Th>
                    <Th>{t('actions')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredTranslations.length > 0 ? (
                    filteredTranslations.map((tr) => (
                      <Tr key={`${tr.language.code}-${tr.id}`}>
                        <Td>{tr.language.code}</Td>
                        <Td>{tr.name}</Td>
                        <Td>{tr.description || '-'}</Td>
                        <Td>
                          <Flex>
                            <IconButton
                              icon={<FiEdit />}
                              aria-label={t('edit_category_translation')}
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => handleEdit(tr)}
                              mr={2}
                            />
                            <IconButton
                              icon={<FiTrash2 />}
                              aria-label={t('delete_category_translation')}
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => openDeleteDialog(tr)}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={4} textAlign="center" py={4}>
                        {t('no_category_translations_found')}
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      <CategoryTranslationModal
        isOpen={isOpen}
        onClose={onClose}
        translation={selectedTranslation}
        onSave={selectedTranslation ? handleUpdateTranslation : handleAddTranslation}
        isLoading={isLoading}
        categories={categories}
        languages={languages}
      />

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('delete_category_translation')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t('delete_confirmation')} {translationToDelete?.name}? {t('delete_confirmation_action')}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteTranslation}
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

export default CategoryTranslationsTable;
