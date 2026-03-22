import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Furniture', 'Stationery', 'Hardware', 'Other'];

const ProductForm = ({ product, onSave, onCancel }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const [formData, setFormData] = useState(product || {
    name: '',
    category: '',
    price: '',
    quantity: '',
    minStock: 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'name' || name === 'category' ? value : Number(value)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-content">

        {/* Header */}
        <div className="modal-header">
          <h2>{product ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
          <button className="action-btn" onClick={onCancel} title="Close">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Keyboard"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-grid">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Price (USD)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Min Stock Threshold</label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                min="0"
                required
              />
              <span className="form-hint">Alert triggers when stock falls at or below this number</span>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {product ? 'Save Changes' : 'Add to Inventory'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProductForm;
