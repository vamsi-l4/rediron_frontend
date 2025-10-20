// Real product data for REDIRON
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
    name: "Creatine",
    slug: "creatine",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    subcategories: ["Creatine Monohydrate", "Creatine HCL", "Buffered Creatine"]
  },
  {
    id: 5,
    name: "Fat Burners",
    slug: "fat-burners",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
    subcategories: ["Thermogenic", "L-Carnitine", "CLA", "Green Tea Extract"]
  }
];

export const products = [
  {
    id: 1,
    name: "REDIRON Whey Protein Isolate",
    subtitle: "Ultra-Premium 90% Isolate",
    slug: "rediron-whey-protein-isolate",
    price: 3299,
    originalPrice: 4499,
    discount: 27,
    category: "protein",
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600"
    ],
    flavors: ["Rich Chocolate", "Vanilla Supreme", "Strawberry Blast", "Cookies & Cream"],
    sizes: ["1 kg", "2 kg", "5 kg"],
    description: "Ultra-premium whey protein isolate with 90% protein content and zero added sugars",
    features: ["30g Protein per serving", "6.2g BCAA", "5g Glutamine", "Lab Tested for Purity"],
    nutritionPer100g: {
      protein: 90,
      carbs: 2,
      fat: 1,
      calories: 380
    },
    batchNo: "RI240901",
    rating: 4.8,
    reviews: 3247,
    inStock: true,
    isBestSeller: true,
    labReportUrl: "/api/lab-reports/RI240901.pdf"
  },
  {
    id: 2,
    name: "REDIRON Creatine Monohydrate",
    subtitle: "Micronized Formula - 300g",
    slug: "rediron-creatine-monohydrate",
    price: 899,
    originalPrice: 1299,
    discount: 31,
    category: "creatine",
    images: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600"
    ],
    flavors: ["Unflavored"],
    sizes: ["150g", "300g", "500g"],
    description: "99.9% pure micronized creatine monohydrate for maximum strength and power",
    features: ["5g Pure Creatine", "Micronized Formula", "Enhanced Absorption", "Third-party Tested"],
    nutritionPer100g: {
      protein: 0,
      carbs: 0,
      fat: 0,
      calories: 0
    },
    batchNo: "RI240905",
    rating: 4.9,
    reviews: 1876,
    inStock: true,
    isBestSeller: false,
    labReportUrl: "/api/lab-reports/RI240905.pdf"
  },
  {
    id: 3,
    name: "REDIRON Mass Gainer Pro",
    subtitle: "High-Calorie Weight Gainer - 3kg",
    slug: "rediron-mass-gainer-pro",
    price: 2799,
    originalPrice: 3899,
    discount: 28,
    category: "mass-gainer",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600"
    ],
    flavors: ["Chocolate Fudge", "Vanilla Ice Cream", "Banana Smoothie"],
    sizes: ["1.5 kg", "3 kg", "6 kg"],
    description: "Advanced mass gainer with 1200+ calories per serving for serious mass building",
    features: ["50g Protein", "250g Carbs", "1250 Calories", "Added Digestive Enzymes"],
    nutritionPer100g: {
      protein: 22,
      carbs: 68,
      fat: 4,
      calories: 390
    },
    batchNo: "RI240910",
    rating: 4.6,
    reviews: 2134,
    inStock: true,
    isBestSeller: true,
    labReportUrl: "/api/lab-reports/RI240910.pdf"
  },
  {
    id: 4,
    name: "REDIRON Pre-Workout Ignite",
    subtitle: "Maximum Energy Formula - 300g",
    slug: "rediron-pre-workout-ignite",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    category: "pre-workout",
    images: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600"
    ],
    flavors: ["Fruit Punch", "Blue Raspberry", "Green Apple"],
    sizes: ["150g", "300g"],
    description: "High-stimulant pre-workout for explosive energy, focus, and pump",
    features: ["300mg Caffeine", "6g L-Citrulline", "3g Beta-Alanine", "Focus Blend"],
    nutritionPer100g: {
      protein: 5,
      carbs: 15,
      fat: 0,
      calories: 80
    },
    batchNo: "RI240915",
    rating: 4.7,
    reviews: 1567,
    inStock: true,
    isBestSeller: false,
    labReportUrl: "/api/lab-reports/RI240915.pdf"
  },
  {
    id: 5,
    name: "REDIRON Fat Burner Extreme",
    subtitle: "Thermogenic Weight Loss - 90 Caps",
    slug: "rediron-fat-burner-extreme",
    price: 1599,
    originalPrice: 2199,
    discount: 27,
    category: "fat-burners",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600"
    ],
    flavors: ["Capsules"],
    sizes: ["60 Caps", "90 Caps", "120 Caps"],
    description: "Advanced thermogenic fat burner with natural ingredients for weight management",
    features: ["Green Coffee Extract", "L-Carnitine", "Garcinia Cambogia", "Metabolism Boost"],
    nutritionPer100g: {
      protein: 0,
      carbs: 5,
      fat: 0,
      calories: 20
    },
    batchNo: "RI240920",
    rating: 4.4,
    reviews: 892,
    inStock: true,
    isBestSeller: false,
    labReportUrl: "/api/lab-reports/RI240920.pdf"
  },
  {
    id: 6,
    name: "REDIRON Casein Protein",
    subtitle: "Slow-Release Night Formula - 1kg",
    slug: "rediron-casein-protein",
    price: 2899,
    originalPrice: 3799,
    discount: 24,
    category: "protein",
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600"
    ],
    flavors: ["Chocolate", "Vanilla", "Strawberry"],
    sizes: ["500g", "1kg", "2kg"],
    description: "Slow-digesting casein protein for overnight muscle recovery and growth",
    features: ["25g Protein", "8-hour Release", "Rich in Glutamine", "Anti-Catabolic"],
    nutritionPer100g: {
      protein: 78,
      carbs: 8,
      fat: 3,
      calories: 370
    },
    batchNo: "RI240925",
    rating: 4.5,
    reviews: 1234,
    inStock: true,
    isBestSeller: false,
    labReportUrl: "/api/lab-reports/RI240925.pdf"
  }
];

