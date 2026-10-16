export default function Hero() {
return (
<section
id="home"
style={{
backgroundImage: "url('')",
}}
>
<div className="absolute inset-0 bg-black/50"></div>

  <div class="min-h-[570px] relative grid place-items-center overflow-hidden 
  bg-[linear-gradient(rgba(7,14,28,0.54),rgba(7,14,28,0.70)),url('../public/images/hero_backround.avif')] bg-center bg-cover">
        <p>
        Experience the extraordinary
        </p>

        <h1>
        Explore South Africa's Best Destinations
        </h1>

        <p>
        Discover unforgettable adventures, breathtaking landscapes, and
        unique experiences across South Africa.
        </p>

        <div>
            <a href="#plan">
                Plan Your Trip
            </a>

            <a href="#packages">
                Explore Packages
            </a>
        </div>
  </div>
</section>

)
}