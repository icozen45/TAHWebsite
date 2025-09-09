// CustomTextarea.tsx

import { ChangeEvent } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'

interface Props extends HTMLMotionProps<'textarea'> {
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  label?: string
}

export default function CustomTextarea({
  value,
  onChange,
  label,
  className,
  ...props
}: Props) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
      )}
      <motion.textarea
        value={value}
        onChange={onChange}
        {...props}
        className={clsx(
          'w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out',
          className
        )}
        initial={{ boxShadow: '0 0 0px rgba(59,130,246,0.5)' }}
        whileFocus={{ boxShadow: '0 0 8px rgba(59,130,246,0.8)' }}
        rows={props.rows ?? 3}
      />
    </div>
  )
}
