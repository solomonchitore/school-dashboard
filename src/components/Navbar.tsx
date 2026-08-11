import {
  Bell,
  Search,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between bg-white px-8 py-4 border-b">

      {/* Search */}
      <div className="relative w-96">
        <Search
          size={18}
          className="absolute left-4 top-3.5 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        {/* Notifications */}
        <button className="relative">
          <Bell size={22} />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* User + Logout */}
        <div className="flex items-center gap-4">

          {/* User information */}
          <div className="flex items-center gap-3">

            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />

            <div>
              <h3 className="font-semibold">
                Solomon
              </h3>

              <p className="text-gray-500 text-sm">
                Administrator
              </p>
            </div>

          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}

export default Navbar;