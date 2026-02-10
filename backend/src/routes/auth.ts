import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { requireAuth } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, "Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, passwordHash, name, authProvider: "email" },
    });

    const payload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, subscriptionTier: user.subscriptionTier },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new AppError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "Invalid email or password");
    }

    const payload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.json({
      user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, subscriptionTier: user.subscriptionTier },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    next(err);
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);

    const payload = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError(401, "Invalid refresh token");
    }

    const newPayload = { userId: user.id, email: user.email };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    next(err);
  }
});

// POST /api/auth/logout
router.post("/logout", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { refreshToken: null },
    });
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/push-token — save Expo push token
router.put("/push-token", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pushToken } = z.object({ pushToken: z.string().min(1) }).parse(req.body);

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { pushToken },
    });

    res.json({ message: "Push token saved" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validation failed", details: err.errors });
    }
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, name: true, avatar: true, subscriptionTier: true },
    });
    if (!user) {
      throw new AppError(404, "User not found");
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;
