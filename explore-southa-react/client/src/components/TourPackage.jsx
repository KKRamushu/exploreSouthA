import { useState } from 'react'
import TourCard from './TourCard.jsx'
import { tours } from '../data/tours.js'

const categories = [
  { id: 'all', label: 'All tours' },
  { id: 'coastal', label: 'Coastal' },
  { id: 'wildlife', label: 'Wildlife' },
]

export default function TourPackages() {
  const [category, setCategory] = useState('all')
  const filteredTours =
    category === 'all'
      ? tours
      : tours.filter((tour) => tour.category === category)

  return (
    <section id="packages" className="scroll-mt-20 px-0 py-14 sm:py-[75px]">
      <div className="mx-auto w-[min(90%,1180px)]">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[0.7rem] font-extrabold uppercase tracking-[0.06em] text-orange">
              Premium experiences
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,2.65rem)] font-bold leading-tight tracking-tight">
              Featured Tour Packages
            </h2>
            <p className="mt-3 max-w-[600px] text-sm text-muted">
              Hand-picked journeys across South Africa, crafted with local
              expertise for the modern explorer.
            </p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filter tour packages">
            {categories.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                aria-pressed={category === id}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                  category === id
                    ? 'border-orange bg-orange text-white'
                    : 'border-line bg-white text-ink hover:border-orange hover:text-orange'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-3">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  )
}
