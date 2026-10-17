import { useState } from 'react'
import TourCard from './TourCard'
import { tours } from '../data/tours'

export default function TourPackages() {
  const [category, setCategory] = useState('all')

  const filteredTours = tours.filter((tour) => {
    if (category === 'all') {
      return true
    }

    return tour.category === category
  })

  return (
    <section id="packages" className='py-[75px]'>
      <div className='mb-[38px] flex flex-col justify-between items-start gap-3'>
        <p className='mb-2 text-orange block  text-[0.7rem] font-extrabold tracking-wider uppercase'>Premium experiences</p>
        <h2 className='m-0 font-serif block  leading-[1.1] tracking-tight text-[clamp(2rem,4vw,2.65rem)]'>Explore Our Tour Packages</h2>
        <p className='max-w-[600px] block  mt-[14px] text-muted text-[0.9rem]'>Discover your next South African adventure.</p>
      
      </div>

      <div className='flex justify-center gap-[2px] flex-wrap mb-[38px]'>
        <button className='px-[13px] py-[7px] border border-line rounded-l-full text-[0.67rem] font-bold
            text-white bg-orange hover:bg-orange-dark'
          type="button"
          onClick={() => setCategory('all')}
          aria-pressed={category === 'all'}
        >
          All Tours
        </button>

        <button className='px-[13px] py-[7px] border border-line text-[0.67rem] font-bold
            text-white bg-orange hover:bg-orange-dark'
          type="button"
          onClick={() => setCategory('coastal')}
          aria-pressed={category === 'coastal'}
        >
          Coastal
        </button>

        <button className='px-[13px] py-[7px] border border-line rounded-r-full text-[0.67rem] font-bold
            text-white bg-orange hover:bg-orange-dark'
          type="button"
          onClick={() => setCategory('wildlife')}
          aria-pressed={category === 'wildlife'}
        >
          Wildlife
        </button>
      </div>

      <div className='grid grid-cols-3 gap-[22px]'>
        {filteredTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      {filteredTours.length === 0 && (
        <p>No tours match this category.</p>
      )}
    </section>
  )
}
