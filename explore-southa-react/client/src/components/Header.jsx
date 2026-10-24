import { useState } from 'react'

const links = [
  { href: '#home', label: 'Home' },
  { href: '#packages', label: 'Tour Packages' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#plan', label: 'Plan Your Trip' },
  { href: '/login', label: 'Sign in' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex min-h-[62px] w-[min(90%,1180px)] items-center justify-between sm:gap-7"
      >
        <a
          href="#home"
          className="shrink-0 font-bold italic text-ink transition-colors hover:text-orange"
          onClick={() => setMenuOpen(false)}
        >
          explore<span className="text-orange">SouthA</span>
        </a>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-ink hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange sm:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="size-6"
          >
            {menuOpen ? (
              <path d="m6 6 12 12M18 6 6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <ul
          id="main-navigation-links"
          className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 top-full m-0 w-full list-none flex-col gap-1 border-t border-line bg-white p-2 text-sm shadow-lg sm:static sm:ml-auto sm:flex sm:w-auto sm:flex-row sm:items-center sm:gap-7 sm:border-0 sm:bg-transparent sm:p-0 sm:text-xs sm:shadow-none`}
        >
          {links.map(({ href, label }) => (
            <li key={href} className="shrink-0">
              <a
                href={href}
                className="block rounded px-3 py-2 transition-colors hover:bg-surface hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange sm:px-0 sm:py-1 sm:hover:bg-transparent"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}