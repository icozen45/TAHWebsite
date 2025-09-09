// components/LeadForm.tsx
'use client';

import React, { useState } from 'react';
import CustomDropdown from './ui/customDropdown';

interface FieldConfig {
  type: 'text' | 'file' | 'dropdown';
  options?: string[]; // only for dropdown
}

interface LeadFormProps {
  aiGenerated?: boolean;
  fields: Record<string, FieldConfig>;
}

export default function LeadForm({ aiGenerated, fields }: LeadFormProps) {
  // keep all form values in one object
  const initialState = Object.keys(fields).reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {} as Record<string, string>);

  const [formData, setFormData] = useState<Record<string, string>>(initialState);

  const handleTextChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (key: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setFormData((prev) => ({ ...prev, [key]: files[0].name }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data', formData);
    // send somewhere or handle
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white p-6 rounded-xl shadow space-y-5"
    >
      {aiGenerated && (
        <p className="text-sm text-green-600 font-semibold border border-green-300 rounded px-2 py-1 inline-block">
          Not AI Generated
        </p>
      )}

      {Object.entries(fields).map(([key, config]) => {
        switch (config.type) {
          case 'dropdown':
            return (
              <CustomDropdown
                key={key}
                label={key}
                options={config.options || []}
                selected={formData[key]}
                onChange={(val) => handleTextChange(key, val)}
              />
            );
          case 'file':
            return (
              <div key={key} className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">
                  {key}
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(key, e.target.files)}
                  className="border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-100"
                />
              </div>
            );
          default:
            return (
              <div key={key} className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700">
                  {key}
                </label>
                <input
                  type="text"
                  value={formData[key]}
                  onChange={(e) => handleTextChange(key, e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-100 shadow-md"
                />
              </div>
            );
        }
      })}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
