import { Request, Response } from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../services/student.service";

export const getStudents = async (
  _req: Request,
  res: Response
) => {
  try {
    const students = await getAllStudents();

    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

export const getStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await getStudentById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
    });
  }
};

export const addStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, class: studentClass, age, status } = req.body;

    if (
      !name ||
      !studentClass ||
      age === undefined ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const student = await createStudent({
      name,
      class: studentClass,
      age: Number(age),
      status,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error creating student:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create student",
    });
  }
};

export const editStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const { name, class: studentClass, age, status } = req.body;

    if (
      !name ||
      !studentClass ||
      age === undefined ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const student = await updateStudent(id, {
      name,
      class: studentClass,
      age: Number(age),
      status,
    });

    res.json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error updating student:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update student",
    });
  }
};

export const removeStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    await deleteStudent(id);

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete student",
    });
  }
};