"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/ui/Loader";
import { useRouter } from "next/navigation";

type Slot = { time: string; available: number };
type Experience = {
  _id: string;
  title: string;
  location: string;
  description: string;
  about?: string;
  price: number;
  image: string;
  availableDates?: string[];
  slots?: Record<string, Slot[]>;
};

const Page: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/experiences`
        );
        setExperiences(res.data);
      } catch (err) {
        // console.error("Failed to load experiences:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="max-w-[1440px] mx-auto px-[124px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-start">
          {experiences.map((exp) => (
            <article
              key={exp._id}
              className="w-full max-w-[280px] h-[312px] bg-card rounded-md overflow-hidden shadow-sm"
            >
              <div className="w-full h-[170px]">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>

              <div className="h-[142px] py-3 px-4 flex flex-col gap-3">
                <div className="flex justify-between items-center w-full px-1">
                  <h2 className="h-[20px] text-[16px] leading-[20px] font-semibold text-foreground">
                    {exp.title}
                  </h2>

                  <div className="flex items-center justify-center bg-button-muted text-foreground text-[14px] rounded-[4px] px-[8px] py-[4px]">
                    {exp.location}
                  </div>
                </div>

                <p className="text-sm text-gray-500 leading-tight max-h-[68px] overflow-hidden">
                  {exp.description}
                </p>

                <div className="flex items-center justify-between w-full mt-auto">
                  <div className="flex items-center gap-[6px]">
                    <span className="text-[12px] leading-[16px] font-normal text-foreground">
                      From
                    </span>
                    <span className="text-[20px] leading-[24px] font-medium text-gray-900">
                      ₹{exp.price}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push(`/experience/${exp._id}`)}
                    className="bg-yellow-400 text-black font-medium text-[14px] px-4 py-1 rounded-md hover:opacity-90 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
