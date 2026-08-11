import "dotenv/config";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma";

// ==========================================
// JWT SECRET
// ==========================================

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not configured in the .env file"
  );
}

// ==========================================
// LOGIN INPUT
// ==========================================

export interface LoginInput {
  email: string;
  password: string;
}

// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async ({
  email,
  password,
}: LoginInput) => {
  const normalizedEmail =
    email.trim().toLowerCase();

  const user =
    await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },

      include: {
        teacher: true,
      },
    });

  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  if (user.status !== "Active") {
    throw new Error(
      "This account is inactive"
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordMatches) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,

      teacherId:
        user.teacherId,

      teacher:
        user.teacher
          ? {
              id: user.teacher.id,
              name: user.teacher.name,
              subject: user.teacher.subject,
              email: user.teacher.email,
              phone: user.teacher.phone,
              status: user.teacher.status,
            }
          : null,
    },
  };
};

// ==========================================
// GET CURRENT USER
// ==========================================

export const getCurrentUser = async (
  userId: number
) => {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      include: {
        teacher: true,
      },
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    teacherId: user.teacherId,

    teacher:
      user.teacher
        ? {
            id: user.teacher.id,
            name: user.teacher.name,
            subject: user.teacher.subject,
            email: user.teacher.email,
            phone: user.teacher.phone,
            status: user.teacher.status,
          }
        : null,
  };
};

// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfile = async (
  userId: number,
  data: {
    name: string;
    email: string;
  }
) => {
  const name =
    data.name.trim();

  const email =
    data.email.trim().toLowerCase();

  if (!name || !email) {
    throw new Error(
      "Name and email are required"
    );
  }

  const existingUser =
    await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: userId,
        },
      },
    });

  if (existingUser) {
    throw new Error(
      "A user with this email already exists"
    );
  }

  const user =
    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        name,
        email,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        teacherId: true,
      },
    });

  return user;
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      currentPassword,
      user.password
    );

  if (!passwordMatches) {
    throw new Error(
      "Current password is incorrect"
    );
  }

  if (newPassword.length < 6) {
    throw new Error(
      "New password must be at least 6 characters"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      10
    );

  await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      password: hashedPassword,
    },
  });

  return {
    message:
      "Password changed successfully",
  };
};

// ==========================================
// CREATE NORMAL USER
// ==========================================

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
  status?: string;
}) => {
  const name =
    data.name.trim();

  const email =
    data.email.trim().toLowerCase();

  if (!name || !email || !data.password) {
    throw new Error(
      "Name, email and password are required"
    );
  }

  if (data.password.length < 6) {
    throw new Error(
      "Password must be at least 6 characters"
    );
  }

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    throw new Error(
      "A user with this email already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      data.password,
      10
    );

  const user =
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,

        role:
          data.role ||
          "Administrator",

        status:
          data.status ||
          "Active",
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        teacherId: true,
      },
    });

  return user;
};

// ==========================================
// GET ALL USERS
// ==========================================

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: {
      id: "asc",
    },

    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      teacherId: true,
    },
  });
};

// ==========================================
// CREATE TEACHER LOGIN ACCOUNT
// ==========================================

export const createTeacherAccount = async (
  teacherId: number,
  password: string
) => {
  // ----------------------------------------
  // Validate password
  // ----------------------------------------

  if (!password) {
    throw new Error(
      "Password is required"
    );
  }

  if (password.length < 6) {
    throw new Error(
      "Password must be at least 6 characters"
    );
  }

  // ----------------------------------------
  // Find teacher
  // ----------------------------------------

  const teacher =
    await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
    });

  if (!teacher) {
    throw new Error(
      "Teacher not found"
    );
  }

  // ----------------------------------------
  // Check existing linked account
  // ----------------------------------------

  const existingTeacherAccount =
    await prisma.user.findUnique({
      where: {
        teacherId,
      },
    });

  if (existingTeacherAccount) {
    throw new Error(
      "This teacher already has a login account"
    );
  }

  // ----------------------------------------
  // Check email
  // ----------------------------------------

  const teacherEmail =
    teacher.email
      .trim()
      .toLowerCase();

  const existingEmail =
    await prisma.user.findUnique({
      where: {
        email: teacherEmail,
      },
    });

  if (existingEmail) {
    throw new Error(
      "A user account with this teacher's email already exists"
    );
  }

  // ----------------------------------------
  // Hash password
  // ----------------------------------------

  const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );

  // ----------------------------------------
  // Create User
  // ----------------------------------------

  const user =
    await prisma.user.create({
      data: {
        name: teacher.name,

        email: teacherEmail,

        password: hashedPassword,

        role: "Teacher",

        status: teacher.status,

        teacherId: teacher.id,
      },

      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        teacherId: true,
      },
    });

  return user;
};