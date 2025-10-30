import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full py-20">
      <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
