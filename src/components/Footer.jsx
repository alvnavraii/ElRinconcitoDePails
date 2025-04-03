import React from 'react';
import { Box, Container, Stack, Text, Link, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt="auto"
      py={4}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2023 El Rinconcito de Pails. {t('all_rights_reserved')}</Text>
        <Stack direction={'row'} spacing={6}>
          <Link href={'#'}>{t('privacy_policy')}</Link>
          <Link href={'#'}>{t('terms_of_service')}</Link>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer; 