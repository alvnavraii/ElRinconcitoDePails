import React from 'react';
import { Box, Heading, SimpleGrid, Icon, Text, Stack, Flex, useColorModeValue } from '@chakra-ui/react';
import { FiUsers, FiShoppingBag, FiTag, FiGlobe } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export const Dashboard = () => {
  const { t } = useTranslation();
  const bgCard = useColorModeValue('white', 'gray.700');
  
  const stats = [
    {
      id: 1,
      title: t('manage_users'),
      icon: FiUsers,
      color: 'blue.500',
      link: '/dashboard/users'
    },
    {
      id: 2,
      title: t('manage_products'),
      icon: FiShoppingBag,
      color: 'green.500',
      link: '/dashboard/products'
    },
    {
      id: 3,
      title: t('manage_categories'),
      icon: FiTag,
      color: 'purple.500',
      link: '/dashboard/categories'
    },
    {
      id: 4,
      title: t('manage_languages'),
      icon: FiGlobe,
      color: 'orange.500',
      link: '/dashboard/languages'
    }
  ];

  return (
    <Box p={5}>
      <Heading mb={6}>{t('dashboard_home')}</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {stats.map(stat => (
          <Box
            key={stat.id}
            bg={bgCard}
            p={5}
            borderRadius="lg"
            boxShadow="md"
            _hover={{ transform: 'translateY(-5px)', transition: 'all 0.3s ease' }}
            as="a"
            href={stat.link}
          >
            <Stack spacing={4} align="center" textAlign="center">
              <Flex
                w={16}
                h={16}
                align={'center'}
                justify={'center'}
                color={'white'}
                rounded={'full'}
                bg={stat.color}
              >
                <Icon as={stat.icon} w={8} h={8} />
              </Flex>
              <Text fontWeight={600} fontSize="lg">{stat.title}</Text>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard; 