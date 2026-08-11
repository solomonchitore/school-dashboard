import { Request, Response } from "express";

import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/course.service";

// GET /api/courses
export const getCourses = async (
  req: Request,
  res: Response
) => {
  try {
    const courses = await getAllCourses();

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

// GET /api/courses/:id
export const getCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await getCourseById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};

// POST /api/courses
export const addCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      code,
      description,
      status,
    } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Course name and code are required",
      });
    }

    const course = await createCourse({
      name,
      code,
      description,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error: any) {
    console.error("Error creating course:", error);

    // Prisma unique constraint
    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A course with this code already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

// PUT /api/courses/:id
export const editCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const {
      name,
      code,
      description,
      status,
    } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Course name and code are required",
      });
    }

    const course = await updateCourse(id, {
      name,
      code,
      description,
      status,
    });

    res.json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error: any) {
    console.error("Error updating course:", error);

    if (error?.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A course with this code already exists",
      });
    }

    if (error?.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

// DELETE /api/courses/:id
export const removeCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    await deleteCourse(id);

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting course:", error);

    if (error?.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};