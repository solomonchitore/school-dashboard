import {
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";

import AttendanceChart from "../charts/AttendanceChart";
import GradeChart from "../charts/GradeChart";

import RecentActivities from "../components/RecentActivities";
import QuickActions from "../components/QuickActions";

function Dashboard() {
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold">
        Dashboard Overview
      </h1>

      <p className="mt-2 text-gray-600">
        Welcome back, Solomon 👋
      </p>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        <StatCard
          title="Students"
          value="1,245"
          color="#2563eb"
          icon={<GraduationCap size={30} />}
          iconBg="bg-blue-600"
        />

        <StatCard
          title="Teachers"
          value="58"
          color="#16a34a"
          icon={<Users size={30} />}
          iconBg="bg-green-600"
        />

        <StatCard
          title="Courses"
          value="34"
          color="#f59e0b"
          icon={<BookOpen size={30} />}
          iconBg="bg-yellow-500"
        />

        <StatCard
          title="Attendance"
          value="96%"
          color="#dc2626"
          icon={<CalendarCheck size={30} />}
          iconBg="bg-red-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
        <AttendanceChart />
        <GradeChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
        <RecentActivities />
        <QuickActions />
      </div>
    </MainLayout>
  );
}

export default Dashboard;