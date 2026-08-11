import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  CalendarDays,
  Award,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: "Students",
    path: "/students",
    icon: <GraduationCap size={20} />,
  },
  {
    title: "Teachers",
    path: "/teachers",
    icon: <Users size={20} />,
  },
  {
    title: "Courses",
    path: "/courses",
    icon: <BookOpen size={20} />,
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: <CalendarDays size={20} />,
  },
  {
    title: "Grades",
    path: "/grades",
    icon: <Award size={20} />,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Settings size={20} />,
  },
];

function Sidebar() {
  return (
    <aside className="w-72 bg-slate-950 text-white min-h-screen flex flex-col">
      {/* LOGO */}

      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-lg">
            <GraduationCap size={28} />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              School Dashboard
            </h1>

            <p className="text-sm text-slate-400">
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {item.icon}

            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}

      <div className="p-4 border-t border-slate-800">
        <p className="text-sm text-slate-400">
          Logged in as
        </p>

        <p className="font-semibold">
          Administrator
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;