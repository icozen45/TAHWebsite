// components/Footer.tsx
import { Mail, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-sm text-gray-600">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Column 1: About / Summary */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">About This Studio</h2>
          <p className="leading-relaxed">
            We craft premium writing and content solutions across 15+ writing types. Whether you're
            looking for a blog, essay, whitepaper, or something entirely custom — we’re built to deliver.
          </p>
          <p className="mt-4 text-gray-500">
            Let's bring your ideas to life through words that work.
          </p>
        </div>

        {/* Column 2: Links + Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Services", href: "/services" },
                { label: "How We Work", href: "/how-we-work" },
                { label: "Contact", href: "/contact" },
                { label: "Reviews", href: "/reviews" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-black transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info + Social Icons */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Get In Touch</h3>

            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" />
              <a
                href="mailto:hr@goprosol.com"
                className="hover:text-black transition-colors duration-150"
              >
                hr@goprosol.com
              </a>
            </div>

            <div className="flex items-center gap-4 mt-4">
              {[
                { icon: Github, href: "https://github.com" },
                { icon: Linkedin, href: "https://linkedin.com" },
                { icon: Twitter, href: "https://twitter.com" },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors duration-150"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="text-center text-xs text-gray-400 py-6">
        &copy; {new Date().getFullYear()} Global Project Solutions. All rights reserved.
      </div>
    </footer>
  );
}
