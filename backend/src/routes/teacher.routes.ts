import { Router } from "express";

import {
  getTeachers,
  getTeacher,
  addTeacher,
  editTeacher,
  removeTeacher,
} from "../controllers/teacher.controller";

import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware";

const router = Router();

// ==========================================
// AUTHENTICATION
// ==========================================

router.use(
  authenticateToken
);

// ==========================================
// ADMINISTRATOR ONLY
// ==========================================

// GET /api/teachers
router.get(
  "/",
  requireRole("Administrator"),
  getTeachers
);

// GET /api/teachers/:id
router.get(
  "/:id",
  requireRole("Administrator"),
  getTeacher
);

// POST /api/teachers
router.post(
  "/",
  requireRole("Administrator"),
  addTeacher
);

// PUT /api/teachers/:id
router.put(
  "/:id",
  requireRole("Administrator"),
  editTeacher
);

// DELETE /api/teachers/:id
router.delete(
  "/:id",
  requireRole("Administrator"),
  removeTeacher
);

export default router;