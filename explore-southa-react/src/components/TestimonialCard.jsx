export default function TestimonialCard({ testimonial }) {
return (
<article>
    <p>{testimonial.quote}</p>
    <h3>{testimonial.name}</h3>
    <p>{testimonial.location}</p>
</article>
)
}