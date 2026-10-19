import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import TourPackage from './components/TourPackage'
import Testimonials from './components/Testimonials'
import PlanYourTrip from './components/PlanYourTrip'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <main>
        <Hero />
        <TourPackage />
        <Testimonials />
        <PlanYourTrip />
        <Footer />

      </main>
    </>
  )
}

export default App
