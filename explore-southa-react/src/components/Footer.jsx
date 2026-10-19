const footerGroups = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#home' },
      { label: 'Careers', href: '#home' },
      { label: 'Contact', href: '#plan' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#plan' },
      { label: 'Travel Safety', href: '#plan' },
      { label: 'FAQs', href: '#home' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Email Us', href: 'mailto:info@exploresoutha.co.za' },
      {
        label: 'Instagram ↗',
        href: 'https://www.instagram.com/',
        external: true,
      },
      { label: 'Global Coverage', href: '#home' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[#f7f7f7] px-0 pb-5 pt-10 text-[#60656e]">
      <div className="mx-auto grid w-[min(90%,1180px)] grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10">
        <div>
          <strong className="text-sm text-ink">© 2026 ExploreSouthA.</strong>
          <p className="mt-1 max-w-[300px] text-xs">
            Crafting unforgettable journeys for explorers. All rights reserved.
            Registered travel agency.
          </p>
        </div>
        {footerGroups.map(({ title, links }) => (
          <div key={title}>
            <h3 className="mb-2 text-xs font-bold text-ink">{title}</h3>
            {links.map(({ label, href, external }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="my-1 block text-xs transition-colors hover:text-orange"
              >
                {label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-6 flex w-[min(90%,1180px)] flex-wrap justify-center gap-x-3 gap-y-1 border-t border-line pt-4 text-center text-[0.65rem] text-muted">
        <span>123 Adventure Lane, Cape Town, South Africa</span>
        <span>support@exploresoutha.co.za</span>
      </div>
    </footer>
  )
}
