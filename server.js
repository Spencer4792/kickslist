/**
 * KICKSLIST - Premium Sneaker Marketplace Backend
 * 
 * Full ecommerce functionality with:
 * - Product catalog management
 * - Cart & checkout
 * - Sell/consignment listings
 * - User notifications
 * - Order management
 * 
 * API Endpoints:
 * - GET    /api/products           - Get all products
 * - GET    /api/products/:id       - Get single product
 * - GET    /api/products/search    - Search products
 * - POST   /api/cart               - Add to cart
 * - GET    /api/cart               - Get cart
 * - DELETE /api/cart/:id           - Remove from cart
 * - POST   /api/checkout           - Process checkout
 * - POST   /api/listings           - Submit sell listing
 * - POST   /api/notify             - Subscribe to notifications
 * - GET    /api/health             - Health check
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ============================================
// IN-MEMORY DATA STORE
// In production, replace with a real database
// ============================================

// Products - All out of stock until inventory is added
let products = [
    {
        id: 1,
        name: "Air Jordan 4 Retro 'Red Thunder'",
        brand: "Jordan",
        category: "jordan",
        styleId: "CT8527-016",
        image: "https://images.stockx.com/images/Air-Jordan-4-Retro-Red-Thunder-Product.jpg",
        images: [
            "https://images.stockx.com/images/Air-Jordan-4-Retro-Red-Thunder-Product.jpg"
        ],
        description: "Following similar color blocking as the Air Jordan 4 Thunder, this release features an all-black upper with vibrant red accents throughout.",
        price: 245,
        retail: 190,
        sizes: [], // Empty = out of stock
        inStock: false,
        badge: null,
        releaseDate: "2022-01-15",
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: "Nike Air Max 1 Travis Scott 'Wheat'",
        brand: "Nike",
        category: "nike",
        styleId: "DO9392-700",
        image: "https://images.stockx.com/images/Nike-Air-Max-1-Travis-Scott-Wheat-Product.jpg",
        images: [
            "https://images.stockx.com/images/Nike-Air-Max-1-Travis-Scott-Wheat-Product.jpg"
        ],
        description: "In collaboration with Travis Scott's record label Cactus Jack, this Air Max 1 features outdoor-inspired design elements.",
        price: 310,
        retail: 160,
        sizes: [],
        inStock: false,
        badge: "new",
        releaseDate: "2022-12-15",
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        name: "Yeezy Boost 350 V2 'Onyx'",
        brand: "Adidas",
        category: "yeezy",
        styleId: "HQ4540",
        image: "https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Onyx-Product.jpg",
        images: [
            "https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Onyx-Product.jpg"
        ],
        description: "The adidas Yeezy Boost 350 V2 Onyx features an all-black Primeknit upper with a matching Boost sole.",
        price: 275,
        retail: 230,
        sizes: [],
        inStock: false,
        badge: null,
        releaseDate: "2022-04-09",
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        name: "Air Jordan 1 High OG 'Chicago Lost & Found'",
        brand: "Jordan",
        category: "jordan",
        styleId: "DZ5485-612",
        image: "https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Lost-and-Found-Product.jpg",
        images: [
            "https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Lost-and-Found-Product.jpg"
        ],
        description: "The iconic Chicago colorway returns with a vintage-inspired 'Lost & Found' theme, featuring cracked leather and aged details.",
        price: 320,
        retail: 180,
        sizes: [],
        inStock: false,
        badge: null,
        releaseDate: "2022-11-19",
        createdAt: new Date().toISOString()
    },
    {
        id: 5,
        name: "Nike Dunk Low 'Panda'",
        brand: "Nike",
        category: "dunk",
        styleId: "DD1391-100",
        image: "https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg",
        images: [
            "https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg"
        ],
        description: "The Nike Dunk Low Retro White Black features a clean two-tone colorway that's become a modern classic.",
        price: 115,
        retail: 110,
        sizes: [],
        inStock: false,
        badge: null,
        releaseDate: "2021-03-10",
        createdAt: new Date().toISOString()
    },
    {
        id: 6,
        name: "New Balance 550 'White Green'",
        brand: "New Balance",
        category: "new balance",
        styleId: "BB550WT1",
        image: "https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg",
        images: [
            "https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg"
        ],
        description: "The New Balance 550 returns from the archives with this clean white and green colorway.",
        price: 135,
        retail: 120,
        sizes: [],
        inStock: false,
        badge: "new",
        releaseDate: "2021-03-25",
        createdAt: new Date().toISOString()
    },
    {
        id: 7,
        name: "Nike SB Dunk Low 'Orange Lobster'",
        brand: "Nike",
        category: "dunk",
        styleId: "FD8776-800",
        image: "https://images.stockx.com/images/Nike-SB-Dunk-Low-Concepts-Orange-Lobster-Product.jpg",
        images: [
            "https://images.stockx.com/images/Nike-SB-Dunk-Low-Concepts-Orange-Lobster-Product.jpg"
        ],
        description: "Concepts continues their iconic Lobster series with this vibrant orange colorway.",
        price: 485,
        retail: 130,
        sizes: [],
        inStock: false,
        badge: null,
        releaseDate: "2022-12-02",
        createdAt: new Date().toISOString()
    },
    {
        id: 8,
        name: "Air Jordan 11 Retro 'Cherry'",
        brand: "Jordan",
        category: "jordan",
        styleId: "CT8012-116",
        image: "https://images.stockx.com/images/Air-Jordan-11-Retro-Cherry-2022-Product.jpg",
        images: [
            "https://images.stockx.com/images/Air-Jordan-11-Retro-Cherry-2022-Product.jpg"
        ],
        description: "The Air Jordan 11 Cherry returns for the holiday season with its classic white and varsity red colorway.",
        price: 235,
        retail: 225,
        sizes: [],
        inStock: false,
        badge: null,
        releaseDate: "2022-12-10",
        createdAt: new Date().toISOString()
    }
];

// Carts (session-based, keyed by sessionId)
let carts = {};

// Sell listings (pending review)
let listings = [];

// Notification subscriptions
let notifications = [];

// Orders
let orders = [];

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getSessionId(req) {
    return req.headers['x-session-id'] || 'default';
}

// ============================================
// API ROUTES
// ============================================

// --- PRODUCTS ---

// Get all products
app.get('/api/products', (req, res) => {
    const { category, brand, search, inStock } = req.query;
    let filtered = [...products];

    if (category && category !== 'all') {
        filtered = filtered.filter(p => 
            p.category.toLowerCase().includes(category.toLowerCase()) ||
            p.name.toLowerCase().includes(category.toLowerCase())
        );
    }

    if (brand) {
        filtered = filtered.filter(p => 
            p.brand.toLowerCase() === brand.toLowerCase()
        );
    }

    if (search) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.brand.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (inStock === 'true') {
        filtered = filtered.filter(p => p.inStock);
    }

    res.json({
        success: true,
        count: filtered.length,
        products: filtered
    });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, product });
});

// Search products
app.get('/api/products/search', (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({ success: false, error: 'Search query required' });
    }

    const results = products.filter(p => 
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase()) ||
        p.styleId.toLowerCase().includes(q.toLowerCase())
    );

    res.json({ success: true, count: results.length, products: results });
});

// --- CART ---

// Get cart
app.get('/api/cart', (req, res) => {
    const sessionId = getSessionId(req);
    const cart = carts[sessionId] || [];
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

    res.json({
        success: true,
        cart,
        subtotal,
        itemCount: cart.length
    });
});

// Add to cart
app.post('/api/cart', (req, res) => {
    const sessionId = getSessionId(req);
    const { productId, size } = req.body;

    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (!product.inStock) {
        return res.status(400).json({ success: false, error: 'Product is out of stock' });
    }

    if (!carts[sessionId]) {
        carts[sessionId] = [];
    }

    const cartItem = {
        cartId: generateId(),
        productId: product.id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        price: product.price,
        size: size || '10',
        addedAt: new Date().toISOString()
    };

    carts[sessionId].push(cartItem);

    res.json({
        success: true,
        message: 'Added to cart',
        cartItem,
        cart: carts[sessionId]
    });
});

// Remove from cart
app.delete('/api/cart/:cartId', (req, res) => {
    const sessionId = getSessionId(req);
    const { cartId } = req.params;

    if (!carts[sessionId]) {
        return res.status(404).json({ success: false, error: 'Cart not found' });
    }

    carts[sessionId] = carts[sessionId].filter(item => item.cartId !== cartId);

    res.json({
        success: true,
        message: 'Removed from cart',
        cart: carts[sessionId]
    });
});

// Clear cart
app.delete('/api/cart', (req, res) => {
    const sessionId = getSessionId(req);
    carts[sessionId] = [];

    res.json({ success: true, message: 'Cart cleared' });
});

// --- CHECKOUT ---

app.post('/api/checkout', (req, res) => {
    const sessionId = getSessionId(req);
    const cart = carts[sessionId] || [];
    const { email, shippingAddress, paymentMethod } = req.body;

    if (cart.length === 0) {
        return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const shipping = subtotal >= 300 ? 0 : 15;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = subtotal + shipping + tax;

    const order = {
        orderId: 'KL-' + generateId().toUpperCase(),
        email,
        items: cart,
        subtotal,
        shipping,
        tax,
        total,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    orders.push(order);
    carts[sessionId] = []; // Clear cart

    res.json({
        success: true,
        message: 'Order placed successfully',
        order
    });
});

// --- SELL LISTINGS ---

// Submit a sell listing
app.post('/api/listings', (req, res) => {
    const { name, brand, size, condition, price, email } = req.body;

    if (!name || !brand || !size || !condition || !price || !email) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const listing = {
        listingId: 'LS-' + generateId().toUpperCase(),
        name,
        brand,
        size,
        condition,
        askingPrice: price,
        email,
        status: 'pending_review',
        createdAt: new Date().toISOString()
    };

    listings.push(listing);

    res.json({
        success: true,
        message: 'Listing submitted for review',
        listing
    });
});

// Get all listings (admin)
app.get('/api/listings', (req, res) => {
    res.json({
        success: true,
        count: listings.length,
        listings
    });
});

// --- NOTIFICATIONS ---

// Subscribe to back-in-stock notifications
app.post('/api/notify', (req, res) => {
    const { productId, email } = req.body;

    if (!productId || !email) {
        return res.status(400).json({ success: false, error: 'Product ID and email required' });
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const subscription = {
        id: generateId(),
        productId,
        productName: product.name,
        email,
        createdAt: new Date().toISOString()
    };

    notifications.push(subscription);

    res.json({
        success: true,
        message: `You'll be notified when ${product.name} is back in stock`,
        subscription
    });
});

// --- ADMIN ROUTES ---

// Add stock to a product (for testing)
app.post('/api/admin/stock', (req, res) => {
    const { productId, sizes } = req.body;

    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    product.sizes = sizes;
    product.inStock = sizes && sizes.length > 0;

    res.json({
        success: true,
        message: 'Stock updated',
        product
    });
});

// --- HEALTH CHECK ---

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        name: 'KicksList API',
        version: '2.0.0',
        status: 'healthy',
        stats: {
            products: products.length,
            listings: listings.length,
            orders: orders.length,
            notifications: notifications.length
        },
        timestamp: new Date().toISOString()
    });
});

// --- SERVE FRONTEND ---

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   KicksList                                             │
│   Premium Sneaker Marketplace                           │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Server:  http://localhost:${PORT}                        │
│   Status:  Running                                      │
│                                                         │
│   Products:     ${products.length} items (${products.filter(p => p.inStock).length} in stock)             │
│   Listings:     ${listings.length} pending                              │
│                                                         │
│   API Endpoints:                                        │
│   • GET  /api/products                                  │
│   • GET  /api/products/:id                              │
│   • POST /api/cart                                      │
│   • POST /api/checkout                                  │
│   • POST /api/listings                                  │
│   • POST /api/notify                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
    `);
});

module.exports = app;
