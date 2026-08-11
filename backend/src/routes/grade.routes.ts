import { Router } from "express";

import {
  getGrades,
  getGrade,
  addGrade,
  editGrade,
  removeGrade,
} from "../controllers/grade.controller";

import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// All grade routes require authentication
router.use(authenticateToken);

// GET /api/grades
router.get("/", getGrades);

// GET /api/grades/:id
router.get("/:id", getGrade);

// POST /api/grades
router.post("/", addGrade);

// PUT /api/grades/:id
router.put("/:id", editGrade);

// DELETE /api/grades/:id
router.delete("/:id", removeGrade);

export default router;