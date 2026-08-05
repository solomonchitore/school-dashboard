import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Teacher } from "./AddTeacherModal";

type Props = {
  teachers: Teacher[];
  onDelete: (id: number) => void;
  onEdit: (teacher: Teacher) => void;
};

function TeacherTable({
  teachers,
  onDelete,
  onEdit,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      teacher.subject
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      teacher.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      {/* Search */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table */}
      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">Teacher</th>
            <th className="text-left p-4">Subject</th>
            <th className="text-left p-4">Email</th>
            <th className="text-left p-4">Phone</th>
            <th className="text-left p-4">Status</th>
            <th className="text-center p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredTeachers.map((teacher) => (
            <tr
              key={teacher.id}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-4">{teacher.id}</td>

              <td className="p-4 font-semibold">
                {teacher.name}
              </td>

              <td className="p-4">
                {teacher.subject}
              </td>

              <td className="p-4">
                {teacher.email}
              </td>

              <td className="p-4">
                {teacher.phone}
              </td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    teacher.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {teacher.status}
                </span>
              </td>

              <td className="p-4">
                <div className="flex justify-center gap-4">

                  <button
                    title="View"
                    onClick={() =>
                      alert(
                        JSON.stringify(
                          teacher,
                          null,
                          2
                        )
                      )
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye size={20} />
                  </button>

                  <button
                    title="Edit"
                    onClick={() =>
                      onEdit(teacher)
                    }
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <Pencil size={20} />
                  </button>

                  <button
                    title="Delete"
                    onClick={() =>
                      onDelete(teacher.id)
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>

                </div>
              </td>

            </tr>
          ))}

          {filteredTeachers.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="text-center p-8 text-gray-500"
              >
                No teachers found.
              </td>
            </tr>
          )}
        </tbody>

      </table>

    </div>
  );
}

export default TeacherTable;