const links = [
  { href: '#home', label: 'Home' },
  { href: '#packages', label: 'Tour Packages' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#plan', label: 'Plan Your Trip' },
  { href: '/login', label: 'Sign in' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-[62px] w-[min(90%,1180px)] flex-wrap items-center gap-4 py-3 sm:flex-nowrap sm:gap-7 sm:py-0"
      >
        <a
          href="#home"
          className="shrink-0 font-bold italic text-ink transition-colors hover:text-orange"
        >
          explore<span className="text-orange">SouthA</span>
        </a>
        <ul className="m-0 flex w-full list-none items-center gap-5 overflow-x-auto p-0 text-xs sm:ml-auto sm:w-auto sm:gap-7">
          {links.map(({ href, label }) => (
            <li key={href} className="shrink-0">
              <a
                href={href}
                className="transition-colors hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
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