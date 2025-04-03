import React, { Suspense } from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthProvider';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Footer } from './components/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import { UsersTable } from './components/dashboard/UsersTable';
import { DashboardHome } from './components/dashboard/DashboardHome';
import LanguagesTable from './components/dashboard/LanguagesTable';
import theme from './theme';
import { Spinner, Center } from '@chakra-ui/react';

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Suspense fallback={
          <Center h="100vh">
            <Spinner size="xl" />
          </Center>
        }>
          <AuthProvider>
            <Router>
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  width: '100vw',
                }}
              >
                <Navbar />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />}>
                    <Route element={<DashboardLayout />}>
                      <Route index element={<DashboardHome />} />
                      <Route path="users" element={<UsersTable />} />
                      <Route path="languages" element={<LanguagesTable />} />
                      <Route path="products" element={<div>Productos</div>} />
                      <Route path="categories" element={<div>Categorías</div>} />
                      <Route path="brands" element={<div>Marcas</div>} />
                      <Route path="orders" element={<div>Pedidos</div>} />
                      <Route path="sales" element={<div>Ventas</div>} />
                      <Route path="shipping" element={<div>Envíos</div>} />
                      <Route path="settings" element={<div>Ajustes</div>} />
                    </Route>
                  </Route>
                  <Route path="/" element={
                    <>
                      <Hero />
                      <div 
                        style={{
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          width: '100%',
                          maxWidth: '1280px',
                          margin: '0 auto',
                          padding: '0 20px',
                        }}
                      >
                        <FeaturedProducts />
                      </div>
                      <Footer />
                    </>
                  } />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </Suspense>
      </ChakraProvider>
    </>
  );
}

export default App;
