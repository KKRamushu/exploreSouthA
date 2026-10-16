import { useState } from 'react'
import TravelerStepper from './TravelerStepper'

export default function TourCard({ tour }) {
  const [travelers, setTravelers] = useState(1)

  return (
    <article>
      <img src={tour.image} alt={tour.name} />

      <h3>{tour.name}</h3>
      <p>{tour.duration}</p>

      <ul>
        {tour.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>

      <p>{tour.price}</p>

      <TravelerStepper
        value={travelers}
        onChange={setTravelers}
      />

      <a href="#plan">Plan This Trip</a>
    </article>
  )
}