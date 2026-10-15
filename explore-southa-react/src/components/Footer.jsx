export default function Footer() {
return (
<footer>
<div>
<a href="#home">exploreSouthA</a>
<p>Discover the extraordinary beauty of South Africa.</p>
</div>

  <div>
    <h3>Quick Links</h3>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#packages">Tour Packages</a></li>
      <li><a href="#testimonials">Testimonials</a></li>
      <li><a href="#plan">Plan Your Trip</a></li>
    </ul>
  </div>

  <div>
    <h3>Contact Us</h3>
    <p>123 Adventure Lane, Cape Town, South Africa</p>
    <a href="mailto:hello@exploresoutha.co.za">
      hello@exploresoutha.co.za
    </a>
  </div>

  <p>© {new Date().getFullYear()} exploreSouthA. All rights reserved.</p>
</footer>

)
}