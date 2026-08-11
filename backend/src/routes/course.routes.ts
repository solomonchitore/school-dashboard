import { Router } from "express";

import {
  getCourses,
  getCourse,
  addCourse,
  editCourse,
  removeCourse,
} from "../controllers/course.controller";

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
// VIEW COURSES
// ==========================================
//
// Administrators and Teachers can view
// course information.
//

router.get(
  "/",
  requireRole("Administrator", "Teacher"),
  getCourses
);

router.get(
  "/:id",
  requireRole("Administrator", "Teacher"),
  getCourse
);

// ==========================================
// ADMINISTRATOR ONLY
// ==========================================
//
// Only Administrators can create, edit,
// or delete courses.
//

router.post(
  "/",
  requireRole("Administrator"),
  addCourse
);

router.put(
  "/:id",
  requireRole("Administrator"),
  editCourse
);

router.delete(
  "/:id",
  requireRole("Administrator"),
  removeCourse
);

export default router;