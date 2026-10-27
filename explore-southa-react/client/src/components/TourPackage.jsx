import { useState, useEffect } from 'react'
import TourCard from './TourCard.jsx'


const categories = [
  { id: 'all', label: 'All tours' },
  { id: 'coastal', label: 'Coastal' },
  { id: 'wildlife', label: 'Wildlife' },
]

export default function TourPackages({ onPlanTrip }) {

  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
  async function loadTours() {
    try {
      const response = await fetch('/api/tours')

      if (!response.ok) {
        throw new Error(`Could not load tours (${response.status})`)
      }

      const data = await response.json()

      const displayTours = data.map((tour) => {
        const [wholePrice, cents] = Number(tour.price).toFixed(2).split('.')

        return {
          ...tour,
          duration: `⏱ ${tour.durationDays} days / ${tour.durationNights} nights`,
          price: Number(wholePrice).toLocaleString('en-US'),
          cents,
          priceInCents: Math.round(Number(tour.price) * 100),
        }
      })

      setTours(displayTours)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  loadTours()
}, [])

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

        {loading && <p role="status">Loading tours...</p>}

        {error && <p role="alert">Could not load tours: {error}</p>}

        {!loading && !error && (
        <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-3">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} onPlanTrip={onPlanTrip} />
          ))}
        </div>
        )}
      </div>
    </section>
  )
}
