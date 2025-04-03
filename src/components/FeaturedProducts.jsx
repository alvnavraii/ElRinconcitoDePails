import React from 'react';
import { Box, SimpleGrid, Image, Text, Stack, Heading, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const FeaturedProducts = () => {
  const { t } = useTranslation();
  
  // Colores adaptados al tema
  const bgBox = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const priceColor = useColorModeValue('blue.600', 'blue.300');
  
  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'Oferta':
        return '#48BB78'; // verde de Chakra UI
      case 'Nuevo':
        return '#3182ce'; // azul de Chakra UI
      case 'Popular':
        return '#E53E3E'; // rojo de Chakra UI
      case 'Destacado':
        return '#805AD5'; // morado de Chakra UI
      default:
        return '#3182ce';
    }
  };

  const products = [
    {
      id: 1,
      name: "Collar de osos tous",
      price: "45.99 Eur",
      image: "/images/collarOsos.jpg",
      badge: "Nuevo"
    },
    {
      id: 2,
      name: "Pulsera de oro de osos tous",
      price: "$149.99",
      image: "/images/PulseraOroOsos.jpg",
      badge: "Oferta"
    },
    {
      id: 3,
      name: "Anillos de osos tous",
      price: "$199.99",
      image: "/images/AnillosOsosTous.jpg",
      badge: "Popular"
    },
    {
      id: 4,
      name: "Colgante Oso de tous",
      price: "$129.99",
      image: "/images/colganteOsoTous.jpg",
      badge: "Destacado"
    }
  ];

  return (
    <Box 
      width="100%" 
      flex="1"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      py={4}
    >
      <Heading mb={4} size="md" textAlign="center" color={headingColor}>{t('featured_products')}</Heading>
      <SimpleGrid 
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={{ base: 4, md: 6 }}
        width="100%"
      >
        {products.map((product) => (
          <Box 
            key={product.id} 
            borderRadius="lg" 
            overflow="hidden" 
            bg={bgBox}
            boxShadow="sm"
            position="relative"
          >
            <Box
              position="absolute"
              top="0"
              right="0"
              width="0"
              height="0"
              borderStyle="solid"
              borderWidth="0 80px 80px 0"
              borderColor={`transparent ${getBadgeColor(product.badge)} transparent transparent`}
              zIndex="1"
            >
              <Text
                position="absolute"
                top="20px"
                right="-90px"
                transform="rotate(45deg)"
                color="white"
                fontSize="xs"
                fontWeight="bold"
                width="70px"
                textAlign="center"
              >
                {product.badge}
              </Text>
            </Box>
            <Image 
              src={product.image} 
              alt={product.name} 
              width="100%" 
              height={{ base: "200px", md: "300px" }}
              objectFit="cover"
              fallbackSrc="https://via.placeholder.com/200x300?text=Producto"
            />
            <Stack p={2}>
              <Text fontSize="sm" fontWeight="bold" color={textColor}>{product.name}</Text>
              <Text fontSize="sm" color={priceColor}>{product.price}</Text>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
      <button>{t('view_all')}</button>
    </Box>
  );
}; 