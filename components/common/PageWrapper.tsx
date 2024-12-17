import React, { ReactNode } from "react";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 pointer-events-none print:hidden"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary-300 to-purple-400"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300"></div>
      </div>
      {children}
    </div>
  );
};

export default PageWrapper;
