import { prisma } from "../config/prisma";

// ==========================================
// GET ALL TEACHERS
// ==========================================

export const getAllTeachers =
  async () => {
    return await prisma.teacher.findMany({
      orderBy: {
        id: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });
  };

// ==========================================
// GET TEACHER BY ID
// ==========================================

export const getTeacherById =
  async (
    id: number
  ) => {
    return await prisma.teacher.findUnique({
      where: {
        id,
      },

      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });
  };

// ==========================================
// CREATE TEACHER
// ==========================================

export const createTeacher =
  async (data: {
    name: string;
    subject: string;
    email: string;
    phone: string;
    status: string;
  }) => {
    return await prisma.teacher.create({
      data: {
        name: data.name,
        subject: data.subject,
        email: data.email
          .trim()
          .toLowerCase(),
        phone: data.phone,
        status: data.status,
      },
    });
  };

// ==========================================
// UPDATE TEACHER
// ==========================================

export const updateTeacher =
  async (
    id: number,
    data: {
      name?: string;
      subject?: string;
      email?: string;
      phone?: string;
      status?: string;
    }
  ) => {
    return await prisma.teacher.update({
      where: {
        id,
      },

      data: {
        ...data,

        ...(data.email
          ? {
              email: data.email
                .trim()
                .toLowerCase(),
            }
          : {}),
      },
    });
  };

// ==========================================
// DELETE TEACHER
// ==========================================

export const deleteTeacher =
  async (
    id: number
  ) => {
    return await prisma.teacher.delete({
      where: {
        id,
      },
    });
  };