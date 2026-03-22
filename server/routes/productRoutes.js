const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Helper to validate MongoDB ID
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Add a product
// @route   POST /products
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// @desc    Get all products
// @route   GET /products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// @desc    Get low stock products
// @route   GET /products/low-stock
router.get('/low-stock', async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$quantity', '$minStock'] }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching low stock products' });
  }
});

// @desc    Update a product
// @route   PUT /products/:id
router.put('/:id', async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }
  try {
    const { name, category, price, quantity, minStock } = req.body;
    const updateData = { name, category, price, quantity, minStock };
    
    // Remove undefined fields to avoid overwriting with null/undefined if not provided
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating product' });
  }
});

// @desc    Delete a product
// @route   DELETE /products/:id
router.delete('/:id', async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;

