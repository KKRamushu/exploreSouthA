const tours = [
  {
    id: "cape-town",
    name: "Cape Town Escape",
    category: "coastal",
    durationDays: 7,
    durationNights: 6,
    price: "1145.95",
    currency: "USD",
    image: "/images/cape_town_escape.avif",
    imageAlt: "Cape Town coastline and surrounding mountains",
    highlights: [
      "Table Mountain Adventure",
      "Cape Peninsula Tour",
      "Winelands Experience",
    ],
  },
  {
    id: "kruger",
    name: "Kruger Safari Quest",
    category: "wildlife",
    durationDays: 5,
    durationNights: 4,
    price: "1059.85",
    currency: "USD",
    image: "/images/kruger.avif",
    imageAlt: "Wildlife on safari in Kruger National Park",
    highlights: [
      "Big Five Wildlife Safari",
      "Private Game Drives",
      "Luxury Lodge Stay",
    ],
  },
  {
    id: "garden-route",
    name: "Garden Route Journey",
    category: "coastal",
    durationDays: 8,
    durationNights: 7,
    price: "1475.90",
    currency: "USD",
    image: "/images/garden_route.jpg",
    imageAlt: "Scenic forest along the Garden Route",
    highlights: [
      "Knysna & Wilderness",
      "Coastal Road Adventures",
      "Local Food & Culture",
    ],
  },
];

const testimonials = [
  {
    id: "maurice",
    quote:
      "The attention to detail on our Cape Town trip was phenomenal. From the wine farms to the coastal drive, everything exceeded our expectations.",
    name: "Maurice Johnson",
    location: "Johannesburg, South Africa",
    rating: 5,
  },
  {
    id: "david",
    quote:
      "I never thought I would see a safari and the ocean in the same holiday. Truly a life-changing adventure in the heart of South Africa.",
    name: "David Chen",
    location: "Vancouver, Canada",
    rating: 4,
  },
  {
    id: "elena",
    quote:
      "Our Garden Route journey was like walking through a storybook. The local guides were knowledgeable and every stop felt carefully chosen.",
    name: "Elena Rodriguez",
    location: "Madrid, Spain",
    rating: 4,
  },
];

const tripInquiries = [
  {
    destination: "Cape Town",
    preferredMonth: "2027-03",
    travelers: 2,
    status: "new",
  },
  {
    destination: "Kruger National Park",
    preferredMonth: "2027-06",
    travelers: 4,
    status: "contacted",
  },
  {
    destination: "Garden Route",
    preferredMonth: "2027-11",
    travelers: 2,
    status: "quoted",
  },
];

module.exports = { tours, testimonials, tripInquiries };
