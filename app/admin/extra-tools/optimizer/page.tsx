'use client';

import { useEffect, useState } from 'react';
import CustomDropdown from '@/app/components/ui/customDropdown';
import { Loader2, Timer, Wand2, CheckCircle2, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TestResult {
    route: string;
    time: number;
    timestamp: string;
}

export default function OptimizerPage() {
    const [routes, setRoutes] = useState<string[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<string>('');
    const [loadTime, setLoadTime] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [history, setHistory] = useState<TestResult[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetch('/api/tools/pages')
            .then((res) => res.json())
            .then((data) => setRoutes(data.routes));
    }, []);

    const generateSuggestions = (time: number) => {
        const tips = [];

        if (time > 3000) {
            tips.push(
                'Consider lazy loading components or using dynamic imports.',
            );
            tips.push('Compress large images with WebP or AVIF formats.');
            tips.push('Minimize and defer unused JavaScript and CSS.');
        } else if (time > 1500) {
            tips.push('Enable caching or CDN for static content.');
            tips.push('Review third-party scripts and reduce where possible.');
        } else {
            tips.push('Your page is performing well. Nice job!');
        }

        return tips;
    };

    const handleTest = () => {
        if (!selectedRoute) return;

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';

        const start = performance.now();
        setLoading(true);
        setLoadTime(null);
        setSuggestions([]);

        iframe.onload = () => {
            const end = performance.now();
            const total = end - start;
            setLoadTime(total);
            setSuggestions(generateSuggestions(total));
            setLoading(false);
            document.body.removeChild(iframe);

            const timestamp = new Date().toLocaleString();
            setHistory((prev) => [
                { route: selectedRoute, time: total, timestamp },
                ...prev,
            ]);
        };

        iframe.src = selectedRoute;
        document.body.appendChild(iframe);
    };

    const handleAutoOptimize = () => {
        alert(
            'Auto optimization coming soon — this would trigger real backend logic!',
        );
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Timer className="text-blue-500" /> Page Optimizer
            </h1>

            <div className="space-y-2 text-gray-600">
                <p>Select a page to analyze:</p>
                <CustomDropdown
                    label="Select a page"
                    options={routes}
                    selected={selectedRoute}
                    onChange={setSelectedRoute}
                />
            </div>

            <button
                onClick={handleTest}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition disabled:opacity-50"
                disabled={!selectedRoute || loading}
            >
                {loading && <Loader2 className="animate-spin w-4 h-4" />}
                {loading ? 'Testing...' : 'Measure Load Time'}
            </button>

            <AnimatePresence>
                {mounted && loadTime !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 bg-white p-6 rounded-lg shadow-md border border-green-200"
                    >
                        <div className="flex items-center gap-2 text-green-700 font-medium mb-2">
                            <CheckCircle2 className="w-5 h-5" />
                            Page Analysis Complete
                        </div>
                        <p className="text-gray-800 mb-4">
                            <strong>{selectedRoute}</strong> loaded in{' '}
                            <strong>{loadTime.toFixed(2)} ms</strong>
                        </p>

                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Suggestions
                        </h3>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            {suggestions.map((s, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    {s}
                                </motion.li>
                            ))}
                        </ul>

                        <div className="mt-6">
                            <button
                                onClick={handleAutoOptimize}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                            >
                                <Wand2 className="w-4 h-4" />
                                Auto Optimize
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {mounted && history.length > 0 && (
                <div className="mt-10">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <History className="text-gray-600" /> History
                    </h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700">
                        {history.map((item, idx) => (
                            <li
                                key={idx}
                                className="border border-gray-200 rounded p-2 flex justify-between items-center bg-gray-50"
                            >
                                <span>{item.route}</span>
                                <span>{item.time.toFixed(1)} ms</span>
                                <span className="text-xs text-gray-500">
                                    {item.timestamp}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
