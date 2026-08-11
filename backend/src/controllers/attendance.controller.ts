import { Request, Response } from "express";

import {
  getAllAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../services/attendance.service";

// ==========================================
// GET ALL ATTENDANCE
// ==========================================

export const getAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    const attendance =
      await getAllAttendance();

    return res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error(
      "Error fetching attendance:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch attendance",
    });
  }
};

// ==========================================
// GET SINGLE ATTENDANCE
// ==========================================

export const getAttendanceRecord =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(
        req.params.id
      );

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid attendance ID",
        });
      }

      const attendance =
        await getAttendanceById(id);

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message:
            "Attendance record not found",
        });
      }

      return res.json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      console.error(
        "Error fetching attendance record:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch attendance record",
      });
    }
  };

// ==========================================
// CREATE ATTENDANCE
// ==========================================

export const addAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      studentId,
      date,
      status,
    } = req.body;

    if (
      studentId === undefined ||
      !date ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentId, date and status are required",
      });
    }

    const numericStudentId =
      Number(studentId);

    if (
      !Number.isInteger(
        numericStudentId
      ) ||
      numericStudentId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid student ID",
      });
    }

    const attendance =
      await createAttendance({
        studentId:
          numericStudentId,
        date,
        status,
      });

    return res.status(201).json({
      success: true,
      message:
        "Attendance created successfully",
      data: attendance,
    });
  } catch (error: any) {
    console.error(
      "Error creating attendance:",
      error
    );

    if (
      error?.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Attendance has already been recorded for this student on this date.",
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "Student not found"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found",
      });
    }

    if (
      error instanceof Error &&
      error.message.startsWith(
        "Invalid attendance status"
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "Invalid attendance date"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid attendance date",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to create attendance",
    });
  }
};

// ==========================================
// UPDATE ATTENDANCE
// ==========================================

export const editAttendance = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(
      req.params.id
    );

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid attendance ID",
      });
    }

    const {
      studentId,
      date,
      status,
    } = req.body;

    if (
      studentId === undefined ||
      !date ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentId, date and status are required",
      });
    }

    const numericStudentId =
      Number(studentId);

    if (
      !Number.isInteger(
        numericStudentId
      ) ||
      numericStudentId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid student ID",
      });
    }

    const attendance =
      await updateAttendance(
        id,
        {
          studentId:
            numericStudentId,
          date,
          status,
        }
      );

    return res.json({
      success: true,
      message:
        "Attendance updated successfully",
      data: attendance,
    });
  } catch (error: any) {
    console.error(
      "Error updating attendance:",
      error
    );

    if (
      error?.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Attendance has already been recorded for this student on this date.",
      });
    }

    if (
      error?.code === "P2025"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Attendance record not found",
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "Student not found"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found",
      });
    }

    if (
      error instanceof Error &&
      error.message.startsWith(
        "Invalid attendance status"
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "Invalid attendance date"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid attendance date",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to update attendance",
    });
  }
};

// ==========================================
// DELETE ATTENDANCE
// ==========================================

export const removeAttendance =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const id = Number(
        req.params.id
      );

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid attendance ID",
        });
      }

      await deleteAttendance(id);

      return res.json({
        success: true,
        message:
          "Attendance deleted successfully",
      });
    } catch (error: any) {
      console.error(
        "Error deleting attendance:",
        error
      );

      if (
        error?.code === "P2025"
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Attendance record not found",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete attendance",
      });
    }
  };