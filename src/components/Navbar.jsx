import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronDownIcon, MoonIcon, SunIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginModal } from './LoginModal';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Obtener el nombre completo del usuario o mostrar "Usuario" si no está disponible
  const userFullName = user && (user.firstName || user.lastName) 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() 
    : (user?.displayName || user?.email || 'Usuario');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Box bg={bgColor} px={4} borderBottom={1} borderStyle={'solid'} borderColor={borderColor} position="sticky" top={0} zIndex={10}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isMenuOpen ? onMenuClose : onMenuOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box fontWeight="black" fontSize="2xl">
            <Text 
              as={RouterLink} 
              to="/" 
              color={'blue.500'}
              fontWeight="extrabold"
              letterSpacing="tight"
            >
              El Rinconcito de Pails
            </Text>
          </Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            <RouterLink to="/">{t('home')}</RouterLink>
            <RouterLink to="/products">{t('products')}</RouterLink>
            <RouterLink to="/categories">{t('categories')}</RouterLink>
            {user && user.role === 'ADMIN' && (
              <RouterLink to="/dashboard">{t('dashboard')}</RouterLink>
            )}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          {/* Selector de idioma */}
          <LanguageSelector />
          
          <IconButton
            ml={2}
            onClick={toggleColorMode}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            aria-label={'Toggle Color Mode'}
          />
          
          {user ? (
            <Menu>
              <MenuButton as={Button} ml={2} rightIcon={<ChevronDownIcon />}>
                <Avatar size="xs" name={userFullName} mr={2} />
                {userFullName}
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">Perfil</MenuItem>
                <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button ml={2} onClick={onLoginOpen}>
              {t('login')}
            </Button>
          )}
        </Flex>
      </Flex>
      
      {/* Drawer para menú móvil */}
      <Drawer isOpen={isMenuOpen} placement="right" onClose={onMenuClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menú</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start" onClick={onMenuClose}>
              <Text as={RouterLink} to="/" w="full" py={2}>
                {t('home')}
              </Text>
              <Text as={RouterLink} to="/products" w="full" py={2}>
                {t('products')}
              </Text>
              <Text as={RouterLink} to="/categories" w="full" py={2}>
                {t('categories')}
              </Text>
              
              {/* Botón de cambio de tema en el menú móvil */}
              <Button
                w="full"
                leftIcon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                justifyContent="flex-start"
              >
                {colorMode === 'light' ? 'Modo oscuro' : 'Modo claro'}
              </Button>
              
              {!user && (
                <Button
                  w="full"
                  colorScheme="blue"
                  onClick={() => {
                    onMenuClose();
                    onLoginOpen();
                  }}
                >
                  {t('login')}
                </Button>
              )}
              {user && (
                <>
                  <Box borderTopWidth="1px" w="full" pt={4} mt={2}>
                    <Text fontWeight="bold" mb={2}>
                      {userFullName}
                    </Text>
                    <Button
                      w="full"
                      colorScheme="blue"
                      variant="outline"
                      mb={2}
                      onClick={() => {
                        onMenuClose();
                        handleDashboard();
                      }}
                    >
                      {t('dashboard')}
                    </Button>
                    <Button
                      w="full"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => {
                        onMenuClose();
                        handleLogout();
                      }}
                    >
                      {t('logout')}
                    </Button>
                  </Box>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <LoginModal isOpen={isLoginOpen} onClose={onLoginClose} />
    </Box>
  );
}; 