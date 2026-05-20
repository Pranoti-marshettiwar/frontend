import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Pages/Login';
import ProductList from './Pages/ProductList';
import ProductForm from './Pages/ProductForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* User + Admin Protected Dashboard */}
          <Route path="/products" element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <ProductList />
            </ProtectedRoute>
          } />

          {/* Admin Strictly Restricted Action Paths */}
          <Route path="/products/add" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProductForm />
            </ProtectedRoute>
          } />
          
          <Route path="/products/edit/:id" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProductForm />
            </ProtectedRoute>
          } />

          {/* Catch All Redirects */}
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;