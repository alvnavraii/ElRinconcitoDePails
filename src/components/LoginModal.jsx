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
  InputGroup,
  InputRightElement,
  Text,
  Link,
  VStack,
  Divider,
  HStack,
  Icon,
  useToast,
  Box,
  useColorModeValue,
  FormErrorMessage
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export const LoginModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  // Limpiar los campos cuando el modal se abre o se cierra
  useEffect(() => {
    if (isOpen) {
      // Limpiar campos cuando se abre el modal
      setEmail('');
      setPassword('');
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      onClose();
      toast({
        title: 'Inicio de sesión exitoso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError(err.message || t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast({
      title: `Inicio con ${provider}`,
      description: `La funcionalidad de inicio de sesión con ${provider} será implementada próximamente.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Función para manejar el cierre del modal
  const handleClose = () => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent borderRadius="xl" boxShadow="xl" bg={useColorModeValue('white', 'gray.800')}>
        <ModalHeader textAlign="center" fontSize="2xl">{t('login')}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl id="email" isRequired isInvalid={!!error}>
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder={t('email')}
                  borderRadius="md"
                  focusBorderColor="blue.400"
                  autoComplete="off"
                />
              </FormControl>
              
              <FormControl id="password" isRequired isInvalid={!!error}>
                <FormLabel>{t('password')}</FormLabel>
                <InputGroup>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder={t('password')}
                    borderRadius="md"
                    focusBorderColor="blue.400"
                    autoComplete="new-password"
                  />
                  <InputRightElement width="3rem">
                    <Button 
                      h="1.75rem" 
                      size="sm" 
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                    >
                      <Icon as={showPassword ? FaEyeSlash : FaEye} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>
              
              <Box alignSelf="flex-end">
                <Link color="blue.500" fontSize="sm" href="#" onClick={(e) => {
                  e.preventDefault();
                  toast({
                    title: 'Recuperación de contraseña',
                    description: 'Esta funcionalidad será implementada próximamente.',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                  });
                }}>
                  {t('forgot_password')}
                </Link>
              </Box>
              
              <Button 
                colorScheme="blue" 
                width="full"
                type="submit"
                isLoading={isLoading}
                loadingText={t('loading')}
                borderRadius="md"
                size="lg"
                mt={2}
              >
                {t('login')}
              </Button>
              
              <Divider my={3} />
              
              <Text textAlign="center" fontSize="sm" color="gray.500">
                {t('continue_with')}
              </Text>
              
              <HStack spacing={4} width="full" justify="center">
                <Button 
                  leftIcon={<FaGoogle />} 
                  colorScheme="red" 
                  variant="outline"
                  onClick={() => handleSocialLogin('Google')}
                  flex={1}
                >
                  Google
                </Button>
                <Button 
                  leftIcon={<FaFacebook />} 
                  colorScheme="facebook" 
                  variant="outline"
                  onClick={() => handleSocialLogin('Facebook')}
                  flex={1}
                >
                  Facebook
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
          
          <ModalFooter justifyContent="center" flexDirection="column">
            <Text fontSize="sm" textAlign="center">
              {t('no_account')} {' '}
              <Link 
                color="blue.500" 
                fontWeight="bold"
                onClick={(e) => {
                  e.preventDefault();
                  toast({
                    title: 'Registro',
                    description: 'La funcionalidad de registro será implementada próximamente.',
                    status: 'info',
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              >
                {t('register')}
              </Link>
            </Text>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal; 