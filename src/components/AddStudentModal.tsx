import { useEffect, useState } from "react";

export interface Student {
  id: number;
  name: string;
  class: string;
  age: number;
  status: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  student: Student | null;
};

function AddStudentModal({
  isOpen,
  onClose,
  onSave,
  student,
}: Props) {
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] =
    useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState("Active");

  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD STUDENT DATA WHEN EDITING
  // ==========================================

  useEffect(() => {
    if (student) {
      setName(student.name);
      setStudentClass(student.class);
      setAge(String(student.age));
      setStatus(student.status || "Active");
    } else {
      setName("");
      setStudentClass("");
      setAge("");
      setStatus("Active");
    }
  }, [student, isOpen]);

  // ==========================================
  // DON'T DISPLAY MODAL WHEN CLOSED
  // ==========================================

  if (!isOpen) {
    return null;
  }

  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // Validate name
    if (!name.trim()) {
      alert("Please enter the student's name.");
      return;
    }

    // Validate class
    if (!studentClass.trim()) {
      alert("Please enter the student's class.");
      return;
    }

    // Validate age
    if (!age) {
      alert("Please enter the student's age.");
      return;
    }

    const numericAge = Number(age);

    if (
      !Number.isInteger(numericAge) ||
      numericAge <= 0
    ) {
      alert("Please enter a valid age.");
      return;
    }

    setSaving(true);

    try {
      const studentData: Student = {
        id: student?.id ?? 0,
        name: name.trim(),
        class: studentClass.trim(),
        age: numericAge,
        status,
      };

      await onSave(studentData);
    } catch (error) {
      console.error(
        "Error saving student:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex items-center justify-between p-6 border-b">

          <div>

            <h2 className="text-2xl font-bold">
              {student
                ? "Edit Student"
                : "Add Student"}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {student
                ? "Update student information."
                : "Enter the student's information."}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-gray-500 hover:text-gray-800 text-2xl disabled:opacity-50"
          >
            ×
          </button>

        </div>

        {/* ======================================
            FORM
        ====================================== */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* NAME */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. Alice Smith"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            />

          </div>

          {/* CLASS */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class
            </label>

            <input
              type="text"
              value={studentClass}
              onChange={(e) =>
                setStudentClass(e.target.value)
              }
              placeholder="e.g. Form 5A"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            />

          </div>

          {/* AGE */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>

            <input
              type="number"
              min="1"
              max="100"
              value={age}
              onChange={(e) =>
                setAge(e.target.value)
              }
              placeholder="e.g. 17"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            />

          </div>

          {/* STATUS */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            >

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

              <option value="Graduated">
                Graduated
              </option>

            </select>

          </div>

          {/* ======================================
              BUTTONS
          ====================================== */}

          <div className="flex justify-end gap-3 pt-4 border-t">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : student
                ? "Update Student"
                : "Add Student"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddStudentModal;