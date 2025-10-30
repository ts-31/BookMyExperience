"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Loader from "@/components/ui/Loader";

// reuse currency formatter (INR, no decimals)
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

type Slot = { time: string; available: number };
type Experience = {
  _id: string;
  title: string;
  location?: string;
  description: string;
  about?: string;
  price: number;
  image: string;
  availableDates?: string[];
  slots?: Record<string, Slot[]>;
};

const TAXES = 59;

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // read query params (set by details page navigation)
  const expId = searchParams?.get("exp") ?? "";
  const dateParam = searchParams?.get("date") ?? "";
  const timeParam = searchParams?.get("time") ?? "";
  const qtyParam = parseInt(searchParams?.get("qty") ?? "1", 10) || 1;

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState<boolean>(!!expId);

  // form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [agree, setAgree] = useState(false);

  const [quantity, setQuantity] = useState<number>(qtyParam);

  useEffect(() => {
    // if qty changes from URL, keep sync initially
    setQuantity(qtyParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qtyParam]);

  useEffect(() => {
    if (!expId) return setLoading(false);

    const fetchExp = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/experiences/${expId}`
        );
        setExperience(res.data);
      } catch (err) {
        console.error("Failed to load experience for checkout", err);
        setExperience(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExp();
  }, [expId]);

  // pricing calculations
  const subtotal = useMemo(() => {
    return (experience?.price ?? 0) * quantity;
  }, [experience, quantity]);

  const totalAfterDiscount = useMemo(() => {
    const t = Math.max(0, subtotal - discountAmount);
    return t;
  }, [subtotal, discountAmount]);

  const total = useMemo(() => totalAfterDiscount + TAXES, [totalAfterDiscount]);

  // promo logic: SAVE10 = 10% off subtotal; FLAT100 = ₹100 off
  const applyPromo = () => {
    setPromoError("");
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError("Enter a promo code");
      return;
    }
    if (code === "SAVE10") {
      const amount = Math.round((subtotal * 10) / 100);
      setDiscountAmount(amount);
      setPromoApplied(code);
      setPromoError("");
    } else if (code === "FLAT100") {
      const amount = 100;
      setDiscountAmount(Math.min(amount, subtotal));
      setPromoApplied(code);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setPromoApplied(null);
      setDiscountAmount(0);
    }
  };

  // basic form validation
  const isEmailValid = (emailStr: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);

  const canPay = useMemo(() => {
    return (
      !!experience &&
      !!dateParam &&
      !!timeParam &&
      quantity > 0 &&
      fullName.trim().length > 1 &&
      isEmailValid(email) &&
      agree
    );
  }, [experience, dateParam, timeParam, quantity, fullName, email, agree]);

  const onConfirm = () => {
    if (!canPay) return;
    // build simple payload to pass to confirmation page
    const payload = {
      exp: expId,
      date: dateParam,
      time: timeParam,
      qty: quantity,
      name: fullName,
      email,
      promo: promoApplied ?? "",
      discount: discountAmount,
    };

    // For now navigate to confirmation page with query params
    const qp = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) => {
      qp.set(k, String(v));
    });

    router.push(`/confirmation?${qp.toString()}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </main>
    );
  }

  if (!experience) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to load booking details.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-yellow-400 text-black px-4 py-2 rounded-md"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-700 hover:text-black transition text-lg"
            aria-label="Go back"
          >
            ←
          </button>
          <h1 className="text-2xl font-semibold text-foreground">Checkout</h1>
          <div className="ml-auto">
            <button
              onClick={() => router.back()}
              className="py-1 px-3 rounded-md border text-sm"
            >
              Edit selection
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <h2 className="text-lg font-medium">Your details</h2>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Full name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full border rounded-md px-3 py-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border rounded-md px-3 py-2 bg-gray-100"
                />
                {email && !isEmailValid(email) && (
                  <p className="text-xs text-red-500 mt-1">
                    Enter a valid email
                  </p>
                )}
              </div>

              {/* Promo code */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 border rounded-md px-3 py-2 bg-gray-100"
                  />
                  <button
                    onClick={applyPromo}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-md"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-sm text-green-600 mt-1">
                    Applied: {promoApplied} (−{formatCurrency(discountAmount)})
                  </p>
                )}
                {promoError && (
                  <p className="text-sm text-red-500 mt-1">{promoError}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="agree" className="text-sm">
                  I agree to the <span className="underline">terms</span> and{" "}
                  <span className="underline">safety policy</span>.
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 sticky top-28">
              <div>
                <div className="text-sm text-gray-600">Experience</div>
                <div className="font-medium">{experience.title}</div>
                <div className="text-sm text-gray-500">
                  {dateParam} · {timeParam}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="text-sm">Qty</div>
                <div className="text-sm font-medium">{quantity}</div>
              </div>

              <div className="flex justify-between">
                <div className="text-sm">Subtotal</div>
                <div className="text-sm font-medium">
                  {formatCurrency(subtotal)}
                </div>
              </div>

              <div className="flex justify-between">
                <div className="text-sm">Taxes</div>
                <div className="text-sm font-medium">
                  {formatCurrency(TAXES)}
                </div>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <div>Discount</div>
                  <div>-{formatCurrency(discountAmount)}</div>
                </div>
              )}

              <div className="border-t pt-2 flex justify-between items-center font-semibold">
                <div>Total</div>
                <div className="text-lg">{formatCurrency(total)}</div>
              </div>

              <button
                onClick={onConfirm}
                disabled={!canPay}
                className={`w-full py-3 rounded-md font-medium ${
                  canPay
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Pay & Confirm
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
