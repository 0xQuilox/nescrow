import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EscrowTypeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function EscrowTypeCard({
  title,
  description,
  icon: Icon,
  iconColor,
  isSelected = false,
  onClick,
}: EscrowTypeCardProps) {
  return (
    <Card
      className={`cursor-pointer card-hover border-2 transition-all duration-300 relative overflow-hidden ${
        isSelected
          ? "border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg shadow-purple-200/50"
          : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent opacity-30 rounded-full -mr-10 -mt-10"></div>
        
        {/* Icon */}
        <div className={`flex items-center justify-center w-16 h-16 ${iconColor} rounded-2xl mb-4 shadow-lg relative z-10`}>
          <Icon className="text-white w-8 h-8" />
        </div>
        
        {/* Content */}
        <h3 className="font-bold text-xl text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
        
        {/* Bottom accent */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ${
          isSelected ? "bg-gradient-to-r from-purple-500 to-purple-600" : "bg-transparent"
        }`}></div>
      </CardContent>
    </Card>
  );
}
