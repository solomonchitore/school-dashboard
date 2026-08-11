import type { ReactNode } from "react";
import { GraduationCap, ShieldCheck, Users, BarChart3 } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* ==========================================
          BACKGROUND DECORATION
      ========================================== */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large blue glow */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl" />

        {/* Purple glow */}
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl" />

        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* ==========================================
              LEFT PROFESSIONAL PANEL
          ========================================== */}

          <div className="hidden lg:flex relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white p-12 flex-col justify-between overflow-hidden">

            {/* Decorative circles */}

            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full" />

            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />

            <div className="absolute top-1/2 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />

            {/* Content */}

            <div className="relative z-10">

              {/* Logo */}

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center">
                  <GraduationCap
                    size={32}
                    className="text-white"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    School Dashboard
                  </h2>

                  <p className="text-blue-200 text-sm">
                    School Management System
                  </p>
                </div>
              </div>

              {/* Main message */}

              <div className="mt-24">

                <h1 className="text-4xl font-bold leading-tight">
                  Manage your school
                  <span className="block text-blue-200">
                    smarter and better.
                  </span>
                </h1>

                <p className="mt-6 text-blue-100 leading-relaxed max-w-md">
                  A centralized platform for managing students,
                  teachers, courses, attendance and school
                  administration.
                </p>

              </div>

              {/* Features */}

              <div className="mt-12 space-y-5">

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Users size={20} />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Student Management
                    </p>

                    <p className="text-sm text-blue-200">
                      Manage student records easily
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <BarChart3 size={20} />
                  </div>

                  <div>
                    <p className="font-semibold">
                      School Analytics
                    </p>

                    <p className="text-sm text-blue-200">
                      Track school performance
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <p className="font-semibold">
                      Secure Administration
                    </p>

                    <p className="text-sm text-blue-200">
                      Protected administrator access
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}

            <div className="relative z-10 text-sm text-blue-200">
              © 2026 School Dashboard. All rights reserved.
            </div>
          </div>

          {/* ==========================================
              LOGIN CONTENT
          ========================================== */}

          <div className="bg-white p-8 sm:p-12 lg:p-14 flex items-center">
            <div className="w-full max-w-md mx-auto">
              {children}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AuthLayout;