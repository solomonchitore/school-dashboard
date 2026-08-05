import {
  Bell,
  Search,
} from "lucide-react";

function Navbar() {
  return (
    <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">

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

        <button className="relative">

          <Bell size={22} />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>

        </button>

        <div className="flex items-center gap-3">

          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="rounded-full"
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

      </div>

    </header>
  );
}

export default Navbar;