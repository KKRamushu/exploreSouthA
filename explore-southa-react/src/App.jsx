import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'

function App() {

  return (
    <body >
      <Header />
      <main>
        <Hero />
      </main>
    </body>
  )
}

export default App
