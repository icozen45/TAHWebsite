"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);

  const fetchAssignments = async () => {
    try {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      setAssignments(Array.isArray(data) ? data : data.assignments || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    const interval = setInterval(fetchAssignments, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCheckout = async () => {
    if (assignments.length === 0) {
      alert("You must add at least one assignment before checking out.");
      return;
    }

    setLoading(true);

    try {
      // Convert assignments to Stripe line items
      const lineItems = assignments.map((a) => {
        const totalWords = a.tasks.reduce(
          (sum, t) => sum + Number(t.wordCount || 500),
          0
        );
        const price = totalWords * 0.01; // base rate
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: a.projectType || `Assignment #${a.id}`,
              description: a.topic || "",
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        };
      });

      const res = await fetch("/api/stripe-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe checkout failed:", data);
        alert(
          data.error
            ? `Checkout failed: ${data.error}`
            : "Checkout failed: No redirect URL returned."
        );
        setLoading(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("An unexpected error occurred during checkout.");
      setLoading(false);
    }
  };

  return assignments.length > 0 ? (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      disabled={loading}
      onClick={handleCheckout}
      className={`w-full px-6 py-3 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Redirecting..." : "Proceed to Checkout"}
    </motion.button>
  ) : null;
}
