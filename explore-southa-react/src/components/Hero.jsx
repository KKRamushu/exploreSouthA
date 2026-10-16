export default function Hero() {
return (
<section id="home" className="min-h-[570px] relative grid place-items-center overflow-hidden bg-[linear-gradient(rgba(7,14,28,0.54),rgba(7,14,28,0.70)),url('/images/hero_backround.avif')] bg-center bg-cover">

    <div className="relative z-10 text-center text-white py-[80px]">
        <p className="m-0 mb-2 text-orange text-[0.7rem] font-extrabold tracking-[0.06em] uppercase">
        Experience the extraordinary
        </p>

        <h1 className="max-w-[760px] mx-auto mt-2 mb-[18px] text-white/90 font-serif text-[clamp(2.8rem,6vw,4.8rem)] leading-[0.98] tracking-tight">
        Explore South Africa's Best Destinations
        </h1>

        <p className="max-w-[650px] mt-0 mx-auto mb-[30px] text-white/90 font-serif text-[clamp(1rem,2vw,1.25rem)]">
        Discover unforgettable adventures, breathtaking landscapes, and
        unique experiences across South Africa.
        </p>

        <div className="flex justify-center gap-[13px] flex-wrap 
         *transition-[transform,background-color] *duration-200 *ease-in-out
        ">
            <a href="#plan" className="min-w-[140px] px-6 py-3 text-[0.67rem] font-bold inline-flex items-center justify-center text-white bg-orange rounded-full hover:bg-orange-dark hover:-translate-y-0.5 transition-transform">
                Plan Your Trip
            </a>

            <a href="#packages" className="min-w-[140px] px-6 py-3 inline-flex items-center justify-center text-white border border-white/75 px-[13px] py-[7px] border border-line rounded-full text-[0.67rem] font-bold hover:-translate-y-0.5 transition-transform">
                Explore Packages
            </a>
        </div>
    </div>
        
  
</section>

)
}