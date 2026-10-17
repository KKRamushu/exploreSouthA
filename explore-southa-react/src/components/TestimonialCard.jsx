export default function TestimonialCard({ testimonial }) {
return (
<article className="min-h-[235px] px-[23px] py-[22px] flex flex-col items-start bg-white border border-line rounded-[10px]">
    <p className="text-orange tracking-[2px] text-[0.85rem]">{testimonial.stars}</p>
    <p className="mt-2.5 mb-5 text-left text-[#686d77] font-serif text-[0.85rem] italic leading-[1.65]">{testimonial.quote}</p>
    <div className="mt-auto flex items-center gap-2.5">
        <span className="w-[35px] h-[35px] grid place-items-center shrink-0 text-white bg-[#c99a64] rounded-full text-[0.62rem] font-extrabold"></span>
        <div className='mt-auto flex flex-col items-start gap-[2.5px]'> 
            <strong className="block text-[0.7rem]">{testimonial.name}</strong>
            <span className="block text-muted text-[0.58rem]">{testimonial.location}</span>
        </div>
    </div>
    
</article>
)
}