import {
  useEffect,
  useState,
} from "react";

import {
  Eye,
  Pencil,
  Trash2,
  KeyRound,
  X,
} from "lucide-react";

import {
  Navigate,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// ==========================================
// TYPES
// ==========================================

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  email: string;
  phone?: string;
  status: string;

  user?: {
    id: number;
    email: string;
    role: string;
    status: string;
  } | null;
}

// ==========================================
// API
// ==========================================

const API_URL =
  "http://localhost:5000/api/teachers";

const AUTH_URL =
  "http://localhost:5000/api/auth";

// ==========================================
// COMPONENT
// ==========================================

function Teachers() {
  const [teachers, setTeachers] =
    useState<Teacher[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [isOpen, setIsOpen] =
    useState(false);

  const [
    selectedTeacher,
    setSelectedTeacher,
  ] =
    useState<Teacher | null>(
      null
    );

  // ========================================
  // LOGIN MODAL
  // ========================================

  const [
    loginModalOpen,
    setLoginModalOpen,
  ] = useState(false);

  const [
    loginTeacher,
    setLoginTeacher,
  ] =
    useState<Teacher | null>(
      null
    );

  const [
    loginPassword,
    setLoginPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    creatingLogin,
    setCreatingLogin,
  ] = useState(false);

  // ========================================
  // VIEW MODAL
  // ========================================

  const [
    viewTeacher,
    setViewTeacher,
  ] =
    useState<Teacher | null>(
      null
    );

  // ========================================
  // CURRENT USER
  // ========================================

  const getUser = () => {
    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(
        storedUser
      );
    } catch (error) {
      console.error(
        "Failed to read logged-in user:",
        error
      );

      return null;
    }
  };

  const user = getUser();

  const isAdministrator =
    user?.role ===
    "Administrator";

  // ========================================
  // TOKEN
  // ========================================

  const getToken = () => {
    return localStorage.getItem(
      "token"
    );
  };

  // ========================================
  // FETCH TEACHERS
  // ========================================

  const fetchTeachers =
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          getToken();

        if (!token) {
          setError(
            "You are not authenticated. Please login again."
          );

          return;
        }

        const response =
          await fetch(
            API_URL,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        if (
          response.status ===
          401
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          window.location.href =
            "/login";

          return;
        }

        if (
          response.status ===
          403
        ) {
          setError(
            "You do not have permission to view teachers."
          );

          return;
        }

        if (!response.ok) {
          throw new Error(
            "Failed to fetch teachers"
          );
        }

        const result =
          await response.json();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load teachers"
          );
        }

        setTeachers(
          result.data
        );
      } catch (error) {
        console.error(
          "Error fetching teachers:",
          error
        );

        setError(
          "Unable to load teachers from the server."
        );
      } finally {
        setLoading(false);
      }
    };

  // ========================================
  // LOAD
  // ========================================

  useEffect(() => {
    if (
      isAdministrator
    ) {
      fetchTeachers();
    } else {
      setLoading(false);
    }
  }, [
    isAdministrator,
  ]);

  // ========================================
  // SAVE TEACHER
  // ========================================

  const handleSave =
    async (
      teacher: Teacher
    ) => {
      if (
        !isAdministrator
      ) {
        alert(
          "You do not have permission to modify teachers."
        );

        return;
      }

      try {
        const token =
          getToken();

        if (!token) {
          alert(
            "You are not authenticated. Please login again."
          );

          return;
        }

        const teacherData =
          {
            name: teacher.name,
            subject:
              teacher.subject,
            email:
              teacher.email,
            phone:
              teacher.phone ||
              "",
            status:
              teacher.status,
          };

        let response: Response;

        if (
          selectedTeacher
        ) {
          response =
            await fetch(
              `${API_URL}/${teacher.id}`,
              {
                method: "PUT",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify(
                    teacherData
                  ),
              }
            );
        } else {
          response =
            await fetch(
              API_URL,
              {
                method: "POST",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",
                },

                body:
                  JSON.stringify(
                    teacherData
                  ),
              }
            );
        }

        if (
          response.status ===
          401
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          window.location.href =
            "/login";

          return;
        }

        if (
          response.status ===
          403
        ) {
          alert(
            "You do not have permission to modify teachers."
          );

          return;
        }

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to save teacher"
          );
        }

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to save teacher"
          );
        }

        await fetchTeachers();

        setSelectedTeacher(
          null
        );

        setIsOpen(false);
      } catch (error) {
        console.error(
          "Error saving teacher:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to save teacher."
        );
      }
    };

  // ========================================
  // DELETE TEACHER
  // ========================================

  const handleDelete =
    async (
      id: number
    ) => {
      if (
        !isAdministrator
      ) {
        alert(
          "You do not have permission to delete teachers."
        );

        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this teacher?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const token =
          getToken();

        if (!token) {
          alert(
            "You are not authenticated. Please login again."
          );

          return;
        }

        const response =
          await fetch(
            `${API_URL}/${id}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        if (
          response.status ===
          401
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          window.location.href =
            "/login";

          return;
        }

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to delete teacher"
          );
        }

        await fetchTeachers();
      } catch (error) {
        console.error(
          "Error deleting teacher:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete teacher."
        );
      }
    };

  // ========================================
  // EDIT
  // ========================================

  const handleEdit = (
    teacher: Teacher
  ) => {
    setSelectedTeacher(
      teacher
    );

    setIsOpen(true);
  };

  // ========================================
  // ADD
  // ========================================

  const handleAdd = () => {
    setSelectedTeacher(
      null
    );

    setIsOpen(true);
  };

  // ========================================
  // CREATE LOGIN
  // ========================================

  const handleOpenLogin =
    (
      teacher: Teacher
    ) => {
      if (
        teacher.user
      ) {
        alert(
          "This teacher already has a login account."
        );

        return;
      }

      setLoginTeacher(
        teacher
      );

      setLoginPassword(
        ""
      );

      setConfirmPassword(
        ""
      );

      setLoginModalOpen(
        true
      );
    };

  // ========================================
  // CLOSE LOGIN MODAL
  // ========================================

  const handleCloseLogin =
    () => {
      if (
        creatingLogin
      ) {
        return;
      }

      setLoginModalOpen(
        false
      );

      setLoginTeacher(
        null
      );

      setLoginPassword(
        ""
      );

      setConfirmPassword(
        ""
      );
    };

  // ========================================
  // CREATE LOGIN ACCOUNT
  // ========================================

  const handleCreateLogin =
    async () => {
      if (
        !loginTeacher
      ) {
        return;
      }

      if (
        loginPassword.length <
        6
      ) {
        alert(
          "Password must be at least 6 characters."
        );

        return;
      }

      if (
        loginPassword !==
        confirmPassword
      ) {
        alert(
          "Passwords do not match."
        );

        return;
      }

      const token =
        getToken();

      if (!token) {
        alert(
          "You are not authenticated. Please login again."
        );

        return;
      }

      try {
        setCreatingLogin(
          true
        );

        const response =
          await fetch(
            `${AUTH_URL}/teacher-account`,
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  teacherId:
                    loginTeacher.id,

                  password:
                    loginPassword,
                }),
            }
          );

        if (
          response.status ===
          401
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          window.location.href =
            "/login";

          return;
        }

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to create login account"
          );
        }

        alert(
          `Login account created successfully!\n\nEmail: ${loginTeacher.email}\nRole: Teacher`
        );

        handleCloseLogin();

        await fetchTeachers();
      } catch (error) {
        console.error(
          "Error creating teacher login:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to create teacher login account."
        );
      } finally {
        setCreatingLogin(
          false
        );
      }
    };

  // ========================================
  // SEARCH
  // ========================================

  const filteredTeachers =
    teachers.filter(
      (teacher) => {
        const text =
          search.toLowerCase();

        return (
          teacher.name
            .toLowerCase()
            .includes(text) ||
          teacher.subject
            .toLowerCase()
            .includes(text) ||
          teacher.email
            .toLowerCase()
            .includes(text) ||
          (
            teacher.phone ||
            ""
          )
            .toLowerCase()
            .includes(text)
        );
      }
    );

  // ========================================
  // NON ADMIN
  // ========================================

  if (
    !isAdministrator
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <MainLayout>
      <div className="p-8">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Teachers
            </h1>

            <p className="text-gray-500 mt-2">
              Manage all teachers in your school.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            + Add Teacher
          </button>

        </div>

        {/* SEARCH */}

        <div className="bg-white rounded-xl shadow p-6 mb-6">

          <input
            type="text"
            placeholder="Search teachers..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* LOADING */}

        {loading && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            Loading teachers...
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* TABLE */}

        {!loading &&
          !error && (
            <div className="bg-white rounded-xl shadow overflow-hidden">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-100">

                    <tr>

                      <th className="text-left p-4">
                        ID
                      </th>

                      <th className="text-left p-4">
                        Teacher
                      </th>

                      <th className="text-left p-4">
                        Subject
                      </th>

                      <th className="text-left p-4">
                        Email
                      </th>

                      <th className="text-left p-4">
                        Phone
                      </th>

                      <th className="text-left p-4">
                        Status
                      </th>

                      <th className="text-center p-4">
                        Login
                      </th>

                      <th className="text-center p-4">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredTeachers.map(
                      (
                        teacher
                      ) => (
                        <tr
                          key={
                            teacher.id
                          }
                          className="border-b hover:bg-gray-50"
                        >

                          <td className="p-4">
                            {
                              teacher.id
                            }
                          </td>

                          <td className="p-4 font-semibold">
                            {
                              teacher.name
                            }
                          </td>

                          <td className="p-4">
                            {
                              teacher.subject
                            }
                          </td>

                          <td className="p-4">
                            {
                              teacher.email
                            }
                          </td>

                          <td className="p-4">
                            {
                              teacher.phone ||
                              "—"
                            }
                          </td>

                          <td className="p-4">

                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                teacher.status ===
                                "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {
                                teacher.status
                              }
                            </span>

                          </td>

                          {/* LOGIN */}

                          <td className="p-4 text-center">

                            {teacher.user ? (

                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                <span>
                                  ✓
                                </span>

                                Created
                              </span>

                            ) : (

                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenLogin(
                                    teacher
                                  )
                                }
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                                title="Create Login Account"
                              >
                                <KeyRound
                                  size={
                                    16
                                  }
                                />

                                Create Login
                              </button>

                            )}

                          </td>

                          {/* ACTIONS */}

                          <td className="p-4">

                            <div className="flex justify-center gap-3">

                              {/* VIEW */}

                              <button
                                type="button"
                                onClick={() =>
                                  setViewTeacher(
                                    teacher
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800"
                                title="View"
                              >
                                <Eye
                                  size={
                                    19
                                  }
                                />
                              </button>

                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    teacher
                                  )
                                }
                                className="text-yellow-500 hover:text-yellow-700"
                                title="Edit"
                              >
                                <Pencil
                                  size={
                                    19
                                  }
                                />
                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    teacher.id
                                  )
                                }
                                className="text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2
                                  size={
                                    19
                                  }
                                />
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                    {filteredTeachers.length ===
                      0 && (
                      <tr>

                        <td
                          colSpan={
                            8
                          }
                          className="p-8 text-center text-gray-500"
                        >
                          No teachers found.
                        </td>

                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        {/* ====================================
            ADD / EDIT MODAL
        ==================================== */}

        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

              <div className="flex items-center justify-between p-6 border-b">

                <h2 className="text-2xl font-bold">
                  {selectedTeacher
                    ? "Edit Teacher"
                    : "Add Teacher"}
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(
                      false
                    );

                    setSelectedTeacher(
                      null
                    );
                  }}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X
                    size={
                      24
                    }
                  />
                </button>

              </div>

              <form
                onSubmit={(
                  event
                ) => {
                  event.preventDefault();

                  const form =
                    event.currentTarget;

                  const formData =
                    new FormData(
                      form
                    );

                  const teacher: Teacher =
                    {
                      id:
                        selectedTeacher?.id ||
                        0,

                      name: String(
                        formData.get(
                          "name"
                        )
                      ),

                      subject:
                        String(
                          formData.get(
                            "subject"
                          )
                        ),

                      email:
                        String(
                          formData.get(
                            "email"
                          )
                        ),

                      phone:
                        String(
                          formData.get(
                            "phone"
                          ) ||
                            ""
                        ),

                      status:
                        String(
                          formData.get(
                            "status"
                          )
                        ),
                    };

                  handleSave(
                    teacher
                  );
                }}
              >

                <div className="p-6">

                  {/* NAME */}

                  <div className="mb-4">

                    <label className="block font-medium mb-2">
                      Name
                    </label>

                    <input
                      name="name"
                      type="text"
                      required
                      defaultValue={
                        selectedTeacher?.name ||
                        ""
                      }
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter teacher name"
                    />

                  </div>

                  {/* SUBJECT */}

                  <div className="mb-4">

                    <label className="block font-medium mb-2">
                      Subject
                    </label>

                    <input
                      name="subject"
                      type="text"
                      required
                      defaultValue={
                        selectedTeacher?.subject ||
                        ""
                      }
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter subject"
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="mb-4">

                    <label className="block font-medium mb-2">
                      Email
                    </label>

                    <input
                      name="email"
                      type="email"
                      required
                      defaultValue={
                        selectedTeacher?.email ||
                        ""
                      }
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="teacher@example.com"
                    />

                  </div>

                  {/* PHONE */}

                  <div className="mb-4">

                    <label className="block font-medium mb-2">
                      Phone
                    </label>

                    <input
                      name="phone"
                      type="text"
                      defaultValue={
                        selectedTeacher?.phone ||
                        ""
                      }
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />

                  </div>

                  {/* STATUS */}

                  <div className="mb-2">

                    <label className="block font-medium mb-2">
                      Status
                    </label>

                    <select
                      name="status"
                      defaultValue={
                        selectedTeacher?.status ||
                        "Active"
                      }
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>
                    </select>

                  </div>

                </div>

                <div className="flex justify-end gap-3 p-6 border-t">

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(
                        false
                      );

                      setSelectedTeacher(
                        null
                      );
                    }}
                    className="px-5 py-3 border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {selectedTeacher
                      ? "Update Teacher"
                      : "Add Teacher"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* ====================================
            CREATE LOGIN MODAL
        ==================================== */}

        {loginModalOpen &&
          loginTeacher && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">

              <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

                {/* HEADER */}

                <div className="flex items-center justify-between p-6 border-b">

                  <div>

                    <h2 className="text-xl font-bold">
                      Create Teacher Login
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Create a login account for this teacher.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleCloseLogin
                    }
                    disabled={
                      creatingLogin
                    }
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <X
                      size={
                        22
                      }
                    />
                  </button>

                </div>

                {/* BODY */}

                <div className="p-6">

                  {/* TEACHER */}

                  <div className="bg-gray-50 rounded-lg p-4 mb-5">

                    <p className="text-sm text-gray-500">
                      Teacher
                    </p>

                    <p className="font-semibold text-gray-900">
                      {
                        loginTeacher.name
                      }
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      {
                        loginTeacher.email
                      }
                    </p>

                  </div>

                  {/* EMAIL */}

                  <div className="mb-4">

                    <label className="block text-sm font-medium mb-2">
                      Login Email
                    </label>

                    <input
                      type="email"
                      value={
                        loginTeacher.email
                      }
                      disabled
                      className="w-full border rounded-lg p-3 bg-gray-100 text-gray-600"
                    />

                  </div>

                  {/* ROLE */}

                  <div className="mb-4">

                    <label className="block text-sm font-medium mb-2">
                      Role
                    </label>

                    <input
                      type="text"
                      value="Teacher"
                      disabled
                      className="w-full border rounded-lg p-3 bg-gray-100 text-gray-600"
                    />

                  </div>

                  {/* PASSWORD */}

                  <div className="mb-4">

                    <label className="block text-sm font-medium mb-2">
                      Password
                    </label>

                    <input
                      type="password"
                      value={
                        loginPassword
                      }
                      onChange={(
                        event
                      ) =>
                        setLoginPassword(
                          event.target.value
                        )
                      }
                      disabled={
                        creatingLogin
                      }
                      minLength={
                        6
                      }
                      placeholder="Minimum 6 characters"
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div className="mb-2">

                    <label className="block text-sm font-medium mb-2">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      value={
                        confirmPassword
                      }
                      onChange={(
                        event
                      ) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      disabled={
                        creatingLogin
                      }
                      minLength={
                        6
                      }
                      placeholder="Enter password again"
                      className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    The teacher will use this email and password to log in. The role will automatically be set to Teacher.
                  </p>

                </div>

                {/* FOOTER */}

                <div className="flex justify-end gap-3 p-6 border-t">

                  <button
                    type="button"
                    onClick={
                      handleCloseLogin
                    }
                    disabled={
                      creatingLogin
                    }
                    className="px-5 py-2.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCreateLogin
                    }
                    disabled={
                      creatingLogin
                    }
                    className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {creatingLogin
                      ? "Creating..."
                      : "Create Account"}
                  </button>

                </div>

              </div>

            </div>
          )}

        {/* ====================================
            VIEW TEACHER MODAL
        ==================================== */}

        {viewTeacher && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

              <div className="flex items-center justify-between p-6 border-b">

                <div>

                  <h2 className="text-2xl font-bold">
                    Teacher Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Teacher information
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setViewTeacher(
                      null
                    )
                  }
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X
                    size={
                      24
                    }
                  />
                </button>

              </div>

              <div className="p-6 space-y-5">

                <div>
                  <p className="text-sm text-gray-500">
                    Name
                  </p>

                  <p className="font-semibold text-lg">
                    {
                      viewTeacher.name
                    }
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Subject
                  </p>

                  <p className="font-semibold">
                    {
                      viewTeacher.subject
                    }
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-semibold">
                    {
                      viewTeacher.email
                    }
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <p className="font-semibold">
                    {
                      viewTeacher.phone ||
                      "—"
                    }
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Status
                  </p>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      viewTeacher.status ===
                      "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {
                      viewTeacher.status
                    }
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Login Account
                  </p>

                  {viewTeacher.user ? (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                      Login account created
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                      No login account
                    </span>
                  )}
                </div>

              </div>

              <div className="flex justify-end gap-3 p-6 border-t">

                <button
                  type="button"
                  onClick={() =>
                    setViewTeacher(
                      null
                    )
                  }
                  className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>

                {!viewTeacher.user && (
                  <button
                    type="button"
                    onClick={() => {
                      setViewTeacher(
                        null
                      );

                      handleOpenLogin(
                        viewTeacher
                      );
                    }}
                    className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Create Login
                  </button>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default Teachers;