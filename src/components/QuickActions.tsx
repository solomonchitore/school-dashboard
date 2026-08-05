import {
  UserPlus,
  Users,
  BookOpen,
  ClipboardList,
} from "lucide-react";

function QuickActions() {
  const actions = [
    {
      title: "Add Student",
      icon: <UserPlus size={22} />,
      color: "bg-blue-600",
    },
    {
      title: "Add Teacher",
      icon: <Users size={22} />,
      color: "bg-green-600",
    },
    {
      title: "Add Course",
      icon: <BookOpen size={22} />,
      color: "bg-yellow-500",
    },
    {
      title: "Attendance",
      icon: <ClipboardList size={22} />,
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-5">
        {actions.map((action) => (
          <button
            key={action.title}
            className={`${action.color} text-white rounded-xl p-6 hover:scale-105 transition duration-300 flex flex-col items-center gap-3`}
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