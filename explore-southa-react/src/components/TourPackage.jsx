import { useState } from 'react'
import TourCard from './TourCard'
import { tours } from '../data/tours'

export default function TourPackages() {
  const [category, setCategory] = useState('all')

  const filteredTours = tours.filter((tour) => {
    if (category === 'all') {
      return true
    }

    return tour.category === category
  })

  return (
    <section id="packages">
      <h2>Explore Our Tour Packages</h2>
      <p>Discover your next South African adventure.</p>

      <div>
        <button
          type="button"
          onClick={() => setCategory('all')}
          aria-pressed={category === 'all'}
        >
          All Tours
        </button>

        <button
          type="button"
          onClick={() => setCategory('coastal')}
          aria-pressed={category === 'coastal'}
        >
          Coastal
        </button>

        <button
          type="button"
          onClick={() => setCategory('wildlife')}
          aria-pressed={category === 'wildlife'}
        >
          Wildlife
        </button>
      </div>

      <div>
        {filteredTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      {filteredTours.length === 0 && (
        <p>No tours match this category.</p>
      )}
    </section>
  )
}
