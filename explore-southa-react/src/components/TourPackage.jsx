import TourCard from './TourCard.jsx'
import { tours } from '../data/tours.js'

export default function TourPackages() {
return (
    <section id="packages">
    <h2>Explore Our Tour Packages</h2>
    <p>Discover your next South African adventure.</p>

    <div>
        {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
        ))}
    </div>
    </section>

)
}