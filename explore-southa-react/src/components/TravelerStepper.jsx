export default function TravelerStepper({ value, onChange }) {
  function decrease() {
    if (value > 1) {
      onChange(value - 1)
    }
  }

  function increase() {
    onChange(value + 1)
  }

  return (
    <div className=" p-[0] border border-line rounded-full text-[0.67rem] font-bold min-w-[140px] 
     inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 ease-out 
    hover:-translate-y-0.5
    ">
      <button type="button" onClick={decrease} disabled={value <= 1}
      className="px-[13px] py-[7px] border border-line rounded-l-full text-[0.67rem] font-bold text-white bg-orange hover:bg-orange-dark" >
        −
      </button>

      <span> {value} traveler(s) </span>

      <button type="button" onClick={increase}
      className="px-[13px] py-[7px] border border-line rounded-r-full text-[0.67rem] font-bold text-white bg-orange hover:bg-orange-dark">
        +
      </button>
    </div>
  )
}