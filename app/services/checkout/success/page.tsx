'use client'

import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    // Set flag to ensure this only renders on client
    setHasMounted(true)

    // Clear the cart from localStorage
    localStorage.removeItem('cart')
  }, [])

  if (!hasMounted) return null // Prevent hydration mismatch

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black p-8">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-4 text-lg">Thank you for your order.</p>
    </div>
  )
}
