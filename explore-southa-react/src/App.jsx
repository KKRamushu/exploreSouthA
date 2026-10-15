import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import TourPackages from './components/TourPackage.jsx'
import Testimonials from './components/Testimonials.jsx'

function App() {

  return (
    <body >
      <Header />
      <main>
        <Hero />
        <TourPackages />
        <Testimonials />
      </main>
    </body>
  )
}

export default App
