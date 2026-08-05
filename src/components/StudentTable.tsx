import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

type Student = {
  id: number;
  name: string;
  class: string;
  age: number;
  status: string;
};

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

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">Name</th>
            <th className="text-left p-4">Class</th>
            <th className="text-left p-4">Age</th>
            <th className="text-left p-4">Status</th>
            <th className="text-center p-4">Actions</th>
          </tr>
        </thead>

        <tbody>

          {filteredStudents.map((student) => (

            <tr
              key={student.id}
              className="border-b hover:bg-gray-50 transition"
            >

              <td className="p-4">{student.id}</td>

              <td className="p-4 font-medium">
                {student.name}
              </td>

              <td className="p-4">
                {student.class}
              </td>

              <td className="p-4">
                {student.age}
              </td>

              <td className="p-4">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    student.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {student.status}
                </span>

              </td>

              <td className="p-4">

                <div className="flex justify-center gap-4">

                  <button
                    onClick={() => alert(JSON.stringify(student, null, 2))}
                    className="text-blue-500 hover:text-blue-700"
                    title="View Student"
                  >
                    <Eye size={20} />
                  </button>

                  <button
                    onClick={() => onEdit(student)}
                    className="text-yellow-500 hover:text-yellow-700"
                    title="Edit Student"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    onClick={() => onDelete(student.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Student"
                  >
                    <Trash2 size={20} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

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
  );
}

export default StudentTable;