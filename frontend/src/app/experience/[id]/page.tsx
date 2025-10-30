// File: frontend/src/app/experience/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Loader from "../../../components/ui/Loader";

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const ExperienceDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/experiences/${id}`
        );
        const data = res.data;
        setExperience(data);
        if (data.availableDates && data.availableDates.length > 0) {
          setSelectedDate(data.availableDates[0]);
        }
      } catch (err) {
        console.error("Error fetching experience:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader />
      </main>
    );
  }

  if (!experience) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-600">
        Experience not found.
      </main>
    );
  }

  const subtotal = experience.price * quantity;
  const taxes = 59;
  const total = subtotal + taxes;

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Back Arrow and Title */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-700 hover:text-black transition text-lg"
            aria-label="Go back"
          >
            ←
          </button>
          <h1 className="text-2xl font-semibold text-foreground">Details</h1>
        </div>

        {/* Grid: Left (content) | Right (sticky sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content (spans 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg">
              <img
                src={experience.image}
                alt={experience.title}
                className="w-full h-[420px] md:h-[480px] object-cover"
              />

              {/* Bottom overlay for details */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-6 flex flex-col gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    {experience.title}
                  </h2>
                  <p className="text-gray-600">{experience.description}</p>
                </div>

                {/* Choose Date */}
                {experience.availableDates && (
                  <div>
                    <p className="font-medium mb-2 text-foreground">
                      Choose Date
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {experience.availableDates.map((date) => (
                        <button
                          key={date}
                          onClick={() => {
                            setSelectedDate(date);
                            setSelectedTime("");
                          }}
                          className={`px-4 py-2 rounded-md border transition text-sm ${
                            selectedDate === date
                              ? "bg-yellow-400 text-black border-yellow-400"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Choose Time */}
                {selectedDate && experience.slots?.[selectedDate] && (
                  <div>
                    <p className="font-medium mb-2 text-foreground">
                      Choose Time
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {experience.slots[selectedDate].map((slot, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedTime(slot.time)}
                          disabled={slot.available === 0}
                          className={`px-4 py-2 rounded-md border text-sm transition ${
                            slot.available === 0
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : selectedTime === slot.time
                              ? "bg-yellow-400 text-black border-yellow-400"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {slot.time}{" "}
                          {slot.available === 0
                            ? "(Sold Out)"
                            : `(${slot.available} left)`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* About */}
                {experience.about && (
                  <div>
                    <p className="font-semibold text-lg mb-1 text-foreground">
                      About
                    </p>
                    <p className="text-gray-600 text-sm">{experience.about}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Pricing Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="w-full bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Starts at</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(experience.price)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quantity</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-2 py-1 border rounded-md bg-gray-100 hover:bg-gray-200"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span>{formatCurrency(taxes)}</span>
                </div>

                <div className="flex justify-between font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <button
                  className="w-full bg-yellow-400 text-black py-2 rounded-md font-medium hover:opacity-90 transition disabled:opacity-60"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => {
                    // TODO: implement confirm booking action
                    console.log("Confirming booking", {
                      selectedDate,
                      selectedTime,
                      quantity,
                    });
                  }}
                >
                  {selectedDate && selectedTime
                    ? "Confirm"
                    : "Select date & time"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ExperienceDetailPage;
