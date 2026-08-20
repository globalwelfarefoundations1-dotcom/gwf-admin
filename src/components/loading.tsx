import React from "react";

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="flex w-full max-w-xs flex-col items-center rounded-2xl bg-white/95 p-6 text-center shadow-2xl dark:bg-gray-900/95 sm:max-w-sm sm:p-8">
        {/* Spinner */}
        <div className="relative h-14 w-14 sm:h-16 sm:w-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[#d9aa3f] border-r-[#d9aa3f]" />
        </div>

        {/* Message */}
        <p className="mt-5 text-sm font-medium text-gray-700 dark:text-gray-200 sm:text-base">
          {message}
        </p>

        {/* Animated dots */}
        <div className="mt-2 flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d9aa3f] [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d9aa3f] [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#d9aa3f]" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
