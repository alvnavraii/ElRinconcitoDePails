import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Heading,
  Text,
  Flex,
  Icon,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useMediaQuery
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiShoppingBag, 
  FiDollarSign, 
  FiTruck,
  FiBarChart2,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';
import Chart3D from './Chart3D';

// Componente de tarjeta de estadísticas
const StatCard = ({ title, stat, icon, percentage, isIncrease }) => {
  return (
    <Card borderRadius="lg" boxShadow="md" height="100%">
      <CardBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Stat>
              <StatLabel fontSize="sm" color="gray.500">{title}</StatLabel>
              <StatNumber fontSize="2xl" fontWeight="bold">{stat}</StatNumber>
              <StatHelpText>
                <StatArrow type={isIncrease ? 'increase' : 'decrease'} />
                {percentage}%
              </StatHelpText>
            </Stat>
          </Box>
          <Flex
            w="60px"
            h="60px"
            bg={isIncrease ? 'green.100' : 'red.100'}
            borderRadius="full"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={icon} w={6} h={6} color={isIncrease ? 'green.500' : 'red.500'} />
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

// Componente de productos más vendidos
const TopProducts = () => {
  const products = [
    { name: 'Smartphone XYZ', sales: 120, stock: 45, percentage: 85 },
    { name: 'Laptop Pro', sales: 95, stock: 12, percentage: 65 },
    { name: 'Auriculares Bluetooth', sales: 85, stock: 30, percentage: 55 },
    { name: 'Smartwatch', sales: 70, stock: 25, percentage: 45 },
    { name: 'Tablet Ultra', sales: 65, stock: 18, percentage: 40 },
  ];

  return (
    <Card borderRadius="lg" boxShadow="md" height="100%">
      <CardHeader pb={0}>
        <Heading size="md">Productos más vendidos</Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={4}>
          {products.map((product, index) => (
            <Box key={index}>
              <Flex justify="space-between" mb={1}>
                <Text fontSize="sm" fontWeight="medium">{product.name}</Text>
                <Text fontSize="sm" color="gray.600">{product.sales} ventas</Text>
              </Flex>
              <Progress 
                value={product.percentage} 
                size="sm" 
                colorScheme={index < 2 ? "green" : index < 4 ? "blue" : "purple"} 
                borderRadius="full"
              />
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
};

// Componente de últimos pedidos
const RecentOrders = () => {
  const orders = [
    { id: '#ORD-001', customer: 'Juan Pérez', date: '2023-04-01', status: 'Completado', total: '€129.99' },
    { id: '#ORD-002', customer: 'María García', date: '2023-04-02', status: 'Pendiente', total: '€89.50' },
    { id: '#ORD-003', customer: 'Carlos López', date: '2023-04-02', status: 'Procesando', total: '€199.99' },
    { id: '#ORD-004', customer: 'Ana Martínez', date: '2023-04-03', status: 'Enviado', total: '€59.99' },
    { id: '#ORD-005', customer: 'Pedro Sánchez', date: '2023-04-03', status: 'Cancelado', total: '€149.50' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado': return 'green';
      case 'Pendiente': return 'yellow';
      case 'Procesando': return 'blue';
      case 'Enviado': return 'purple';
      case 'Cancelado': return 'red';
      default: return 'gray';
    }
  };

  // Determinar si estamos en vista móvil
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  return (
    <Card borderRadius="lg" boxShadow="md" height="100%">
      <CardHeader pb={0}>
        <Heading size="md">Pedidos recientes</Heading>
      </CardHeader>
      <CardBody>
        {isMobile ? (
          // Vista móvil: tarjetas en lugar de tabla
          <Stack spacing={4}>
            {orders.map((order, index) => (
              <Card key={index} variant="outline" size="sm">
                <CardBody p={3}>
                  <Flex justifyContent="space-between" mb={2}>
                    <Text fontWeight="bold">{order.id}</Text>
                    <Badge colorScheme={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </Flex>
                  <Text fontSize="sm">Cliente: {order.customer}</Text>
                  <Text fontSize="sm">Fecha: {order.date}</Text>
                  <Flex justifyContent="flex-end" mt={2}>
                    <Text fontWeight="bold">{order.total}</Text>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </Stack>
        ) : (
          // Vista desktop: tabla tradicional
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Cliente</Th>
                  <Th>Fecha</Th>
                  <Th>Estado</Th>
                  <Th isNumeric>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order, index) => (
                  <Tr key={index}>
                    <Td fontWeight="medium">{order.id}</Td>
                    <Td>{order.customer}</Td>
                    <Td>{order.date}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </Td>
                    <Td isNumeric>{order.total}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </CardBody>
    </Card>
  );
};

// Componente principal del Dashboard
export const DashboardHome = () => {
  // Simular carga de datos
  
  return (
    <Box p={4}>
      <Heading mb={6}>Panel de Control</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard 
          title="Usuarios" 
          stat="1,254" 
          icon={FiUsers} 
          percentage={12} 
          isIncrease={true} 
        />
        <StatCard 
          title="Pedidos" 
          stat="452" 
          icon={FiShoppingBag} 
          percentage={8} 
          isIncrease={true} 
        />
        <StatCard 
          title="Ventas" 
          stat="€24,530" 
          icon={FiDollarSign} 
          percentage={5} 
          isIncrease={false} 
        />
        <StatCard 
          title="Envíos" 
          stat="352" 
          icon={FiTruck} 
          percentage={10} 
          isIncrease={true} 
        />
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <Chart3D />
        <TopProducts />
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1 }} spacing={6}>
        <RecentOrders />
      </SimpleGrid>
    </Box>
  );
}; 