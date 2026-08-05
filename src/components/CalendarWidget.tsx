function CalendarWidget() {
  const events = [
    {
      date: "Aug 6",
      title: "Mathematics Exam",
      color: "bg-red-500",
    },
    {
      date: "Aug 10",
      title: "Science Fair",
      color: "bg-green-500",
    },
    {
      date: "Aug 14",
      title: "Parents Meeting",
      color: "bg-blue-500",
    },
    {
      date: "Aug 18",
      title: "Sports Day",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6">
        Upcoming Events
      </h2>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.title}
            className="flex items-center gap-4"
          >
            <div
              className={`w-4 h-4 rounded-full ${event.color}`}
            />

            <div className="flex-1">
              <h3 className="font-semibold">
                {event.title}
              </h3>

              <p className="text-gray-500 text-sm">
                {event.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarWidget;