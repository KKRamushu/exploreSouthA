import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import TourPackage from './components/TourPackage'
import Testimonials from './components/Testimonials'
import PlanYourTrip from './components/PlanYourTrip'
import Footer from './components/Footer'
import Login from './components/Login'

function App() {
  if (window.location.pathname === '/login') {
    return <Login />
  }

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
