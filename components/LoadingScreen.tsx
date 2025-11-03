"use client";
import React from "react";

interface LoadingScreenProps {
  type?: "inline" | "page";
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
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-gray-300 dark:border-gray-600 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-t-transparent border-blue-400 animate-[spin_1.5s_linear_infinite]"></div>
        </div>

        {message && (
          <p className="text-sm text-gray-700 dark:text-gray-200 font-medium mt-2">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
