import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

// ==========================================
// VALID ATTENDANCE STATUSES
// ==========================================

const VALID_STATUSES = [
  "Present",
  "Absent",
  "Late",
  "Excused",
];

// ==========================================
// NORMALIZE DATE
// ==========================================

const normalizeDate = (date: string) => {
  const parsedDate = new Date(
    `${date}T00:00:00.000Z`
  );

  if (isNaN(parsedDate.getTime())) {
    throw new Error(
      "Invalid attendance date"
    );
  }

  return parsedDate;
};

// ==========================================
// VALIDATE STATUS
// ==========================================

const validateStatus = (status: string) => {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(
      "Invalid attendance status. Use Present, Absent, Late, or Excused."
    );
  }
};

// ==========================================
// GET ALL ATTENDANCE
// ==========================================

export const getAllAttendance = async () => {
  return prisma.attendance.findMany({
    include: {
      student: true,
    },
    orderBy: {
      date: "desc",
    },
  });
};

// ==========================================
// GET ATTENDANCE BY ID
// ==========================================

export const getAttendanceById = async (
  id: number
) => {
  return prisma.attendance.findUnique({
    where: {
      id,
    },
    include: {
      student: true,
    },
  });
};

// ==========================================
// CREATE ATTENDANCE
// ==========================================

export const createAttendance = async (
  data: {
    studentId: number;
    date: string;
    status: string;
  }
) => {
  validateStatus(data.status);

  const attendanceDate =
    normalizeDate(data.date);

  // ========================================
  // CHECK STUDENT
  // ========================================

  const student =
    await prisma.student.findUnique({
      where: {
        id: data.studentId,
      },
    });

  if (!student) {
    throw new Error(
      "Student not found"
    );
  }

  // ========================================
  // CHECK DUPLICATE
  // ========================================

  const existingAttendance =
    await prisma.attendance.findUnique({
      where: {
        studentId_date: {
          studentId: data.studentId,
          date: attendanceDate,
        },
      },
    });

  if (existingAttendance) {
    throw new Error(
      "Attendance has already been recorded for this student on this date."
    );
  }

  // ========================================
  // CREATE
  // ========================================

  return prisma.attendance.create({
    data: {
      studentId: data.studentId,
      date: attendanceDate,
      status: data.status,
    },
    include: {
      student: true,
    },
  });
};

// ==========================================
// UPDATE ATTENDANCE
// ==========================================

export const updateAttendance = async (
  id: number,
  data: {
    studentId: number;
    date: string;
    status: string;
  }
) => {
  validateStatus(data.status);

  const attendanceDate =
    normalizeDate(data.date);

  // ========================================
  // CHECK STUDENT
  // ========================================

  const student =
    await prisma.student.findUnique({
      where: {
        id: data.studentId,
      },
    });

  if (!student) {
    throw new Error(
      "Student not found"
    );
  }

  // ========================================
  // CHECK DUPLICATE
  // ========================================

  const existingAttendance =
    await prisma.attendance.findUnique({
      where: {
        studentId_date: {
          studentId: data.studentId,
          date: attendanceDate,
        },
      },
    });

  if (
    existingAttendance &&
    existingAttendance.id !== id
  ) {
    throw new Error(
      "Attendance has already been recorded for this student on this date."
    );
  }

  // ========================================
  // UPDATE
  // ========================================

  return prisma.attendance.update({
    where: {
      id,
    },
    data: {
      studentId: data.studentId,
      date: attendanceDate,
      status: data.status,
    },
    include: {
      student: true,
    },
  });
};

// ==========================================
// DELETE ATTENDANCE
// ==========================================

export const deleteAttendance = async (
  id: number
) => {
  return prisma.attendance.delete({
    where: {
      id,
    },
  });
};