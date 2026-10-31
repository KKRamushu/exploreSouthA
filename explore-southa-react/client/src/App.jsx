import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import TourPackage from './components/TourPackage'
import TripCart from './components/TripCart'
import Testimonials from './components/Testimonials'
import PlanYourTrip from './components/PlanYourTrip'
import Footer from './components/Footer'
import Login from './components/Login'

const cartStorageKey = 'exploreSouthA.tripCart'

function isValidCartDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function readCart() {
  try {
    const savedCart = window.localStorage.getItem(cartStorageKey)
    if (!savedCart) return []

    const parsedCart = JSON.parse(savedCart)
    if (
      !Array.isArray(parsedCart) ||
      parsedCart.some(
        (item) =>
          !item ||
          typeof item.id !== 'string' ||
          typeof item.name !== 'string' ||
          typeof item.image !== 'string' ||
          typeof item.imageAlt !== 'string' ||
          !Number.isSafeInteger(item.priceInCents) ||
          item.priceInCents < 0 ||
          !Number.isSafeInteger(item.travelers) ||
          item.travelers < 1 ||
          !isValidCartDate(item.travelDate),
      )
    ) {
      throw new Error('Saved trip cart has an invalid format.')
    }

    return parsedCart
  } catch (error) {
    console.error('Could not restore the saved trip cart:', error)
    return []
  }
}

function getInitialCheckoutStatus() {
  if (window.location.pathname !== '/cart') return null

  const params = new URLSearchParams(window.location.search)
  if (params.get('checkout') === 'cancelled') {
    return { state: 'cancelled' }
  }
  if (params.get('checkout') === 'success') {
    return params.get('session_id')
      ? { state: 'checking' }
      : {
          state: 'error',
          message: 'The checkout return did not include a session reference.',
        }
  }

  return null
}

function App() {
  const [cart, setCart] = useState(readCart)
  const [plannedTrip, setPlannedTrip] = useState(null)
  const [planVersion, setPlanVersion] = useState(0)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [checkoutStatus, setCheckoutStatus] = useState(getInitialCheckoutStatus)
  const [cancellationLoading, setCancellationLoading] = useState(false)
  const [cancellationError, setCancellationError] = useState('')

  useEffect(() => {
    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(cart))
    } catch (error) {
      console.error('Could not save the trip cart:', error)
    }
  }, [cart])

  useEffect(() => {
    if (window.location.pathname !== '/cart') return

    const params = new URLSearchParams(window.location.search)
    if (params.get('checkout') !== 'success') return

    const sessionId = params.get('session_id')
    if (!sessionId) return

    let active = true
    async function checkBooking() {
      for (let attempt = 0; attempt < 15 && active; attempt += 1) {
        try {
          const response = await fetch(
            `/api/checkout-sessions/${encodeURIComponent(sessionId)}`,
            { cache: 'no-store' },
          )
          const result = await response.json()
          if (!response.ok) {
            throw new Error(result.error || `Booking check failed (${response.status}).`)
          }

          if (!active) return
          if (result.status === 'paid') {
            setCheckoutStatus({ state: 'paid', booking: result })
            setCart([])
            return
          }
          if (
            result.status === 'payment_failed' ||
            result.status === 'expired' ||
            result.status === 'cancellation_requested'
          ) {
            setCheckoutStatus({ state: result.status, booking: result })
            return
          }
          setCheckoutStatus({ state: 'checking', booking: result })
        } catch (error) {
          if (active) {
            setCheckoutStatus({ state: 'error', message: error.message })
          }
          return
        }

        await new Promise((resolve) => window.setTimeout(resolve, 2000))
      }

      if (active) setCheckoutStatus({ state: 'pending' })
    }

    checkBooking()
    return () => {
      active = false
    }
  }, [])

  if (window.location.pathname === '/login') {
    return <Login />
  }

  function planTrip(tour, travelers) {
    setPlannedTrip({ tour, travelers })
    setPlanVersion((version) => version + 1)
    window.requestAnimationFrame(() => {
      document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  function addToCart(tour, travelers, travelDate) {
    setCart((items) => {
      const existingItem = items.find(
        (item) => item.id === tour.id && item.travelDate === travelDate,
      )
      if (existingItem) {
        return items.map((item) =>
          item.id === tour.id && item.travelDate === travelDate
            ? { ...item, travelers: item.travelers + travelers }
            : item,
        )
      }

      return [
        ...items,
        {
          id: tour.id,
          name: tour.name,
          image: tour.image,
          imageAlt: tour.imageAlt,
          priceInCents: tour.priceInCents,
          travelers,
          travelDate,
        },
      ]
    })
  }

  function updateCartTravelers(tourId, travelDate, travelers) {
    setCart((items) =>
      items.map((item) =>
        item.id === tourId && item.travelDate === travelDate
          ? { ...item, travelers }
          : item,
      ),
    )
  }

  function removeFromCart(tourId, travelDate) {
    setCart((items) =>
      items.filter(
        (item) => item.id !== tourId || item.travelDate !== travelDate,
      ),
    )
  }

  async function handleCheckout() {
    setCheckoutLoading(true)
    setCheckoutError('')

    try {
      const response = await fetch('/api/checkout-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(({ id, travelers, travelDate }) => ({
            tourId: id,
            travelers,
            travelDate,
          })),
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || `Checkout failed (${response.status}).`)
      }
      if (typeof result.url !== 'string') {
        throw new Error('Checkout response did not include a URL.')
      }

      window.location.assign(result.url)
    } catch (error) {
      setCheckoutError(error.message)
      setCheckoutLoading(false)
    }
  }

  async function handleCancellationRequest() {
    const sessionId = new URLSearchParams(window.location.search).get('session_id')
    if (!sessionId) {
      setCancellationError('The booking session reference is missing.')
      return
    }

    setCancellationLoading(true)
    setCancellationError('')
    try {
      const response = await fetch(
        `/api/checkout-sessions/${encodeURIComponent(sessionId)}/cancellation-request`,
        { method: 'POST' },
      )
      const result = await response.json()
      if (!response.ok) {
        throw new Error(
          result.error || `Cancellation request failed (${response.status}).`,
        )
      }

      setCheckoutStatus((current) => ({
        ...current,
        state: result.status,
        booking: { ...current.booking, status: result.status },
      }))
    } catch (error) {
      setCancellationError(error.message)
    } finally {
      setCancellationLoading(false)
    }
  }

  const cartCount = cart.reduce((total, item) => total + item.travelers, 0)
  const tripCart = (
    <TripCart
      items={cart}
      onUpdateTravelers={updateCartTravelers}
      onRemove={removeFromCart}
      onCheckout={handleCheckout}
      checkoutLoading={checkoutLoading}
      checkoutError={checkoutError}
      checkoutStatus={checkoutStatus}
      onRequestCancellation={handleCancellationRequest}
      cancellationLoading={cancellationLoading}
      cancellationError={cancellationError}
    />
  )

  if (window.location.pathname === '/cart') {
    return (
      <>
        <Header cartCount={cartCount} />
        <main>{tripCart}</main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header cartCount={cartCount} />
      <main>
        <Hero />
        <TourPackage onPlanTrip={planTrip} />
        <Testimonials />
        <PlanYourTrip
          key={planVersion}
          plannedTrip={plannedTrip}
          onAddToCart={addToCart}
        />
        <Footer />

      </main>
    </>
  )
}

export default App
