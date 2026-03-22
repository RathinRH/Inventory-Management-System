const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0,
  },
  minStock: {
    type: Number,
    required: [true, 'Minimum stock is required'],
    min: [0, 'Minimum stock cannot be negative'],
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Add a virtual property for 'id' to map from '_id'
productSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Add a virtual property for out of stock status
productSchema.virtual('isOutOfStock').get(function() {
  return this.quantity === 0;
});

// Add a virtual property for low stock status (but not out of stock)
productSchema.virtual('isLowStock').get(function() {
  return this.quantity > 0 && this.quantity <= this.minStock;
});

module.exports = mongoose.model('Product', productSchema);
