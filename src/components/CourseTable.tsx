import { useState } from "react";
import { Eye, Pencil, Trash2, X } from "lucide-react";

export interface Course {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  status: string;
}

type Props = {
  courses: Course[];
  onDelete: (id: number) => void;
  onEdit: (course: Course) => void;
};

function CourseTable({
  courses,
  onDelete,
  onEdit,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);

  // ==============================
  // SEARCH
  // ==============================

  const filteredCourses = courses.filter((course) => {
    const searchText = search.toLowerCase();

    return (
      course.name.toLowerCase().includes(searchText) ||
      course.code.toLowerCase().includes(searchText) ||
      (course.description || "")
        .toLowerCase()
        .includes(searchText) ||
      course.status.toLowerCase().includes(searchText)
    );
  });

  // ==============================
  // VIEW COURSE
  // ==============================

  const handleView = (course: Course) => {
    setSelectedCourse(course);
  };

  // ==============================
  // CLOSE VIEW MODAL
  // ==============================

  const handleCloseView = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">

      {/* ==============================
          SEARCH
      ============================== */}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search course..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ==============================
          TABLE
      ============================== */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                ID
              </th>

              <th className="text-left p-4">
                Course
              </th>

              <th className="text-left p-4">
                Code
              </th>

              <th className="text-left p-4">
                Description
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-center p-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredCourses.map((course) => (

              <tr
                key={course.id}
                className="border-b hover:bg-gray-50"
              >

                {/* ID */}

                <td className="p-4">
                  {course.id}
                </td>

                {/* COURSE */}

                <td className="p-4 font-semibold">
                  {course.name}
                </td>

                {/* CODE */}

                <td className="p-4">
                  {course.code}
                </td>

                {/* DESCRIPTION */}

                <td className="p-4">
                  {course.description || "—"}
                </td>

                {/* STATUS */}

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      course.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {course.status}
                  </span>

                </td>

                {/* ACTIONS */}

                <td className="p-4">

                  <div className="flex justify-center gap-4">

                    {/* VIEW */}

                    <button
                      title="View"
                      onClick={() =>
                        handleView(course)
                      }
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <Eye size={20} />
                    </button>

                    {/* EDIT */}

                    <button
                      title="Edit"
                      onClick={() =>
                        onEdit(course)
                      }
                      className="text-yellow-500 hover:text-yellow-700 transition"
                    >
                      <Pencil size={20} />
                    </button>

                    {/* DELETE */}

                    <button
                      title="Delete"
                      onClick={() =>
                        onDelete(course.id)
                      }
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

            {/* NO RESULTS */}

            {filteredCourses.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="text-center p-8 text-gray-500"
                >
                  No courses found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* ==============================
          VIEW COURSE MODAL
      ============================== */}

      {selectedCourse && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-6 border-b">

              <h2 className="text-2xl font-bold">
                Course Details
              </h2>

              <button
                onClick={handleCloseView}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="p-6 space-y-5">

              {/* COURSE NAME */}

              <div>

                <p className="text-sm text-gray-500">
                  Course Name
                </p>

                <p className="text-lg font-semibold">
                  {selectedCourse.name}
                </p>

              </div>

              {/* COURSE CODE */}

              <div>

                <p className="text-sm text-gray-500">
                  Course Code
                </p>

                <p className="text-lg font-semibold">
                  {selectedCourse.code}
                </p>

              </div>

              {/* DESCRIPTION */}

              <div>

                <p className="text-sm text-gray-500">
                  Description
                </p>

                <p className="text-lg">
                  {selectedCourse.description ||
                    "No description provided"}
                </p>

              </div>

              {/* STATUS */}

              <div>

                <p className="text-sm text-gray-500 mb-2">
                  Status
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCourse.status ===
                    "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedCourse.status}
                </span>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="flex justify-end gap-3 p-6 border-t">

              <button
                onClick={handleCloseView}
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>

              <button
                onClick={() => {
                  handleCloseView();
                  onEdit(selectedCourse);
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Course
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default CourseTable;