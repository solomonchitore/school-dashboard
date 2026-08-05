const activities = [
  {
    id: 1,
    title: "New student added",
    description: "John Doe joined Form 5",
    time: "2 min ago",
    color: "bg-green-500",
  },
  {
    id: 2,
    title: "Attendance updated",
    description: "Form 4 attendance submitted",
    time: "10 min ago",
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Teacher assigned",
    description: "Mr. Smith assigned to Mathematics",
    time: "30 min ago",
    color: "bg-yellow-500",
  },
  {
    id: 4,
    title: "Grades published",
    description: "Mid-term results released",
    time: "1 hour ago",
    color: "bg-red-500",
  },
];

function RecentActivities() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">
        Recent Activities
      </h2>

      <div className="space-y-5">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4"
          >
            <div
              className={`w-3 h-3 rounded-full mt-2 ${activity.color}`}
            />

            <div className="flex-1">
              <h3 className="font-semibold">
                {activity.title}
              </h3>

              <p className="text-gray-500 text-sm">
                {activity.description}
              </p>
            </div>

            <span className="text-gray-400 text-xs whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivities;