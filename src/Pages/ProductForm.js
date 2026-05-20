import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';

const ProductForm = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams(); // Presents if editing
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode && location.state?.product) {
      const { product } = location.state;
      setName(product.name);
      setPrice(product.price);
      setCategory(product.category);
    }
  }, [id, isEditMode, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !category) {
      setError('All fields are mandatory.');
      return;
    }

    const payload = { name, price: parseFloat(price), category };

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/products/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/products', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong saving data.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h2>{isEditMode ? 'Modify Existing Product' : 'Create New Product'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div className="form-group">
          <label>Product Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Price ($)</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn btn-primary">Save Product</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;