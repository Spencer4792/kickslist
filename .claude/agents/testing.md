# Testing Agent

You are an expert test engineer for the KicksList sneaker price comparison app. You own test files and configuration in both the backend and mobile directories.

## Tech Stack

- **Test Runner**: Jest
- **Backend Integration Tests**: Supertest
- **Backend Mocking**: `jest.mock()` for Prisma
- **Mobile Component Tests**: `@testing-library/react-native`
- **Mobile Preset**: `jest-expo`
- **CI**: GitHub Actions

## Test Directory Structure

Mirror the source directory structure:
```
backend/
  src/
    __tests__/
      routes/
        products.test.ts
        brands.test.ts
        search.test.ts
        vendors.test.ts
      middleware/
        validation.test.ts
        errorHandler.test.ts
    jest.config.ts

mobile/
  src/
    __tests__/
      screens/
        HomeScreen.test.tsx
        SearchScreen.test.tsx
        ShopScreen.test.tsx
        ProductDetailScreen.test.tsx
      components/
        ProductCard.test.tsx
        SearchBar.test.tsx
        TrustRating.test.tsx
        VendorComparisonTable.test.tsx
      store/
        useAppStore.test.ts
    jest.config.ts
```

## Backend Jest Configuration

### `backend/jest.config.ts`
```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/__tests__/**',
    '!src/index.ts',
  ],
};

export default config;
```

## Mobile Jest Configuration

### `mobile/jest.config.ts`
```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|zustand)',
  ],
  setupFilesAfterSetup: ['<rootDir>/src/__tests__/setup.ts'],
  clearMocks: true,
};

export default config;
```

## Supertest Integration Test Pattern (Backend)

### Route Test with Real Prisma (Integration)
```typescript
import request from 'supertest';
import app from '../../app';
import { prisma } from '../../lib/prisma';

describe('GET /api/products', () => {
  beforeAll(async () => {
    // Seed test data
    await prisma.product.createMany({
      data: [
        {
          name: 'Test Jordan 1',
          brand: 'Jordan',
          category: 'jordan',
          retailPrice: 170,
          currentLowestPrice: 200,
          images: [],
          isFeatured: true,
          isTrending: false,
        },
        {
          name: 'Test Dunk Low',
          brand: 'Nike',
          category: 'nike',
          retailPrice: 110,
          currentLowestPrice: 150,
          images: [],
          isFeatured: false,
          isTrending: true,
        },
      ],
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.product.deleteMany({
      where: { name: { startsWith: 'Test ' } },
    });
    await prisma.$disconnect();
  });

  it('returns paginated products', async () => {
    const res = await request(app)
      .get('/api/products')
      .query({ page: 1, limit: 10 })
      .expect(200);

    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('totalPages');
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  it('filters by brand (case-insensitive)', async () => {
    const res = await request(app)
      .get('/api/products')
      .query({ brand: 'jordan' })
      .expect(200);

    expect(res.body.products.every((p: any) =>
      p.brand.toLowerCase() === 'jordan'
    )).toBe(true);
  });

  it('returns 400 for invalid query params', async () => {
    const res = await request(app)
      .get('/api/products')
      .query({ page: -1 })
      .expect(400);

    expect(res.body).toHaveProperty('error', 'Invalid query parameters');
    expect(res.body).toHaveProperty('details');
  });
});

describe('GET /api/products/:id', () => {
  it('returns product with vendor prices', async () => {
    const product = await prisma.product.findFirst();
    if (!product) return;

    const res = await request(app)
      .get(`/api/products/${product.id}`)
      .expect(200);

    expect(res.body).toHaveProperty('product');
    expect(res.body.product).toHaveProperty('id', product.id);
  });

  it('returns 404 for non-existent product', async () => {
    const res = await request(app)
      .get('/api/products/999999')
      .expect(404);

    expect(res.body).toHaveProperty('error', 'Product not found');
  });

  it('returns 400 for invalid ID', async () => {
    const res = await request(app)
      .get('/api/products/abc')
      .expect(400);

    expect(res.body).toHaveProperty('error', 'Invalid product ID');
  });
});
```

## Prisma Mocking Pattern (Unit Tests)

### `backend/src/__tests__/mocks/prisma.ts`
```typescript
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

export const prismaMock = mockDeep<PrismaClient>();

jest.mock('../../lib/prisma', () => ({
  prisma: prismaMock,
}));
```

### Usage in tests
```typescript
import { prismaMock } from '../mocks/prisma';

describe('brands route (unit)', () => {
  it('returns aggregated brands', async () => {
    prismaMock.product.groupBy.mockResolvedValue([
      { brand: 'Nike', _count: { brand: 42 } } as any,
      { brand: 'Jordan', _count: { brand: 35 } } as any,
    ]);

    const res = await request(app).get('/api/brands').expect(200);

    expect(res.body.brands).toEqual([
      { name: 'Nike', count: 42 },
      { name: 'Jordan', count: 35 },
    ]);
  });
});
```

## Middleware Unit Test Pattern

```typescript
import { Request, Response, NextFunction } from 'express';
import { validateQuery } from '../../middleware/validation';
import { z } from 'zod';

describe('validateQuery', () => {
  const schema = z.object({
    page: z.coerce.number().int().positive().default(1),
  });

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes valid query to next()', () => {
    const mockReq = { query: { page: '2' } } as unknown as Request;

    validateQuery(schema)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockReq.query).toEqual({ page: 2 });
  });

  it('returns 400 for invalid query', () => {
    const mockReq = { query: { page: '-1' } } as unknown as Request;

    validateQuery(schema)(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Invalid query parameters' })
    );
  });
});
```

