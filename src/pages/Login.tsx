import { useState, type FormEvent } from "react";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import API_URL from "../lib/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Invalid email or password."
        );

        return;
      }

      // ==========================================
      // CHECK TOKEN
      // ==========================================

      if (!result.data?.token) {
        setError(
          "Login failed: authentication token was not returned."
        );

        return;
      }

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      localStorage.setItem(
        "token",
        result.data.token
      );

      // ==========================================
      // SAVE USER
      // ==========================================

      if (result.data?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(result.data.user)
        );
      }

      // ==========================================
      // DASHBOARD
      // ==========================================

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <AuthLayout>

      <div>

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="text-center">

          <div className="mx-auto bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center">

            <GraduationCap
              className="text-white"
              size={42}
            />

          </div>

          <h1 className="text-3xl font-bold mt-6">
            School Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Secure Login
          </p>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mt-6 bg-red-100 border border-red-300 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* ======================================
            FORM
        ====================================== */}

        <form
          onSubmit={handleLogin}
          className="space-y-5 mt-8"
        >

          {/* EMAIL */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              autoComplete="email"
              required
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              autoComplete="current-password"
              required
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl p-4 font-semibold transition"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* ======================================
            SECURITY NOTICE
        ====================================== */}

        <div className="mt-8 text-center text-sm text-gray-500">

          <p>
            Use your authorized school account
            to access the dashboard.
          </p>

        </div>

      </div>

    </AuthLayout>
  );
}

export default Login;