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

function App() {
  const [cart, setCart] = useState(readCart)
  const [plannedTrip, setPlannedTrip] = useState(null)
  const [planVersion, setPlanVersion] = useState(0)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  useEffect(() => {
    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(cart))
    } catch (error) {
      console.error('Could not save the trip cart:', error)
    }
  }, [cart])

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

  const cartCount = cart.reduce((total, item) => total + item.travelers, 0)
  const tripCart = (
    <TripCart
      items={cart}
      onUpdateTravelers={updateCartTravelers}
      onRemove={removeFromCart}
      onCheckout={handleCheckout}
      checkoutLoading={checkoutLoading}
      checkoutError={checkoutError}
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
