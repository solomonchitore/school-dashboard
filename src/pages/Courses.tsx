import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import CourseTable from "../components/CourseTable";
import AddCourseModal from "../components/AddCourseModal";
import type { Course } from "../components/AddCourseModal";

function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // GET ALL COURSES
  // ==========================================

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        "http://localhost:5000/api/courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    } catch (error) {
      console.error(
        "Error fetching courses:",
        error
      );

      setError(
        "Unable to load courses from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD COURSES
  // ==========================================

  useEffect(() => {
    fetchCourses();
  }, []);

  // ==========================================
  // ADD / EDIT COURSE
  // ==========================================

  const handleSave = async (course: Course) => {
    try {
      const token = getToken();

      let response;

      // ========================================
      // EDIT COURSE
      // ========================================

      if (selectedCourse) {
        response = await fetch(
          `http://localhost:5000/api/courses/${course.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(course),
          }
        );
      }

      // ========================================
      // ADD COURSE
      // ========================================

      else {
        response = await fetch(
          "http://localhost:5000/api/courses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(course),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to save course");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to save course"
        );
      }

      // Reload courses
      await fetchCourses();

      // Close modal
      setSelectedCourse(null);
      setIsOpen(false);
    } catch (error) {
      console.error(
        "Error saving course:",
        error
      );

      alert("Failed to save course.");
    }
  };

  // ==========================================
  // DELETE COURSE
  // ==========================================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `http://localhost:5000/api/courses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete course"
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to delete course"
        );
      }

      // Reload courses
      await fetchCourses();
    } catch (error) {
      console.error(
        "Error deleting course:",
        error
      );

      alert("Failed to delete course.");
    }
  };

  // ==========================================
  // EDIT COURSE
  // ==========================================

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsOpen(true);
  };

  // ==========================================
  // ADD COURSE
  // ==========================================

  const handleAdd = () => {
    setSelectedCourse(null);
    setIsOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedCourse(null);
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <MainLayout>
      <div>
        {/* PAGE HEADER */}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Courses
            </h1>

            <p className="text-gray-500 mt-2">
              Manage all courses in your school.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Course
          </button>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">
              Loading courses...
            </p>
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* COURSE TABLE */}

        {!loading && !error && (
          <CourseTable
            courses={courses}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}

        {/* ADD / EDIT MODAL */}

        <AddCourseModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          course={selectedCourse}
        />
      </div>
    </MainLayout>
  );
}

export default Courses;
