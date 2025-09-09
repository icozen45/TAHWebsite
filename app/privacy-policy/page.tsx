'use client';

import Head from "next/head";

const sections = [
  {
    title: "Introduction",
    text: `This Privacy Policy outlines the types of personal information we collect, how it is used, and the steps we take to protect your data. By accessing or using our website and services, you agree to the terms of this Privacy Policy.`,
  },
  {
    title: "Information We Collect",
    text: `We may collect both personally identifiable and non-personally identifiable information, such as:
- Name, email, and contact details (if provided)
- Browser type, device, IP address
- Interaction data and site usage patterns`,
  },
  {
    title: "How We Use Your Information",
    text: `We use the data to:
- Provide and improve our services
- Respond to inquiries or support requests
- Conduct internal analytics
- Send service-related updates (if opted in)
We never sell or lease your data to third parties for marketing.`,
  },
  {
    title: "Cookies & Tracking Technologies",
    text: `We use cookies and similar technologies for analytics and improving user experience. Cookies are small text files stored on your device. You can disable cookies in your browser, though some features may not work properly.`,
  },
  {
    title: "Sharing & Disclosure",
    text: `We may share data with trusted third-party providers (e.g., analytics or hosting services) only for essential operations. All parties are contractually obligated to protect your data. We may also disclose data when required by law or to protect our rights.`,
  },
  {
    title: "Data Retention",
    text: `We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy or to comply with legal obligations. Data no longer required is securely deleted or anonymized.`,
  },
  {
    title: "Data Security",
    text: `We use industry-standard security practices such as:
- SSL encryption
- Secure servers and restricted access
- Regular updates and vulnerability checks
While we take precautions, no system can be 100% secure.`,
  },
  {
    title: "Your Rights",
    text: `You may:
- Access or correct your personal data
- Request deletion of your data
- Withdraw consent
- Contact a data protection authority
To exercise your rights, reach out via the contact details below.`,
  },
  {
    title: "Children’s Privacy",
    text: `We do not knowingly collect data from individuals under 13. If you're a parent or guardian and believe your child has provided data, contact us immediately for removal.`,
  },
  {
    title: "Changes to This Privacy Policy",
    text: `We may update this policy periodically. Changes take effect once published here. Continued use of our services indicates your acceptance of the updated terms.`,
  },
  {
    title: "Contact Us",
    text: `For questions or concerns regarding this policy, contact us at:

Email: hello@example.com  
Address: 123 Privacy Lane, Webtown, Internetland  
Phone: +1 (800) 555-PRIV`,
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <main className="min-h-screen py-20 px-6 text-gray-800">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">
            Privacy Policy
          </h1>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                <p className="text-base whitespace-pre-line leading-relaxed text-gray-700">
                  {section.text}
                </p>
              </section>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-16">
            Last updated: July 2025
          </p>
        </div>
      </main>
    </>
  );
}
