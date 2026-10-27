import { useState } from 'react'

const inputClasses =
  'w-full min-w-0 rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-orange focus:ring-2 focus:ring-orange/15'

function localDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function PlanYourTrip({ plannedTrip, onAddToCart }) {
  const [travelers, setTravelers] = useState(plannedTrip?.travelers ?? 1)
  const [travelDate, setTravelDate] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (!plannedTrip || !travelDate) return

    onAddToCart(plannedTrip.tour, travelers, travelDate)
    setSubmitted(true)
  }

  return (
    <section
      id="plan"
      className="scroll-mt-20 bg-navy px-0 py-14 text-white sm:py-[75px] lg:bg-[linear-gradient(90deg,#0d162a_0%,#0d162a_72%,#252525_72%)]"
    >
      <div className="mx-auto grid w-[min(90%,1180px)] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <p className="mb-2 text-[0.7rem] font-extrabold uppercase tracking-[0.06em] text-orange">
            Your next adventure starts here
          </p>
          <h2 className="max-w-[500px] font-serif text-[clamp(2.1rem,4vw,3.1rem)] font-bold leading-tight tracking-tight">
            Ready for your next big adventure?
          </h2>
          <p className="mb-6 mt-4 max-w-[530px] text-sm text-white/75">
            Choose a tour, confirm the number of travelers, and select your
            travel date. You can review your plans in the trip cart before
            paying.
          </p>
          <div
            className="flex flex-wrap gap-x-0 gap-y-4"
            aria-label="ExploreSouthA statistics"
          >
            {[
              ['50+', 'Destinations'],
              ['12k', 'Happy Travelers'],
              ['150+', 'Expert Guides'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="border-r border-white/25 px-4 first:pl-0 last:border-0 sm:px-6"
              >
                <strong className="block text-2xl">{value}</strong>
                <span className="block text-xs text-white/60">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          onChange={() => setSubmitted(false)}
          className="rounded-[11px] bg-white p-6 text-ink shadow-2xl sm:p-7"
        >
          <h3 className="text-xl font-bold">Plan Your Trip</h3>
          <p className="mb-5 mt-1 text-xs text-muted">
            {plannedTrip
              ? 'Your selected tour is ready. Choose a travel date to add it to your cart.'
              : 'Choose a tour package first to start planning.'}
          </p>

          <label
            htmlFor="destination"
            className="mb-1 block text-xs font-extrabold uppercase"
          >
            Selected tour
          </label>
          <input
            className={`${inputClasses} read-only:bg-surface`}
            id="destination"
            name="destination"
            type="text"
            value={plannedTrip?.tour.name ?? ''}
            placeholder="Select a tour package first"
            readOnly
            required
          />

          <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="travel-date"
                className="mb-1 block text-xs font-extrabold uppercase"
              >
                Travel date
              </label>
              <input
                className={inputClasses}
                id="travel-date"
                name="travelDate"
                type="date"
                min={localDateString()}
                value={travelDate}
                onChange={(event) => setTravelDate(event.target.value)}
                disabled={!plannedTrip}
                required
              />
            </div>
            <div>
              <label
                htmlFor="travelers"
                className="mb-1 block text-xs font-extrabold uppercase"
              >
                Travelers
              </label>
              <input
                className={inputClasses}
                id="travelers"
                name="travelers"
                type="number"
                min="1"
                step="1"
                value={travelers}
                onChange={(event) => setTravelers(Number(event.target.value))}
                disabled={!plannedTrip}
                required
              />
            </div>
          </div>

          <button
            className="w-full rounded-full bg-orange px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={!plannedTrip || submitted}
          >
            {submitted ? 'Added to Trip Cart' : 'Add Trip to Cart'}
          </button>
          {submitted && (
            <p className="mt-3 text-center text-sm font-semibold text-green" role="status">
              Trip added.{' '}
              <a className="underline" href="/cart">
                Review your trip cart
              </a>
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
