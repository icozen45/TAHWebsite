// components/Card.tsx
import React from "react";
import { Star } from "lucide-react";

interface CardProps {
  avatar?: string;
  name: string;
  reviewsCount?: number;
  rating?: number;       // optional now
  reviewText?: string;   // used for review cards
  orders?: number;       // for other uses
}

export default function Card({
  avatar,
  name,
  reviewsCount,
  rating,
  reviewText,
  orders,
}: CardProps) {
  return (
    <div
      className="
        relative shrink-0 snap-start
        w-[340px] h-[300px]
        rounded-2xl shadow-lg
        bg-blue-50
        p-5 flex flex-col
      "
    >
      {/* Top Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {avatar && (
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border border-blue-200"
            />
          )}
          <div>
            <h4 className="font-semibold text-gray-900">{name}</h4>
            {reviewsCount !== undefined && (
              <p className="text-xs text-gray-700">{reviewsCount} reviews</p>
            )}
          </div>
        </div>

        {/* Rating (only render if rating exists) */}
        {typeof rating === "number" && (
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-sm font-semibold text-gray-900">
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Review Text */}
      {reviewText && (
        <p className="text-sm text-gray-800 leading-snug mb-4 line-clamp-5">
          {reviewText}
        </p>
      )}

      {/* Orders / Meta */}
      {orders !== undefined && !reviewText && (
        <div className="mt-auto text-lg font-bold text-gray-900">
          {orders.toLocaleString()}{" "}
          <span className="text-sm font-medium text-gray-700">
            completed orders
          </span>
        </div>
      )}
    </div>
  );
}
