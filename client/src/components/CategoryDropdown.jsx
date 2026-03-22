import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CATEGORIES = ['Electronics', 'Furniture', 'Stationery', 'Hardware', 'Other'];

const CategoryDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (cat) => { onChange(cat); setOpen(false); };

  const label = value || 'All Categories';

  return (
    <div className="cat-dropdown" ref={ref}>
      <button
        type="button"
        className={`cat-dropdown-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="cat-dropdown-label">{label}</span>
        <ChevronDown size={15} className={`cat-dropdown-arrow ${open ? 'rotated' : ''}`} />
      </button>

      {open && (
        <div className="cat-dropdown-menu" role="listbox">
          {/* All option */}
          <div
            className={`cat-dropdown-item ${value === '' ? 'active' : ''}`}
            role="option"
            aria-selected={value === ''}
            onClick={() => handleSelect('')}
          >
            <span>All Categories</span>
            {value === '' && <Check size={13} />}
          </div>

          <div className="cat-dropdown-divider" />

          {CATEGORIES.map(cat => (
            <div
              key={cat}
              className={`cat-dropdown-item ${value === cat ? 'active' : ''}`}
              role="option"
              aria-selected={value === cat}
              onClick={() => handleSelect(cat)}
            >
              <span>{cat}</span>
              {value === cat && <Check size={13} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
