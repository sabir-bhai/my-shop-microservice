import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  color,
}) => {
  return (
    <div className="bg-[#0e1620] rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-md ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-gray-400 text-sm">{title}</span>
      </div>
      <div className="text-white text-2xl font-semibold">{value}</div>
    </div>
  );
};

export default StatCard;
