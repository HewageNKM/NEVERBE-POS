import React from 'react';

const LoadingScreen= ({type}:{type?:string}) => {
    return (
        <div className={`inset-0 bg-background bg-opacity-60 flex items-center justify-center z-50 ${type === "page" ? "fixed": "absolute w-full h-full"}`}>
            <div className="absolute inset-0 backdrop-blur-md"></div> {/* Background Blur */}
            <div className="relative z-10 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-foreground dark:bg-background border-t-transparent rounded-full animate-spin shadow-lg"
                ></div>
            </div>
        </div>
    );
};

export default LoadingScreen;
