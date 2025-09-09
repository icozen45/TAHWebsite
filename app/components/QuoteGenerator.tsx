'use client';

import { useState } from 'react';

export default function QuoteGenerator() {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQuote = async () => {
    setLoading(true);
    const res = await fetch('/api/quote', { method: 'POST' });
    const data = await res.json();
    setQuote(data.quote);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-md w-full sticky top-20">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">AI Quote Generator</h2>
      <button
        onClick={generateQuote}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Quote'}
      </button>
      {quote && (
        <p className="text-gray-700 italic mt-6">“{quote}”</p>
      )}
    </div>
  );
}
