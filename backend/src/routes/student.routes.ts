import { Router } from "express";

import {
  getStudents,
  getStudent,
  addStudent,
  editStudent,
  removeStudent,
} from "../controllers/student.controller";

import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.middleware";

const router = Router();

// ==========================================
// AUTHENTICATION
// ==========================================

router.use(authenticateToken);

// ==========================================
// VIEW STUDENTS
// ==========================================
//
// Administrators and Teachers can view
// student information.
//

router.get(
  "/",
  requireRole("Administrator", "Teacher"),
  getStudents
);

router.get(
  "/:id",
  requireRole("Administrator", "Teacher"),
  getStudent
);

// ==========================================
// ADMINISTRATOR ONLY
// ==========================================
//
// Only Administrators can create, edit,
// or delete students.
//

router.post(
  "/",
  requireRole("Administrator"),
  addStudent
);

router.put(
  "/:id",
  requireRole("Administrator"),
  editStudent
);

router.delete(
  "/:id",
  requireRole("Administrator"),
  removeStudent
);

export default router;