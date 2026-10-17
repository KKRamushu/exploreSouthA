import TestimonialCard from './TestimonialCard'
import { testimonials } from '../data/testimonials'

export default function Testimonials() {
return (
<section className='bg-[#eef0f3] py-[75px]'>
  <h2 className='m-0 font-serif leading-[1.1] tracking-tight mb-[38px] 
  flex justify-center items-end gap-[30px] text-[clamp(2rem,4vw,2.65rem)]'>
  What Our Travelers Say
  </h2>

  <div className='grid grid-cols-3 gap-[22px]'>
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