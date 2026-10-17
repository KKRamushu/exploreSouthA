import { useState } from 'react'
import TravelerStepper from './TravelerStepper'

export default function TourCard({ tour }) {
  const [travelers, setTravelers] = useState(1)

  return (
    <article className='overflow-hidden flex flex-col bg-white border border-line rounded-[10px] shadow-card'>
      <img className='min-h-[225px] relative bg-center bg-cover' src={tour.image} alt={tour.name} />
        <div className='flex-1 px-[19px] pt-[18px] pb-[14px]'>
          <p className='mb-2 text-muted text-[0.7rem]'></p>
          <h3 className='mb-2.5 text-[1.12rem]'>{tour.name}</h3>
          <p className='• mb-2 text-muted text-[0.7rem]'>{tour.duration}</p>

          <ul className='m-0 p-0 list-none text-muted text-[0.72rem]'>
            {tour.highlights.map((highlight) => (
              <li key={highlight} className="my-1.25 before:content-['*'] before:mr-2 before:text-orange before:font-black">{highlight}</li>
            ))}
          </ul>
          <div className='px-[19px] pt-[13px] pb-[17px] flex items-end justify-between border-t border-line'>
            <span className='block text-muted text-[0.6rem] uppercase tracking-wider'>Starting from</span>
            <strong>{tour.price}</strong>
          </div>
          
          <div className='flex justify-center gap-[13px] flex-wrap'>
            <TravelerStepper
            value={travelers}
            onChange={setTravelers}
            />

            <a href="#plan" className='px-[13px] py-[7px] border border-line rounded-full text-[0.67rem] font-bold
            text-white bg-orange hover:bg-orange-dark'>
                Plan This Trip
            </a>
          </div>
          
      </div>
      
    </article>
  )
}