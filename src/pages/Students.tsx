import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import StudentTable from "../components/StudentTable";
import AddStudentModal from "../components/AddStudentModal";
import { students as initialStudents } from "../data/students";

type Student = {
  id: number;
  name: string;
  class: string;
  age: number;
  status: string;
};

function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleSave = (student: Student) => {
    if (selectedStudent) {
      // Edit existing student
      setStudents((prev) =>
        prev.map((s) => (s.id === student.id ? student : s))
      );
    } else {
      // Add new student
      setStudents((prev) => [...prev, student]);
    }

    setSelectedStudent(null);
    setIsOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents((prev) => prev.filter((student) => student.id !== id));
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setSelectedStudent(null);
    setIsOpen(true);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Students</h1>
          <p className="text-gray-500 mt-2">
            Manage all students in your school.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Student
        </button>
      </div>

      <StudentTable
        students={students}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <AddStudentModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelectedStudent(null);
        }}
        onSave={handleSave}
        student={selectedStudent}
      />
    </MainLayout>
  );
}

export default Students;