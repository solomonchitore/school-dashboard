import { useState, useEffect } from "react";

type Student = {
  id: number;
  name: string;
  class: string;
  age: number;
  status: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  student?: Student | null;
};

function AddStudentModal({
  isOpen,
  onClose,
  onSave,
  student,
}: Props) {
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (student) {
      setName(student.name);
      setStudentClass(student.class);
      setAge(student.age.toString());
      setStatus(student.status);
    } else {
      setName("");
      setStudentClass("");
      setAge("");
      setStatus("Active");
    }
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name || !studentClass || !age) return;

    onSave({
      id: student ? student.id : Date.now(),
      name,
      class: studentClass,
      age: Number(age),
      status,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[500px] p-6">

        <h2 className="text-2xl font-bold mb-6">
          {student ? "Edit Student" : "Add Student"}
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            placeholder="Class"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="border px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {student ? "Save Changes" : "Add Student"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default AddStudentModal;