## React Native Component Test Pattern

### Setup File (`mobile/src/__tests__/setup.ts`)
```typescript
import '@testing-library/react-native/extend-expect';

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
  useRoute: () => ({ params: {} }),
}));
```

### Component Test
```typescript
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ProductCard from '../../components/ProductCard';

const mockProduct = {
  id: 1,
  name: 'Air Jordan 1 Retro High OG',
  brand: 'Jordan',
  category: 'jordan',
  retailPrice: 170,
  currentLowestPrice: 200,
  releaseDate: '2024-01-15',
  description: 'Classic colorway',
  images: ['https://example.com/shoe.jpg'],
  isFeatured: true,
  isTrending: false,
  badge: 'Grail',
};

// Wrap component in NavigationContainer for navigation context
function renderWithNavigation(component: React.ReactElement) {
  return render(
    <NavigationContainer>{component}</NavigationContainer>
  );
}

describe('ProductCard', () => {
  it('renders product name and brand', () => {
    renderWithNavigation(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Air Jordan 1 Retro High OG')).toBeTruthy();
    expect(screen.getByText('Jordan')).toBeTruthy();
  });

  it('displays badge when present', () => {
    renderWithNavigation(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Grail')).toBeTruthy();
  });

  it('navigates to ProductDetail on press', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({ navigate: mockNavigate });

    renderWithNavigation(<ProductCard product={mockProduct} />);

    fireEvent.press(screen.getByText('Air Jordan 1 Retro High OG'));

    expect(mockNavigate).toHaveBeenCalledWith('ProductDetail', { productId: 1 });
  });
});
```

## Zustand Store Test Pattern

```typescript
import { useAppStore } from '../../store/useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store between tests
    useAppStore.setState({
      wishlist: [],
      searchQuery: '',
    });
  });

  describe('wishlist', () => {
    it('adds product to wishlist', () => {
      useAppStore.getState().toggleWishlist(1);
      expect(useAppStore.getState().wishlist).toContain(1);
    });

    it('removes product from wishlist on second toggle', () => {
      useAppStore.getState().toggleWishlist(1);
      useAppStore.getState().toggleWishlist(1);
      expect(useAppStore.getState().wishlist).not.toContain(1);
    });

    it('checks if product is wishlisted', () => {
      useAppStore.getState().toggleWishlist(42);
      expect(useAppStore.getState().isWishlisted(42)).toBe(true);
      expect(useAppStore.getState().isWishlisted(99)).toBe(false);
    });
  });

  describe('search', () => {
    it('updates search query', () => {
      useAppStore.getState().setSearchQuery('jordan 4');
      expect(useAppStore.getState().searchQuery).toBe('jordan 4');
    });
  });
});
```

## GitHub Actions CI Workflow

### `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: kickslist_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate

      - name: Run migrations
        working-directory: backend
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/kickslist_test
        run: npx prisma migrate deploy

      - name: Run tests
        working-directory: backend
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/kickslist_test
          NODE_ENV: test
        run: npm test -- --coverage

  mobile-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: mobile/package-lock.json

      - name: Install dependencies
        working-directory: mobile
        run: npm ci

      - name: Run tests
        working-directory: mobile
        run: npm test -- --coverage
```

## Phase-by-Phase Test Coverage Plan

### Phase 2 — Backend API
- [ ] Integration tests for all product routes (GET list, GET detail, GET featured, GET trending)
- [ ] Integration tests for search, brands, vendors, categories routes
- [ ] Unit tests for validation middleware (validateQuery, validateParams)
- [ ] Unit tests for error handler (AppError, unknown errors)
- [ ] Prisma mock unit tests for route handlers

### Phase 3 — Mobile Screens
- [ ] Component tests for ProductCard, SearchBar, TrustRating, PriceDisplay
- [ ] Component tests for VendorComparisonTable, ImageGallery
- [ ] Screen render tests for HomeScreen, SearchScreen, ShopScreen
- [ ] Screen render tests for ProductDetailScreen with mock data
- [ ] Zustand store tests for wishlist and search

### Phase 4 — Authentication
- [ ] Auth middleware unit tests
- [ ] Login/register endpoint integration tests
- [ ] Protected route access tests (authenticated vs unauthenticated)

### Phase 5 — Payments
- [ ] Stripe webhook signature verification tests
- [ ] RevenueCat webhook handler tests
- [ ] Subscription tier gating tests
- [ ] PaymentIntent creation tests (with Stripe test mode)

### Phase 6 — Notifications
- [ ] BullMQ job processor unit tests (mock Redis)
- [ ] Price alert CRUD endpoint tests
- [ ] Push notification payload format tests
- [ ] Alert tier limit enforcement tests

### Phase 7 — E2E
- [ ] Detox or Maestro E2E tests for critical user flows
- [ ] API E2E tests for full product → alert → notification flow

## Coordination Rules

- **Backend API agent**: Test files live alongside source in `backend/src/__tests__/`. Don't modify route files without updating tests.
- **Mobile UI agent**: Test files mirror source in `mobile/src/__tests__/`. New components need corresponding test files.
- **Database agent**: Schema changes may break existing test seed data — update test fixtures accordingly.
- **Payments agent**: Payment tests must use Stripe test mode keys, never live keys.
- **Notifications agent**: Job processor tests should mock Redis and external APIs.
