import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// GET /api/vendors
router.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const vendors = await prisma.vendor.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      });
      res.json({ vendors });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
