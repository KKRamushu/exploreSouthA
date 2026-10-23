import TestimonialCard from './TestimonialCard.jsx'
import { useEffect, useState } from 'react'

const avatarColors = ['bg-[#c99a64]', 'bg-[#c8a35a]', 'bg-[#d75d7d]']

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const response = await fetch('/api/testimonials')

        if (!response.ok) {
          throw new Error(
            `Could not load traveler testimonials (${response.status})`,
          )
        }

        const data = await response.json()
        const displayTestimonials = data.map((testimonial, index) => ({
          ...testimonial,
          initials: testimonial.name
            .split(/\s+/)
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          avatarColor: avatarColors[index % avatarColors.length],
        }))
        setTestimonials(displayTestimonials)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadTestimonials()
  }, [])

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 bg-[#eef0f3] px-0 py-14 sm:py-[75px]"
    >
      <div className="mx-auto w-[min(90%,1180px)]">
        <div className="mb-10 text-center">
          <p className="mb-2 text-[0.7rem] font-extrabold uppercase tracking-[0.06em] text-orange">
            Guest reviews
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.65rem)] font-bold leading-tight tracking-tight">
            What Our Travelers Say
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-4 block h-[3px] w-[55px] bg-orange"
          />
        </div>

        {loading && <p role="status">Loading testimonials...</p>}
        {error && <p role="alert">Could not load testimonials: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
