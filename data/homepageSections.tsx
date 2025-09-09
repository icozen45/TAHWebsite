// data/homepageSections.ts
import {
  UsersRound,
  ShieldCheck,
  Clock,
  Headphones,
  DollarSign,
  ThumbsUp,
  ShoppingCart,
  CreditCard,
  MailCheck,
} from 'lucide-react'

export const features = [
  {
    title: "Expert Team of Writers",
    desc: "Our writers are domain specialists with years of experience. Whether it's academic, business, or technical writing, we match your project with the right expert to ensure precision, relevance, and top-quality results every time.",
    icon: UsersRound,
  },
  {
    title: "Tailored Project Solutions",
    desc: "No generic templates here. We create custom solutions based on your subject, level, and specific instructions—whether it's formatting, tone, or research depth—so your project meets all requirements.",
    icon: ShieldCheck,
  },
  {
    title: "Guaranteed On-Time Delivery",
    desc: "Deadlines matter, and we never miss them. Whether it’s a tight turnaround or a long-term task, we deliver on schedule—ensuring you always stay ahead without sacrificing quality or accuracy.",
    icon: Clock,
  },
  {
    title: "24/7 Support",
    desc: "Got a question at midnight? We’re here. Our support team is available day and night to help with updates, questions, or urgent requests—whenever you need us, wherever you are.",
    icon: Headphones,
  },
  {
    title: "Affordable Pricing",
    desc: "We believe in fair, transparent pricing. You’ll only pay for what you need—no hidden costs, no surprise fees. Our flexible rates work for students, professionals, and businesses alike.",
    icon: DollarSign,
  },
  {
    title: "Trusted by 14k+ Clients",
    desc: "Thousands of satisfied clients have trusted us with their work. From students to startups, our high success rate and returning customers speak to the consistency and quality we deliver.",
    icon: ThumbsUp,
  },
]

export const howItWorks = [
  {
    step: "Step 1",
    title: "Choose Your Service",
    desc: "Browse and select from our wide range of academic and business solutions.",
    icon: <ShoppingCart className="w-5 h-5 text-blue-600" />,
  },
  {
    step: "Step 2",
    title: "Make Payment Securely",
    desc: "Checkout using our encrypted, Stripe-powered secure payment gateway.",
    icon: <CreditCard className="w-5 h-5 text-blue-600" />,
  },
  {
    step: "Step 3",
    title: "Get Delivery on Time",
    desc: "Receive your completed project directly to your inbox, always on time.",
    icon: <MailCheck className="w-5 h-5 text-blue-600" />,
  },
]
