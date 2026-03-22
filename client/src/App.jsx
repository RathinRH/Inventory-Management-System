import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Plus, Search, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import ProductForm from './components/ProductForm';
import InventoryStats from './components/InventoryStats';
import CategoryDropdown from './components/CategoryDropdown';
import Toast from './components/Toast';

const API_BASE_URL = '/products';

function App() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  const fetchProducts = useCallback(async () => {
    try {
      const url = showLowStockOnly ? `${API_BASE_URL}/low-stock` : API_BASE_URL;
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setToast({ message: 'Failed to connect to the server.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [showLowStockOnly]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        await axios.put(`${API_BASE_URL}/${editingProduct.id}`, productData);
        setToast({ message: 'Product updated successfully!', type: 'success' });
      } else {
        await axios.post(API_BASE_URL, productData);
        setToast({ message: 'Product added successfully!', type: 'success' });
      }
      setShowModal(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      setToast({ 
        message: 'Error saving product: ' + (error.response?.data?.message || error.message), 
        type: 'error' 
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        setToast({ message: 'Product deleted successfully!', type: 'success' });
        fetchProducts();
      } catch (error) {
        setToast({ message: 'Error deleting product', type: 'error' });
      }
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="container">

      {/* ── Original Header ── */}
      <header>
        <div className="header-text">
          <h1>INVENTORY MANAGER</h1>
          <p>Smart tracking for your modern business</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Add New Product
        </button>
      </header>

      {/* ── Stats Cards ── */}
      <InventoryStats products={products} />

      {/* ── Controls: Search + Filter + Low Stock ── */}
      <div className="inventory-controls">
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            placeholder="Search products by name or category..."
            style={{ paddingLeft: '2.5rem', width: '100%' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <CategoryDropdown value={categoryFilter} onChange={setCategoryFilter} />

          <button
            className={`btn ${showLowStockOnly ? 'btn-warning' : 'btn-ghost'}`}
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            style={{ padding: '0.65rem 1.1rem' }}
          >
            <AlertCircle size={16} />
            {showLowStockOnly ? 'Show All' : 'Low Stock Only'}
          </button>
        </div>
      </div>

      {/* ── Product Table (improved) ── */}
      <div className="product-table-container">
        <div className="table-header-bar">
          <h2>{showLowStockOnly ? '⚠️ Low Stock Items' : 'All Products'}</h2>
          <span className="table-count">{filteredProducts.length} items</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => {
              const outOfStock = product.quantity === 0;
              const isLow = !outOfStock && product.quantity <= product.minStock;
              
              let rowClass = '';
              if (outOfStock) rowClass = 'out-of-stock-row';
              else if (isLow) rowClass = 'low-stock-row';

              return (
                <tr key={product.id} className={rowClass}>

                  {/* Product Name + Date */}
                  <td>
                    <div className="product-name">{product.name}</div>
                    <div className="product-date">
                      Added {new Date(product.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>

                  {/* Category Chip */}
                  <td>
                    <span className="category-chip">{product.category}</span>
                  </td>

                  {/* Price */}
                  <td>
                    <span className="price-tag">
                      ${product.price ? product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </span>
                  </td>

                  {/* Stock + Min */}
                  <td>
                    <div className="stock-info">
                      <span className={`stock-count ${isLow ? 'low' : ''}`}>{product.quantity}</span>
                      <span className="stock-min">Min: {product.minStock}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td>
                    {outOfStock ? (
                      <span className="badge badge-danger">
                        <span className="badge-dot" /> Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="badge badge-warning">
                        <span className="badge-dot" /> Low Stock
                      </span>
                    ) : (
                      <span className="badge badge-success">
                        <span className="badge-dot" /> In Stock
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="actions-cell">
                      <button
                        className="action-btn"
                        title="Edit product"
                        onClick={() => { setEditingProduct(product); setShowModal(true); }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="action-btn delete"
                        title="Delete product"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <p>{searchTerm || categoryFilter ? 'No products match your filters.' : 'No products yet. Add your first one!'}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
        />
      )}
      {/* Notifications */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, message: '' })} 
      />
    </div>
  );
}

export default App;
