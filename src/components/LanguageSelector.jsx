import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Button, 
  Flex, 
  Text, 
  Image, 
  Box,
  useColorModeValue,
  Spinner,
  Center
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

// Fallback component for when flag images fail to load
const FlagFallback = ({ languageCode }) => {
  const bgColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.100');
  
  return (
    <Center 
      w="20px" 
      h="15px" 
      bg={bgColor} 
      mr={2} 
      borderRadius="1px"
      fontSize="10px"
      fontWeight="bold"
      color={textColor}
    >
      {languageCode.toUpperCase()}
    </Center>
  );
};

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Colores para el elemento seleccionado
  const selectedBgColor = useColorModeValue('blue.50', 'blue.900');
  const selectedTextColor = useColorModeValue('blue.700', 'blue.200');
  
  // Colores para el hover
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverTextColor = useColorModeValue('gray.800', 'white');

  // Inicializar el idioma actual al cargar la página
  useEffect(() => {
    // Obtener el idioma guardado en localStorage o el idioma del navegador
    const savedLanguage = localStorage.getItem('i18nextLng');
    
    if (savedLanguage) {
      // Asegurarse de que i18n use el idioma guardado
      i18n.changeLanguage(savedLanguage);
      console.log('Idioma cargado desde localStorage:', savedLanguage);
    }
  }, [i18n]);

  // Cargar idiomas desde la API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/v1/languages', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar los idiomas');
        }
        
        const data = await response.json();
        // Filtrar solo los idiomas activos
        const activeLanguages = data.filter(lang => lang.isActive);
        setLanguages(activeLanguages);
      } catch (error) {
        console.error('Error cargando idiomas:', error);
        // Usar idiomas por defecto en caso de error
        const defaultLanguages = [
          {
            id: 1,
            code: 'es',
            name: 'Español',
            nativeName: 'Español',
            flagUrl: 'https://flagcdn.com/w40/es.png',
            isActive: true
          },
          {
            id: 2,
            code: 'en',
            name: 'English',
            nativeName: 'English',
            flagUrl: 'https://flagcdn.com/w40/gb.png',
            isActive: true
          },
          {
            id: 3,
            code: 'fr',
            name: 'Français',
            nativeName: 'Français',
            flagUrl: 'https://flagcdn.com/w40/fr.png',
            isActive: true
          }
        ];
        setLanguages(defaultLanguages);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLanguages();
  }, []);
  
  // Actualizar el idioma actual cuando cambia i18n.language o languages
  useEffect(() => {
    if (languages.length > 0) {
      // Buscar el idioma que coincide con el idioma actual de i18n
      const currentLang = languages.find(lang => 
        lang.code.toLowerCase() === i18n.language.toLowerCase() ||
        i18n.language.toLowerCase().startsWith(lang.code.toLowerCase())
      );
      
      if (currentLang) {
        console.log('Idioma encontrado en la lista:', currentLang.name);
        setCurrentLanguage(currentLang);
      } else {
        // Si no se encuentra, usar el idioma por defecto (español o el primero disponible)
        const defaultLang = languages.find(lang => lang.code.toLowerCase() === 'es') || languages[0];
        console.log('Usando idioma por defecto:', defaultLang.name);
        setCurrentLanguage(defaultLang);
      }
    }
  }, [i18n.language, languages]);

  // Cambiar el idioma
  const changeLanguage = (language) => {
    console.log(`Cambiando idioma a: ${language.code}`);
    
    // Cambiar el idioma en i18next
    i18n.changeLanguage(language.code.toLowerCase(), (err, t) => {
      if (err) {
        console.error('Error al cambiar el idioma:', err);
      } else {
        console.log(`Idioma cambiado correctamente a: ${language.code}`);
        console.log(`Traducción de 'home' ahora: ${t('home')}`);
        
        // Verificar que el idioma ha cambiado
        console.log('Idioma actual en i18n:', i18n.language);
      }
    });
    
    // Ya no necesitamos establecer currentLanguage aquí, se hará en el useEffect
    localStorage.setItem('i18nextLng', language.code.toLowerCase());
  };

  const getTranslatedName = useCallback((code) => {
    return t(`language_names.${code}`);
  }, [t]);

  if (isLoading) {
    return (
      <Button variant="ghost" isDisabled>
        <Spinner size="sm" mr={2} />
        <Text>Cargando...</Text>
      </Button>
    );
  }

  if (!languages.length) {
    return null;
  }

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
        <Flex alignItems="center">
          {currentLanguage && (
            <>
              {currentLanguage.flagUrl && (
                <Image 
                  src={currentLanguage.flagUrl} 
                  alt={currentLanguage.name} 
                  boxSize="20px" 
                  mr={2}
                  onError={() => {
                    console.error(`Failed to load flag image for ${currentLanguage.code}: ${currentLanguage.flagUrl}`);
                  }}
                  fallback={<FlagFallback languageCode={currentLanguage.code} />}
                />
              )}
              <Text>{getTranslatedName(currentLanguage.code.toLowerCase())}</Text>
            </>
          )}
        </Flex>
      </MenuButton>
      <MenuList>
        {languages.map((language) => {
          const isSelected = currentLanguage?.code === language.code;
          return (
            <MenuItem 
              key={language.id} 
              onClick={() => changeLanguage(language)}
              bg={isSelected ? selectedBgColor : 'transparent'}
              color={isSelected ? selectedTextColor : undefined}
              _hover={{
                bg: isSelected ? selectedBgColor : hoverBgColor,
                color: isSelected ? selectedTextColor : hoverTextColor
              }}
              transition="all 0.2s"
            >
              <Flex alignItems="center">
                {language.flagUrl && (
                  <Image 
                    src={language.flagUrl} 
                    alt={language.name} 
                    boxSize="20px" 
                    mr={2}
                    onError={() => {
                      console.error(`Failed to load flag image for ${language.code}: ${language.flagUrl}`);
                    }}
                    fallback={<FlagFallback languageCode={language.code} />}
                  />
                )}
                <Text>{getTranslatedName(language.code.toLowerCase())}</Text>
                {language.nativeName && language.nativeName !== language.name && (
                  <Text 
                    ml={2} 
                    fontSize="sm" 
                    color={isSelected ? `${selectedTextColor}70` : "gray.500"}
                    _hover={{ color: isSelected ? `${selectedTextColor}90` : "gray.600" }}
                  >
                    ({language.nativeName})
                  </Text>
                )}
              </Flex>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default LanguageSelector; 