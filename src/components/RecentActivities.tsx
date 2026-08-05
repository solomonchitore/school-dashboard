import {
  UserPlus,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  Pencil,
} from "lucide-react";

const activities = [
  {
    icon: <UserPlus className="text-blue-600" size={20} />,
    title: "New student registered",
    description: "John Doe joined Form 5",
    time: "2 minutes ago",
  },
  {
    icon: <CalendarCheck className="text-green-600" size={20} />,
    title: "Attendance updated",
    description: "Attendance recorded for Grade 10",
    time: "15 minutes ago",
  },
  {
    icon: <BookOpen className="text-yellow-500" size={20} />,
    title: "Course created",
    description: "Computer Science added",
    time: "1 hour ago",
  },
  {
    icon: <GraduationCap className="text-purple-600" size={20} />,
    title: "Grades uploaded",
    description: "Semester results published",
    time: "Yesterday",
  },
  {
    icon: <Pencil className="text-red-500" size={20} />,
    title: "Teacher updated profile",
    description: "Mrs. Johnson edited her information",
    time: "Yesterday",
  },
];

function RecentActivities() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        Recent Activities
      </h2>

      <div className="space-y-5">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-4 border-b pb-4 last:border-none"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              {activity.icon}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">
                {activity.title}
              </h3>

              <p className="text-gray-500 text-sm">
                {activity.description}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivities;