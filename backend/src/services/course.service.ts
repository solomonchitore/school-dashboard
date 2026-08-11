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

// Get all courses
export const getAllCourses = async () => {
  return prisma.course.findMany({
    orderBy: {
      id: "desc",
    },
  });
};

// Get one course
export const getCourseById = async (id: number) => {
  return prisma.course.findUnique({
    where: {
      id,
    },
  });
};

// Create course
export const createCourse = async (data: {
  name: string;
  code: string;
  description?: string;
  status?: string;
}) => {
  return prisma.course.create({
    data: {
      name: data.name,
      code: data.code,
      description: data.description || null,
      status: data.status || "Active",
    },
  });
};

// Update course
export const updateCourse = async (
  id: number,
  data: {
    name: string;
    code: string;
    description?: string;
    status?: string;
  }
) => {
  return prisma.course.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      code: data.code,
      description: data.description || null,
      status: data.status || "Active",
    },
  });
};

// Delete course
export const deleteCourse = async (id: number) => {
  return prisma.course.delete({
    where: {
      id,
    },
  });
};