export const heroSlides = [
  {
    id: 1,
    title: "FORGE YOUR STRENGTH",
    subtitle: "PREMIUM SUPPLEMENTS",
    description: "Ultra-Premium Whey Protein Isolate",
    price: "STARTS @ JUST ₹3299",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
    bgGradient: "from-red-900 via-red-800 to-black",
    cta: "Shop Now"
  },
  {
    id: 2,
    title: "UNLEASH YOUR POWER",
    subtitle: "MAXIMUM PERFORMANCE",
    description: "Advanced Pre-Workout & Creatine Combo",
    price: "STARTS @ JUST ₹1899",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
    bgGradient: "from-red-800 via-gray-900 to-black",
    cta: "Explore Range"
  },
  {
    id: 3,
    title: "BUILD MASS FAST",
    subtitle: "SERIOUS GAINS",
    description: "High-calorie mass gainer for rapid muscle growth",
    price: "STARTS @ JUST ₹2799",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    bgGradient: "from-gray-900 via-red-900 to-black",
    cta: "Build Mass"
  }
];

export const offers = [
  {
    id: 1,
    title: "First Order 30% Off",
    code: "REDIRON30",
    description: "Get 30% discount on your first purchase",
    minOrder: 2000,
    maxDiscount: 1000
  },
  {
    id: 2,
    title: "Buy 2 Get 1 Free",
    code: "REDironbogo",
    description: "On selected protein supplements",
    minOrder: 5000,
    maxDiscount: 3000
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Arjun Singh",
    rating: 5,
    review: "REDIRON whey isolate gave me incredible results! Best protein I've used.",
    product: "REDIRON Whey Protein Isolate",
    verified: true
  },
  {
    id: 2,
    name: "Vikash Kumar",
    rating: 5,
    review: "Amazing quality and taste. The lab reports give complete confidence in purity.",
    product: "REDIRON Mass Gainer Pro",
    verified: true
  },
  {
    id: 3,
    name: "Rohit Sharma",
    rating: 4,
    review: "Excellent pre-workout! Energy lasts throughout my entire training session.",
    product: "REDIRON Pre-Workout Ignite",
    verified: true
  }
];

export const trustBadges = [
  {
    id: 1,
    name: "NABL Accredited",
    image: "/images/nabl-badge.png",
    description: "All products tested in NABL accredited laboratories"
  },
  {
    id: 2,
    name: "FSSAI Approved",
    image: "/images/fssai-badge.png",
    description: "Food safety standards authority of India approved"
  },
  {
    id: 3,
    name: "GMP Certified",
    image: "/images/gmp-badge.png",
    description: "Good Manufacturing Practice certified facility"
  }
];

export const labReports = {
  "RI240901": {
    productName: "REDIRON Whey Protein Isolate",
    batchNumber: "RI240901",
    manufacturedDate: "2024-09-01",
    expiryDate: "2026-09-01",
    testingLab: "Intertek India Pvt Ltd (NABL Accredited)",
    testDate: "2024-09-15",
    reportNumber: "INT/2024/RI240901",
    results: {
      proteinContent: "90.2%",
      heavyMetals: "Within Limits",
      microbiological: "Satisfactory",
      pesticides: "Not Detected",
      overallGrade: "A+"
    },
    certified: true,
    reportUrl: "/reports/RI240901_lab_report.pdf"
  },
  "RI240905": {
    productName: "REDIRON Creatine Monohydrate",
    batchNumber: "RI240905",
    manufacturedDate: "2024-09-05",
    expiryDate: "2027-09-05",
    testingLab: "SGS India Pvt Ltd (NABL Accredited)",
    testDate: "2024-09-20",
    reportNumber: "SGS/2024/RI240905",
    results: {
      purityLevel: "99.9%",
      creatineContent: "100.1%",
      heavyMetals: "Within Limits",
      microbiological: "Satisfactory",
      overallGrade: "A+"
    },
    certified: true,
    reportUrl: "/reports/RI240905_lab_report.pdf"
  }
};

export const deliveryInfo = {
  freeDelivery: 999,
  deliveryCharges: 99,
  expressDelivery: 199,
  returnPolicy: 15
};