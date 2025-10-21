import React from "react";

interface LoadingScreenProps {
  type?: "page" | "inline";
  message?: string;
}

const LoadingScreen = ({ type = "inline", message }: LoadingScreenProps) => {
  return (
    <div
      className={`${
        type === "page" ? "fixed inset-0" : "absolute inset-0 w-full h-full"
      } flex flex-col items-center justify-center z-50 bg-black/30 backdrop-blur-sm`}
    >
      <div className="flex flex-col items-center space-y-3">
        {/* Spinner */}
        <div className="w-14 h-14 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin shadow-md"></div>
        {/* Optional message */}
        {message && (
          <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
