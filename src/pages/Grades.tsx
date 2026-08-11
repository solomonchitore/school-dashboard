import { useEffect, useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  X,
  Plus,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";

// ==========================================
// TYPES
// ==========================================

interface Student {
  id: number;
  name: string;
  class: string;
}

interface Course {
  id: number;
  name: string;
  code: string;
}

interface Grade {
  id: number;
  studentId: number;
  courseId: number;
  assessment: string;
  mark: number;
  grade: string;
  createdAt: string;
  updatedAt: string;
  student: Student;
  course: Course;
}

// ==========================================
// API
// ==========================================

const API_URL = "http://localhost:5000/api";

// ==========================================
// COMPONENT
// ==========================================

function Grades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const [selectedGrade, setSelectedGrade] =
    useState<Grade | null>(null);

  const [viewGrade, setViewGrade] =
    useState<Grade | null>(null);

  // ==========================================
  // FORM
  // ==========================================

  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [assessment, setAssessment] = useState("");
  const [mark, setMark] = useState("");

  const [saving, setSaving] = useState(false);

  // ==========================================
  // TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // HANDLE AUTH ERROR
  // ==========================================

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // ==========================================
  // FETCH GRADES
  // ==========================================

  const fetchGrades = async () => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    const response = await fetch(
      `${API_URL}/grades`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch grades");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.message || "Failed to load grades"
      );
    }

    setGrades(result.data);
  };

  // ==========================================
  // FETCH STUDENTS
  // ==========================================

  const fetchStudents = async () => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    const response = await fetch(
      `${API_URL}/students`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.message || "Failed to load students"
      );
    }

    setStudents(result.data);
  };

  // ==========================================
  // FETCH COURSES
  // ==========================================

  const fetchCourses = async () => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    const response = await fetch(
      `${API_URL}/courses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.message || "Failed to load courses"
      );
    }

    setCourses(result.data);
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchGrades(),
        fetchStudents(),
        fetchCourses(),
      ]);
    } catch (error) {
      console.error(
        "Error loading grades:",
        error
      );

      setError(
        "Unable to load grades from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const handleAdd = () => {
    setSelectedGrade(null);

    setStudentId("");
    setCourseId("");
    setAssessment("");
    setMark("");

    setIsOpen(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEdit = (grade: Grade) => {
    setSelectedGrade(grade);

    setStudentId(String(grade.studentId));
    setCourseId(String(grade.courseId));
    setAssessment(grade.assessment);
    setMark(String(grade.mark));

    setIsOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleClose = () => {
    setIsOpen(false);
    setSelectedGrade(null);

    setStudentId("");
    setCourseId("");
    setAssessment("");
    setMark("");
  };

  // ==========================================
  // SAVE GRADE
  // ==========================================

  const handleSave = async () => {
    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      if (
        !studentId ||
        !courseId ||
        !assessment.trim() ||
        mark === ""
      ) {
        alert(
          "Student, course, assessment and mark are required."
        );
        return;
      }

      const numericMark = Number(mark);

      if (
        Number.isNaN(numericMark) ||
        numericMark < 0 ||
        numericMark > 100
      ) {
        alert(
          "Mark must be between 0 and 100."
        );
        return;
      }

      setSaving(true);

      const data = {
        studentId: Number(studentId),
        courseId: Number(courseId),
        assessment: assessment.trim(),
        mark: numericMark,
      };

      let response: Response;

      if (selectedGrade) {
        response = await fetch(
          `${API_URL}/grades/${selectedGrade.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(data),
          }
        );
      } else {
        response = await fetch(
          `${API_URL}/grades`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(data),
          }
        );
      }

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to save grade"
        );
      }

      await fetchGrades();

      handleClose();
    } catch (error) {
      console.error(
        "Error saving grade:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save grade."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE GRADE
  // ==========================================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this grade?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(
        `${API_URL}/grades/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete grade"
        );
      }

      await fetchGrades();
    } catch (error) {
      console.error(
        "Error deleting grade:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete grade."
      );
    }
  };

  // ==========================================
  // FILTER
  // ==========================================

  const filteredGrades = grades.filter(
    (grade) => {
      const searchText =
        search.toLowerCase();

      return (
        grade.student.name
          .toLowerCase()
          .includes(searchText) ||
        grade.course.name
          .toLowerCase()
          .includes(searchText) ||
        grade.course.code
          .toLowerCase()
          .includes(searchText) ||
        grade.assessment
          .toLowerCase()
          .includes(searchText) ||
        grade.grade
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  // ==========================================
  // GRADE STYLE
  // ==========================================

  const getGradeStyle = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-700";

      case "B":
        return "bg-blue-100 text-blue-700";

      case "C":
        return "bg-yellow-100 text-yellow-700";

      case "D":
        return "bg-orange-100 text-orange-700";

      case "E":
        return "bg-purple-100 text-purple-700";

      case "F":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <MainLayout>
      <div>
        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Grades
            </h1>

            <p className="text-gray-500 mt-2">
              Manage student academic performance.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Add Grade
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* SEARCH */}

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search student, course, assessment or grade..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            Loading grades...
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4">
                      ID
                    </th>

                    <th className="text-left p-4">
                      Student
                    </th>

                    <th className="text-left p-4">
                      Course
                    </th>

                    <th className="text-left p-4">
                      Assessment
                    </th>

                    <th className="text-left p-4">
                      Mark
                    </th>

                    <th className="text-left p-4">
                      Grade
                    </th>

                    <th className="text-center p-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredGrades.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-4">
                          {item.id}
                        </td>

                        <td className="p-4 font-semibold">
                          {item.student.name}
                        </td>

                        <td className="p-4">
                          <div>
                            <p className="font-medium">
                              {item.course.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {item.course.code}
                            </p>
                          </div>
                        </td>

                        <td className="p-4">
                          {item.assessment}
                        </td>

                        <td className="p-4 font-semibold">
                          {item.mark}%
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getGradeStyle(
                              item.grade
                            )}`}
                          >
                            {item.grade}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex justify-center gap-4">
                            <button
                              title="View Grade"
                              onClick={() =>
                                setViewGrade(
                                  item
                                )
                              }
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye size={20} />
                            </button>

                            <button
                              title="Edit Grade"
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                              className="text-yellow-500 hover:text-yellow-700"
                            >
                              <Pencil
                                size={20}
                              />
                            </button>

                            <button
                              title="Delete Grade"
                              onClick={() =>
                                handleDelete(
                                  item.id
                                )
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2
                                size={20}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                  {filteredGrades.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center p-10 text-gray-500"
                      >
                        No grades found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =====================================
            ADD / EDIT MODAL
        ===================================== */}

        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
              {/* HEADER */}

              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedGrade
                      ? "Edit Grade"
                      : "Add Grade"}
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Enter student assessment results.
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              {/* FORM */}

              <div className="p-6 space-y-5">
                {/* STUDENT */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Student
                  </label>

                  <select
                    value={studentId}
                    onChange={(e) =>
                      setStudentId(
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Select student
                    </option>

                    {students.map(
                      (student) => (
                        <option
                          key={student.id}
                          value={student.id}
                        >
                          {student.name} —{" "}
                          {student.class}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* COURSE */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Course
                  </label>

                  <select
                    value={courseId}
                    onChange={(e) =>
                      setCourseId(
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Select course
                    </option>

                    {courses.map(
                      (course) => (
                        <option
                          key={course.id}
                          value={course.id}
                        >
                          {course.name} (
                          {course.code})
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* ASSESSMENT */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Assessment
                  </label>

                  <input
                    type="text"
                    value={assessment}
                    onChange={(e) =>
                      setAssessment(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Midterm, Final Exam, Assignment 1"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* MARK */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mark
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={mark}
                    onChange={(e) =>
                      setMark(e.target.value)
                    }
                    placeholder="0 - 100"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {mark !== "" && (
                    <p className="text-sm text-gray-500 mt-2">
                      Grade will be calculated automatically.
                    </p>
                  )}
                </div>
              </div>

              {/* FOOTER */}

              <div className="flex justify-end gap-3 p-6 border-t">
                <button
                  onClick={handleClose}
                  disabled={saving}
                  className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : selectedGrade
                    ? "Update Grade"
                    : "Save Grade"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================
            VIEW MODAL
        ===================================== */}

        {viewGrade && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold">
                    Grade Details
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Academic performance
                  </p>
                </div>

                <button
                  onClick={() =>
                    setViewGrade(null)
                  }
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <p className="text-sm text-gray-500">
                    Student
                  </p>

                  <p className="text-lg font-semibold">
                    {viewGrade.student.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Course
                  </p>

                  <p className="text-lg font-semibold">
                    {viewGrade.course.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {viewGrade.course.code}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Assessment
                  </p>

                  <p className="text-lg font-semibold">
                    {viewGrade.assessment}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Mark
                  </p>

                  <p className="text-2xl font-bold">
                    {viewGrade.mark}%
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Grade
                  </p>

                  <span
                    className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${getGradeStyle(
                      viewGrade.grade
                    )}`}
                  >
                    {viewGrade.grade}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t">
                <button
                  onClick={() =>
                    setViewGrade(null)
                  }
                  className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    const grade =
                      viewGrade;

                    setViewGrade(null);
                    handleEdit(grade);
                  }}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Grade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Grades;