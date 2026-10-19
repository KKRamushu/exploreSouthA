export default function TravelerStepper({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Remove one traveler"
        className="grid size-8 place-items-center rounded-full border border-line text-lg leading-none transition hover:border-orange hover:text-orange disabled:cursor-not-allowed disabled:opacity-40"
      >
        −
      </button>
      <output className="min-w-6 text-center text-sm font-semibold" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Add one traveler"
        className="grid size-8 place-items-center rounded-full border border-line text-lg leading-none transition hover:border-orange hover:text-orange"
      >
        +
      </button>
    </div>
  )
}
