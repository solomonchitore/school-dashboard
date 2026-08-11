import type { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  color: string;
  icon: ReactNode;
};

function StatCard({
  title,
  value,
  color,
  icon,
}: StatCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-md p-6 border-l-4"
      style={{ borderColor: color }}
    >
      <div className="flex justify-between items-center">

        <div>
          <h3 className="text-gray-500 text-sm">
            {title}
          </h3>

          <p className="text-4xl font-bold mt-3">
            {value}
          </p>
        </div>

        <div
          className="p-4 rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

export default StatCard;