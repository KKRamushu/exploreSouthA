export default function Header() {

      return (
    <header class="sticky top-0 z-[100] bg-white/97 border-b border-[var(--line)]">
      <nav aria-label="Main navigation" class="min-h-[62px] flex items-center gap-[28px] w-[min(90%,1180px)] mx-auto" >
        <a href="#home" class="flex items-center font-bold whitespace-nowrap text-inherit no-underline">
          explore<span className="font-black text-orange">SouthA</span>
        </a>

        <ul class="m-0 ml-auto p-0 flex items-center gap-[27px] list-none text-[0.78rem] 
        *transition-colors *duration-200 ease-in-out *hover:text-[var(--orange)]">
          
          <li><a href="#home" class="transition-colors hover:text-emerald-600">Home</a></li>
          <li><a href="#packages" class="transition-colors hover:text-emerald-600">Tour Packages</a></li>
          <li><a href="#testimonials" class="transition-colors hover:text-emerald-600">Testimonials</a></li>
          <li><a href="#plan" class="transition-colors hover:text-emerald-600">Plan Your Trip</a></li>
        </ul>
      </nav>
    </header>
  )
}