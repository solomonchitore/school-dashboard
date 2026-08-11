import { Router } from "express";

import {
  getAttendance,
  getAttendanceRecord,
  addAttendance,
  editAttendance,
  removeAttendance,
} from "../controllers/attendance.controller";

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
// ATTENDANCE AUTHORIZATION
// ==========================================
//
// Administrators and Teachers can manage
// attendance.
//

router.use(
  requireRole(
    "Administrator",
    "Teacher"
  )
);

// ==========================================
// GET ALL ATTENDANCE
// ==========================================

router.get(
  "/",
  getAttendance
);

// ==========================================
// GET SINGLE RECORD
// ==========================================

router.get(
  "/:id",
  getAttendanceRecord
);

// ==========================================
// ADD ATTENDANCE
// ==========================================

router.post(
  "/",
  addAttendance
);

// ==========================================
// EDIT ATTENDANCE
// ==========================================

router.put(
  "/:id",
  editAttendance
);

// ==========================================
// DELETE ATTENDANCE
// ==========================================

router.delete(
  "/:id",
  removeAttendance
);

export default router;