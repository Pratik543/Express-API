/**
 * Main API routes (v1)
 * Public routes (/ and /version) are mounted at root in server.js.
 */

const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./users');
const productRoutes = require('./products');
const authRoutes = require('./auth');
const docsRoutes = require('./docs');

// Mount versioned resource routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);
router.use('/docs', docsRoutes);

module.exports = router;
