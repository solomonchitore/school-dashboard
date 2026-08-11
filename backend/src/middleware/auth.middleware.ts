import "dotenv/config";

import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

// ==========================================
// JWT SECRET
// ==========================================

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not configured in the .env file"
  );
}

// ==========================================
// AUTHENTICATED REQUEST
// ==========================================

export interface AuthenticatedRequest
  extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// ==========================================
// AUTHENTICATE TOKEN
// ==========================================

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization;

  // ========================================
  // TOKEN REQUIRED
  // ========================================

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message:
        "Authorization token required",
    });
  }

  // ========================================
  // EXTRACT TOKEN
  // ========================================

  const token = authHeader.startsWith(
    "Bearer "
  )
    ? authHeader.substring(7)
    : authHeader;

  // ========================================
  // EMPTY TOKEN CHECK
  // ========================================

  if (!token) {
    return res.status(401).json({
      success: false,
      message:
        "Authorization token required",
    });
  }

  // ========================================
  // VERIFY TOKEN
  // ========================================

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as {
      id: number;
      email: string;
      role: string;
    };

    // ======================================
    // SAVE USER ON REQUEST
    // ======================================

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    // ======================================
    // CONTINUE REQUEST
    // ======================================

    next();
  } catch (error) {
    console.error(
      "JWT verification error:",
      error
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
};

// ==========================================
// ROLE AUTHORIZATION
// ==========================================

export const requireRole = (
  ...allowedRoles: string[]
) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    // ======================================
    // USER MUST BE AUTHENTICATED
    // ======================================

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authorization token required",
      });
    }

    // ======================================
    // CHECK USER ROLE
    // ======================================

    if (
      !allowedRoles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to perform this action",
      });
    }

    // ======================================
    // ROLE IS ALLOWED
    // ======================================

    next();
  };
};