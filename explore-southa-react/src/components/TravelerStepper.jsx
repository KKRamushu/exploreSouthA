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
    <div>
      <button type="button" onClick={decrease} disabled={value <= 1}>
        −
      </button>

      <span> {value} traveler(s) </span>

      <button type="button" onClick={increase}>
        +
      </button>
    </div>
  )
}