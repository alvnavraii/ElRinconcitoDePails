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
import { useTranslation } from 'react-i18next';

const Chart3D = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const { t } = useTranslation();
  
  const localizedData = [
    { name: t('sales_graph.month_jan'), sales: 4000, profit: 2400, costs: 1600 },
    { name: t('sales_graph.month_feb'), sales: 3000, profit: 1398, costs: 1200 },
    { name: t('sales_graph.month_mar'), sales: 5000, profit: 3800, costs: 2000 },
    { name: t('sales_graph.month_apr'), sales: 2780, profit: 908, costs: 1500 },
    { name: t('sales_graph.month_may'), sales: 1890, profit: 800, costs: 1000 },
    { name: t('sales_graph.month_jun'), sales: 2390, profit: 1200, costs: 1100 },
    { name: t('sales_graph.month_jul'), sales: 3490, profit: 2300, costs: 1300 },
  ];

  return (
    <Card borderRadius="lg" boxShadow="md" height="100%">
      <CardHeader pb={0}>
        <Heading size="md" color={textColor}>{t('sales_graph.graph')}</Heading>
        <Text color="gray.500" fontSize="sm">{t('sales_graph.graph_description')}</Text>
      </CardHeader>
      <CardBody>
        <Box h="300px" w="100%">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={localizedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: bgColor, borderRadius: '8px' }}
                labelFormatter={(value) => `${t('sales_graph.month')}: ${value}`}
                formatter={(value, name) => {
                  const labels = {
                    sales: t('sales'),
                    profit: t('sales_graph.profit'),
                    costs: t('sales_graph.costs')
                  };
                  return [`${value}`, labels[name]];
                }}
              />
              <Legend 
                formatter={(value) => {
                  const labels = {
                    sales: t('sales'),
                    profit: t('profit'),
                    costs: t('costs')
                  };
                  return labels[value];
                }}
              />
              <Bar dataKey="sales" fill="#4299E1" stackId="a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#48BB78" stackId="a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="costs" fill="#F56565" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardBody>
    </Card>
  );
};

export default Chart3D; 