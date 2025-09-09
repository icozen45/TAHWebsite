// data/tagInfo.ts

export type TagDetail = {
  description: string;
  examples: string[];
};

export const tagInfo: Record<string, TagDetail> = {
  Marketing: {
    description: "Projects focused on increasing visibility, reach, or engagement.",
    examples: ["SEO Tools", "Email Campaigns", "Brand Landing Pages"],
  },
  Web: {
    description: "Browser-based projects built for interaction or information.",
    examples: ["Portfolio Websites", "Web Apps", "Admin Dashboards"],
  },
  Blog: {
    description: "Content-driven platforms centered around articles and storytelling.",
    examples: ["Personal Blogs", "Developer Journals", "Publishing Tools"],
  },
  Portfolio: {
    description: "Projects that showcase personal or professional achievements.",
    examples: ["Creative Portfolios", "Resume Sites", "Case Study Pages"],
  },
  Ecommerce: {
    description: "Platforms that enable product browsing and online sales.",
    examples: ["Online Stores", "Product Landing Pages", "Checkout Systems"],
  },
  Dashboard: {
    description: "Data-driven interfaces for managing or analyzing information.",
    examples: ["Admin Panels", "Analytics Tools", "CRMs"],
  },
};
