// Mock data for MUSCLE BLAZE clone
export const categories = [
  {
    id: 1,
    name: "Protein",
    slug: "protein",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
    subcategories: ["Whey Protein", "Casein Protein", "Plant Protein", "Isolate"]
  },
  {
    id: 2,
    name: "Mass Gainer",
    slug: "mass-gainer",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    subcategories: ["Weight Gainer", "Lean Mass", "High Calorie"]
  },
  {
    id: 3,
    name: "Pre-Workout",
    slug: "pre-workout",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
    subcategories: ["Energy Booster", "Pump Formula", "Endurance"]
  },
  {
    id: 4,
    name: "Vitamins",
    slug: "vitamins",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    subcategories: ["Multivitamins", "Vitamin D", "B-Complex", "Omega-3"]
  },
  {
    id: 5,
    name: "Health Food",
    slug: "health-food",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
    subcategories: ["Oats", "Peanut Butter", "Dry Fruits", "Superfoods"]
  }
];

export const products = [
  {
    id: 1,
    name: "Biozyme Performance Whey",
    subtitle: "4.4 lb Choco Crispers",
    slug: "biozyme-performance-whey-choco",
    price: 4899,
    originalPrice: 6199,
    discount: 22,
    category: "protein",
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600"
    ],
    flavors: ["Chocolate", "Vanilla", "Strawberry", "Cookies & Cream"],
    sizes: ["2.2 lb", "4.4 lb", "8.8 lb"],
    description: "Advanced whey protein with higher absorption powered by MB CREABSORB™",
    features: ["25g Protein per serving", "5.5g BCAA", "4g Glutamine", "Lab Tested"],
    nutritionPer100g: {
      protein: 75,
      carbs: 8,
      fat: 2,
      calories: 350
    },
    batchNo: "MB240815",
    rating: 4.5,
    reviews: 2847,
    inStock: true,
    isBestSeller: true,
    labReportUrl: "/api/lab-reports/MB240815.pdf"
  },
  {
    id: 2,
    name: "Creatine Monohydrate CreAMP",
    subtitle: "400g & Shaker Combo",
    slug: "creatine-monohydrate-creamp",
    price: 1429,
    originalPrice: 3198,
    discount: 55,
    category: "pre-workout",
    images: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600"
    ],
    flavors: ["Unflavored"],
    sizes: ["250g", "400g", "500g"],
    description: "Pure creatine monohydrate for enhanced strength and muscle growth",
    features: ["3g Pure Creatine", "Muscle Growth", "Strength Enhancement", "NABL Tested"],
    nutritionPer100g: {
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0
    },
    batchNo: "MB240820",
    rating: 4.7,
    reviews: 1523,
    inStock: true,
    isBestSeller: false,
    labReportUrl: "/api/lab-reports/MB240820.pdf"
  },
  {
    id: 3,
    name: "Super Gainer XXL Weight Gainer",
    subtitle: "6.6 lb Chocolate",
    slug: "super-gainer-xxl-chocolate",
    price: 2449,
    originalPrice: 4299,
    discount: 43,
    category: "mass-gainer",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600"
    ],
    flavors: ["Chocolate", "Vanilla", "Strawberry"],
    sizes: ["3 lb", "6.6 lb", "11 lb"],
    description: "High-calorie weight gainer for serious mass building",
    features: ["60g Protein", "252g Carbs", "1250 Calories", "Lab Certified"],
    nutritionPer100g: {
      protein: 20,
      carbs: 75,
      fat: 3,
      calories: 400
    },
    batchNo: "MB240825",
    rating: 4.3,
    reviews: 987,
    inStock: true,
    isBestSeller: true,
    labReportUrl: "/api/lab-reports/MB240825.pdf"
  },
  {
    id: 4,
    name: "Shilajit Pro by MuscleBlaze",
    subtitle: "20g",
    slug: "shilajit-pro-20g",
    price: 1049,
    originalPrice: 1299,
    discount: 19,
    category: "vitamins",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600"
    ],
    flavors: ["Natural"],
    sizes: ["10g", "20g", "50g"],
    description: "Pure Himalayan Shilajit for natural energy and vitality",
    features: ["Pure Shilajit", "Natural Energy", "Stamina Booster", "Lab Tested"],
    nutritionPer100g: {
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0
    },
    batchNo: "MB240830",
    rating: 4.6,
    reviews: 654,
    inStock: true,
    isBestSeller: false,
    isFreebie: true,
    labReportUrl: "/api/lab-reports/MB240830.pdf"
  }
];

export const heroSlides = [
  {
    id: 1,
    title: "POWERED BY MB CREABSORB™",
    subtitle: "HIGHER ABSORPTION",
    description: "Creatine Creamp & Shaker Combos",
    price: "STARTS @ JUST ₹979",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
    bgGradient: "from-orange-100 to-blue-100",
    cta: "Shop Now"
  },
  {
    id: 2,
    title: "BIOZYME WHEY PROTEIN",
    subtitle: "ADVANCED ABSORPTION",
    description: "Get 25g protein per serving with enhanced bioavailability",
    price: "STARTS @ JUST ₹4899",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800",
    bgGradient: "from-yellow-100 to-orange-100",
    cta: "Explore Range"
  },
  {
    id: 3,
    title: "SUPER GAINER XXL",
    subtitle: "SERIOUS MASS BUILDING",
    description: "1250 calories per serving for rapid weight gain",
    price: "STARTS @ JUST ₹2449",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    bgGradient: "from-green-100 to-blue-100",
    cta: "Build Mass"
  }
];

export const offers = [
  {
    id: 1,
    title: "Flat 25% Off on First Order",
    code: "FIRST25",
    description: "Get 25% discount on your first purchase",
    minOrder: 2000,
    maxDiscount: 500
  },
  {
    id: 2,
    title: "Buy 2 Get 1 Free",
    code: "BUY2GET1",
    description: "On selected protein supplements",
    minOrder: 5000,
    maxDiscount: 2000
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Rohit Sharma",
    rating: 5,
    review: "Amazing quality protein! Results are visible within weeks.",
    product: "Biozyme Performance Whey",
    verified: true
  },
  {
    id: 2,
    name: "Priya Patel",
    rating: 4,
    review: "Great taste and mixability. Highly recommended for fitness enthusiasts.",
    product: "Super Gainer XXL",
    verified: true
  }
];

export const trustBadges = [
  {
    id: 1,
    name: "NABL Accredited",
    image: "/images/nabl-badge.png",
    description: "All products tested in NABL accredited labs"
  },
  {
    id: 2,
    name: "Labdoor Certified",
    image: "/images/labdoor-badge.png",
    description: "Third-party tested for purity and potency"
  },
  {
    id: 3,
    name: "FSSAI Approved",
    image: "/images/fssai-badge.png",
    description: "Food safety standards authority of India approved"
  }
];

export const deliveryInfo = {
  freeDelivery: 499,
  deliveryCharges: 49,
  expressDelivery: 99,
  returnPolicy: 14
};