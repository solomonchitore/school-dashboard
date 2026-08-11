import { useEffect, useState } from "react";

export interface Course {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  status: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Course) => void;
  course: Course | null;
};

function AddCourseModal({
  isOpen,
  onClose,
  onSave,
  course,
}: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");

  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD COURSE WHEN EDITING
  // ==========================================

  useEffect(() => {
    if (course) {
      setName(course.name);
      setCode(course.code);
      setDescription(course.description || "");
      setStatus(course.status || "Active");
    } else {
      setName("");
      setCode("");
      setDescription("");
      setStatus("Active");
    }
  }, [course, isOpen]);

  // ==========================================
  // DON'T RENDER WHEN CLOSED
  // ==========================================

  if (!isOpen) {
    return null;
  }

  // ==========================================
  // SAVE
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a course name.");
      return;
    }

    if (!code.trim()) {
      alert("Please enter a course code.");
      return;
    }

    setSaving(true);

    try {
      const courseData: Course = {
        id: course?.id ?? 0,
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        status,
      };

      await onSave(courseData);
    } catch (error) {
      console.error("Error saving course:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

        {/* ==============================
            HEADER
        ============================== */}

        <div className="flex items-center justify-between p-6 border-b">

          <div>
            <h2 className="text-2xl font-bold">
              {course
                ? "Edit Course"
                : "Add Course"}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {course
                ? "Update course information."
                : "Enter the details for the new course."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>

        </div>

        {/* ==============================
            FORM
        ============================== */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* COURSE NAME */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. Computer Engineering"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* COURSE CODE */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Code
            </label>

            <input
              type="text"
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
              placeholder="e.g. CENG101"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Enter course description..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* ==============================
              BUTTONS
          ============================== */}

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
                : course
                ? "Update Course"
                : "Add Course"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddCourseModal;