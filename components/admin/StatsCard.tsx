import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string; // Tailwind class e.g. "bg-red-50"
  iconColor: string; // Tailwind class e.g. "text-red-600"
  trend?: {
    text: string;
    icon?: ReactNode;
    color: string; // Tailwind class e.g. "text-red-600"
  };
}

export default function StatsCard({ title, value, icon, iconBgColor, iconColor, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgColor} ${iconColor}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${trend.color}`}>
          {trend.icon}
          <span>{trend.text}</span>
        </div>
      )}
    </div>
  );
}
