import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import StudentTable from "../components/StudentTable";
import AddStudentModal from "../components/AddStudentModal";

export interface Student {
  id: number;
  name: string;
  class: string;
  age: number;
  status: string;
}

const API_URL =
  "http://localhost:5000/api/students";

function Students() {
  const [students, setStudents] =
    useState<Student[]>([]);

  const [isOpen, setIsOpen] =
    useState(false);

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const getUser = () => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error(
        "Failed to read logged-in user:",
        error
      );

      return null;
    }
  };

  const user = getUser();

  const isAdministrator =
    user?.role === "Administrator";

  // ==========================================
  // GET AUTHENTICATION TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // GET ALL STUDENTS
  // ==========================================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError(
          "You are not authenticated. Please login again."
        );
        return;
      }

      const response = await fetch(
        API_URL,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch students"
        );
      }

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to load students"
        );
      }

      setStudents(result.data);
    } catch (error) {
      console.error(
        "Error fetching students:",
        error
      );

      setError(
        "Unable to load students from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD STUDENTS
  // ==========================================

  useEffect(() => {
    fetchStudents();
  }, []);

  // ==========================================
  // ADD / EDIT STUDENT
  // ==========================================

  const handleSave = async (
    student: Student
  ) => {
    // ========================================
    // FRONTEND ROLE PROTECTION
    // ========================================

    if (!isAdministrator) {
      alert(
        "You do not have permission to modify students."
      );

      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert(
          "You are not authenticated. Please login again."
        );

        return;
      }

      const studentData = {
        name: student.name,
        class: student.class,
        age: student.age,
        status: student.status,
      };

      let response: Response;

      // ========================================
      // EDIT STUDENT
      // ========================================

      if (selectedStudent) {
        response = await fetch(
          `${API_URL}/${student.id}`,
          {
            method: "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              studentData
            ),
          }
        );
      }

      // ========================================
      // ADD STUDENT
      // ========================================

      else {
        response = await fetch(
          API_URL,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              studentData
            ),
          }
        );
      }

      // ========================================
      // SESSION EXPIRED
      // ========================================

      if (response.status === 401) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        alert(
          "Your session has expired. Please login again."
        );

        return;
      }

      // ========================================
      // FORBIDDEN
      // ========================================

      if (response.status === 403) {
        alert(
          "You do not have permission to modify students."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to save student"
        );
      }

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to save student"
        );
      }

      await fetchStudents();

      setSelectedStudent(null);
      setIsOpen(false);
    } catch (error) {
      console.error(
        "Error saving student:",
        error
      );

      alert(
        "Failed to save student."
      );
    }
  };

  // ==========================================
  // DELETE STUDENT
  // ==========================================

  const handleDelete = async (
    id: number
  ) => {
    // ========================================
    // FRONTEND ROLE PROTECTION
    // ========================================

    if (!isAdministrator) {
      alert(
        "You do not have permission to delete students."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        alert(
          "You are not authenticated. Please login again."
        );

        return;
      }

      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      // ========================================
      // SESSION EXPIRED
      // ========================================

      if (response.status === 401) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        alert(
          "Your session has expired. Please login again."
        );

        return;
      }

      // ========================================
      // FORBIDDEN
      // ========================================

      if (response.status === 403) {
        alert(
          "You do not have permission to delete students."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to delete student"
        );
      }

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to delete student"
        );
      }

      await fetchStudents();
    } catch (error) {
      console.error(
        "Error deleting student:",
        error
      );

      alert(
        "Failed to delete student."
      );
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (
    student: Student
  ) => {
    if (!isAdministrator) {
      return;
    }

    setSelectedStudent(student);
    setIsOpen(true);
  };

  // ==========================================
  // ADD
  // ==========================================

  const handleAdd = () => {
    if (!isAdministrator) {
      return;
    }

    setSelectedStudent(null);
    setIsOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleClose = () => {
    setSelectedStudent(null);
    setIsOpen(false);
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <MainLayout>
      <div>
        {/* ====================================
            HEADER
        ===================================== */}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Students
            </h1>

            <p className="text-gray-500 mt-2">
              Manage all students in your school.
            </p>
          </div>

          {/* ==================================
              ADMINISTRATOR ONLY
          =================================== */}

          {isAdministrator && (
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              + Add Student
            </button>
          )}
        </div>

        {/* ====================================
            LOADING
        ===================================== */}

        {loading && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            Loading students...
          </div>
        )}

        {/* ====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* ====================================
            TABLE
        ===================================== */}

        {!loading && !error && (
          <StudentTable
            students={students}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isAdministrator={
              isAdministrator
            }
          />
        )}

        {/* ====================================
            MODAL
        ===================================== */}

        {isAdministrator && (
          <AddStudentModal
            isOpen={isOpen}
            onClose={handleClose}
            onSave={handleSave}
            student={selectedStudent}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default Students;