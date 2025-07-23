import { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  prefix?: string;
  suffix?: string;
  animate?: boolean;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  iconBgColor, 
  prefix = "",
  suffix = "",
  animate = true 
}: StatCardProps) {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  const isNumeric = !isNaN(numericValue);

  return (
    <div className="card-hover bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-purple-200 relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-105">
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-50 to-transparent opacity-50 rounded-full -mr-12 -mt-12 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2 group-hover:text-purple-600 transition-colors duration-300">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {animate && isNumeric ? (
              <AnimatedCounter 
                value={numericValue} 
                prefix={prefix} 
                suffix={suffix} 
                duration={1500}
              />
            ) : (
              value
            )}
          </p>
        </div>
        <div className={`w-14 h-14 ${iconBgColor} rounded-2xl flex items-center justify-center shadow-lg ml-4 group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
          <Icon className={`${iconColor} w-7 h-7`} />
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>
    </div>
  );
}
