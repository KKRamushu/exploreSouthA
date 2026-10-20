export default function TestimonialCard({ testimonial }) {
  return (
    <article className="flex min-h-[235px] flex-col rounded-[10px] border border-line bg-white p-6">
      <p
        className="text-sm tracking-[2px] text-orange"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {'★'.repeat(testimonial.rating)}
      </p>
      <blockquote className="my-3 flex-1 font-serif text-sm italic leading-relaxed text-[#686d77]">
        “{testimonial.quote}”
      </blockquote>
      <div className="mt-auto flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`grid size-[35px] shrink-0 place-items-center rounded-full text-xs font-extrabold text-white ${testimonial.avatarColor}`}
        >
          {testimonial.initials}
        </span>
        <div>
          <p className="text-sm font-bold">{testimonial.name}</p>
          <p className="text-xs text-muted">{testimonial.location}</p>
        </div>
      </div>
    </article>
  )
}
