import { Navigate, Outlet } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  let user: User | null = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error("Invalid user data:", error);
    user = null;
  }

  // ==========================================
  // USER DATA MISSING
  // ==========================================

  if (!user) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // ROLE CHECK
  // ==========================================

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // ==========================================
  // AUTHORIZED
  // ==========================================

  return <Outlet />;
}

export default ProtectedRoute;