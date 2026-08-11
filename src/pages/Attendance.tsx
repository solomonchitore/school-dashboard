
import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

interface Student {
  id: number;
  name: string;
  class: string;
  age: number;
  status: string;
}

interface AttendanceRecord {
  id: number;
  studentId: number;
  date: string;
  status: string;
  student?: Student;
}

function Attendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<AttendanceRecord | null>(null);

  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");

  // ==========================================
  // GET AUTH TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // FETCH ATTENDANCE
  // ==========================================

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/attendance",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch attendance");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to load attendance"
        );
      }

      setAttendance(result.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);

      setError(
        "Unable to load attendance from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH STUDENTS
  // ==========================================

  const fetchStudents = async () => {
    try {
      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/students",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
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
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    fetchAttendance();
    fetchStudents();
  }, []);

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const handleAdd = () => {
    setEditingRecord(null);

    setStudentId("");
    setDate(new Date().toISOString().split("T")[0]);
    setStatus("Present");

    setIsOpen(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);

    setStudentId(String(record.studentId));

    setDate(
      new Date(record.date)
        .toISOString()
        .split("T")[0]
    );

    setStatus(record.status);

    setIsOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleClose = () => {
    setIsOpen(false);
    setEditingRecord(null);

    setStudentId("");
    setDate("");
    setStatus("Present");
  };

  // ==========================================
  // ADD / EDIT ATTENDANCE
  // ==========================================

  const handleSave = async () => {
    if (!studentId || !date || !status) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const attendanceData = {
        studentId: Number(studentId),
        date,
        status,
      };

      let response;

      // ======================================
      // EDIT
      // ======================================

      if (editingRecord) {
        response = await fetch(
          `http://localhost:5000/api/attendance/${editingRecord.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(attendanceData),
          }
        );
      }

      // ======================================
      // ADD
      // ======================================

      else {
        response = await fetch(
          "http://localhost:5000/api/attendance",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(attendanceData),
          }
        );
      }

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          editingRecord
            ? "Failed to update attendance"
            : "Failed to create attendance"
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to save attendance"
        );
      }

      // Reload attendance
      await fetchAttendance();

      handleClose();

    } catch (error) {
      console.error(
        "Error saving attendance:",
        error
      );

      alert("Failed to save attendance.");
    }
  };

  // ==========================================
  // DELETE ATTENDANCE
  // ==========================================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/attendance/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to delete attendance"
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to delete attendance"
        );
      }

      await fetchAttendance();

    } catch (error) {
      console.error(
        "Error deleting attendance:",
        error
      );

      alert("Failed to delete attendance.");
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-700";

      case "absent":
        return "bg-red-100 text-red-700";

      case "late":
        return "bg-yellow-100 text-yellow-700";

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

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Attendance
            </h1>

            <p className="text-gray-500 mt-2">
              Manage student attendance records.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Attendance
          </button>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* ======================================
            LOADING
        ====================================== */}

        {loading ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            Loading attendance...
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            {/* ==================================
                TABLE
            ================================== */}

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="text-left px-6 py-4">
                      ID
                    </th>

                    <th className="text-left px-6 py-4">
                      Student
                    </th>

                    <th className="text-left px-6 py-4">
                      Class
                    </th>

                    <th className="text-left px-6 py-4">
                      Date
                    </th>

                    <th className="text-left px-6 py-4">
                      Status
                    </th>

                    <th className="text-left px-6 py-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {attendance.length === 0 ? (

                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-10 text-gray-500"
                      >
                        No attendance records found.
                      </td>
                    </tr>

                  ) : (

                    attendance.map((record) => (

                      <tr
                        key={record.id}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="px-6 py-4">
                          {record.id}
                        </td>

                        <td className="px-6 py-4 font-medium">
                          {record.student?.name ||
                            "Unknown Student"}
                        </td>

                        <td className="px-6 py-4">
                          {record.student?.class ||
                            "-"}
                        </td>

                        <td className="px-6 py-4">
                          {formatDate(record.date)}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>

                        </td>

                        <td className="px-6 py-4">

                          <div className="flex gap-3">

                            <button
                              onClick={() =>
                                handleEdit(record)
                              }
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(record.id)
                              }
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* ======================================
            ADD / EDIT MODAL
        ====================================== */}

        {isOpen && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-bold">
                  {editingRecord
                    ? "Edit Attendance"
                    : "Add Attendance"}
                </h2>

                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ×
                </button>

              </div>

              {/* STUDENT */}

              <div className="mb-4">

                <label className="block text-sm font-medium mb-2">
                  Student
                </label>

                <select
                  value={studentId}
                  onChange={(e) =>
                    setStudentId(e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select student
                  </option>

                  {students.map((student) => (

                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.name} -{" "}
                      {student.class}
                    </option>

                  ))}

                </select>

              </div>

              {/* DATE */}

              <div className="mb-4">

                <label className="block text-sm font-medium mb-2">
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              {/* STATUS */}

              <div className="mb-6">

                <label className="block text-sm font-medium mb-2">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="Present">
                    Present
                  </option>

                  <option value="Absent">
                    Absent
                  </option>

                  <option value="Late">
                    Late
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3">

                <button
                  onClick={handleClose}
                  className="px-5 py-3 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingRecord
                    ? "Update Attendance"
                    : "Save Attendance"}
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </MainLayout>
  );
}

export default Attendance;