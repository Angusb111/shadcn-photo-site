"use client";
import { InstaButton } from "./InstaButton";

export function Footer() {
  return (
    <div className="w-vw bg-black flex flex-col justify-center sm:flex-row items-center mt-1 sm:mt-20 text-white z-100">
      {/* Copyright */}
      <div className="w-full sm:w-1/3">
        <div className="p-12 flex flex-col items-center gap-5">
          <InstaButton/>
          <p className="text-sm">
            &copy; 2025. Copyright Angus Bodle Media
          </p>
        </div>
      </div>
    </div>
  );
}