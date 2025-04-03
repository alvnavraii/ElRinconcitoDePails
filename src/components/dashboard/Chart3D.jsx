import React from 'react';
import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Ene', ventas: 4000, beneficio: 2400, costos: 1600 },
  { name: 'Feb', ventas: 3000, beneficio: 1398, costos: 1200 },
  { name: 'Mar', ventas: 5000, beneficio: 3800, costos: 2000 },
  { name: 'Abr', ventas: 2780, beneficio: 908, costos: 1500 },
  { name: 'May', ventas: 1890, beneficio: 800, costos: 1000 },
  { name: 'Jun', ventas: 2390, beneficio: 1200, costos: 1100 },
  { name: 'Jul', ventas: 3490, beneficio: 2300, costos: 1300 },
];

const Chart3D = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  
  return (
    <Card borderRadius="lg" boxShadow="md" height="100%">
      <CardHeader pb={0}>
        <Heading size="md" color={textColor}>Rendimiento Financiero</Heading>
        <Text color="gray.500" fontSize="sm">Análisis de ventas y beneficios</Text>
      </CardHeader>
      <CardBody>
        <Box h="300px" w="100%">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: bgColor, borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="ventas" fill="#4299E1" stackId="a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="beneficio" fill="#48BB78" stackId="a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="costos" fill="#F56565" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardBody>
    </Card>
  );
};

export default Chart3D; 