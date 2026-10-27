import TravelerStepper from './TravelerStepper.jsx'

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function TripCart({
  items,
  onUpdateTravelers,
  onRemove,
  onCheckout,
  checkoutLoading,
  checkoutError,
}) {
  const totalInCents = items.reduce(
    (total, item) => total + item.priceInCents * item.travelers,
    0,
  )

  return (
    <section id="cart" className="scroll-mt-20 bg-surface px-0 py-14 sm:py-[75px]">
      <div className="mx-auto w-[min(90%,1180px)]">
        <p className="mb-2 text-[0.7rem] font-extrabold uppercase tracking-[0.06em] text-orange">
          Review before booking
        </p>
        <h2 className="font-serif text-[clamp(2rem,4vw,2.65rem)] font-bold leading-tight tracking-tight">
          Your Trip Cart
        </h2>
        <p className="mb-7 mt-3 max-w-[600px] text-sm text-muted">
          Review your planned tours and traveler counts before continuing to
          payment.
        </p>

        {items.length === 0 ? (
          <div className="rounded-[10px] border border-line bg-white p-6 text-center">
            <p className="font-semibold">Your trip cart is empty.</p>
            <a
              href="/#packages"
              className="mt-3 inline-block text-sm font-bold text-orange hover:text-orange-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              Browse tour packages
            </a>
          </div>
        ) : (
          <div className="rounded-[10px] border border-line bg-white p-5 shadow-sm sm:p-7">
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.travelDate}`}
                  className="flex flex-col gap-4 py-5 first:pt-0 sm:flex-row sm:items-center"
                >
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="h-24 w-full rounded-md object-cover sm:w-36"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {usd.format(item.priceInCents / 100)} per traveler
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ink">
                      Travel date:{' '}
                      {new Date(`${item.travelDate}T00:00:00`).toLocaleDateString(
                        'en-US',
                        { dateStyle: 'long' },
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold text-muted">
                        Travelers
                      </span>
                      <TravelerStepper
                        value={item.travelers}
                        onChange={(travelers) =>
                          onUpdateTravelers(
                            item.id,
                            item.travelDate,
                            travelers,
                          )
                        }
                      />
                    </div>
                    <div className="min-w-24 text-right">
                      <span className="block text-xs text-muted">Subtotal</span>
                      <span className="font-bold">
                        {usd.format(
                          (item.priceInCents * item.travelers) / 100,
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id, item.travelDate)}
                        className="mt-2 block w-full text-xs font-semibold text-red-700 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-line pt-5">
              <span className="text-base font-bold">Estimated total</span>
              <span className="text-xl font-bold">{usd.format(totalInCents / 100)}</span>
            </div>
            <p className="mt-2 text-right text-xs text-muted">
              Full payment in USD; final amount is confirmed at checkout.
            </p>
            {checkoutError && (
              <p className="mt-4 text-right text-sm text-red-700" role="alert">
                Could not start checkout: {checkoutError}
              </p>
            )}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onCheckout}
                disabled={checkoutLoading || items.length === 0}
                className="rounded-full bg-orange px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-wait disabled:opacity-60"
              >
                {checkoutLoading ? 'Preparing checkout...' : 'Proceed to checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
