import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { prisma } from "../config/prisma";

import {
  loginUser,
  getCurrentUser,
  updateProfile,
  changePassword,
  getAllUsers,
  createUser as createUserService,
} from "../services/auth.service";

// ==========================================
// LOGIN
// ==========================================

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const result = await loginUser({
      email: email.trim(),
      password,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(401).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    });
  }
};

// ==========================================
// CREATE USER
// ==========================================
// Administrator creates login accounts.
//
// role examples:
// - Administrator
// - Teacher
//
// teacherId can optionally connect the login
// account to an existing Teacher record.
// ==========================================

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      role,
      status,
      teacherId,
    } = req.body;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
      return;
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    if (!cleanName || !cleanEmail) {
      res.status(400).json({
        success: false,
        message: "Name and email cannot be empty",
      });
      return;
    }

    // ------------------------------------------
    // CHECK EXISTING USER
    // ------------------------------------------

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: cleanEmail,
        },
      });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message:
          "A user with this email already exists",
      });
      return;
    }

    // ------------------------------------------
    // OPTIONAL TEACHER LINK
    // ------------------------------------------

    let parsedTeacherId: number | undefined;

    if (
      teacherId !== undefined &&
      teacherId !== null &&
      teacherId !== ""
    ) {
      parsedTeacherId = Number(teacherId);

      if (Number.isNaN(parsedTeacherId)) {
        res.status(400).json({
          success: false,
          message: "Invalid teacher ID",
        });
        return;
      }

      const teacher =
        await prisma.teacher.findUnique({
          where: {
            id: parsedTeacherId,
          },
        });

      if (!teacher) {
        res.status(404).json({
          success: false,
          message: "Teacher not found",
        });
        return;
      }

      // Check whether this teacher already
      // has a login account.
      const teacherUser =
        await prisma.user.findUnique({
          where: {
            teacherId: parsedTeacherId,
          },
        });

      if (teacherUser) {
        res.status(409).json({
          success: false,
          message:
            "This teacher already has a login account",
        });
        return;
      }
    }

    // ------------------------------------------
    // HASH PASSWORD
    // ------------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ------------------------------------------
    // CREATE USER
    // ------------------------------------------

    const user =
      await prisma.user.create({
        data: {
          name: cleanName,
          email: cleanEmail,
          password: hashedPassword,

          role:
            role && String(role).trim()
              ? String(role).trim()
              : "Administrator",

          status:
            status && String(status).trim()
              ? String(status).trim()
              : "Active",

          ...(parsedTeacherId !== undefined
            ? {
                teacherId:
                  parsedTeacherId,
              }
            : {}),
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          teacherId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    res.status(201).json({
      success: true,
      message:
        "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error(
      "Create user error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create user",
    });
  }
};

// ==========================================
// GET ALL USERS
// ==========================================

export const getUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load users",
    });
  }
};

// ==========================================
// GET CURRENT USER
// ==========================================

export const me = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message:
          "Authorization token required",
      });
      return;
    }

    const user =
      await getCurrentUser(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to load user",
    });
  }
};

// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateUserProfile =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message:
            "Authorization token required",
        });
        return;
      }

      const { name, email } =
        req.body;

      if (!name || !email) {
        res.status(400).json({
          success: false,
          message:
            "Name and email are required",
        });
        return;
      }

      const result =
        await updateProfile(
          req.user.id,
          {
            name: String(name).trim(),
            email: String(email)
              .trim()
              .toLowerCase(),
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Profile updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update profile",
      });
    }
  };

// ==========================================
// CHANGE PASSWORD
// ==========================================

export const updatePassword =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message:
            "Authorization token required",
        });
        return;
      }

      const {
        currentPassword,
        newPassword,
      } = req.body;

      if (
        !currentPassword ||
        !newPassword
      ) {
        res.status(400).json({
          success: false,
          message:
            "Current password and new password are required",
        });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({
          success: false,
          message:
            "New password must be at least 6 characters",
        });
        return;
      }

      const result =
        await changePassword(
          req.user.id,
          currentPassword,
          newPassword
        );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to change password",
      });
    }
  };