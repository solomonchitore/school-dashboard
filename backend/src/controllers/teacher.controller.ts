import {
  Request,
  Response,
} from "express";

import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../services/teacher.service";

// ==========================================
// GET ALL TEACHERS
// ==========================================

export const getTeachers =
  async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const teachers =
        await getAllTeachers();

      res.status(200).json({
        success: true,
        data: teachers,
      });
    } catch (error) {
      console.error(
        "Error fetching teachers:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch teachers",
      });
    }
  };

// ==========================================
// GET TEACHER
// ==========================================

export const getTeacher =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id =
        Number(req.params.id);

      if (Number.isNaN(id)) {
        res.status(400).json({
          success: false,
          message:
            "Invalid teacher ID",
        });

        return;
      }

      const teacher =
        await getTeacherById(id);

      if (!teacher) {
        res.status(404).json({
          success: false,
          message:
            "Teacher not found",
        });

        return;
      }

      res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (error) {
      console.error(
        "Error fetching teacher:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch teacher",
      });
    }
  };

// ==========================================
// ADD TEACHER
// ==========================================

export const addTeacher =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        name,
        subject,
        email,
        phone,
        status,
      } = req.body;

      if (
        !name ||
        !subject ||
        !email ||
        !phone ||
        !status
      ) {
        res.status(400).json({
          success: false,
          message:
            "name, subject, email, phone and status are required",
        });

        return;
      }

      const teacher =
        await createTeacher({
          name: name.trim(),
          subject: subject.trim(),
          email: email
            .trim()
            .toLowerCase(),
          phone: phone.trim(),
          status: status.trim(),
        });

      res.status(201).json({
        success: true,
        message:
          "Teacher created successfully",
        data: teacher,
      });
    } catch (error: any) {
      console.error(
        "Error creating teacher:",
        error
      );

      if (
        error?.code === "P2002"
      ) {
        res.status(409).json({
          success: false,
          message:
            "A teacher with this email already exists",
        });

        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to create teacher",
      });
    }
  };

// ==========================================
// EDIT TEACHER
// ==========================================

export const editTeacher =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id =
        Number(req.params.id);

      if (Number.isNaN(id)) {
        res.status(400).json({
          success: false,
          message:
            "Invalid teacher ID",
        });

        return;
      }

      const {
        name,
        subject,
        email,
        phone,
        status,
      } = req.body;

      const teacher =
        await updateTeacher(
          id,
          {
            name,
            subject,
            email,
            phone,
            status,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Teacher updated successfully",
        data: teacher,
      });
    } catch (error: any) {
      console.error(
        "Error updating teacher:",
        error
      );

      if (
        error?.code === "P2002"
      ) {
        res.status(409).json({
          success: false,
          message:
            "A teacher with this email already exists",
        });

        return;
      }

      if (
        error?.code === "P2025"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Teacher not found",
        });

        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to update teacher",
      });
    }
  };

// ==========================================
// DELETE TEACHER
// ==========================================

export const removeTeacher =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const id =
        Number(req.params.id);

      if (Number.isNaN(id)) {
        res.status(400).json({
          success: false,
          message:
            "Invalid teacher ID",
        });

        return;
      }

      await deleteTeacher(id);

      res.status(200).json({
        success: true,
        message:
          "Teacher deleted successfully",
      });
    } catch (error: any) {
      console.error(
        "Error deleting teacher:",
        error
      );

      if (
        error?.code === "P2025"
      ) {
        res.status(404).json({
          success: false,
          message:
            "Teacher not found",
        });

        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Failed to delete teacher",
      });
    }
  };