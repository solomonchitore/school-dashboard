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
// CALCULATE GRADE
// ==========================================

export const calculateGrade = (mark: number): string => {
  if (mark >= 80) return "A";
  if (mark >= 70) return "B";
  if (mark >= 60) return "C";
  if (mark >= 50) return "D";
  if (mark >= 40) return "E";
  return "F";
};

// ==========================================
// GET ALL GRADES
// ==========================================

export const getAllGrades = async () => {
  return prisma.grade.findMany({
    include: {
      student: true,
      course: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ==========================================
// GET GRADE BY ID
// ==========================================

export const getGradeById = async (id: number) => {
  return prisma.grade.findUnique({
    where: {
      id,
    },
    include: {
      student: true,
      course: true,
    },
  });
};

// ==========================================
// CREATE GRADE
// ==========================================

export const createGrade = async (data: {
  studentId: number;
  courseId: number;
  assessment: string;
  mark: number;
}) => {
  const grade = calculateGrade(data.mark);

  return prisma.grade.create({
    data: {
      studentId: data.studentId,
      courseId: data.courseId,
      assessment: data.assessment,
      mark: data.mark,
      grade,
    },
    include: {
      student: true,
      course: true,
    },
  });
};

// ==========================================
// UPDATE GRADE
// ==========================================

export const updateGrade = async (
  id: number,
  data: {
    studentId: number;
    courseId: number;
    assessment: string;
    mark: number;
  }
) => {
  const grade = calculateGrade(data.mark);

  return prisma.grade.update({
    where: {
      id,
    },
    data: {
      studentId: data.studentId,
      courseId: data.courseId,
      assessment: data.assessment,
      mark: data.mark,
      grade,
    },
    include: {
      student: true,
      course: true,
    },
  });
};

// ==========================================
// DELETE GRADE
// ==========================================

export const deleteGrade = async (id: number) => {
  return prisma.grade.delete({
    where: {
      id,
    },
  });
};