# KicksList

> Buy & Sell Authentic Sneakers

A premium sneaker marketplace inspired by GOAT and Louis Vuitton. Clean, elegant, and designed for serious collectors.

---

## Features

### For Buyers
- **Browse** curated selection of authenticated sneakers
- **Search** by name, brand, or style ID
- **Filter** by category (Jordan, Nike, Yeezy, etc.)
- **Add to Bag** and checkout securely
- **Get Notified** when sold-out items are back in stock

### For Sellers
- **List Your Sneakers** through our simple submission form
- **Set Your Price** — you're in control
- **We Authenticate** every pair before it ships
- **Get Paid** quickly and securely

---

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open in browser
open http://localhost:3000
```

---

## API Reference

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products?category=jordan` | Filter by category |
| GET | `/api/products?search=dunk` | Search products |

### Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart contents |
| POST | `/api/cart` | Add item to cart |
| DELETE | `/api/cart/:cartId` | Remove item from cart |

### Checkout

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/checkout` | Process order |

### Sell

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/listings` | Submit a sell listing |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notify` | Subscribe to back-in-stock alerts |

---

## Adding Inventory

All products are marked **Sold Out** by default. To add stock:

```bash
curl -X POST http://localhost:3000/api/admin/stock \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "sizes": ["8", "9", "10", "11"]}'
```

---

## Design System

### Colors
| Name | Value | Usage |
|------|-------|-------|
| Background | `#fafafa` | Page background |
| White | `#ffffff` | Cards, modals |
| Text | `#1a1a1a` | Primary text |
| Muted | `#666666` | Secondary text |
| Border | `#e5e5e5` | Dividers |

### Typography
- **Headings:** Cormorant Garamond (serif)
- **Body:** Inter (sans-serif)

### Aesthetic
- Clean, minimal layouts
- Generous white space
- Editorial photography
- Subtle hover states
- No harsh colors or effects

---

## Project Structure

```
kickslist/
├── index.html      # Frontend (single-page app)
├── server.js       # Express API server
├── package.json    # Dependencies
└── README.md       # Documentation
```

---

## Production Checklist

- [ ] Database (PostgreSQL / MongoDB)
- [ ] User authentication (Auth0 / Clerk)
- [ ] Payment processing (Stripe)
- [ ] Image uploads (Cloudinary / S3)
- [ ] Email notifications (SendGrid / Resend)
- [ ] Search (Algolia / Elasticsearch)
- [ ] Analytics (Mixpanel / Amplitude)
- [ ] SSL certificate

---

## License

MIT

---

<p align="center">
  <strong>KicksList</strong> — Authenticity Guaranteed
</p>
