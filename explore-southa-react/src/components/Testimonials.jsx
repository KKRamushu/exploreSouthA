import TestimonialCard from './TestimonialCard.jsx'
import { testimonials } from '../data/testimonials.js'

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 bg-[#eef0f3] px-0 py-14 sm:py-[75px]"
    >
      <div className="mx-auto w-[min(90%,1180px)]">
        <div className="mb-10 text-center">
          <p className="mb-2 text-[0.7rem] font-extrabold uppercase tracking-[0.06em] text-orange">
            Guest reviews
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.65rem)] font-bold leading-tight tracking-tight">
            What Our Travelers Say
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-4 block h-[3px] w-[55px] bg-orange"
          />
        </div>
        <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
