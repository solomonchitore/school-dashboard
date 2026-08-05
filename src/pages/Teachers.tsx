import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import TeacherTable from "../components/TeacherTable";
import AddTeacherModal, {
  Teacher,
} from "../components/AddTeacherModal";
import { teachers as initialTeachers } from "../data/teachers";

function Teachers() {
  const [teachers, setTeachers] =
    useState<Teacher[]>(initialTeachers);

  const [isOpen, setIsOpen] = useState(false);

  const [selectedTeacher, setSelectedTeacher] =
    useState<Teacher | null>(null);

  const handleSave = (teacher: Teacher) => {
    if (selectedTeacher) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === teacher.id ? teacher : t
        )
      );
    } else {
      setTeachers((prev) => [
        ...prev,
        teacher,
      ]);
    }

    setSelectedTeacher(null);
    setIsOpen(false);
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this teacher?"
      )
    ) {
      setTeachers((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsOpen(true);
  };

  const handleAdd = () => {
    setSelectedTeacher(null);
    setIsOpen(true);
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Teachers
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all teachers in your school.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          + Add Teacher
        </button>
      </div>

      <TeacherTable
        teachers={teachers}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <AddTeacherModal
        isOpen={isOpen}
        onClose={() => {
          setSelectedTeacher(null);
          setIsOpen(false);
        }}
        onSave={handleSave}
        teacher={selectedTeacher}
      />
    </MainLayout>
  );
}

export default Teachers;