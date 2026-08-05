import {
  UserPlus,
  GraduationCap,
  BookOpen,
  CalendarCheck,
} from "lucide-react";

function QuickActions() {
  const actions = [
    {
      title: "Add Student",
      icon: <UserPlus size={24} />,
      color: "bg-blue-600",
    },
    {
      title: "Add Teacher",
      icon: <GraduationCap size={24} />,
      color: "bg-green-600",
    },
    {
      title: "Add Course",
      icon: <BookOpen size={24} />,
      color: "bg-orange-500",
    },
    {
      title: "Mark Attendance",
      icon: <CalendarCheck size={24} />,
      color: "bg-red-600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            className={`${action.color} text-white rounded-xl p-5 hover:scale-105 transition flex flex-col items-center gap-3`}
          >
            {action.icon}

            <span className="font-semibold">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;