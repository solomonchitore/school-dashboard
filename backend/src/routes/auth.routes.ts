import { Router } from "express";

import {
  login,
  createUser,
  getUsers,
  me,
  updateUserProfile,
  updatePassword,
} from "../controllers/auth.controller";

import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware";

const router = Router();

// ==========================================
// PUBLIC AUTH ROUTES
// ==========================================

// POST /api/auth/login
router.post(
  "/login",
  login
);

// ==========================================
// ADMINISTRATOR ONLY
// ==========================================

// POST /api/auth/register
//
// Administrator can create a new login account.
//
// For a teacher account, the request can include:
//
// {
//   "name": "John Teacher",
//   "email": "john@example.com",
//   "password": "Teacher123",
//   "role": "Teacher",
//   "teacherId": 4
// }
//
router.post(
  "/register",
  authenticateToken,
  requireRole("Administrator"),
  createUser
);

// ==========================================
// GET ALL USERS
// ==========================================

// GET /api/auth/users
//
// Only Administrators can view
// all login accounts.
//
router.get(
  "/users",
  authenticateToken,
  requireRole("Administrator"),
  getUsers
);

// ==========================================
// CURRENT USER
// ==========================================

// GET /api/auth/me
router.get(
  "/me",
  authenticateToken,
  me
);

// ==========================================
// UPDATE PROFILE
// ==========================================

// PUT /api/auth/profile
router.put(
  "/profile",
  authenticateToken,
  updateUserProfile
);

// ==========================================
// CHANGE PASSWORD
// ==========================================

// PUT /api/auth/password
router.put(
  "/password",
  authenticateToken,
  updatePassword
);

export default router;