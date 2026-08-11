import { useState } from "react";
import { Eye, Pencil, Trash2, X } from "lucide-react";

export interface Student {
  id: number;
  name: string;
  class: string;
  age: number;
  status: string;
}

type Props = {
  students: Student[];
  onDelete: (id: number) => void;
  onEdit: (student: Student) => void;
};

function StudentTable({
  students,
  onDelete,
  onEdit,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredStudents = students.filter(
    (student) => {
      const searchText = search.toLowerCase();

      return (
        student.name
          .toLowerCase()
          .includes(searchText) ||
        student.class
          .toLowerCase()
          .includes(searchText) ||
        String(student.age).includes(searchText) ||
        student.status
          .toLowerCase()
          .includes(searchText)
      );
    }
  );

  // ==========================================
  // VIEW STUDENT
  // ==========================================

  const handleView = (student: Student) => {
    setSelectedStudent(student);
  };

  // ==========================================
  // CLOSE VIEW
  // ==========================================

  const handleCloseView = () => {
    setSelectedStudent(null);
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";

      case "inactive":
        return "bg-red-100 text-red-700";

      case "graduated":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">

      {/* ========================================
          SEARCH
      ======================================== */}

      <div className="mb-6">

        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* ========================================
          TABLE
      ======================================== */}

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
                Class
              </th>

              <th className="text-left p-4">
                Age
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

            {filteredStudents.map(
              (student) => (

                <tr
                  key={student.id}
                  className="border-b hover:bg-gray-50"
                >

                  {/* ID */}

                  <td className="p-4">
                    {student.id}
                  </td>

                  {/* NAME */}

                  <td className="p-4 font-semibold">
                    {student.name}
                  </td>

                  {/* CLASS */}

                  <td className="p-4">
                    {student.class}
                  </td>

                  {/* AGE */}

                  <td className="p-4">
                    {student.age}
                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        student.status
                      )}`}
                    >
                      {student.status}
                    </span>

                  </td>

                  {/* ACTIONS */}

                  <td className="p-4">

                    <div className="flex justify-center gap-4">

                      {/* VIEW */}

                      <button
                        title="View"
                        onClick={() =>
                          handleView(student)
                        }
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <Eye size={20} />
                      </button>

                      {/* EDIT */}

                      <button
                        title="Edit"
                        onClick={() =>
                          onEdit(student)
                        }
                        className="text-yellow-500 hover:text-yellow-700 transition"
                      >
                        <Pencil size={20} />
                      </button>

                      {/* DELETE */}

                      <button
                        title="Delete"
                        onClick={() =>
                          onDelete(student.id)
                        }
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={20} />
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

            {/* ==================================
                NO RESULTS
            ================================== */}

            {filteredStudents.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="text-center p-8 text-gray-500"
                >
                  No students found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* ========================================
          VIEW STUDENT MODAL
      ======================================== */}

      {selectedStudent && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

            {/* HEADER */}

            <div className="flex items-center justify-between p-6 border-b">

              <div>

                <h2 className="text-2xl font-bold">
                  Student Details
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Student information
                </p>

              </div>

              <button
                onClick={handleCloseView}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>

            </div>

            {/* BODY */}

            <div className="p-6 space-y-5">

              {/* NAME */}

              <div>

                <p className="text-sm text-gray-500">
                  Name
                </p>

                <p className="text-lg font-semibold">
                  {selectedStudent.name}
                </p>

              </div>

              {/* CLASS */}

              <div>

                <p className="text-sm text-gray-500">
                  Class
                </p>

                <p className="text-lg font-semibold">
                  {selectedStudent.class}
                </p>

              </div>

              {/* AGE */}

              <div>

                <p className="text-sm text-gray-500">
                  Age
                </p>

                <p className="text-lg font-semibold">
                  {selectedStudent.age}
                </p>

              </div>

              {/* STATUS */}

              <div>

                <p className="text-sm text-gray-500 mb-2">
                  Status
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                    selectedStudent.status
                  )}`}
                >
                  {selectedStudent.status}
                </span>

              </div>

            </div>

            {/* FOOTER */}

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
                  onEdit(selectedStudent);
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Student
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default StudentTable;