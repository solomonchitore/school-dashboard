import { prisma } from "../config/prisma";

export const getAllStudents = async () => {
  return await prisma.student.findMany({
    orderBy: {
      id: "desc",
    },
  });
};

export const getStudentById = async (id: number) => {
  return await prisma.student.findUnique({
    where: {
      id,
    },
  });
};

export const createStudent = async (data: {
  name: string;
  class: string;
  age: number;
  status: string;
}) => {
  return await prisma.student.create({
    data: {
      name: data.name,
      class: data.class,
      age: data.age,
      status: data.status,
    },
  });
};

export const updateStudent = async (
  id: number,
  data: {
    name: string;
    class: string;
    age: number;
    status: string;
  }
) => {
  return await prisma.student.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      class: data.class,
      age: data.age,
      status: data.status,
    },
  });
};

export const deleteStudent = async (id: number) => {
  return await prisma.student.delete({
    where: {
      id,
    },
  });
};