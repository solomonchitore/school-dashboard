import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      email === "admin@school.com" &&
      password === "password"
    ) {
      navigate("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10">
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
            Administrator Login
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5 mt-8"
        >
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 font-semibold transition"
          >
            Login
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Demo Login</p>
          <p className="mt-2 font-medium">admin@school.com</p>
          <p>password</p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;