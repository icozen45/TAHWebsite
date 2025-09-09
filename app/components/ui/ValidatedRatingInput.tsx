// components/ui/ValidatedRatingInput.tsx

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { showCustomToast } from '@/app/components/ui/customToast'

interface ValidatedRatingInputProps {
  value: string
  rows?: number
  onChange: (value: string) => void
  placeholder?: string
}

export default function ValidatedRatingInput({
  value,
  onChange,
  placeholder = 'Enter rating...',
}: ValidatedRatingInputProps) {
  const [lastValidValue, setLastValidValue] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value

    // Allow empty input
    if (input.trim() === '') {
      onChange('')
      setLastValidValue('')
      return
    }

    // Regex: float between 0 and 5 with up to one decimal place
    const floatRegex = /^([0-4](\.\d{0,1})?|5(\.0?)?)$/
    if (floatRegex.test(input)) {
      onChange(input)
      setLastValidValue(input)
    } else {
      showCustomToast('Invalid rating', 'Rating must be between 0.0 and 5.0')
    }
  }

  return (
    <motion.input
      type="number"
      step="0.1"
      min="0"
      max="5"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 outline-none"
      initial={{ boxShadow: 'inset 0 0 0px rgba(0, 0, 0, 0.2)' }}
      whileFocus={{ boxShadow: 'inset 0 0 0 2px rgba(59, 130, 246, 0.5)' }}
    />
  )
}
