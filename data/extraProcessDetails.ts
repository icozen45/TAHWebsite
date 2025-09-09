// components/extraProcessDetails.ts
import {
  ShieldCheck,
  MessageSquare,
  ScanLine,
  RotateCcw,
  Lock,
  Users,
  FileText,
  Clock,
} from "lucide-react";

export const extraProcessDetails = [
  {
    title: "Quality Assurance",
    desc: "Every document undergoes a second round of expert review to ensure top-tier accuracy, consistency, and polish before final delivery.",
    icon: ShieldCheck,
  },
  {
    title: "Direct Communication",
    desc: "You’ll have an open line of communication with your assigned expert, allowing you to ask questions, give feedback, or make adjustments at any point.",
    icon: MessageSquare,
  },
  {
    title: "Plagiarism-Free Guarantee",
    desc: "Each file is verified through enterprise-grade plagiarism detection tools, ensuring your content is 100% original and citation-safe.",
    icon: ScanLine,
  },
  {
    title: "Unlimited Revisions",
    desc: "Request as many revisions as needed within the project timeline—our goal is to meet your expectations without compromise.",
    icon: RotateCcw,
  },
  {
    title: "Confidential & Secure",
    desc: "Your personal information and project data are protected using advanced encryption, strict access controls, and privacy-first policies.",
    icon: Lock,
  },
  {
    title: "Expert Matching",
    desc: "Our system pairs you with a subject-matter expert who best fits your project scope, academic level, and stylistic requirements.",
    icon: Users,
  },
  {
    title: "Detailed Project Notes",
    desc: "We maintain thorough internal notes and documentation throughout the process to ensure consistent progress and accountability.",
    icon: FileText,
  },
  {
    title: "On-Time Delivery",
    desc: "Timeliness is a priority—we work with built-in milestones and automated alerts to ensure every deliverable is completed by or before your deadline.",
    icon: Clock,
  },
];
