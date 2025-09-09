import { faqItems } from '@/data/faqItems';
import Accordion from '@/app/components/accordion';

const groupedFAQs = faqItems.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {} as Record<string, typeof faqItems>);

export default function FAQPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Frequently Asked Questions</h1>
      
      <div className="space-y-12">
        {Object.entries(groupedFAQs).map(([category, items]) => (
          <section key={category}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-600 pb-2">{category}</h2>
            <Accordion items={items} />
          </section>
        ))}
      </div>
    </main>
  );
}
