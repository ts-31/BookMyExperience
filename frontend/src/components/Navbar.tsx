"use client";

import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full max-w-[1440px] h-[87px] mx-auto flex items-center justify-between bg-background px-[124px] py-[16px] shadow-sm">
      {/* Logo */}
      <div className="w-[100px] h-[55px] flex items-center">
        <img
          src="/next.svg"
          alt="BookMyExperience Logo"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Search Section */}
      <div className="flex items-center gap-[16px] w-auto">
        <input
          type="text"
          placeholder="Search Experiences"
          className="w-[340px] h-[42px] bg-surface rounded-[4px] px-[16px] py-[12px] 
                     text-foreground text-[14px] leading-[18px] font-inter font-normal 
                     placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          className="bg-primary text-foreground font-inter font-medium text-[14px] 
                           leading-[18px] px-[16px] py-[12px] rounded-[4px] 
                           hover:bg-[--color-primary]/90 transition"
        >
          Search
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
