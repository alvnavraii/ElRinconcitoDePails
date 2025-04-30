import {
  Box,
  Flex,
  VStack,
  Icon,
  Text,
  Heading,
  useColorModeValue,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useColorMode,
  Tooltip,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { FiMenu, FiUsers, FiShoppingBag, FiBox, FiTag, FiDollarSign, FiGrid, FiTruck, FiSettings, FiBarChart2, FiHome, FiGlobe, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SidebarContent = ({ ...rest }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [translationsOpen, setTranslationsOpen] = useState(false);

  const NavItem = ({ icon, children, to, isExternal, ...props }) => {
    const isActive = location.pathname === to;
    
    const activeBg = useColorModeValue('blue.100', 'blue.900');
    const activeColor = useColorModeValue('blue.600', 'blue.200');
    const inactiveColor = useColorModeValue('gray.600', 'gray.400');
    const hoverBg = useColorModeValue('blue.50', 'blue.800');
    const hoverColor = useColorModeValue('blue.600', 'blue.200');
    
    const handleClick = (e) => {
      if (isExternal) {
        e.preventDefault();
        navigate(to);
      }
    };
    
    return (
      <Flex
        align="center"
        px="4"
        py="3"
        cursor="pointer"
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        backgroundColor={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : inactiveColor}
        _hover={{
          bg: hoverBg,
          color: hoverColor,
        }}
        as={RouterLink}
        to={to}
        onClick={handleClick}
        {...props}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    );
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <VStack h="full" spacing={0} align="stretch">
        <Box px="4" py="5">
          <Heading size="md">{t('admin_panel')}</Heading>
        </Box>

        <VStack spacing={0} align="stretch">
          <Text px="4" py="2" fontSize="sm" fontWeight="semibold" color="gray.500">
            {t('navigation')}
          </Text>
          <NavItem icon={FiHome} to="/" isExternal>{t('home')}</NavItem>
          <NavItem icon={FiBarChart2} to="/dashboard">{t('dashboard')}</NavItem>
          <NavItem icon={FiUsers} to="/dashboard/users">{t('users')}</NavItem>
          
          <Text px="4" py="2" fontSize="sm" fontWeight="semibold" color="gray.500" mt="4">
            {t('ecommerce')}
          </Text>
          <NavItem icon={FiBox} to="/dashboard/products">{t('products')}</NavItem>
          <NavItem icon={FiTag} to="/dashboard/categories">{t('categories')}</NavItem>
          <NavItem icon={FiGrid} to="/dashboard/brands">{t('brands')}</NavItem>
          <NavItem icon={FiShoppingBag} to="/dashboard/orders">{t('orders')}</NavItem>
          <NavItem icon={FiDollarSign} to="/dashboard/sales">{t('sales')}</NavItem>
          <NavItem icon={FiTruck} to="/dashboard/shipping">{t('shipping')}</NavItem>
          <NavItem icon={FiGlobe} to="/dashboard/languages">{t('languages')}</NavItem>

          <Text px="4" py="2" fontSize="sm" fontWeight="semibold" color="gray.500" mt="4">
            {t('translations')}
          </Text>
          <Flex
            align="center"
            px="4"
            py="3"
            cursor="pointer"
            fontWeight="semibold"
            onClick={() => setTranslationsOpen((open) => !open)}
            _hover={{ bg: useColorModeValue('blue.50', 'blue.800'), color: useColorModeValue('blue.600', 'blue.200') }}
          >
            <Icon mr="4" fontSize="16" as={FiGlobe} />
            {t('translations')}
            <Icon as={translationsOpen ? FiChevronUp : FiChevronDown} ml={2} fontSize="16" />
          </Flex>
          {translationsOpen && (
            <VStack align="stretch" spacing={0} pl={8}>
              <NavItem to="/dashboard/translations/categories">{t('categories')}</NavItem>
              {/* Aquí puedes añadir más entidades en el futuro */}
            </VStack>
          )}

          <Text px="4" py="2" fontSize="sm" fontWeight="semibold" color="gray.500" mt="4">
            {t('configuration')}
          </Text>
          <NavItem icon={FiSettings} to="/dashboard/settings">{t('settings')}</NavItem>
        </VStack>
      </VStack>
    </Box>
  );
};

const DashboardLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation();

  return (
    <Box minH="100vh" bg={bgColor}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
        position="fixed"
        top="4"
        left="4"
        zIndex="1"
      />

      {/* Sidebar para móvil */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{t('admin_panel')}</DrawerHeader>
          <DrawerBody p={0}>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Sidebar para desktop */}
      <Box display={{ base: 'none', md: 'block' }} w={60}>
        <SidebarContent />
      </Box>

      {/* Contenido principal */}
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet />
      </Box>

      {/* Barra superior */}
      <Flex
        position="fixed"
        top="0"
        left="0"
        right="0"
        bg={useColorModeValue('white', 'gray.800')}
        p="4"
        align="center"
        justify="space-between"
      >
        <Tooltip label={colorMode === 'light' ? t('dark_mode') : t('light_mode')}>
          <IconButton
            aria-label={`Cambiar a modo ${colorMode === 'light' ? t('dark_mode') : t('light_mode')}`}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            variant="ghost"
            onClick={toggleColorMode}
            mr={2}
          />
        </Tooltip>
      </Flex>
    </Box>
  );
};

export default DashboardLayout;