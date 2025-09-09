'use client';

import { useEffect, useState } from 'react';
import prettier from 'prettier/standalone';
import parserTypescript from 'prettier/plugins/typescript';
import pluginEstree from 'prettier/plugins/estree';
import { Button } from '@/app/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Highlight, { defaultProps } from 'prism-react-renderer';
import github from 'prism-react-renderer/themes/github';

export default function ComponentLinter() {
  const [inputCode, setInputCode] = useState('');
  const [formattedCode, setFormattedCode] = useState('');
  const [issues, setIssues] = useState<string[]>([]);
  const [lineCountWithSpaces, setLineCountWithSpaces] = useState(true);
  const [hasRun, setHasRun] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canPaste, setCanPaste] = useState(true); // Paste cooldown

  const handleLint = async () => {
    let cleaned = '';
    const warnings: string[] = [];
    setHasRun(true);

    if (!inputCode.trim()) {
      setFormattedCode('');
      setIssues(['⚠️ Paste or write some code first.']);
      return;
    }

    try {
      cleaned = await prettier.format(inputCode, {
        parser: 'typescript',
        plugins: [parserTypescript, pluginEstree],
        semi: true,
        singleQuote: true,
        tabWidth: 4,
      });
    } catch (err: any) {
      console.error('🔥 Prettier full error:', err);
      const msg = err?.message || 'Unknown Prettier error';
      const match = msg.match(/.*\((\d+):(\d+)\)/);
      const location = match ? ` at line ${match[1]}, column ${match[2]}` : '';
      const stack = err?.stack ? `\n\nStack Trace:\n${err.stack}` : '';
      warnings.push(`❌ Prettier Error: ${msg}${location}${stack}`);
    }

    if (/console\.log/.test(inputCode)) {
      warnings.push('⚠️ Avoid using console.log in production code.');
    }

    if (
      /useEffect\s*\(\s*\(\s*.*?\s*\)\s*=>\s*{[^}]*}\s*\)/gs.test(inputCode)
    ) {
      warnings.push('⚠️ useEffect missing dependency array.');
    }

    if (/\.map\(/.test(inputCode) && !/key=/.test(inputCode)) {
      warnings.push('⚠️ Possibly missing key prop in .map().');
    }

    const varMatches = inputCode.matchAll(/(?:const|let)\s+(\w+)\s*=/g);
    const declaredVars = [...varMatches].map((m) => m[1]);
    declaredVars.forEach((v) => {
      const re = new RegExp(`\\b${v}\\b`, 'g');
      const matches = [...inputCode.matchAll(re)];
      if (matches.length <= 1) {
        warnings.push(`⚠️ Variable "${v}" declared but never used.`);
      }
    });

    setFormattedCode(cleaned);
    setIssues(warnings);
  };

  const totalLines = inputCode.split('\n').length;
  const nonEmptyLines = inputCode
    .split('\n')
    .filter((line) => line.trim() !== '').length;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (!canPaste) {
        e.preventDefault();
        console.warn('🚫 Paste blocked during cooldown.');
        return;
      }

      const pasted = e.clipboardData?.getData('text');
      if (pasted) {
        setCanPaste(false);
        setInputCode(pasted);
        setTimeout(() => {
          handleLint();
          setCanPaste(true);
        }, 1500); // 1.5s cooldown
      }
    };

    window.addEventListener('paste', onPaste as any);
    return () => window.removeEventListener('paste', onPaste as any);
  }, [canPaste]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* LEFT PANEL */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          🧹 Component Linter
        </h2>

        <textarea
          rows={20}
          placeholder="Paste your React/TSX component code here..."
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 text-gray-600 font-mono resize-none overflow-y-auto"
          style={{ maxHeight: '450px' }}
        />

        <div className="flex items-center justify-between">
          <Button type="button" onClick={handleLint}>
            🧼 Lint & Auto-Fix
          </Button>
          <div className="text-sm text-gray-700">
            {lineCountWithSpaces
              ? `Lines: ${totalLines}`
              : `Non-empty: ${nonEmptyLines}`}
            <button
              onClick={() => setLineCountWithSpaces((prev) => !prev)}
              className="ml-2 underline text-blue-600"
            >
              Toggle
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      {hasRun && (
        <div className="space-y-4">
          <AnimatePresence>
            {formattedCode && (
              <motion.div
                key="formatted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-100 p-4 rounded-md overflow-x-auto relative"
              >
                <h3 className="font-semibold mb-2">✨ Auto-Fixed Code</h3>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-4 text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <Highlight
                  {...defaultProps}
                  code={formattedCode}
                  language="tsx"
                  theme={github}
                >
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) => (
                    <pre className={`${className} text-sm`} style={style}>
                      {tokens.map((line, i) => (
                        <div
                          key={i}
                          {...getLineProps({ line })}
                          className="flex"
                        >
                          <span className="w-8 text-right pr-4 text-gray-400 select-none">
                            {i + 1}
                          </span>
                          <span className="flex-1">
                            {line.map((token, key) => {
                              const tokenProps = getTokenProps({ token });
                              const { key: tokenKey, ...rest } = tokenProps;
                              return <span key={key} {...rest} />;
                            })}
                          </span>
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {issues.length > 0 && (
              <motion.div
                key="issues"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-yellow-50 border border-yellow-300 p-4 rounded-md"
              >
                <h3 className="font-semibold mb-2">
                  🚨 Detected Issues ({issues.length})
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-yellow-900 whitespace-pre-wrap break-all">
                  {issues.map((issue, i) => (
                    <li key={`warn-${i}`}>{issue}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
