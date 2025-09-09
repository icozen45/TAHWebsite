"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Paperclip, Phone as PhoneIcon } from "lucide-react";
import CountUp from "react-countup";

interface AssignmentTask {
  id: number;
  wordCount?: string;
  file?: { name?: string; size?: number };
}

interface SingleAssignment {
  id: number;
  projectType: string;
  topic: string;
  urgencyType: "days" | "hours";
  urgencyValue: string;
  tasks: AssignmentTask[];
}

const BASE_RATE_PER_WORD = 0.01;
const DEFAULT_FILE_WORDS = 500;

const urgencyMultiplier = (type: "days" | "hours", value: number) => {
  if (type === "days") {
    if (value <= 1) return 2.0;
    if (value <= 2) return 1.5;
    if (value <= 3) return 1.2;
    return 1.0;
  } else {
    if (value <= 1) return 3.0;
    if (value <= 3) return 2.0;
    if (value <= 6) return 1.5;
    return 1.2;
  }
};

const calculateAssignmentPrice = (assignment: SingleAssignment) => {
  const totalWords = assignment.tasks.reduce((sum, t) => {
    if (t.wordCount) return sum + Number(t.wordCount);
    if (t.file) return sum + DEFAULT_FILE_WORDS;
    return sum;
  }, 0);
  const urgencyNum = Number(assignment.urgencyValue) || 1;
  const multiplier = urgencyMultiplier(assignment.urgencyType, urgencyNum);
  return Number((totalWords * BASE_RATE_PER_WORD * multiplier).toFixed(2));
};

export default function CheckoutPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [assignments, setAssignments] = useState<SingleAssignment[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch assignments from API
  useEffect(() => {
    fetch("/api/saveAssignments")
      .then(res => res.json())
      .then(data => {
        if (data.assignments && Array.isArray(data.assignments)) {
          setAssignments(data.assignments);
        } else {
          setAssignments([]);
        }
      })
      .catch(() => setAssignments([]));
  }, []);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isValidPhone = (v: string) => /^\+?[0-9\s\-()]{7,20}$/.test(v.trim());

  const validate = () => {
    if (assignments === null) {
      setMessage("Loading your order...");
      return false;
    }
    const errs: string[] = [];
    if (!name.trim()) errs.push("name");
    if (!email.trim() || !isValidEmail(email)) errs.push("email");
    if (!phone.trim() || !isValidPhone(phone)) errs.push("phone");
    if (!assignments || assignments.length === 0) errs.push("items");
    setErrors(errs);
    setMessage(errs.length ? "Please fix the highlighted fields." : "");
    return errs.length === 0;
  };

  const totalPrice = (assignments ?? []).reduce((acc, a) => acc + calculateAssignmentPrice(a), 0);
  const inputClass = (field: string) =>
    `w-full border rounded-md p-3 shadow-sm focus:outline-none transition ${
      errors.includes(field)
        ? "border-red-500 bg-red-50 text-red-700"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`;

  const fileBase = (n: string) => (n.lastIndexOf(".") >= 0 ? n.slice(0, n.lastIndexOf(".")) : n);
  const extOf = (n: string) => (n.lastIndexOf(".") >= 0 ? n.slice(n.lastIndexOf(".")).toLowerCase() : "");

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setMessage("Saving assignments...");

    try {
      await fetch("/api/saveAssignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignments }),
      });

      setMessage("Redirecting to payment...");
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, notes }),
      });
      const checkoutData = await checkoutRes.json();

      if (checkoutRes.ok && checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        setMessage(checkoutData.error || "Checkout failed. Try again.");
        setLoading(false);
      }
    } catch {
      setMessage("Network error. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-16 px-6 flex justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Items */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Review Your Items</h2>
              <p className="text-sm text-gray-500">Check details before payment.</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Order total</div>
              <div className="text-2xl font-bold text-green-600">
                <CountUp start={0} end={totalPrice} duration={0.9} decimals={2} prefix="$" />
              </div>
            </div>
          </div>

          {assignments === null ? (
            <div className="py-12 text-center text-gray-500">Loading...</div>
          ) : assignments.length === 0 ? (
            <div className="py-12 text-center text-gray-500">Your cart is empty.</div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {assignments.map(a => (
                <div key={a.id} className="border rounded-lg p-4 hover:shadow-sm transition">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{a.projectType}</p>
                      <p className="text-sm text-gray-600">{a.topic}</p>
                      <p className="text-xs text-gray-500">
                        Urgency: {a.urgencyValue} {a.urgencyType}
                      </p>
                    </div>
                    <div className="text-green-700 font-semibold">
                      ${calculateAssignmentPrice(a).toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-3 border-t pt-3 space-y-2">
                    {a.tasks.map(t => (
                      <div key={t.id} className="flex items-center gap-3 text-sm">
                        {t.file?.name ? (
                          <>
                            <Paperclip size={14} className="text-gray-500" />
                            <span className="truncate">{fileBase(t.file.name)}</span>
                            <span className="text-xs text-gray-400">{extOf(t.file.name)}</span>
                          </>
                        ) : (
                          <>
                            <span>{t.wordCount}</span>
                            <span className="text-xs text-gray-400">words</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Form */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="text-green-600" />
            <h2 className="text-xl font-semibold">Your Details</h2>
          </div>

          <label className="block mb-1 font-medium">Full Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            className={inputClass("name")} placeholder="John Doe" disabled={loading} />

          <label className="block mt-4 mb-1 font-medium">Email *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className={inputClass("email")} placeholder="you@example.com" disabled={loading} />

          <label className="block mt-4 mb-1 font-medium">Phone Number *</label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-3 text-gray-400" size={16} />
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className={`${inputClass("phone")} pl-11`} placeholder="+92 300 1234567" disabled={loading} />
          </div>

          <label className="block mt-4 mb-1 font-medium">Additional Notes</label>
          <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)}
            className="w-full border rounded-md p-3 shadow-sm focus:ring-2 focus:ring-blue-500" disabled={loading} />

          <div className="mt-6">
            <button onClick={handleSubmit}
              disabled={loading || !assignments?.length}
              className={`w-full rounded-full py-3 text-white font-semibold shadow flex items-center justify-center gap-2 ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}>
              {loading ? "Processing..." : <>Pay with Card <ArrowRight size={16} /></>}
            </button>
          </div>

          {message && <p className="mt-4 text-center font-medium text-red-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}
