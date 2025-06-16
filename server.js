// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ValidationError } = require('./utils/errors');
const asyncHandler = require('./utils/asyncHandler');



// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// - Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// - Authentication

app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== 'secret123') {
    return res.status(401).json({ message: 'Unauthorized. API key is missing or invalid.' });
  }

  next(); // if valid, move to the next middleware/route
});

//Validation Middleware
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof price !== 'number' ||
    typeof category !== 'string' ||
    typeof inStock !== 'boolean'
  ) {
    return res.status(400).json({ message: 'Invalid or missing product fields.' });
  }
  next();
}

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});
// GET all products (with optional category filtering)
app.get('/api/products', asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 5} = req.query;

  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  // Pagination
  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);
  const startIndex = (pageInt - 1) * limitInt;
  const endIndex = pageInt * limitInt;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
 
 res.json({
    page: pageInt,
    limit: limitInt,
    totalResults: filteredProducts.length,
    products: paginatedProducts 
  });
  }));
// Get product statistics: count by category
app.get('/api/products/stats', (req, res) => {
  const stats = {};
  console.log('Products:', products);

  products.forEach(product => {
    const category = product.category.toLowerCase();
    stats[category] = (stats[category] || 0) + 1;
  });

  res.json(stats);
});


//add data
app.post('/api/products', (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || price === undefined || !category || inStock === undefined) {
    return next(new ValidationError('All product fields are required'));
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

//update
app.put('/api/products/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return next(new NotFoundError('Product not found'));
  }

  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || price === undefined || !category || inStock === undefined) {
    return next(new ValidationError('All product fields are required for update'));
  }

  product.name = name;
  product.description = description;
  product.price = price;
  product.category = category;
  product.inStock = inStock;

  res.json(product);
});


//delete
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const deletedProduct = products.splice(productIndex, 1); // remove 1 item

  res.json({ message: 'Product deleted', product: deletedProduct[0] });
});



// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // log it in terminal
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong on the server.',
  });
});


// Get ONE product by its ID
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id; // pick ID from the URL

  // look for the product in the list
  const foundProduct = products.find(product => product.id === productId);

  if (foundProduct) {
  } else {
    res.status(404).json({ message: 'Product not found' }); // error if not found
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 