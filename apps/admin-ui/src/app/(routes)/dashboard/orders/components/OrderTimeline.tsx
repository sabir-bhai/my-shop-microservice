import React from "react";
import { CheckCircle } from "lucide-react";

interface TimelineStep {
  status: string;
  date: string;
  completed: boolean;
}

interface OrderTimelineProps {
  timeline: TimelineStep[];
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ timeline }) => {
  return (
    <div className="space-y-4">
      {timeline.map((step, index) => (
        <div key={index} className="flex items-center gap-4">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.completed ? "bg-green-500" : "bg-slate-600"
            }`}
          >
            {step.completed ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-white font-medium">{step.status}</div>
            <div className="text-gray-400 text-sm">{step.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTimeline;
