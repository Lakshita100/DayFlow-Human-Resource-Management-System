import { Clock } from "lucide-react";

interface WorkingHoursCardProps {
  hours: string | null;
  label?: string;
}

export default function WorkingHoursCard({ hours, label }: WorkingHoursCardProps) {
  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-50">
          <Clock className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-sm font-medium text-gray-500">Working Hours</h3>
      </div>
      <p className="text-2xl font-bold text-blue-600">
        {hours ?? "--"}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {label ?? "Total working time"}
      </p>
    </div>
  );
}
