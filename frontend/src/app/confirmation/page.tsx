"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

const ConfirmationPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refId = searchParams?.get("ref") ?? null;

  if (!refId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
        <div className="text-red-600 mb-4">No booking reference found.</div>
        <button
          onClick={() => router.push("/")}
          className="bg-yellow-400 text-black font-medium px-6 py-2 rounded-lg hover:bg-yellow-300 transition-all duration-200"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
      {/* Green Circle with Tick */}
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-500 mb-6 shadow-lg">
        <Check className="w-12 h-12 text-white" strokeWidth={3} />
      </div>

      {/* Booking Message */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Booking Confirmed
      </h1>
      <p className="text-gray-600 text-lg mb-6">
        Ref ID: <span className="font-mono font-semibold">{refId}</span>
      </p>

      {/* Back to Home Button */}
      <button
        onClick={() => router.push("/")}
        className="bg-yellow-400 text-black font-medium px-6 py-2 rounded-lg hover:bg-yellow-300 transition-all duration-200"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ConfirmationPage;