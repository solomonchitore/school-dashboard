import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const API_URL = "http://localhost:5000/api/auth";

function Settings() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateUser, setShowCreateUser] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Teacher");
  const [status, setStatus] = useState("Active");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // ==========================================
  // GET TOKEN
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ==========================================
  // LOAD USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError(
          "You are not authenticated. Please login again."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      if (response.status === 403) {
        setError(
          "You do not have permission to view users."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch users"
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to load users"
        );
      }

      setUsers(result.data);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error
      );

      setError(
        "Unable to load users from the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD USERS ON PAGE LOAD
  // ==========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("Teacher");
    setStatus("Active");
  };

  // ==========================================
  // CREATE USER
  // ==========================================

  const handleCreateUser = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        setError(
          "You are not authenticated. Please login again."
        );
        return;
      }

      if (
        !name.trim() ||
        !email.trim() ||
        !password.trim()
      ) {
        setError(
          "Name, email and password are required."
        );
        return;
      }

      if (password.length < 6) {
        setError(
          "Password must be at least 6 characters."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/register`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            role,
            status,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      if (response.status === 403) {
        setError(
          "Only Administrators can create user accounts."
        );

        return;
      }

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to create user"
        );
      }

      setSuccess(
        "User account created successfully."
      );

      resetForm();

      setShowCreateUser(false);

      await fetchUsers();
    } catch (error) {
      console.error(
        "Error creating user:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create user."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // ROLE STYLE
  // ==========================================

  const getRoleStyle = (
    userRole: string
  ) => {
    if (
      userRole === "Administrator"
    ) {
      return "bg-purple-100 text-purple-700";
    }

    if (userRole === "Teacher") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (
    userStatus: string
  ) => {
    if (
      userStatus === "Active"
    ) {
      return "bg-green-100 text-green-700";
    }

    return "bg-red-100 text-red-700";
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>

            <p className="text-gray-500 mt-2">
              Manage administrator and teacher
              login accounts.
            </p>
          </div>

          <button
            onClick={() => {
              setError("");
              setSuccess("");
              resetForm();
              setShowCreateUser(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Add User
          </button>

        </div>

        {/* SUCCESS */}

        {success && (
          <div className="bg-green-100 text-green-700 border border-green-200 p-4 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* USERS CARD */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="p-6 border-b border-gray-200">

            <h2 className="text-xl font-semibold text-gray-900">
              System Users
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Accounts that can access the
              School Dashboard.
            </p>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="p-10 text-center text-gray-500">
              Loading users...
            </div>
          )}

          {/* TABLE */}

          {!loading && !error && (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      ID
                    </th>

                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      Name
                    </th>

                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      Email
                    </th>

                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      Role
                    </th>

                    <th className="text-left p-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >

                      <td className="p-4">
                        {user.id}
                      </td>

                      <td className="p-4 font-medium text-gray-900">
                        {user.name}
                      </td>

                      <td className="p-4 text-gray-600">
                        {user.email}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleStyle(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>

                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>

                      </td>

                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center p-10 text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* ======================================
            CREATE USER MODAL
        ====================================== */}

        {showCreateUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between p-6 border-b">

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create User Account
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    Create a login account for
                    a school staff member.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateUser(false);
                    setError("");
                  }}
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleCreateUser}
                className="p-6 space-y-5"
              >

                {/* NAME */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter full name"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter email address"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* PASSWORD */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Minimum 6 characters"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* ROLE */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>

                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Teacher">
                      Teacher
                    </option>

                    <option value="Administrator">
                      Administrator
                    </option>
                  </select>
                </div>

                {/* STATUS */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Status
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

                {/* BUTTONS */}

                <div className="flex justify-end gap-3 pt-4 border-t">

                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateUser(false);
                      setError("");
                    }}
                    className="px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {saving
                      ? "Creating..."
                      : "Create User"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default Settings;