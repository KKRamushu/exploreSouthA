export default function TourCard ({tour}){
    return (
        <article>
        <img src={tour.image} alt={tour.name} />

        <h3>{tour.name}</h3>
        <p>{tour.duration}</p>

        <ul>
            {tour.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
            ))}
        </ul>

        <p>{tour.price}</p>

        <a href="#plan">Plan This Trip</a>
        </article>
    )
}