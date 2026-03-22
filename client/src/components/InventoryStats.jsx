import React from 'react';
import { Package, AlertCircle, AlertTriangle } from 'lucide-react';

const InventoryStats = ({ products }) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity <= p.minStock && p.quantity > 0).length;
  const outOfStockProducts = products.filter(p => p.quantity === 0).length;

  return (
    <div className="stats-grid">

      <div className="stat-card">
        <div className="stat-icon total">
          <Package size={28} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon low">
          <AlertCircle size={28} />
        </div>
        <div className="stat-info">
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{lowStockProducts}</div>
          <div className="stat-label">Low Stock Alerts</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon out">
          <AlertTriangle size={28} />
        </div>
        <div className="stat-info">
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{outOfStockProducts}</div>
          <div className="stat-label">Out of Stock</div>
        </div>
      </div>

    </div>
  );
};

export default InventoryStats;
