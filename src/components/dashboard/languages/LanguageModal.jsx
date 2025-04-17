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
  Switch,
  FormErrorMessage,
  VStack,
  useColorModeValue,
  Checkbox,
  InputGroup,
  InputRightElement,
  Image,
  Box,
  Text
} from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const LanguageModal = ({ isOpen, onClose, language, onSave, isLoading }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    nativeName: '',
    flagUrl: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [allowCodeEdit, setAllowCodeEdit] = useState(false);
  const [flagPreview, setFlagPreview] = useState('');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  // Cargar datos del lenguaje si estamos editando
  useEffect(() => {
    if (language) {
      setFormData({
        id: language.id,
        code: language.code,
        name: language.name,
        nativeName: language.nativeName || '',
        flagUrl: language.flagUrl || '',
        isActive: language.isActive
      });
      setFlagPreview(language.flagUrl || '');
      setAllowCodeEdit(false); // Resetear la opción al abrir el modal
    } else {
      setFormData({
        code: '',
        name: '',
        nativeName: '',
        flagUrl: '',
        isActive: true
      });
      setFlagPreview('');
      setAllowCodeEdit(false); // No es necesario en creación, pero por consistencia
    }
    setErrors({});
  }, [language, isOpen]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Si es la URL de la bandera, actualizar la vista previa
    if (name === 'flagUrl') {
      setFlagPreview(value);
    }
    
    // Limpiar error al editar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Manejar cambio en el switch de activo/inactivo
  const handleSwitchChange = () => {
    setFormData({
      ...formData,
      isActive: !formData.isActive
    });
  };

  // Validar el formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.code.trim()) {
      newErrors.code = 'El código es obligatorio';
    } else if (formData.code.length > 10) {
      newErrors.code = 'El código no puede tener más de 10 caracteres';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    // Validar URL de la bandera si se proporciona
    if (formData.flagUrl && !isValidUrl(formData.flagUrl)) {
      newErrors.flagUrl = 'La URL de la bandera no es válida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para validar URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  // Manejar el cambio en la opción de permitir editar código
  const handleAllowCodeEditChange = () => {
    setAllowCodeEdit(!allowCodeEdit);
  };

  // Abrir URL en nueva pestaña
  const openFlagUrl = () => {
    if (formData.flagUrl) {
      window.open(formData.flagUrl, '_blank');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent bg={bgColor} color={textColor}>
        <ModalHeader>
          {language ? t('edit_language') : t('create_language')}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={errors.code}>
              <FormLabel>{t('code')}</FormLabel>
              <Input
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="es, en, fr..."
                isDisabled={language && !allowCodeEdit}
              />
              <FormErrorMessage>{errors.code}</FormErrorMessage>
            </FormControl>
            
            {language && (
              <FormControl display="flex" alignItems="center">
                <Checkbox 
                  isChecked={allowCodeEdit}
                  onChange={handleAllowCodeEditChange}
                  colorScheme="red"
                  size="sm"
                >
                  {t('allow_code_edit')}
                </Checkbox>
              </FormControl>
            )}
            
            <FormControl isInvalid={errors.name}>
              <FormLabel>{t('name')}</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Español, English, Français..."
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            
            <FormControl>
              <FormLabel>{t('native_name')}</FormLabel>
              <Input
                name="nativeName"
                value={formData.nativeName}
                onChange={handleChange}
                placeholder="Español, English, Français..."
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                {t('native_language_name')}
              </Text>
            </FormControl>
            
            <FormControl isInvalid={errors.flagUrl}>
              <FormLabel>{t('flag_url')}</FormLabel>
              <InputGroup>
                <Input
                  name="flagUrl"
                  value={formData.flagUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/bandera.png"
                />
                {formData.flagUrl && (
                  <InputRightElement>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={openFlagUrl}
                      aria-label={t('open_url')}
                    >
                      <FiExternalLink />
                    </Button>
                  </InputRightElement>
                )}
              </InputGroup>
              <FormErrorMessage>{errors.flagUrl}</FormErrorMessage>
              
              {flagPreview && (
                <Box mt={2} p={2} borderWidth="1px" borderRadius="md">
                  <Text fontSize="sm" mb={1}>{t('preview')}</Text>
                  <Image 
                    src={flagPreview} 
                    alt={t('flag_preview')} 
                    maxH="40px"
                    onError={() => setFlagPreview('')}
                  />
                </Box>
              )}
            </FormControl>
            
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="isActive" mb="0">
                {t('active')}
              </FormLabel>
              <Switch
                id="isActive"
                isChecked={formData.isActive}
                onChange={handleSwitchChange}
                colorScheme="green"
              />
            </FormControl>
          </VStack>
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
            {language ? t('update') : t('create')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LanguageModal; 