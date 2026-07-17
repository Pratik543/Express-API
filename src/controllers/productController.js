/**
 * Product controller - handles product-related operations
 */

const products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', inStock: true },
  { id: 2, name: 'Smartphone', price: 699.99, category: 'Electronics', inStock: true },
  { id: 3, name: 'Headphones', price: 149.99, category: 'Electronics', inStock: false },
  { id: 4, name: 'Desk Chair', price: 299.99, category: 'Furniture', inStock: true },
];

// Get all products
const getAllProducts = (req, res) => {
  const { category, inStock, search } = req.query;
  
  let filteredProducts = products;

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by stock status
  if (inStock !== undefined) {
    const inStockBool = inStock === 'true';
    filteredProducts = filteredProducts.filter(p => p.inStock === inStockBool);
  }

  // Search by name
  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({
    success: true,
    count: filteredProducts.length,
    data: filteredProducts,
  });
};

// Get product by ID
const getProductById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found`,
    });
  }

  res.json({
    success: true,
    data: product,
  });
};

// Create new product
const createProduct = (req, res) => {
  const { name, price, category, inStock = false } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      message: 'Name, price, and category are required',
    });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be a positive number',
    });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    category,
    inStock,
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct,
  });
};

// Update product
const updateProduct = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found`,
    });
  }

  const { name, price, category, inStock } = req.body;
  products[productIndex] = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    price: price !== undefined ? price : products[productIndex].price,
    category: category || products[productIndex].category,
    inStock: inStock !== undefined ? inStock : products[productIndex].inStock,
  };

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: products[productIndex],
  });
};

// Delete product
const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const productIndex = products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Product with ID ${id} not found`,
    });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];

  res.json({
    success: true,
    message: 'Product deleted successfully',
    data: deletedProduct,
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
