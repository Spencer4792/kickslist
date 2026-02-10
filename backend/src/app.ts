import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import productsRouter from "./routes/products";
import brandsRouter from "./routes/brands";
import searchRouter from "./routes/search";
import vendorsRouter from "./routes/vendors";
import authRouter from "./routes/auth";
import wishlistRouter from "./routes/wishlist";
import priceAlertsRouter from "./routes/priceAlerts";
import dropAlertsRouter from "./routes/dropAlerts";
import webhooksRouter from "./routes/webhooks";
import subscriptionRouter from "./routes/subscription";
import { errorHandler } from "./middleware/errorHandler";
import { prisma } from "./lib/prisma";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

// Routes
app.use("/api/products", productsRouter);
app.use("/api/brands", brandsRouter);
app.use("/api/search", searchRouter);
app.use("/api/vendors", vendorsRouter);
app.use("/api/auth", authRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/price-alerts", priceAlertsRouter);
app.use("/api/drop-alerts", dropAlertsRouter);
app.use("/api/webhooks", webhooksRouter);
app.use("/api/subscription", subscriptionRouter);

// GET /api/categories (standalone route)
app.get("/api/categories", async (_req, res, next) => {
  try {
    const categories = await prisma.product.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });

    res.json({
      categories: categories.map((c) => ({
        name: c.category,
        count: c._count.category,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
