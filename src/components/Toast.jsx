import React, { useEffect } from "react";

export default function Toast({ message, type = "error", onClose }) {
  
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, []);

  const colors = {
    error: "from-red-500/40 to-red-700/40 border-red-400/40",
    success: "from-green-500/40 to-green-700/40 border-green-400/40",
    info: "from-blue-500/40 to-blue-700/40 border-blue-400/40",
  };

  return (
    <div className={`
      fixed top-6 right-6 z-[9999]
      px-5 py-3 rounded-xl backdrop-blur-xl border 
      bg-gradient-to-r ${colors[type]} text-white shadow-xl
      animate-fadeIn
    `}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

