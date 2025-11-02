export interface Category {
  name: string;
  children: SubCategory[];
}

export interface SubCategory {
  name: string;
  options: string[];
}

export const GLOBAL_CATEGORIES: Category[] = [
  {
    name: "Categories",
    children: [
      {
        name: "Hair Care",
        options: [
          "Shampoo",
          "Conditioner",
          "Hair Mask",
          "Hair Oil",
          "Leave-In Treatment",
        ],
      },
      {
        name: "Skin Care",
        options: ["Cleanser", "Moisturizer", "Serum", "Face Mask", "Toner"],
      },
      {
        name: "Body Care",
        options: [
          "Body Wash",
          "Body Lotion",
          "Body Scrub",
          "Hand Cream",
          "Body Oil",
        ],
      },
      {
        name: "Makeup",
        options: ["Foundation", "Lipstick", "Mascara", "Eyeshadow", "Blush"],
      },
    ],
  },
  {
    name: "Ingredients",
    children: [
      {
        name: "Active Ingredients",
        options: [
          "Hyaluronic Acid",
          "Vitamin C",
          "Retinol",
          "Niacinamide",
          "Salicylic Acid",
        ],
      },
      {
        name: "Natural Oils",
        options: [
          "Argan Oil",
          "Coconut Oil",
          "Jojoba Oil",
          "Rosehip Oil",
          "Tea Tree Oil",
        ],
      },
      {
        name: "Plant Extracts",
        options: [
          "Aloe Vera",
          "Green Tea",
          "Chamomile",
          "Calendula",
          "Witch Hazel",
        ],
      },
      {
        name: "Free From",
        options: [
          "Sulfate-Free",
          "Paraben-Free",
          "Silicone-Free",
          "Fragrance-Free",
          "Cruelty-Free",
        ],
      },
    ],
  },
  {
    name: "Skin Types",
    children: [
      {
        name: "Skin Types",
        options: [
          "Dry Skin",
          "Oily Skin",
          "Combination Skin",
          "Normal Skin",
          "Sensitive Skin",
        ],
      },
      {
        name: "Special Considerations",
        options: [
          "Acne-Prone",
          "Rosacea-Prone",
          "Eczema-Prone",
          "Aging Skin",
          "Mature Skin",
        ],
      },
    ],
  },
  {
    name: "Skin Concerns",
    children: [
      {
        name: "Texture & Appearance",
        options: [
          "Acne & Blemishes",
          "Fine Lines & Wrinkles",
          "Dark Spots & Hyperpigmentation",
          "Dullness",
          "Uneven Skin Tone",
        ],
      },
      {
        name: "Skin Conditions",
        options: [
          "Dryness & Flakiness",
          "Oiliness & Shine",
          "Redness & Inflammation",
          "Enlarged Pores",
          "Blackheads",
        ],
      },
      {
        name: "Environmental Concerns",
        options: [
          "Sun Damage",
          "Pollution Protection",
          "Blue Light Protection",
          "Environmental Stress",
        ],
      },
    ],
  },
  {
    name: "Hair Type",
    children: [
      {
        name: "Hair Texture",
        options: ["Straight Hair", "Wavy Hair", "Curly Hair", "Coily Hair"],
      },
      {
        name: "Hair Concerns",
        options: [
          "Dry & Damaged",
          "Frizzy",
          "Thin & Fine",
          "Color-Treated",
          "Dandruff",
        ],
      },
    ],
  },
  {
    name: "Rating",
    children: [
      {
        name: "Customer Rating",
        options: ["5 Stars", "4 Stars & Up", "3 Stars & Up", "2 Stars & Up"],
      },
      {
        name: "Top Rated",
        options: [
          "Best Sellers",
          "Top Rated",
          "Editor's Choice",
          "Award Winners",
        ],
      },
    ],
  },
  {
    name: "Price Range",
    children: [
      {
        name: "Price Brackets",
        options: [
          "Under $15",
          "$15 - $30",
          "$30 - $50",
          "$50 - $100",
          "Over $100",
        ],
      },
      {
        name: "Value Options",
        options: ["Sale Items", "Special Offers", "Value Sets", "Travel Size"],
      },
    ],
  },
  {
    name: "Brands",
    children: [
      {
        name: "Popular Brands",
        options: ["The Ordinary", "CeraVe", "Olay", "Neutrogena", "L'Oréal"],
      },
      {
        name: "Luxury Brands",
        options: [
          "La Mer",
          "SK-II",
          "Tatcha",
          "Drunk Elephant",
          "Sunday Riley",
        ],
      },
      {
        name: "Natural Brands",
        options: ["Burt's Bees", "Herbivore", "Kiehl's", "Origins", "Lush"],
      },
    ],
  },
  {
    name: "On Sale",
    children: [], // Empty children array for the Sale category
  },
];
