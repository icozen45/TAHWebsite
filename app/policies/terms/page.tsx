// app/(main)/policies/terms/page.tsx

export default function TermsOfService() {
  return (
    <main className="max-w-3xl mx-auto py-24 px-4">
      <h1 className="text-4xl font-bold text-gray-700 mb-8">Terms of Service</h1>

      <div className="space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base">
        <p>
          By accessing or using this website, you agree to be bound by these terms and conditions. If you do not agree
          with any part of these terms, you must not use our service.
        </p>

        <p>
          This service is provided as-is and without any warranties, express or implied. We do not guarantee that the
          website will be available at all times or that it will be free of bugs, interruptions, or other issues.
        </p>

        <p>
          Users are solely responsible for any content they submit. You agree not to upload or share anything that
          violates applicable laws, infringes on intellectual property rights, or is otherwise harmful, misleading,
          or offensive.
        </p>

        <p>
          We reserve the right to suspend or terminate accounts that violate these terms without prior notice. We may
          also modify or discontinue parts of the service at any time without liability.
        </p>

        <p>
          Our services may include links to third-party websites. We are not responsible for the content, policies,
          or practices of any external sites.
        </p>

        <p>
          These terms are governed by the laws of the applicable jurisdiction. Any disputes will be subject to the
          exclusive jurisdiction of the courts in that region.
        </p>

        <p>
          We may update these terms at any time. Continued use of the service after any such changes shall constitute
          your consent to such changes.
        </p>

        <p>
          If you have any questions or concerns regarding these Terms of Service, you may contact us at{' '}
          <a href="mailto:support@example.com" className="text-blue-600 underline">support@example.com</a>.
        </p>
      </div>
    </main>
  );
}
