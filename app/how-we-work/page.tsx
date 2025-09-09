'use client'

const workSteps = [
  {
    step: 'Step 1',
    title: 'Tell Us What You Need',
    desc: 'Start by sharing the goals, expectations, or specific requirements for your project. Whether you have a vague idea or a detailed brief, we’ll take it from there.',
  },
  {
    step: 'Step 2',
    title: 'We Match You With the Right Expert',
    desc: 'Based on your needs, we assign the most suitable writer or specialist from our experienced team — someone who has tackled similar projects and understands your industry.',
  },
  {
    step: 'Step 3',
    title: 'Collaborative Kickoff',
    desc: 'You’ll receive an initial draft or outline for review. This stage ensures we’re aligned with your expectations before diving deeper.',
  },
  {
    step: 'Step 4',
    title: 'Development & Refinement',
    desc: 'Our team works on crafting the final piece — whether that’s writing, strategy, or design — while actively incorporating your feedback if needed.',
  },
  {
    step: 'Step 5',
    title: 'Final Delivery',
    desc: 'Once complete, you’ll receive the final version in your preferred format. Satisfaction is key — we don’t close projects until you’re happy.',
  },
]

export default function HowWeWorkPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-24">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-700">How We Work</h1>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Timeline Steps */}
        <div className="md:w-full space-y-16">
          {workSteps.map((step, i) => (
            <div key={i} className="relative pl-12">
              {/* Number circle */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-blue-500 text-blue-600 font-bold flex items-center justify-center shadow-sm">
                {i + 1}
              </div>

              {/* Step card */}
              <div className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all p-5">
                <div className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-1">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mt-1">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
