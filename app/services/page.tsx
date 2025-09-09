'use client';

import { useState, useRef, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import {
  FileText,
  PenLine,
  Users,
  Search,
  Sliders,
  CheckCircle,
  Filter,
} from 'lucide-react';
import { servicesData } from '@/data/servicesData';
import { tagInfo } from '@/data/tagInfo';
import Drawer from '@/app/components/drawer';
import Link from 'next/link';

const allCategories = Array.from(new Set(servicesData.map((s) => s.category))).sort();

const steps = [
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Pick a Project Type',
    desc: 'Browse through 30+ writing-focused projects and select one that fits your needs.',
    bg: 'bg-blue-100 text-blue-600',
  },
  {
    icon: <Sliders className="w-6 h-6" />,
    title: 'Request Customization',
    desc: 'Need a tweak? We’re flexible. Get in touch to adjust scope, voice, or direction.',
    bg: 'bg-green-100 text-green-600',
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: 'Get Your Content',
    desc: 'Our team gets to work and delivers content you’ll love—on time and on brand.',
    bg: 'bg-purple-100 text-purple-600',
  },
];

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 100, damping: 20 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (isInView) motionValue.set(target);
  }, [isInView, target]);

  useEffect(() => {
    return spring.on('change', (v) => setCurrent(Math.floor(v)));
  }, [spring]);

  return <span ref={ref}>{current}</span>;
}

function Carousel() {
  const testimonials = [
    'This service saved me countless hours!',
    'Brilliantly written content, super happy.',
    'They understood my needs perfectly.',
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-20 bg-gray-100 rounded-xl p-6 text-center max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="text-gray-700 font-medium italic"
        >
          "{testimonials[index]}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default function ProjectsPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [projects, setProjects] = useState(servicesData);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const tagPopupRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(howRef, { once: true });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tagPopupRef.current && !tagPopupRef.current.contains(event.target as Node)) {
        setActiveTag(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let filtered = servicesData;
    if (activeTag) filtered = filtered.filter((p) => p.tags.includes(activeTag));
    if (activeCategory) filtered = filtered.filter((p) => p.category === activeCategory);
    setProjects(filtered);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTag, activeCategory]);

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 relative ml-15">
      <main className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center text-gray-700">Services</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Explore over 30 writing-focused services built to meet real client needs across 15+ writing domains.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-gray-700 mb-16">
          {[ 
            { icon: <FileText className="w-8 h-8 text-blue-600" />, value: 1200, label: 'Projects Delivered' },
            { icon: <PenLine className="w-8 h-8 text-green-600" />, value: 15, label: 'Writing Domains' },
            { icon: <Users className="w-8 h-8 text-purple-600" />, value: 12, label: 'Years Combined Experience' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              {item.icon}
              <h3 className="text-3xl font-bold text-gray-800">
                <CountUp target={item.value} />+
              </h3>
              <p className="text-sm text-gray-600 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* How We Work */}
        <div ref={howRef} className="max-w-xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">How We Work</h2>
          <div className="space-y-10">
            {steps.map((step) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="flex items-start gap-4"
              >
                <div className={`p-3 rounded-full ${step.bg}`}>{step.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <Carousel />

        {/* Filters Button (mobile only) */}
        <div className="flex justify-center lg:hidden mt-12 mb-8">
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Mobile Drawer Filter */}
        <Drawer isOpen={showFilters} onClose={() => setShowFilters} title="Filters">
          <div className="flex flex-wrap gap-3 mb-6">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory((prev) => (prev === category ? null : category));
                  setShowFilters(false);
                }}
                className={`px-4 py-2 rounded-full border text-sm transition ${
                  activeCategory === category
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
            {activeCategory && (
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setShowFilters(false);
                }}
                className="text-sm text-blue-600 underline"
              >
                Clear
              </button>
            )}
          </div>
        </Drawer>

        {/* Projects Grid */}
        <h2 className="text-3xl font-bold text-center mt-24 mb-6 text-gray-700">Services We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -2, scale: 1.015 }}
              className="bg-white border p-6 rounded-2xl shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    key={tag}
                    onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full hover:bg-blue-200 transition"
                  >
                    #{tag}
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mb-2">Category: {project.category}</p>
              <Link
                href={{ pathname: '/services/calculator', query: { style: project.title } }}
                className="inline-block bg-black text-white rounded-full px-4 py-2 text-sm hover:bg-gray-900 transition"
              >
                Check Pricing
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Tag Popup */}
        <AnimatePresence>
          {activeTag && tagInfo[activeTag] && (
            <motion.div
              ref={tagPopupRef}
              key={activeTag}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-8 right-8 w-72 bg-white border border-gray-200 shadow-xl rounded-xl p-4 z-50"
            >
              <h3 className="text-lg font-semibold mb-2 text-blue-800">{activeTag}</h3>
              <p className="text-sm text-gray-700">{tagInfo[activeTag].description}</p>
              {tagInfo[activeTag].examples?.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                  {tagInfo[activeTag].examples.map((example, i) => (
                    <li key={i}>{example}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="mt-24 text-center pb-8">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">Need something custom?</h2>
          <p className="mb-4 text-gray-600">
            Let’s bring your idea to life. Call us at <strong>(+92) 300-0000000</strong>
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Contact Us
          </motion.button>
        </div>
      </main>
    </div>
  );
}
