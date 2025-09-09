import type Review from "../app/components/ui/carousel"

export type Review = {
  id: string
  name: string
  rating: number
  comment: string
  date: string
}

export const reviews: Review[] = [
  {
    id: "1",
    name: "Areeba M.",
    rating: 5,
    comment: "The experience was seamless. I found top-rated pros within minutes and never looked back.",
    date: "Jan 12, 2024"
  },
  {
    id: "2",
    name: "Hamza K.",
    rating: 4,
    comment: "Super easy to use and very helpful when comparing service providers.",
    date: "Feb 22, 2024"
  },
  {
    id: "3",
    name: "Sara T.",
    rating: 5,
    comment: "Saved me so much time. Now I rely on it for all my hiring decisions.",
    date: "Mar 5, 2024"
  },
  {
    id: "4",
    name: "Ali N.",
    rating: 4,
    comment: "Reliable info, helpful insights, and clean design. Love it.",
    date: "Apr 18, 2024"
  },
  {
    id: "5",
    name: "Zainab L.",
    rating: 5,
    comment: "So many useful reviews! Helped me avoid some major mistakes.",
    date: "May 3, 2024"
  },
  {
    id: "6",
    name: "Faizan R.",
    rating: 5,
    comment: "Feels like a cheat code for finding the right services!",
    date: "June 7, 2024"
  }
]
