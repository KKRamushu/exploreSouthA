export default function Hero() {
  return (
    <section
      id="home"
      className="grid min-h-[510px] scroll-mt-20 place-items-center overflow-hidden bg-[linear-gradient(rgba(7,14,28,0.54),rgba(7,14,28,0.70)),url('/images/hero_backround.avif')] bg-cover bg-center sm:min-h-[570px]"
    >
      <div className="mx-auto w-[min(90%,760px)] py-20 text-center text-white">
        <p className="mb-2 text-[0.7rem] font-extrabold uppercase tracking-[0.06em] text-orange">
          Experience the extraordinary
        </p>
        <h1 className="mx-auto mb-[18px] mt-2 font-serif text-[clamp(2.6rem,7vw,4.8rem)] font-bold leading-[0.98] tracking-tight">
          Explore South Africa&apos;s Best Destinations
        </h1>
        <p className="mx-auto mb-[30px] max-w-[650px] font-serif text-[clamp(1rem,2vw,1.25rem)] text-white/90">
          Curated travel experiences designed to inspire your spirit and create
          memories that last a lifetime.
        </p>
        <div className="flex flex-wrap justify-center gap-[13px]">
          <a
            href="#plan"
            className="inline-flex min-w-[140px] items-center justify-center rounded-full bg-orange px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Plan Your Trip
          </a>
          <a
            href="#packages"
            className="inline-flex min-w-[140px] items-center justify-center rounded-full border border-white/75 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Explore Packages
          </a>
        </div>
      </div>
    </section>
  )
}