'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { HiMenu, HiX } from 'react-icons/hi'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobilePoliciesOpen, setMobilePoliciesOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const navRef = useRef<HTMLDivElement>(null)

  const links = [
    { href: '/services', label: 'Services' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/reviews', label: 'Reviews' }
  ]

  const policyLinks = [
    { href: '/policies/terms', label: 'Terms and Conditions' },
    { href: '/policies/data-use', label: 'How We Use Your Data' },
    { href: '/policies/privacy', label: 'Privacy Policy' }
  ]

  // Handle click outside for dropdown and mobile nav
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
        setIsOpen(false)
        setMobilePoliciesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setDropdownOpen(false)
    setMobilePoliciesOpen(false)
  }, [pathname])

  return (
    <nav className="fixed top-0 left-0 w-full z-51 bg-white/60 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
            Global Project Solutions
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-medium transition ${
                  mounted && pathname === href
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {label}
              </Link>
            ))}

            {/* Policies Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 font-medium text-gray-700 hover:text-blue-600 transition"
              >
                Policies <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 min-w-[220px] bg-white shadow-lg rounded-md py-2 z-50 border border-gray-200 animate-fade-in">
                  {policyLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 text-3xl"
              aria-label="Toggle Menu"
            >
              {isOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div
        ref={navRef}
        className={`md:hidden fixed top-16 left-0 w-full transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="bg-blue-50 shadow-lg rounded-b-lg py-4 px-6 space-y-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block w-full text-center py-2 font-medium rounded-md transition ${
                mounted && pathname === href
                  ? 'text-blue-700 bg-blue-100'
                  : 'text-gray-800 hover:bg-blue-100'
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Mobile Policies Dropdown */}
          <div className="w-full text-center">
            <button
              onClick={() => setMobilePoliciesOpen(!mobilePoliciesOpen)}
              className="w-full flex justify-center items-center gap-1 text-gray-800 font-medium py-2 hover:bg-blue-100 rounded-md transition"
            >
              Policies
              {mobilePoliciesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {mobilePoliciesOpen && (
              <div className="mt-1 space-y-1 animate-fade-in">
                {policyLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block text-sm text-blue-800 bg-white rounded-md py-2 px-4 hover:bg-blue-100 transition"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
