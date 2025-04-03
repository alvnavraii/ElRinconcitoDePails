import React from 'react';
import { Box, Heading, Text, Button, Stack, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const Hero = () => {
  const { t } = useTranslation();
  
  // Colores adaptados al tema
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  return (
    <Box bg={bgColor} py={{ base: 4, md: 8 }}>
      <Stack spacing={4} alignItems="center" textAlign="center" px={4}>
        <Heading size={{ base: "md", md: "lg" }} color={headingColor}>
          {t('welcome')}
        </Heading>
        <Text fontSize={{ base: "sm", md: "md" }} color={textColor} maxW="800px">
          {t('hero_description')}
        </Text>
        <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} w="100%" justifyContent="center">
          <Button size={{ base: "sm", md: "md" }} colorScheme="blue" width={{ base: "100%", sm: "auto" }}>
            {t('view_all')}
          </Button>
          <Button size={{ base: "sm", md: "md" }} variant="outline" width={{ base: "100%", sm: "auto" }}>
            Ver Ofertas
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}; 