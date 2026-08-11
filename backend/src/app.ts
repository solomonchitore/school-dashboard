import express from "express";
import cors from "cors";

import teacherRoutes from "./routes/teacher.routes";
import studentRoutes from "./routes/student.routes";
import courseRoutes from "./routes/course.routes";
import attendanceRoutes from "./routes/attendance.routes";
import gradeRoutes from "./routes/grade.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "School Dashboard Backend is running",
  });
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy",
  });
});

// ==========================================
// TEACHER API
// ==========================================

app.use("/api/teachers", teacherRoutes);

// ==========================================
// STUDENT API
// ==========================================

app.use("/api/students", studentRoutes);

// ==========================================
// COURSE API
// ==========================================

app.use("/api/courses", courseRoutes);

// ==========================================
// ATTENDANCE API
// ==========================================

app.use("/api/attendance", attendanceRoutes);

// ==========================================
// GRADE API
// ==========================================

app.use("/api/grades", gradeRoutes);

// ==========================================
// AUTHENTICATION API
// ==========================================

app.use("/api/auth", authRoutes);

export default app;