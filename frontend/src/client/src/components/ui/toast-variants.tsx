import { CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info" | "loading";

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  variant?: ToastVariant;
}

export function useEnhancedToast() {
  const { toast } = useToast();

  const showToast = ({ title, description, duration = 5000, variant = "default" }: ToastOptions) => {
    const variantStyles = {
      default: {
        className: "border-gray-200 bg-white text-gray-900",
        icon: <Info className="w-4 h-4" />,
      },
      success: {
        className: "border-green-200 bg-green-50 text-green-900",
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      },
      error: {
        className: "border-red-200 bg-red-50 text-red-900", 
        icon: <XCircle className="w-4 h-4 text-red-600" />,
      },
      warning: {
        className: "border-yellow-200 bg-yellow-50 text-yellow-900",
        icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
      },
      info: {
        className: "border-blue-200 bg-blue-50 text-blue-900",
        icon: <Info className="w-4 h-4 text-blue-600" />,
      },
      loading: {
        className: "border-purple-200 bg-purple-50 text-purple-900",
        icon: <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />,
      },
    };

    const style = variantStyles[variant];

    return toast({
      title,
      description: description ? (
        <div className="flex items-center space-x-2">
          {style.icon}
          <span>{description}</span>
        </div>
      ) : undefined,
      duration,
      className: style.className,
    });
  };

  return {
    success: (title: string, description?: string) => showToast({ title, description, variant: "success" }),
    error: (title: string, description?: string) => showToast({ title, description, variant: "error" }),
    warning: (title: string, description?: string) => showToast({ title, description, variant: "warning" }),
    info: (title: string, description?: string) => showToast({ title, description, variant: "info" }),
    loading: (title: string, description?: string) => showToast({ title, description, variant: "loading", duration: 0 }),
    default: (title: string, description?: string) => showToast({ title, description }),
  };
}