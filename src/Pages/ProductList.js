import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
 const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const ProductList = () => {
  const { token, user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/products?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]); // Re-fetch data on active searching

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`${API_BASE}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting product');
    }
  };

  return (
    <div className="container">
      <div className="navbar">
        <div>
          <h2>Product Dashboard</h2>
          <small>Logged in as: <strong>{user?.username}</strong> ({user?.role})</small>
        </div>
        <button onClick={logout} className="btn btn-danger">Logout</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search products by name or category..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {/* Conditional UI element: Admin Only */}
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => navigate('/products/add')}>+ Add Product</button>
        )}
      </div>

      {loading && <p>Loading application resources...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              {user?.role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                {/* Conditional UI element: Admin Only row items */}
                {user?.role === 'admin' && (
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      style={{ marginRight: '5px', padding: '5px 10px' }}
                      onClick={() => navigate(`/products/edit/${product.id}`, { state: { product } })}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      style={{ padding: '5px 10px' }}
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={user?.role === 'admin' ? 4 : 3} style={{ textAlign: 'center' }}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;