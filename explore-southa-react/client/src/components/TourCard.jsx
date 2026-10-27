import { useState } from 'react'
import TravelerStepper from './TravelerStepper.jsx'

export default function TourCard({ tour, onPlanTrip }) {
  const [travelers, setTravelers] = useState(1)

  return (
    <article className="flex overflow-hidden rounded-[10px] border border-line bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex w-full flex-col">
        <img
          src={tour.image}
          alt={tour.imageAlt}
          className="h-[225px] w-full object-cover"
          loading="lazy"
        />
        <div className="flex flex-1 flex-col p-5">
          <p className="mb-2 text-xs text-muted">{tour.duration}</p>
          <h3 className="mb-3 text-lg font-bold">{tour.name}</h3>
          <ul className="mb-5 space-y-1 text-sm text-muted">
            {tour.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2">
                <span aria-hidden="true" className="font-bold text-orange">
                  *
                </span>
                {highlight}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
            <div>
              <span className="block text-[0.62rem] font-semibold uppercase tracking-wider text-muted">
                Starting from
              </span>
              <p className="font-bold">
                ${tour.price}
                <sup className="text-xs">{tour.cents}</sup>
              </p>
            </div>
            <button
              type="button"
              onClick={() => onPlanTrip(tour, travelers)}
              className="rounded-full bg-orange px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              Plan this trip
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
            <span className="text-xs font-semibold text-muted">Travelers</span>
            <TravelerStepper value={travelers} onChange={setTravelers} />
          </div>
        </div>
      </div>
    </article>
  )
}
