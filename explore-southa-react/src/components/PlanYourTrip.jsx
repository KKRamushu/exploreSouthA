export default function PlanYourTrip() {
function handleSubmit(event) {
event.preventDefault()
alert('Your trip preferences have been submitted!')
}

return (
<section id="plan">
<h2>Plan Your Trip</h2>
<p>Tell us what your ideal South African adventure looks like.</p>

  <div>
    <p>50+ Destinations</p>
    <p>12k Happy Travelers</p>
    <p>150+ Expert Guides</p>
  </div>

  <form onSubmit={handleSubmit}>
    <label htmlFor="destination">Preferred destination</label>
    <select id="destination" name="destination" defaultValue="">
      <option value="" disabled>Select a destination</option>
      <option value="cape-town">Cape Town</option>
      <option value="kruger">Kruger National Park</option>
      <option value="garden-route">Garden Route</option>
      <option value="anywhere">I'm open to suggestions</option>
    </select>

    <label htmlFor="month">Preferred month</label>
    <input id="month" name="month" type="month" />

    <label htmlFor="travelers">Number of travelers</label>
    <input
      id="travelers"
      name="travelers"
      type="number"
      min="1"
      defaultValue="2"
    />

    <button type="submit">Request a Trip Plan</button>
  </form>
</section>

)
}