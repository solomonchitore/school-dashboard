import { useEffect, useState } from "react";

import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  UserPlus,
  PlusCircle,
  CalendarCheck,
  RefreshCw,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// ==========================================
// TYPES
// ==========================================

interface Student {
  id: number;
  name: string;
  class: string;
  age: number;
  status: string;
}

interface Teacher {
  id: number;
  name: string;
  subject: string;
  email: string;
  phone?: string;
  status: string;
}

interface Course {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  status: string;
}

interface AttendanceRecord {
  id: number;
  studentId: number;
  date: string;
  status: string;
  student?: Student;
}

interface MonthlyAttendance {
  month: string;
  attendance: number;
}

// ==========================================
// DASHBOARD
// ==========================================

function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET AUTH TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // GET CURRENT USER ROLE
  // ==========================================

  const getUserRole = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return "Administrator";
    }

    try {
      const user = JSON.parse(storedUser);

      return user.role || "Administrator";
    } catch (error) {
      console.error(
        "Error reading logged-in user:",
        error
      );

      return "Administrator";
    }
  };

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async (
    showRefresh = false
  ) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      // ========================================
      // TOKEN
      // ========================================

      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      // ========================================
      // USER ROLE
      // ========================================

      const userRole = getUserRole();

      // ========================================
      // REQUEST HEADERS
      // ========================================

      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // ========================================
      // STUDENTS
      // ========================================

      const studentsResponse = await fetch(
        "http://localhost:5000/api/students",
        {
          method: "GET",
          headers,
        }
      );

      // ========================================
      // COURSES
      // ========================================

      const coursesResponse = await fetch(
        "http://localhost:5000/api/courses",
        {
          method: "GET",
          headers,
        }
      );

      // ========================================
      // ATTENDANCE
      // ========================================

      const attendanceResponse = await fetch(
        "http://localhost:5000/api/attendance",
        {
          method: "GET",
          headers,
        }
      );

      // ========================================
      // TEACHERS
      // ========================================
      // Teachers are only requested by
      // Administrators.
      //
      // Teachers should not call:
      // GET /api/teachers
      //
      // because the backend protects this route.
      // ========================================

      let teachersResponse: Response | null =
        null;

      if (userRole === "Administrator") {
        teachersResponse = await fetch(
          "http://localhost:5000/api/teachers",
          {
            method: "GET",
            headers,
          }
        );
      }

      // ========================================
      // AUTHENTICATION CHECK
      // ========================================

      if (
        studentsResponse.status === 401 ||
        coursesResponse.status === 401 ||
        attendanceResponse.status === 401 ||
        teachersResponse?.status === 401
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return;
      }

      // ========================================
      // SERVER ERROR CHECK
      // ========================================

      if (
        !studentsResponse.ok ||
        !coursesResponse.ok ||
        !attendanceResponse.ok ||
        (teachersResponse &&
          !teachersResponse.ok)
      ) {
        throw new Error(
          "Failed to load dashboard data"
        );
      }

      // ========================================
      // JSON RESPONSES
      // ========================================

      const studentsResult =
        await studentsResponse.json();

      const coursesResult =
        await coursesResponse.json();

      const attendanceResult =
        await attendanceResponse.json();

      // ========================================
      // TEACHERS RESPONSE
      // ========================================

      let teachersResult = {
        success: true,
        data: [],
      };

      if (teachersResponse) {
        teachersResult =
          await teachersResponse.json();
      }

      // ========================================
      // SAVE STUDENTS
      // ========================================

      if (studentsResult.success) {
        setStudents(
          studentsResult.data
        );
      }

      // ========================================
      // SAVE TEACHERS
      // ========================================

      if (teachersResult.success) {
        setTeachers(
          teachersResult.data
        );
      }

      // ========================================
      // SAVE COURSES
      // ========================================

      if (coursesResult.success) {
        setCourses(
          coursesResult.data
        );
      }

      // ========================================
      // SAVE ATTENDANCE
      // ========================================

      if (attendanceResult.success) {
        setAttendance(
          attendanceResult.data
        );
      }
    } catch (error) {
      console.error(
        "Error loading dashboard:",
        error
      );

      setError(
        "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // ATTENDANCE STATISTICS
  // ==========================================

  const presentCount =
    attendance.filter(
      (record) =>
        record.status.toLowerCase() ===
        "present"
    ).length;

  const absentCount =
    attendance.filter(
      (record) =>
        record.status.toLowerCase() ===
        "absent"
    ).length;

  const lateCount =
    attendance.filter(
      (record) =>
        record.status.toLowerCase() ===
        "late"
    ).length;

  const attendancePercentage =
    attendance.length > 0
      ? Math.round(
          (presentCount /
            attendance.length) *
            100
        )
      : 0;

  // ==========================================
  // MONTHLY ATTENDANCE
  // ==========================================

  const monthlyAttendance: MonthlyAttendance[] =
    (() => {
      const months: {
        key: string;
        month: string;
        present: number;
        total: number;
      }[] = [];

      const now = new Date();

      for (let i = 5; i >= 0; i--) {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1
        );

        const key =
          `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;

        const month =
          date.toLocaleString(
            "en-US",
            {
              month: "short",
            }
          );

        months.push({
          key,
          month,
          present: 0,
          total: 0,
        });
      }

      attendance.forEach(
        (record) => {
          const date =
            new Date(record.date);

          const key =
            `${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}`;

          const month =
            months.find(
              (item) =>
                item.key === key
            );

          if (month) {
            month.total += 1;

            if (
              record.status
                .toLowerCase() ===
              "present"
            ) {
              month.present += 1;
            }
          }
        }
      );

      return months.map(
        (month) => ({
          month: month.month,

          attendance:
            month.total > 0
              ? Math.round(
                  (month.present /
                    month.total) *
                    100
                )
              : 0,
        })
      );
    })();

  // ==========================================
  // RECENT ATTENDANCE
  // ==========================================

  const recentAttendance = [
    ...attendance,
  ]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 5);

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusClass = (
    status: string
  ) => {
    switch (
      status.toLowerCase()
    ) {
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
      <div className="p-8">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back. Here's what's happening
              in your school.
            </p>
          </div>

          <button
            onClick={() =>
              fetchDashboardData(true)
            }
            disabled={refreshing}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center justify-between">

            <span>{error}</span>

            <button
              onClick={() =>
                fetchDashboardData(true)
              }
              className="font-semibold underline"
            >
              Retry
            </button>

          </div>
        )}

        {/* =====================================
            STAT CARDS
        ===================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* STUDENTS */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Students
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {loading
                    ? "..."
                    : students.length}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Users size={24} />
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-5">
              Students registered in the system
            </p>

          </div>

          {/* TEACHERS */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Teachers
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {loading
                    ? "..."
                    : teachers.length}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <GraduationCap size={24} />
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-5">
              Teachers currently registered
            </p>

          </div>

          {/* COURSES */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Courses
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {loading
                    ? "..."
                    : courses.length}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <BookOpen size={24} />
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-5">
              Courses available in the school
            </p>

          </div>

          {/* ATTENDANCE */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Attendance Rate
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {loading
                    ? "..."
                    : `${attendancePercentage}%`}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <ClipboardCheck size={24} />
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-5">
              Overall recorded attendance
            </p>

          </div>

        </div>

        {/* =====================================
            QUICK ACTIONS
        ===================================== */}

        <div className="mt-8">

          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* STUDENTS */}

            <button
              onClick={() =>
                (window.location.href =
                  "/students")
              }
              className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition text-left"
            >

              <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <UserPlus size={22} />
              </div>

              <div>
                <p className="font-semibold">
                  Manage Students
                </p>

                <p className="text-sm text-gray-500">
                  Add or update students
                </p>
              </div>

            </button>

            {/* COURSES */}

            <button
              onClick={() =>
                (window.location.href =
                  "/courses")
              }
              className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:border-purple-200 transition text-left"
            >

              <div className="w-11 h-11 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <PlusCircle size={22} />
              </div>

              <div>
                <p className="font-semibold">
                  Manage Courses
                </p>

                <p className="text-sm text-gray-500">
                  View and manage courses
                </p>
              </div>

            </button>

            {/* ATTENDANCE */}

            <button
              onClick={() =>
                (window.location.href =
                  "/attendance")
              }
              className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:border-green-200 transition text-left"
            >

              <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <CalendarCheck size={22} />
              </div>

              <div>
                <p className="font-semibold">
                  Record Attendance
                </p>

                <p className="text-sm text-gray-500">
                  Manage daily attendance
                </p>
              </div>

            </button>

          </div>

        </div>

        {/* =====================================
            CHART + SUMMARY
        ===================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

          {/* MONTHLY ATTENDANCE */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="mb-6">

              <h2 className="text-xl font-bold text-gray-900">
                Monthly Attendance
              </h2>

              <p className="text-gray-500 mt-1">
                Attendance rate over the last six months.
              </p>

            </div>

            <div className="w-full h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={monthlyAttendance}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      `${value}%`
                    }
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${value}%`,
                      "Attendance",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="attendance"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* ATTENDANCE SUMMARY */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="mb-8">

              <h2 className="text-xl font-bold text-gray-900">
                Attendance Summary
              </h2>

              <p className="text-gray-500 mt-1">
                Current attendance breakdown.
              </p>

            </div>

            <div className="space-y-7">

              {/* PRESENT */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className="font-medium text-gray-700">
                    Present
                  </span>

                  <span className="font-semibold text-gray-900">
                    {presentCount}
                  </span>

                </div>

                <div className="w-full bg-gray-100 rounded-full h-3">

                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{
                      width:
                        attendance.length > 0
                          ? `${Math.round(
                              (presentCount /
                                attendance.length) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

              {/* ABSENT */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className="font-medium text-gray-700">
                    Absent
                  </span>

                  <span className="font-semibold text-gray-900">
                    {absentCount}
                  </span>

                </div>

                <div className="w-full bg-gray-100 rounded-full h-3">

                  <div
                    className="bg-red-500 h-3 rounded-full transition-all"
                    style={{
                      width:
                        attendance.length > 0
                          ? `${Math.round(
                              (absentCount /
                                attendance.length) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

              {/* LATE */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className="font-medium text-gray-700">
                    Late
                  </span>

                  <span className="font-semibold text-gray-900">
                    {lateCount}
                  </span>

                </div>

                <div className="w-full bg-gray-100 rounded-full h-3">

                  <div
                    className="bg-yellow-500 h-3 rounded-full transition-all"
                    style={{
                      width:
                        attendance.length > 0
                          ? `${Math.round(
                              (lateCount /
                                attendance.length) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================
            RECENT ATTENDANCE
        ===================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 overflow-hidden">

          <div className="p-6 border-b border-gray-100">

            <h2 className="text-xl font-bold text-gray-900">
              Recent Attendance
            </h2>

            <p className="text-gray-500 mt-1">
              Latest attendance records.
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Student
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Class
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Date
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentAttendance.length === 0 ? (

                  <tr>

                    <td
                      colSpan={4}
                      className="p-10 text-center text-gray-500"
                    >
                      No attendance records available yet.
                    </td>

                  </tr>

                ) : (

                  recentAttendance.map(
                    (record) => (

                      <tr
                        key={record.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >

                        <td className="px-6 py-4 font-medium text-gray-900">
                          {record.student?.name ||
                            "Unknown Student"}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {record.student?.class ||
                            "—"}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {new Date(
                            record.date
                          ).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
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

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;