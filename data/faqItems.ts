export type FAQItem = {
  title: string;
  content: string;
  category: 'General' | 'Services' | 'Availability & Support';
};

export const faqItems: FAQItem[] = [
  // ── General ──
  {
    title: 'What is Global Project Solutions?',
    content:
      'Global Project Solutions is a writing and research support company focused on helping individuals and businesses tackle any content-related task — fast, efficiently, and with real human support.',
    category: 'General',
  },
  {
    title: 'Who can use your services?',
    content:
      'Anyone! Whether you’re a student, a startup, or a corporate team, we assist with everything from academic writing to professional reports.',
    category: 'General',
  },
  {
    title: 'Do I need an account to get started?',
    content:
      'No account is required to make an inquiry. We keep it simple: just reach out via the contact form and we’ll guide you from there.',
    category: 'General',
  },

  // ── Services ──
  {
    title: 'What types of writing do you offer?',
    content:
      'We handle research writing, articles, blogs, business documentation, marketing copy, ghostwriting, and more. Custom requests are welcome too.',
    category: 'Services',
  },
  {
    title: 'Do you provide editing or proofreading?',
    content:
      'Yes. We offer full editing, proofreading, and formatting services for all types of documents — academic, business, or creative.',
    category: 'Services',
  },
  {
    title: 'Can you write in a specific tone or format?',
    content:
      'Absolutely. Just let us know your preferred tone (formal, conversational, persuasive, etc.) and any formatting guidelines you need followed.',
    category: 'Services',
  },

  // ── Availability & Support ──
  {
    title: 'When are you available?',
    content:
      'We operate 24/7 with special focus on Asian and European timezones. No matter where you are, we aim to respond quickly.',
    category: 'Availability & Support',
  },
  {
    title: 'How can I get in touch with support?',
    content:
      'Use the contact form or email us directly. You’ll usually get a response within an hour during business hours.',
    category: 'Availability & Support',
  },
  {
    title: 'What’s your typical response time?',
    content:
      'We try to respond within 1–3 hours depending on volume. For urgent projects, we prioritize your requests accordingly.',
    category: 'Availability & Support',
  },
];
