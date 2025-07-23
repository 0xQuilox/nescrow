import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingState({ size = "md", text, className }: LoadingStateProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      <Loader2 className={cn("animate-spin text-purple-600", sizeClasses[size])} />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}