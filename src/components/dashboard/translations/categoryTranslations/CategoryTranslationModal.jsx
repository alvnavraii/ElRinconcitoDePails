import React, { useState, useEffect } from 'react';
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
  FormErrorMessage,
  VStack,
  useColorModeValue,
  Select,
  Textarea
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const CategoryTranslationModal = ({ isOpen, onClose, translation, onSave, isLoading, categories, languages }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    categoryId: '',
    languageCode: '',
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    if (translation) {
      setFormData({
        id: translation.id,
        categoryId: translation.categoryId,
        languageCode: translation.languageCode,
        name: translation.name,
        description: translation.description || ''
      });
    } else {
      setFormData({
        categoryId: '',
        languageCode: '',
        name: '',
        description: ''
      });
    }
    setErrors({});
  }, [translation, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.categoryId) newErrors.categoryId = t('category_required');
    if (!formData.languageCode) newErrors.languageCode = t('language_required');
    if (!formData.name.trim()) newErrors.name = t('name_required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent bg={bgColor} color={textColor}>
        <ModalHeader>
          {translation ? t('edit_category_translation') : t('create_category_translation')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={errors.categoryId}>
              <FormLabel>{t('category')}</FormLabel>
              <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                placeholder={t('select_category')}
              >
                {categories && categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
              <FormErrorMessage>{errors.categoryId}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.languageCode}>
              <FormLabel>{t('language')}</FormLabel>
              <Select
                name="languageCode"
                value={formData.languageCode}
                onChange={handleChange}
                placeholder={t('select_language')}
              >
                {languages && languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </Select>
              <FormErrorMessage>{errors.languageCode}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.name}>
              <FormLabel>{t('name')}</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('category_translation_name_placeholder')}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>{t('description')}</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t('category_translation_description_placeholder')}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
            {translation ? t('update') : t('create')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CategoryTranslationModal;
