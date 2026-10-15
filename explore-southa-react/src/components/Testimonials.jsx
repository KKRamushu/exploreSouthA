import TestimonialCard from './TestimonialCard'
import { testimonials } from '../data/testimonials'

export default function Testimonials() {
return (
<section id="testimonials">
<h2>What Our Travelers Say</h2>

  <div>
    {testimonials.map((testimonial) => (
      <TestimonialCard
        key={testimonial.id}
        testimonial={testimonial}
      />
    ))}
  </div>
</section>

)
}