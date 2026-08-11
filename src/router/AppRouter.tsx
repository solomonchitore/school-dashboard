import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Teachers from "../pages/Teachers";
import Courses from "../pages/Courses";
import Attendance from "../pages/Attendance";
import Grades from "../pages/Grades";
import Settings from "../pages/Settings";
import Login from "../pages/Login";

import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==========================================
            PUBLIC ROUTES
        ========================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ==========================================
            GENERAL PROTECTED ROUTES
        ========================================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/students"
            element={<Students />}
          />

          <Route
            path="/courses"
            element={<Courses />}
          />

          <Route
            path="/attendance"
            element={<Attendance />}
          />

          <Route
            path="/grades"
            element={<Grades />}
          />

        </Route>

        {/* ==========================================
            ADMINISTRATOR ONLY ROUTES
        ========================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["Administrator"]}
            />
          }
        >

          <Route
            path="/teachers"
            element={<Teachers />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

        {/* ==========================================
            UNKNOWN URL
        ========================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}