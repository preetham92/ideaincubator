import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full bg-white/10 border border-white/30 rounded-lg p-3 mt-1 text-white focus:ring-2 focus:ring-[#E94560] outline-none placeholder-gray-400 transition duration-300 ease-in-out hover:border-white pr-12"
          ref={ref}
          {...props}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export { PasswordInput };