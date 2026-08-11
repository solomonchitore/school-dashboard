import { Request, Response } from "express";

import {
  getAllGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
} from "../services/grade.service";

// ==========================================
// GET ALL GRADES
// ==========================================

export const getGrades = async (
  req: Request,
  res: Response
) => {
  try {
    const grades = await getAllGrades();

    return res.status(200).json({
      success: true,
      data: grades,
    });
  } catch (error) {
    console.error("Error fetching grades:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch grades",
    });
  }
};

// ==========================================
// GET GRADE BY ID
// ==========================================

export const getGrade = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid grade ID",
      });
    }

    const grade = await getGradeById(id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: "Grade not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: grade,
    });
  } catch (error) {
    console.error("Error fetching grade:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch grade",
    });
  }
};

// ==========================================
// CREATE GRADE
// ==========================================

export const addGrade = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      studentId,
      courseId,
      assessment,
      mark,
    } = req.body;

    if (
      studentId === undefined ||
      courseId === undefined ||
      !assessment ||
      mark === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentId, courseId, assessment and mark are required",
      });
    }

    const numericStudentId = Number(studentId);
    const numericCourseId = Number(courseId);
    const numericMark = Number(mark);

    if (
      !Number.isInteger(numericStudentId) ||
      !Number.isInteger(numericCourseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid student or course ID",
      });
    }

    if (
      isNaN(numericMark) ||
      numericMark < 0 ||
      numericMark > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Mark must be between 0 and 100",
      });
    }

    const grade = await createGrade({
      studentId: numericStudentId,
      courseId: numericCourseId,
      assessment: assessment.trim(),
      mark: numericMark,
    });

    return res.status(201).json({
      success: true,
      message: "Grade created successfully",
      data: grade,
    });
  } catch (error: any) {
    console.error("Error creating grade:", error);

    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message:
          "This assessment already exists for this student and course",
      });
    }

    if (error?.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Student or course does not exist",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create grade",
    });
  }
};

// ==========================================
// UPDATE GRADE
// ==========================================

export const editGrade = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid grade ID",
      });
    }

    const {
      studentId,
      courseId,
      assessment,
      mark,
    } = req.body;

    if (
      studentId === undefined ||
      courseId === undefined ||
      !assessment ||
      mark === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "studentId, courseId, assessment and mark are required",
      });
    }

    const numericStudentId = Number(studentId);
    const numericCourseId = Number(courseId);
    const numericMark = Number(mark);

    if (
      !Number.isInteger(numericStudentId) ||
      !Number.isInteger(numericCourseId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid student or course ID",
      });
    }

    if (
      isNaN(numericMark) ||
      numericMark < 0 ||
      numericMark > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Mark must be between 0 and 100",
      });
    }

    const grade = await updateGrade(id, {
      studentId: numericStudentId,
      courseId: numericCourseId,
      assessment: assessment.trim(),
      mark: numericMark,
    });

    return res.status(200).json({
      success: true,
      message: "Grade updated successfully",
      data: grade,
    });
  } catch (error: any) {
    console.error("Error updating grade:", error);

    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message:
          "This assessment already exists for this student and course",
      });
    }

    if (error?.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Grade not found",
      });
    }

    if (error?.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Student or course does not exist",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update grade",
    });
  }
};

// ==========================================
// DELETE GRADE
// ==========================================

export const removeGrade = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid grade ID",
      });
    }

    await deleteGrade(id);

    return res.status(200).json({
      success: true,
      message: "Grade deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting grade:", error);

    if (error?.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Grade not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete grade",
    });
  }
};