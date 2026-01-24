/**
 * KicksList Product Database
 * Curated collection with verified, working images
 */

const products = [
  // === JORDAN BRAND ===
  {
    id: 1,
    name: "Air Jordan 4 Retro 'Military Black'",
    brand: "Jordan",
    category: "jordan",
    price: 225,
    retail: 190,
    releaseDate: "2022-05-21",
    description: "Clean white leather upper with black and neutral grey accents. One of the most versatile Jordan 4 colorways ever released.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Military-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 2,
    name: "Air Jordan 3 Retro 'White Cement Reimagined'",
    brand: "Jordan",
    category: "jordan",
    price: 250,
    retail: 200,
    releaseDate: "2023-03-11",
    description: "The legendary White Cement colorway returns with premium materials and the iconic elephant print that defined a generation.",
    images: ["https://images.stockx.com/images/Air-Jordan-3-Retro-White-Cement-Reimagined-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 3,
    name: "Air Jordan 11 Retro 'Cherry'",
    brand: "Jordan",
    category: "jordan",
    price: 235,
    retail: 225,
    releaseDate: "2022-12-10",
    description: "Holiday release featuring white patent leather upper with varsity red accents and icy translucent outsole.",
    images: ["https://images.stockx.com/images/Air-Jordan-11-Retro-Cherry-2022-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 4,
    name: "Air Jordan 1 Retro High OG 'University Blue'",
    brand: "Jordan",
    category: "jordan",
    price: 280,
    retail: 170,
    releaseDate: "2021-03-06",
    description: "Paying homage to Michael Jordan's alma mater UNC with white leather and powder blue overlays.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-White-University-Blue-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 5,
    name: "Air Jordan 4 Retro 'Bred Reimagined'",
    brand: "Jordan",
    category: "jordan",
    price: 275,
    retail: 200,
    releaseDate: "2024-02-17",
    description: "The classic Black/Red colorway returns with premium nubuck leather and updated materials for the modern era.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Bred-Reimagined-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 6,
    name: "Air Jordan 1 Retro High OG 'Royal Reimagined'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 180,
    releaseDate: "2024-10-26",
    description: "The iconic Royal Blue colorway gets a premium reimagining with buttery soft leather and gold details.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Royal-Reimagined-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 7,
    name: "Air Jordan 12 Retro 'Playoffs'",
    brand: "Jordan",
    category: "jordan",
    price: 245,
    retail: 200,
    releaseDate: "2022-03-12",
    description: "Black tumbled leather upper with red and white accents. A classic colorway MJ wore during the playoffs.",
    images: ["https://images.stockx.com/images/Air-Jordan-12-Retro-Playoffs-2022-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 8,
    name: "Air Jordan 4 Retro 'Thunder'",
    brand: "Jordan",
    category: "jordan",
    price: 285,
    retail: 190,
    releaseDate: "2023-05-13",
    description: "Black nubuck upper with vibrant Tour Yellow accents on the midsole, laces, and Jumpman logo.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Thunder-2023-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 9,
    name: "Air Jordan 11 Retro 'Cool Grey'",
    brand: "Jordan",
    category: "jordan",
    price: 260,
    retail: 225,
    releaseDate: "2021-12-11",
    description: "Medium grey patent leather mudguard with matching grey mesh upper. An instant classic since 2001.",
    images: ["https://images.stockx.com/images/Air-Jordan-11-Retro-Cool-Grey-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 10,
    name: "Air Jordan 4 Retro 'Red Thunder'",
    brand: "Jordan",
    category: "jordan",
    price: 245,
    retail: 190,
    releaseDate: "2022-01-15",
    description: "Black nubuck upper with bold Crimson red accents. Inspired by the original 'Thunder' colorway from 2006.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Red-Thunder-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 11,
    name: "Air Jordan 1 Retro High OG 'Heritage'",
    brand: "Jordan",
    category: "jordan",
    price: 175,
    retail: 170,
    releaseDate: "2022-04-09",
    description: "White leather base with red overlays and black accents. A clean, wearable Chicago-adjacent colorway.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Heritage-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 12,
    name: "Air Jordan 1 Mid 'Banned'",
    brand: "Jordan",
    category: "jordan",
    price: 145,
    retail: 125,
    releaseDate: "2022-09-01",
    description: "The iconic Black/Red colorway in mid-top form. Accessible Bred for all.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Mid-Banned-2020-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 13,
    name: "Air Jordan 4 Retro 'Infrared'",
    brand: "Jordan",
    category: "jordan",
    price: 230,
    retail: 200,
    releaseDate: "2022-06-25",
    description: "Dark grey nubuck upper with infrared accents on the midsole and heel tab.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Infrared-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 14,
    name: "Air Jordan 3 Retro 'Muslin'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 200,
    releaseDate: "2023-04-15",
    description: "Off-white canvas upper with grey elephant print. Premium vintage aesthetic.",
    images: ["https://images.stockx.com/images/Air-Jordan-3-Retro-Muslin-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 15,
    name: "Air Jordan 4 Retro 'Black Cat'",
    brand: "Jordan",
    category: "jordan",
    price: 350,
    retail: 190,
    releaseDate: "2020-01-22",
    description: "Triple black colorway with nubuck upper. A stealthy tribute to MJ's 'Black Cat' nickname.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Black-Cat-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 16,
    name: "Air Jordan 4 Retro x Off-White 'Sail'",
    brand: "Jordan",
    category: "jordan",
    price: 1400,
    retail: 200,
    releaseDate: "2020-07-25",
    description: "Virgil Abloh deconstructs the AJ4 with translucent panels and exposed Air unit.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Off-White-Sail-W-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },

  // === NIKE ===
  {
    id: 17,
    name: "Nike Dunk Low 'Panda'",
    brand: "Nike",
    category: "nike",
    price: 130,
    retail: 110,
    releaseDate: "2021-03-10",
    description: "The most popular Dunk of the decade. Clean white leather base with black overlays. Simple perfection.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 18,
    name: "Nike Dunk Low 'Grey Fog'",
    brand: "Nike",
    category: "nike",
    price: 140,
    retail: 110,
    releaseDate: "2022-02-04",
    description: "White leather base with wolf grey overlays. A versatile colorway perfect for everyday wear.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Grey-Fog-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 19,
    name: "Nike Dunk Low 'Georgetown'",
    brand: "Nike",
    category: "nike",
    price: 145,
    retail: 110,
    releaseDate: "2022-03-04",
    description: "College colors collection featuring navy blue and grey overlays on white leather.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Georgetown-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 20,
    name: "Nike Air Max 90 'Infrared'",
    brand: "Nike",
    category: "nike",
    price: 145,
    retail: 130,
    releaseDate: "2020-01-23",
    description: "The OG colorway that defined the Air Max 90. White mesh with grey suede and infrared accents.",
    images: ["https://images.stockx.com/images/Nike-Air-Max-90-Infrared-2020-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 21,
    name: "Nike SB Dunk Low 'Strangelove'",
    brand: "Nike",
    category: "nike",
    price: 950,
    retail: 110,
    releaseDate: "2020-02-08",
    description: "Valentine's Day release with pink velvet upper, heart-shaped swoosh, and skull embroidery.",
    images: ["https://images.stockx.com/images/Nike-SB-Dunk-Low-StrangeLove-Skateboards-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 22,
    name: "Nike Dunk Low 'Medium Curry'",
    brand: "Nike",
    category: "nike",
    price: 155,
    retail: 110,
    releaseDate: "2022-02-25",
    description: "Vintage-inspired colorway with sail white base and medium curry brown overlays.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Medium-Curry-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 23,
    name: "Nike Dunk Low 'Setsubun'",
    brand: "Nike",
    category: "nike",
    price: 180,
    retail: 120,
    releaseDate: "2022-02-03",
    description: "Japanese festival-inspired release with brown, tan, and green colors representing beans and demons.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Setsubun-2022-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 24,
    name: "Nike Dunk Low 'Valerian Blue'",
    brand: "Nike",
    category: "nike",
    price: 145,
    retail: 110,
    releaseDate: "2022-03-18",
    description: "Blue and white colorway with leather overlays. Clean everyday option.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Valerian-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 25,
    name: "Nike Dunk Low 'Team Red'",
    brand: "Nike",
    category: "nike",
    price: 135,
    retail: 110,
    releaseDate: "2023-01-24",
    description: "Burgundy overlays on white base. Rich wine-red tone for a premium look.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Team-Red-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 26,
    name: "Nike Dunk Low 'Rose Whisper'",
    brand: "Nike",
    category: "nike",
    price: 130,
    retail: 110,
    releaseDate: "2022-06-21",
    description: "Soft pink and white leather for a subtle, feminine aesthetic.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Rose-Whisper-W-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 27,
    name: "Nike Dunk High 'Syracuse'",
    brand: "Nike",
    category: "nike",
    price: 140,
    retail: 125,
    releaseDate: "2021-08-03",
    description: "Classic Be True To Your School colorway in orange and white high-top.",
    images: ["https://images.stockx.com/images/Nike-Dunk-High-Syracuse-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 28,
    name: "Nike Air Max 95 'Neon'",
    brand: "Nike",
    category: "nike",
    price: 195,
    retail: 185,
    releaseDate: "2023-04-19",
    description: "The OG colorway that launched the AM95. Grey gradients with volt yellow accents.",
    images: ["https://images.stockx.com/images/Nike-Air-Max-95-OG-Neon-2020-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 29,
    name: "Nike SB Dunk Low 'Jarritos'",
    brand: "Nike",
    category: "nike",
    price: 350,
    retail: 125,
    releaseDate: "2023-05-06",
    description: "Collaboration with Mexican soda brand featuring bottle cap logo and vibrant green.",
    images: ["https://images.stockx.com/images/Nike-SB-Dunk-Low-Jarritos-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 30,
    name: "Nike SB Dunk Low 'Ben & Jerry's Chunky Dunky'",
    brand: "Nike",
    category: "nike",
    price: 1100,
    retail: 100,
    releaseDate: "2020-05-23",
    description: "Ice cream collab with cow print, tie-dye swoosh, and dripping green accents.",
    images: ["https://images.stockx.com/images/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 31,
    name: "Nike Air Max 1 'Travis Scott Baroque Brown'",
    brand: "Nike",
    category: "nike",
    price: 385,
    retail: 160,
    releaseDate: "2022-05-26",
    description: "Cactus Jack takes on the Air Max 1 with brown tones and backwards Swoosh.",
    images: ["https://images.stockx.com/images/Nike-Air-Max-1-Travis-Scott-Baroque-Brown-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },

  // === YEEZY / ADIDAS ===
  {
    id: 32,
    name: "Adidas Yeezy Boost 350 V2 'Zebra'",
    brand: "Adidas",
    category: "yeezy",
    price: 260,
    retail: 220,
    releaseDate: "2022-04-09",
    description: "White Primeknit with black stripes and red SPLY-350 text. One of the most coveted Yeezys.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Zebra-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 33,
    name: "Adidas Yeezy Boost 350 V2 'Beluga Reflective'",
    brand: "Adidas",
    category: "yeezy",
    price: 280,
    retail: 230,
    releaseDate: "2021-12-18",
    description: "The iconic orange stripe returns on grey Primeknit upper with reflective threads throughout.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Beluga-Reflective-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 34,
    name: "Adidas Yeezy Boost 350 V2 'Onyx'",
    brand: "Adidas",
    category: "yeezy",
    price: 250,
    retail: 230,
    releaseDate: "2022-04-09",
    description: "Triple black colorway with dark grey Primeknit and black Boost midsole. Stealth mode activated.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Onyx-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 35,
    name: "Adidas Yeezy Foam Runner 'Onyx'",
    brand: "Adidas",
    category: "yeezy",
    price: 165,
    retail: 90,
    releaseDate: "2022-06-08",
    description: "Futuristic all-black foam clog. Made with algae-based EVA for a sustainable approach.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Foam-RNNR-Onyx-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 36,
    name: "Adidas Samba OG 'Cloud White'",
    brand: "Adidas",
    category: "adidas",
    price: 120,
    retail: 100,
    releaseDate: "2023-01-01",
    description: "The classic indoor soccer shoe that became a streetwear icon. White leather with black stripes.",
    images: ["https://images.stockx.com/images/adidas-Samba-OG-Cloud-White-Core-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 37,
    name: "Adidas Campus 00s 'Core Black'",
    brand: "Adidas",
    category: "adidas",
    price: 110,
    retail: 100,
    releaseDate: "2023-01-01",
    description: "Y2K-inspired revival with chunkier sole and premium suede upper in classic black.",
    images: ["https://images.stockx.com/images/adidas-Campus-00s-Core-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },

  // === NEW BALANCE ===
  {
    id: 38,
    name: "New Balance 550 'White Green'",
    brand: "New Balance",
    category: "new-balance",
    price: 145,
    retail: 130,
    releaseDate: "2021-03-12",
    description: "Retro basketball shoe from 1989. White leather with green accents on heel and N logo.",
    images: ["https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 39,
    name: "New Balance 1906R 'Silver Metallic'",
    brand: "New Balance",
    category: "new-balance",
    price: 160,
    retail: 150,
    releaseDate: "2023-04-27",
    description: "Futuristic runner with silver mesh upper and ABZORB cushioning. Early 2000s vibes.",
    images: ["https://images.stockx.com/images/New-Balance-1906R-Silver-Metallic-Sea-Salt-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 40,
    name: "New Balance 530 'White Silver Navy'",
    brand: "New Balance",
    category: "new-balance",
    price: 115,
    retail: 100,
    releaseDate: "2023-01-01",
    description: "90s running silhouette with white mesh, silver accents, and ABZORB midsole.",
    images: ["https://images.stockx.com/images/New-Balance-530-White-Silver-Navy-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },

  // === OTHER BRANDS ===
  {
    id: 41,
    name: "ASICS Gel-1130 'White/Pure Silver'",
    brand: "ASICS",
    category: "other",
    price: 130,
    retail: 120,
    releaseDate: "2023-05-01",
    description: "2000s-era runner with silver accents and layered mesh upper. Gel cushioning in heel.",
    images: ["https://images.stockx.com/images/ASICS-Gel-1130-White-Pure-Silver-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 42,
    name: "Vans Old Skool 'Black/White'",
    brand: "Vans",
    category: "other",
    price: 70,
    retail: 70,
    releaseDate: "2023-01-01",
    description: "The iconic side stripe skate shoe. Canvas and suede upper with vulcanized sole.",
    images: ["https://images.stockx.com/images/Vans-Old-Skool-Black-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 43,
    name: "Reebok Club C 85 'Chalk/Green'",
    brand: "Reebok",
    category: "other",
    price: 85,
    retail: 80,
    releaseDate: "2023-01-01",
    description: "Clean tennis shoe from 1985. Soft garment leather with green accents.",
    images: ["https://images.stockx.com/images/Reebok-Club-C-85-Vintage-Chalk-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  // === NEW ADDITIONS ===
  // --- ADIDAS ---
  {
    id: 44,
    name: "Adidas Samba OG 'Cloud White'",
    brand: "Adidas",
    category: "adidas",
    price: 120,
    retail: 100,
    releaseDate: "2024-01-15",
    description: "The iconic Samba returns in a clean Cloud White and Core Black colorway. Premium leather upper with the signature gum sole that started it all.",
    images: ["https://images.stockx.com/images/adidas-Samba-OG-Cloud-White-Core-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 45,
    name: "Adidas Campus 00s 'Core Black'",
    brand: "Adidas",
    category: "adidas",
    price: 115,
    retail: 100,
    releaseDate: "2023-09-01",
    description: "A modern reimagining of the classic Campus silhouette from the 2000s. Suede upper with contrasting white stripes and thick rubber sole.",
    images: ["https://images.stockx.com/images/adidas-Campus-00s-Core-Black-Cloud-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 46,
    name: "Adidas Campus 00s 'Grey White'",
    brand: "Adidas",
    category: "adidas",
    price: 110,
    retail: 100,
    releaseDate: "2023-11-01",
    description: "The Campus 00s in a versatile grey suede colorway. Features the chunky sole and premium construction that made this silhouette a modern classic.",
    images: ["https://images.stockx.com/images/adidas-Campus-00s-Grey-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 47,
    name: "Adidas Gazelle Indoor 'Blue Fusion'",
    brand: "Adidas",
    category: "adidas",
    price: 130,
    retail: 110,
    releaseDate: "2024-02-01",
    description: "The Gazelle Indoor brings retro handball court style with a Blue Fusion suede upper and classic gum outsole.",
    images: ["https://images.stockx.com/images/adidas-Gazelle-Indoor-Blue-Fusion-Gum-W-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 48,
    name: "Adidas Handball Spezial 'Light Blue'",
    brand: "Adidas",
    category: "adidas",
    price: 125,
    retail: 100,
    releaseDate: "2024-03-01",
    description: "The Handball Spezial continues its resurgence with this light blue suede colorway. A terrace culture icon with timeless appeal.",
    images: ["https://images.stockx.com/images/adidas-Handball-Spezial-Light-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  // --- NEW BALANCE ---
  {
    id: 49,
    name: "New Balance 2002R 'Rain Cloud'",
    brand: "New Balance",
    category: "new-balance",
    price: 175,
    retail: 150,
    releaseDate: "2023-06-15",
    description: "Part of the Protection Pack, the 2002R Rain Cloud features a tonal grey suede and mesh upper with ABZORB cushioning.",
    images: ["https://images.stockx.com/images/New-Balance-2002R-Rain-Cloud-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 50,
    name: "New Balance 990v6 'Grey'",
    brand: "New Balance",
    category: "new-balance",
    price: 220,
    retail: 200,
    releaseDate: "2024-01-01",
    description: "The latest iteration of the iconic 990 series. Made in USA with premium pigskin suede and FuelCell midsole technology.",
    images: ["https://images.stockx.com/images/New-Balance-990v6-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 51,
    name: "New Balance 530 'White Silver Navy'",
    brand: "New Balance",
    category: "new-balance",
    price: 110,
    retail: 100,
    releaseDate: "2023-08-01",
    description: "The 530 brings retro running style from the early 2000s. Mesh and synthetic upper with ABZORB cushioning in a clean white colorway.",
    images: ["https://images.stockx.com/images/New-Balance-530-White-Silver-Navy-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 52,
    name: "New Balance 574 'Classic Grey'",
    brand: "New Balance",
    category: "new-balance",
    price: 95,
    retail: 90,
    releaseDate: "2023-01-01",
    description: "The quintessential New Balance silhouette in its signature grey. Suede and mesh upper with ENCAP midsole technology.",
    images: ["https://images.stockx.com/images/New-Balance-574-Classic-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  // --- YEEZY ---
  {
    id: 53,
    name: "Adidas Yeezy Foam RNNR 'Onyx'",
    brand: "Yeezy",
    category: "yeezy",
    price: 145,
    retail: 90,
    releaseDate: "2023-09-01",
    description: "The futuristic Foam RNNR in stealthy Onyx black. Made from algae-based foam for a sustainable, comfortable, and distinctive silhouette.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Foam-RNNR-Onyx-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  // --- NIKE ---
  {
    id: 54,
    name: "Nike Air Max Plus 'Black Volt'",
    brand: "Nike",
    category: "nike",
    price: 185,
    retail: 175,
    releaseDate: "2024-01-15",
    description: "The Air Max Plus with its distinctive gradient upper in Black and Volt. Features visible Tuned Air cushioning for maximum comfort.",
    images: ["https://images.stockx.com/images/Nike-Air-Max-Plus-Black-Volt-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 55,
    name: "Nike Air Max 90 'Triple White'",
    brand: "Nike",
    category: "nike",
    price: 135,
    retail: 130,
    releaseDate: "2023-01-01",
    description: "The legendary Air Max 90 in an all-white colorway. A timeless classic that never goes out of style.",
    images: ["https://images.stockx.com/images/Nike-Air-Max-90-Triple-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 56,
    name: "Nike Blazer Mid '77 Vintage 'White Black'",
    brand: "Nike",
    category: "nike",
    price: 115,
    retail: 105,
    releaseDate: "2023-06-01",
    description: "The iconic basketball shoe from 1977, reimagined with a vintage aesthetic. Premium leather upper with exposed foam on the tongue.",
    images: ["https://images.stockx.com/images/Nike-Blazer-Mid-77-Vintage-White-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 57,
    name: "Nike SB Dunk Low 'Court Purple'",
    brand: "Nike",
    category: "nike",
    price: 175,
    retail: 110,
    releaseDate: "2021-03-01",
    description: "A coveted SB Dunk Low colorway featuring Court Purple and white leather. Clean and classic skateboarding style.",
    images: ["https://images.stockx.com/images/Nike-SB-Dunk-Low-Court-Purple-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  // --- JORDAN ---
  {
    id: 58,
    name: "Air Jordan 6 Retro 'Black Infrared' (2019)",
    brand: "Jordan",
    category: "jordan",
    price: 265,
    retail: 200,
    releaseDate: "2019-02-16",
    description: "The iconic colorway Michael Jordan wore when he won his first championship. Black nubuck upper with infrared accents and visible Air unit.",
    images: ["https://images.stockx.com/images/Air-Jordan-6-Retro-Black-Infrared-2019-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 59,
    name: "Air Jordan 1 Low 'Bred Toe'",
    brand: "Jordan",
    category: "jordan",
    price: 145,
    retail: 110,
    releaseDate: "2023-07-01",
    description: "The classic Bred Toe colorway on the low-top Jordan 1. Black, white, and gym red leather in a wearable silhouette.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Low-Bred-Toe-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 60,
    name: "Air Jordan 3 Retro 'Fire Red' (2022)",
    brand: "Jordan",
    category: "jordan",
    price: 210,
    retail: 200,
    releaseDate: "2022-09-10",
    description: "The Fire Red 3s return with OG-style 'Nike Air' branding on the heel. White cement grey upper with fire red accents.",
    images: ["https://images.stockx.com/images/Air-Jordan-3-Retro-Fire-Red-2022-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  // --- OTHER BRANDS ---
  {
    id: 61,
    name: "ASICS Gel-1130 'White Clay Canyon'",
    brand: "ASICS",
    category: "other",
    price: 135,
    retail: 120,
    releaseDate: "2024-01-01",
    description: "The retro runner that's taken over. Originally from 2008, the Gel-1130 features GEL technology and a vintage aesthetic.",
    images: ["https://images.stockx.com/images/ASICS-Gel-1130-White-Clay-Canyon-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 62,
    name: "ASICS GT-2160 'White Black'",
    brand: "ASICS",
    category: "other",
    price: 145,
    retail: 130,
    releaseDate: "2024-02-01",
    description: "The GT-2160 brings 2000s running heritage to modern streetwear. Features GEL cushioning and the iconic ASICS stripe.",
    images: ["https://images.stockx.com/images/ASICS-GT-2160-White-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  // --- MORE JORDAN ---
  {
    id: 63,
    name: "Air Jordan 11 Retro 'Cool Grey' (2021)",
    brand: "Jordan",
    category: "jordan",
    price: 275,
    retail: 225,
    releaseDate: "2021-12-11",
    description: "The Cool Grey 11s returned in 2021 with the iconic patent leather mudguard and carbon fiber spring plate. A holiday grail.",
    images: ["https://images.stockx.com/images/Air-Jordan-11-Retro-Cool-Grey-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 64,
    name: "Air Jordan 5 Retro 'Aqua'",
    brand: "Jordan",
    category: "jordan",
    price: 215,
    retail: 200,
    releaseDate: "2022-11-25",
    description: "The Aqua 5s feature a black suede upper with bright aqua blue accents on the midsole and shark tooth detailing.",
    images: ["https://images.stockx.com/images/Air-Jordan-5-Retro-Aqua-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 65,
    name: "Air Jordan 12 Retro 'Royalty Taxi'",
    brand: "Jordan",
    category: "jordan",
    price: 225,
    retail: 200,
    releaseDate: "2021-11-13",
    description: "Black tumbled leather upper with metallic gold accents and white midsole. Premium materials and iconic 12 silhouette.",
    images: ["https://images.stockx.com/images/Air-Jordan-12-Retro-Royalty-Taxi-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 66,
    name: "Air Jordan 1 Retro High OG 'Palomino'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 180,
    releaseDate: "2023-10-14",
    description: "Premium tan leather with black accents on this sophisticated Jordan 1 colorway. Buttery soft materials throughout.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Palomino-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 67,
    name: "Air Jordan 1 Retro High OG 'Yellow Ochre'",
    brand: "Jordan",
    category: "jordan",
    price: 185,
    retail: 180,
    releaseDate: "2024-01-27",
    description: "A fresh colorway featuring Yellow Ochre leather overlays on a white base. Sail midsole adds a vintage touch.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Yellow-Ochre-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 68,
    name: "Air Jordan 1 Retro High OG 'Stealth'",
    brand: "Jordan",
    category: "jordan",
    price: 175,
    retail: 170,
    releaseDate: "2022-08-20",
    description: "An understated grey colorway that's perfect for everyday wear. Premium leather in Light Smoke Grey and White.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Stealth-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 69,
    name: "Air Jordan 13 Retro 'Wheat' (2023)",
    brand: "Jordan",
    category: "jordan",
    price: 210,
    retail: 200,
    releaseDate: "2023-12-16",
    description: "The classic 13 silhouette in a wheat/tan colorway with gum sole. Holographic Jumpman eye and panther paw outsole.",
    images: ["https://images.stockx.com/images/Air-Jordan-13-Retro-Wheat-2023-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 70,
    name: "Air Jordan 4 Retro 'Red Cement'",
    brand: "Jordan",
    category: "jordan",
    price: 295,
    retail: 210,
    releaseDate: "2023-09-09",
    description: "Fire Red and cement grey combine on this striking Jordan 4. Nike Air branding on the heel adds OG appeal.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Red-Cement-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 71,
    name: "Air Jordan 4 Retro 'White Oreo' (2021)",
    brand: "Jordan",
    category: "jordan",
    price: 315,
    retail: 190,
    releaseDate: "2021-07-03",
    description: "White leather upper with Tech Grey speckled accents. One of the cleanest Jordan 4 colorways in recent memory.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-White-Oreo-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  // --- MORE NIKE ---
  {
    id: 72,
    name: "Nike Dunk Low 'Grey Fog'",
    brand: "Nike",
    category: "nike",
    price: 135,
    retail: 110,
    releaseDate: "2022-02-01",
    description: "A clean two-tone colorway in white and Grey Fog. Premium leather construction on a classic Dunk Low silhouette.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Grey-Fog-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 73,
    name: "Nike Dunk Low 'Vintage Green'",
    brand: "Nike",
    category: "nike",
    price: 125,
    retail: 110,
    releaseDate: "2022-06-01",
    description: "A vintage-inspired green and white Dunk Low. Perfect for those who love retro collegiate style.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Vintage-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 74,
    name: "Nike Dunk Low 'Polar Blue'",
    brand: "Nike",
    category: "nike",
    price: 130,
    retail: 110,
    releaseDate: "2022-03-01",
    description: "Icy Polar Blue overlays on a white leather base. A refreshing Dunk Low colorway for warmer months.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Polar-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 75,
    name: "Nike Dunk Low 'Rose Whisper' (W)",
    brand: "Nike",
    category: "nike",
    price: 120,
    retail: 110,
    releaseDate: "2022-01-01",
    description: "A soft pink colorway with white base. Feminine and versatile, this women's exclusive has been a hit.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Rose-Whisper-W-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 76,
    name: "Nike Dunk High 'Panda'",
    brand: "Nike",
    category: "nike",
    price: 145,
    retail: 125,
    releaseDate: "2021-09-01",
    description: "The high-top version of the iconic Panda colorway. Black and white leather in the classic Dunk silhouette.",
    images: ["https://images.stockx.com/images/Nike-Dunk-High-Panda-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 77,
    name: "Nike P-6000 'Metallic Silver'",
    brand: "Nike",
    category: "nike",
    price: 115,
    retail: 110,
    releaseDate: "2024-01-01",
    description: "Y2K running style returns with the P-6000. Metallic silver details and visible Air cushioning.",
    images: ["https://images.stockx.com/images/Nike-P-6000-Metallic-Silver-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 78,
    name: "Nike Air Force 1 Low x Stussy 'Fossil'",
    brand: "Nike",
    category: "nike",
    price: 225,
    retail: 150,
    releaseDate: "2020-12-11",
    description: "Stussy's take on the Air Force 1 features a textured fossil-toned upper with reflective Swoosh details.",
    images: ["https://images.stockx.com/images/Nike-Air-Force-1-Low-Stussy-Fossil-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: false
  },
  // --- MORE YEEZY ---
  {
    id: 79,
    name: "Adidas Yeezy Boost 350 V2 'MX Rock'",
    brand: "Yeezy",
    category: "yeezy",
    price: 285,
    retail: 230,
    releaseDate: "2021-12-27",
    description: "The MX pattern brings a marbled look to the 350 V2. Rock-inspired earth tones throughout the Primeknit upper.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-MX-Rock-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 80,
    name: "Adidas Yeezy Boost 350 V2 'Dazzling Blue'",
    brand: "Yeezy",
    category: "yeezy",
    price: 265,
    retail: 230,
    releaseDate: "2022-02-26",
    description: "Black Primeknit upper with a vibrant Dazzling Blue stripe. Classic 350 V2 design with Boost cushioning.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Dazzling-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 81,
    name: "Adidas Yeezy Boost 700 'Analog'",
    brand: "Yeezy",
    category: "yeezy",
    price: 310,
    retail: 300,
    releaseDate: "2019-04-27",
    description: "Muted tan and grey tones on the chunky 700 silhouette. Premium leather, suede, and mesh construction.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-700-Analog-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  // --- MORE NEW BALANCE ---
  {
    id: 82,
    name: "New Balance 550 'White Grey'",
    brand: "New Balance",
    category: "new-balance",
    price: 135,
    retail: 110,
    releaseDate: "2021-03-01",
    description: "The 550 that started the retro basketball revival. Clean white leather with grey accents and perforated toe.",
    images: ["https://images.stockx.com/images/New-Balance-550-White-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 83,
    name: "New Balance 9060 'Sea Salt'",
    brand: "New Balance",
    category: "new-balance",
    price: 185,
    retail: 150,
    releaseDate: "2023-03-01",
    description: "The 9060's deconstructed aesthetic in a warm Sea Salt colorway. ABZORB and SBS cushioning for comfort.",
    images: ["https://images.stockx.com/images/New-Balance-9060-Sea-Salt-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 84,
    name: "New Balance 2002R 'Sea Salt'",
    brand: "New Balance",
    category: "new-balance",
    price: 165,
    retail: 150,
    releaseDate: "2023-08-01",
    description: "The 2002R continues to be a go-to lifestyle sneaker. Sea Salt suede and mesh with N-ergy cushioning.",
    images: ["https://images.stockx.com/images/New-Balance-2002R-Sea-Salt-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  // --- MORE ADIDAS ---
  {
    id: 85,
    name: "Adidas Samba x Wales Bonner 'Silver'",
    brand: "Adidas",
    category: "adidas",
    price: 350,
    retail: 200,
    releaseDate: "2023-04-01",
    description: "Wales Bonner's elevated take on the Samba. Premium silver leather with pony hair details. A collector's piece.",
    images: ["https://images.stockx.com/images/adidas-Samba-Wales-Bonner-Silver-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 86,
    name: "Adidas Campus 80s x South Park 'Towelie'",
    brand: "Adidas",
    category: "adidas",
    price: 195,
    retail: 100,
    releaseDate: "2021-04-20",
    description: "The infamous 420 release featuring Towelie from South Park. Blue-purple suede with bloodshot eye graphics.",
    images: ["https://images.stockx.com/images/adidas-Campus-80s-South-Park-Towelie-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  // --- MORE OTHER BRANDS ---
  {
    id: 87,
    name: "ASICS Gel-NYC 'White Ivy'",
    brand: "ASICS",
    category: "other",
    price: 155,
    retail: 140,
    releaseDate: "2024-01-01",
    description: "A hybrid of the Gel-Nimbus 3 and MC Plus V, the Gel-NYC brings chunky 2000s style with modern comfort.",
    images: ["https://images.stockx.com/images/ASICS-Gel-NYC-White-Ivy-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 88,
    name: "Vans Old Skool 'Black White'",
    brand: "Vans",
    category: "other",
    price: 70,
    retail: 65,
    releaseDate: "2023-01-01",
    description: "The iconic skate shoe with the famous jazz stripe. Black canvas and suede upper with signature waffle sole.",
    images: ["https://images.stockx.com/images/Vans-Old-Skool-Black-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  // === BATCH 3 ADDITIONS ===
  // --- JORDAN ---
  {
    id: 89,
    name: "Air Jordan 4 Retro 'Lightning' (2021)",
    brand: "Jordan",
    category: "jordan",
    price: 285,
    retail: 190,
    releaseDate: "2021-08-28",
    description: "The electric yellow Jordan 4 returns. Tour Yellow nubuck upper with grey and black accents. A 2006 classic reimagined.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Lightning-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 90,
    name: "Air Jordan 4 Retro 'University Blue'",
    brand: "Jordan",
    category: "jordan",
    price: 350,
    retail: 190,
    releaseDate: "2021-04-28",
    description: "UNC vibes on the iconic 4 silhouette. University Blue suede with tech grey and white details.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-University-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 91,
    name: "Air Jordan 3 Retro 'Cardinal Red'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 200,
    releaseDate: "2022-02-24",
    description: "Cardinal Red accents pop against the white leather and cement grey elephant print. A fresh take on the classic 3.",
    images: ["https://images.stockx.com/images/Air-Jordan-3-Retro-Cardinal-Red-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 92,
    name: "Air Jordan 1 Retro High OG 'Craft Ivory'",
    brand: "Jordan",
    category: "jordan",
    price: 175,
    retail: 180,
    releaseDate: "2023-11-11",
    description: "Part of the Craft series with premium materials. Ivory and cream tones with grey suede accents.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Craft-Ivory-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 93,
    name: "Air Jordan 1 Low 'Shadow Toe'",
    brand: "Jordan",
    category: "jordan",
    price: 135,
    retail: 110,
    releaseDate: "2022-05-01",
    description: "Black toe-box styling meets Shadow grey. A versatile low-top perfect for everyday wear.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Low-Shadow-Toe-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 94,
    name: "Air Jordan 1 Low 'Black Toe'",
    brand: "Jordan",
    category: "jordan",
    price: 145,
    retail: 110,
    releaseDate: "2023-01-01",
    description: "The classic Black Toe colorway on the low-top silhouette. Black, white, and gym red leather.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Low-Black-Toe-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 95,
    name: "Air Jordan 6 Retro 'Electric Green'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 190,
    releaseDate: "2021-06-05",
    description: "Black nubuck upper with vibrant Electric Green accents. A bold colorway on the championship silhouette.",
    images: ["https://images.stockx.com/images/Air-Jordan-6-Retro-Electric-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 96,
    name: "Air Jordan 5 Retro 'Green Bean' (2022)",
    brand: "Jordan",
    category: "jordan",
    price: 205,
    retail: 200,
    releaseDate: "2022-05-28",
    description: "Silver and Green Bean colorway returns. 3M reflective tongue with shark teeth midsole detailing.",
    images: ["https://images.stockx.com/images/Air-Jordan-5-Retro-Green-Bean-2022-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 97,
    name: "Air Jordan 2 Retro 'Lucky Green'",
    brand: "Jordan",
    category: "jordan",
    price: 165,
    retail: 175,
    releaseDate: "2023-03-11",
    description: "The Jordan 2 in a fresh Lucky Green colorway. Premium leather construction with lizard-print detailing.",
    images: ["https://images.stockx.com/images/Air-Jordan-2-Retro-Lucky-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 98,
    name: "Air Jordan 2 Retro 'Chicago' (2022)",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 175,
    releaseDate: "2022-12-30",
    description: "The OG Chicago colorway returns on the Jordan 2. White leather with varsity red and black accents.",
    images: ["https://images.stockx.com/images/Air-Jordan-2-Retro-Chicago-2022-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: false
  },
  {
    id: 99,
    name: "Air Jordan 7 Retro 'Flint' (2021)",
    brand: "Jordan",
    category: "jordan",
    price: 205,
    retail: 190,
    releaseDate: "2021-05-08",
    description: "The Flint 7s in their 2021 iteration. White, Flint Grey, and Varsity Purple on the geometric 7 silhouette.",
    images: ["https://images.stockx.com/images/Air-Jordan-7-Retro-Flint-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 100,
    name: "Air Jordan 10 Retro 'Shadow' (2018)",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 190,
    releaseDate: "2018-04-20",
    description: "Black and grey tones on the Jordan 10. Features the iconic sole with accomplishments etched into it.",
    images: ["https://images.stockx.com/images/Air-Jordan-10-Retro-Shadow-2018-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  // --- NIKE ---
  {
    id: 101,
    name: "Nike Dunk Low 'Black White' (2021)",
    brand: "Nike",
    category: "nike",
    price: 145,
    retail: 100,
    releaseDate: "2021-03-10",
    description: "The original Panda Dunk that started it all. Classic black and white colorblocking that goes with everything.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Black-White-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 102,
    name: "Nike Dunk Low 'UNC' (2021)",
    brand: "Nike",
    category: "nike",
    price: 175,
    retail: 100,
    releaseDate: "2021-06-24",
    description: "University Blue and white in the classic Dunk Low. A must-have for UNC fans and Dunk collectors.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-UNC-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 103,
    name: "Nike Dunk Low 'Team Green'",
    brand: "Nike",
    category: "nike",
    price: 135,
    retail: 100,
    releaseDate: "2022-04-01",
    description: "Rich Team Green overlays on white leather. A fan-favorite colorway in the Dunk Low lineup.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Team-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 104,
    name: "Nike Dunk Low 'Gorge Green'",
    brand: "Nike",
    category: "nike",
    price: 130,
    retail: 110,
    releaseDate: "2023-03-01",
    description: "Deep Gorge Green leather overlays with white base and gum sole. A refined take on the Dunk.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Gorge-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 105,
    name: "Nike Dunk Low 'Chlorophyll'",
    brand: "Nike",
    category: "nike",
    price: 140,
    retail: 110,
    releaseDate: "2022-03-01",
    description: "Inspired by the classic Air Trainer 1. Chlorophyll green accents with grey and white base.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Chlorophyll-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 106,
    name: "Nike Dunk Low SE 'Jackpot'",
    brand: "Nike",
    category: "nike",
    price: 135,
    retail: 120,
    releaseDate: "2024-01-01",
    description: "Vegas-inspired Dunk with playing card graphics and gold accents. Hit the jackpot with this SE release.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-SE-Jackpot-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 107,
    name: "Nike Dunk Low 'Industrial Blue Sashiko'",
    brand: "Nike",
    category: "nike",
    price: 145,
    retail: 120,
    releaseDate: "2023-05-01",
    description: "Japanese-inspired sashiko stitching in Industrial Blue. Premium craftsmanship on the classic Dunk.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Industrial-Blue-Sashiko-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 108,
    name: "Nike SB Dunk Low 'White Navy' Orange Label",
    brand: "Nike",
    category: "nike",
    price: 155,
    retail: 110,
    releaseDate: "2021-04-01",
    description: "Clean white and navy colorway from the Orange Label line. Premium materials for skateshops only.",
    images: ["https://images.stockx.com/images/Nike-SB-Dunk-Low-Orange-Label-White-Navy-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 109,
    name: "Nike Air Max 1 SC 'Light Bone Violet Dust'",
    brand: "Nike",
    category: "nike",
    price: 145,
    retail: 140,
    releaseDate: "2024-02-01",
    description: "Soft Light Bone base with Violet Dust accents. The SC version features jewel Swoosh branding.",
    images: ["https://images.stockx.com/images/Nike-Air-Max-1-SC-Light-Bone-Violet-Dust-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 110,
    name: "Nike Air Max Plus 'Triple White'",
    brand: "Nike",
    category: "nike",
    price: 185,
    retail: 175,
    releaseDate: "2023-01-01",
    description: "The aggressive Air Max Plus silhouette in clean triple white. Visible Tuned Air cushioning throughout.",
    images: ["https://images.stockx.com/images/Nike-Air-Max-Plus-Triple-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 111,
    name: "Nike Air Presto x Off-White 'White' (2018)",
    brand: "Nike",
    category: "nike",
    price: 485,
    retail: 160,
    releaseDate: "2018-07-01",
    description: "Virgil Abloh's deconstructed take on the Air Presto. Signature Off-White details with exposed foam and zip tie.",
    images: ["https://images.stockx.com/images/Nike-Air-Presto-Off-White-White-2018-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: false
  },
  // --- YEEZY ---
  {
    id: 112,
    name: "Adidas Yeezy Boost 350 V2 'Beluga Reflective'",
    brand: "Yeezy",
    category: "yeezy",
    price: 325,
    retail: 230,
    releaseDate: "2021-12-18",
    description: "The iconic Beluga colorway returns with reflective stripe. Solar Red accents on grey Primeknit.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Beluga-Reflective-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 113,
    name: "Adidas Yeezy Boost 350 V2 'Blue Tint'",
    brand: "Yeezy",
    category: "yeezy",
    price: 295,
    retail: 220,
    releaseDate: "2022-01-22",
    description: "Grey Primeknit upper with blue tint stripe and red SPLY-350 branding. A beloved 350 V2 colorway.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Blue-Tint-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 114,
    name: "Adidas Yeezy 500 'Granite'",
    brand: "Yeezy",
    category: "yeezy",
    price: 225,
    retail: 200,
    releaseDate: "2022-10-01",
    description: "The chunky 500 silhouette in Granite grey. Suede, leather, and mesh with adiPRENE cushioning.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-500-Granite-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  // --- NEW BALANCE ---
  {
    id: 115,
    name: "New Balance 550 'White Black'",
    brand: "New Balance",
    category: "new-balance",
    price: 130,
    retail: 110,
    releaseDate: "2021-06-01",
    description: "Clean panda colorway on the retro basketball 550. White leather with black 'N' logo and accents.",
    images: ["https://images.stockx.com/images/New-Balance-550-White-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 116,
    name: "New Balance 550 x Aimé Leon Dore 'White Grey'",
    brand: "New Balance",
    category: "new-balance",
    price: 295,
    retail: 130,
    releaseDate: "2020-11-01",
    description: "The collaboration that started the 550 revival. ALD's refined take with grey suede and leather.",
    images: ["https://images.stockx.com/images/New-Balance-550-Aime-Leon-Dore-White-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 117,
    name: "New Balance 1906R 'Silver Metallic Sea Salt'",
    brand: "New Balance",
    category: "new-balance",
    price: 175,
    retail: 150,
    releaseDate: "2023-06-01",
    description: "Part of the Protection Pack with metallic silver and sea salt tones. Premium mesh and suede construction.",
    images: ["https://images.stockx.com/images/New-Balance-1906R-Silver-Metallic-Sea-Salt-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  // === BATCH 4 ADDITIONS ===
  // --- JORDAN ---
  {
    id: 118,
    name: "Air Jordan 1 Retro High OG 'Stage Haze'",
    brand: "Jordan",
    category: "jordan",
    price: 175,
    retail: 170,
    releaseDate: "2022-07-02",
    description: "Grey and cream tones with subtle bleached coral accents. A sophisticated take on the Jordan 1.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Stage-Haze-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 119,
    name: "Air Jordan 1 Retro High OG 'Atmosphere' (W)",
    brand: "Jordan",
    category: "jordan",
    price: 165,
    retail: 180,
    releaseDate: "2023-02-25",
    description: "Women's exclusive with soft Atmosphere grey and white leather. Subtle and versatile colorway.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Atmosphere-W-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 120,
    name: "Air Jordan 1 Retro High OG 'Rebellionaire'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 170,
    releaseDate: "2022-03-12",
    description: "Black and white with newspaper-style graphics. A tribute to MJ's rebellious spirit when Nike was fined for the banned AJ1.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Rebellionaire-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 121,
    name: "Air Jordan 1 Retro High OG 'Heritage'",
    brand: "Jordan",
    category: "jordan",
    price: 175,
    retail: 170,
    releaseDate: "2022-04-09",
    description: "Classic Chicago-inspired colorblocking with white, red, and black. Heritage vibes with premium leather.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Heritage-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 122,
    name: "Air Jordan 4 Retro SE 'Craft Photon Dust'",
    brand: "Jordan",
    category: "jordan",
    price: 225,
    retail: 210,
    releaseDate: "2024-02-10",
    description: "Part of the Craft series with premium materials. Light Photon Dust colorway with exposed foam details.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-SE-Craft-Photon-Dust-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 123,
    name: "Air Jordan 11 Retro 'Gamma Blue'",
    brand: "Jordan",
    category: "jordan",
    price: 295,
    retail: 200,
    releaseDate: "2013-12-21",
    description: "Black upper with Gamma Blue accents and varsity maize Jumpman. A holiday classic from 2013.",
    images: ["https://images.stockx.com/images/Air-Jordan-11-Retro-Gamma-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 124,
    name: "Air Jordan 3 Retro 'A Ma Maniére' (W)",
    brand: "Jordan",
    category: "jordan",
    price: 475,
    retail: 200,
    releaseDate: "2021-04-21",
    description: "James Whitner's A Ma Maniére brings a luxurious rose-tinted take on the 3. Premium materials and quilted lining.",
    images: ["https://images.stockx.com/images/Air-Jordan-3-Retro-A-Ma-Maniere-W-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 125,
    name: "Air Jordan 3 Retro 'Dark Iris'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 200,
    releaseDate: "2022-07-30",
    description: "Black cement 3 with purple iris accents. A fresh colorway on the iconic silhouette.",
    images: ["https://images.stockx.com/images/Air-Jordan-3-Retro-Dark-Iris-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 126,
    name: "Air Jordan 3 Retro 'Palomino'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 200,
    releaseDate: "2023-09-02",
    description: "Warm Palomino brown accents on white leather with cement grey details. Fall-ready colorway.",
    images: ["https://images.stockx.com/images/Air-Jordan-3-Retro-Palomino-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 127,
    name: "Air Jordan 3 Retro 'Wizards'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 200,
    releaseDate: "2023-03-25",
    description: "Inspired by MJ's Wizards era. True Blue and fire red accents on white leather.",
    images: ["https://images.stockx.com/images/Air-Jordan-3-Retro-Wizards-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 128,
    name: "Air Jordan 12 Retro 'Black Taxi'",
    brand: "Jordan",
    category: "jordan",
    price: 215,
    retail: 200,
    releaseDate: "2022-10-08",
    description: "Black tumbled leather with Taxi yellow accents. A sophisticated 12 for the holiday season.",
    images: ["https://images.stockx.com/images/Air-Jordan-12-Retro-Black-Taxi-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 129,
    name: "Air Jordan 12 Retro 'Stealth'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 200,
    releaseDate: "2022-03-05",
    description: "Clean white leather with grey accents. A stealthy Jordan 12 for everyday versatility.",
    images: ["https://images.stockx.com/images/Air-Jordan-12-Retro-Stealth-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 130,
    name: "Air Jordan 12 Retro 'Twist'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 190,
    releaseDate: "2021-07-24",
    description: "White leather upper with red and black accents. A twist on the classic Taxi colorway.",
    images: ["https://images.stockx.com/images/Air-Jordan-12-Retro-Twist-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  // --- NIKE ---
  {
    id: 131,
    name: "Nike Air Force 1 Low 'White Black' (2020)",
    brand: "Nike",
    category: "nike",
    price: 115,
    retail: 100,
    releaseDate: "2020-01-01",
    description: "The classic AF1 Low in white leather with black Swoosh and outsole accents. Timeless.",
    images: ["https://images.stockx.com/images/Nike-Air-Force-1-Low-White-Black-2020-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 132,
    name: "Nike Air Force 1 Low x Travis Scott 'Cactus Jack'",
    brand: "Nike",
    category: "nike",
    price: 585,
    retail: 150,
    releaseDate: "2019-11-16",
    description: "Travis Scott's deconstructed AF1 with removable Swoosh patches and canvas uppers. A grail.",
    images: ["https://images.stockx.com/images/Nike-Air-Force-1-Low-Travis-Scott-Cactus-Jack-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 133,
    name: "Nike Air Force 1 Low 'White University Red'",
    brand: "Nike",
    category: "nike",
    price: 115,
    retail: 100,
    releaseDate: "2021-01-01",
    description: "Clean white leather with University Red Swoosh accents. Simple and classic.",
    images: ["https://images.stockx.com/images/Nike-Air-Force-1-Low-White-University-Red-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 134,
    name: "Nike Dunk Low 'Two Tone Grey'",
    brand: "Nike",
    category: "nike",
    price: 125,
    retail: 110,
    releaseDate: "2022-06-01",
    description: "Light and dark grey leather for a tonal look. Subtle and wearable everyday Dunk.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Two-Tone-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 135,
    name: "Nike Dunk Low 'Valerian Blue'",
    brand: "Nike",
    category: "nike",
    price: 135,
    retail: 110,
    releaseDate: "2022-01-01",
    description: "Deep Valerian Blue overlays on white leather. A rich, saturated take on the Dunk Low.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Valerian-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 136,
    name: "Nike Air Max 1 'Curry' (2018)",
    brand: "Nike",
    category: "nike",
    price: 195,
    retail: 140,
    releaseDate: "2018-05-01",
    description: "Inspired by Japanese curry packaging. White mesh with brown and yellow accents. A food-inspired classic.",
    images: ["https://images.stockx.com/images/Nike-Air-Max-1-Curry-2018-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  // --- ADIDAS ---
  {
    id: 137,
    name: "Adidas Gazelle Bold 'Pink Glow' (W)",
    brand: "Adidas",
    category: "adidas",
    price: 135,
    retail: 120,
    releaseDate: "2024-01-01",
    description: "The platform Gazelle Bold in vibrant Pink Glow. A bold statement piece for the bold.",
    images: ["https://images.stockx.com/images/adidas-Gazelle-Bold-Pink-Glow-W-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  // --- YEEZY ---
  {
    id: 138,
    name: "Adidas Yeezy Boost 380 'Calcite Glow'",
    brand: "Yeezy",
    category: "yeezy",
    price: 195,
    retail: 230,
    releaseDate: "2020-10-10",
    description: "The 380 silhouette with glow-in-the-dark detailing. Unique pattern and comfortable Boost cushioning.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-380-Calcite-Glow-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  // --- NEW BALANCE ---
  {
    id: 139,
    name: "New Balance 992 'Grey'",
    brand: "New Balance",
    category: "new-balance",
    price: 265,
    retail: 185,
    releaseDate: "2020-04-01",
    description: "Steve Jobs' favorite shoe. Made in USA with premium grey suede and mesh. A dad shoe icon.",
    images: ["https://images.stockx.com/images/New-Balance-992-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  // --- OTHER BRANDS ---
  {
    id: 140,
    name: "ASICS Gel-Kayano 14 x JJJJound 'Silver White'",
    brand: "ASICS",
    category: "other",
    price: 285,
    retail: 180,
    releaseDate: "2023-06-01",
    description: "JJJJound's minimalist take on the Kayano 14. Clean silver and white with premium materials.",
    images: ["https://images.stockx.com/images/ASICS-Gel-Kayano-14-JJJJound-Silver-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 141,
    name: "Saucony Shadow 6000 'Grey Navy'",
    brand: "Saucony",
    category: "other",
    price: 110,
    retail: 100,
    releaseDate: "2023-01-01",
    description: "A retro running classic from Saucony. Grey suede and mesh with navy accents.",
    images: ["https://images.stockx.com/images/Saucony-Shadow-6000-Grey-Navy-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 142,
    name: "Air Jordan 4 Retro 'Bred Reimagined'",
    brand: "Jordan",
    category: "jordan",
    price: 285,
    retail: 215,
    releaseDate: "2024-02-17",
    description: "The iconic Bred colorway returns with a reimagined design. Black nubuck upper with Fire Red accents and Nike Air branding on the heel.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Bred-Reimagined-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 143,
    name: "New Balance 550 'White Green'",
    brand: "New Balance",
    category: "new-balance",
    price: 125,
    retail: 110,
    releaseDate: "2022-03-15",
    description: "Classic basketball-inspired silhouette in white leather with green accents. A versatile everyday sneaker.",
    images: ["https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 144,
    name: "Air Jordan 11 Retro 'Cherry' (2022)",
    brand: "Jordan",
    category: "jordan",
    price: 245,
    retail: 225,
    releaseDate: "2022-12-10",
    description: "The Air Jordan 11 Cherry features white patent leather with varsity red accents. A holiday favorite returning in 2022.",
    images: ["https://images.stockx.com/images/Air-Jordan-11-Retro-Cherry-2022-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 145,
    name: "Air Jordan 3 Retro 'White Cement Reimagined'",
    brand: "Jordan",
    category: "jordan",
    price: 275,
    retail: 210,
    releaseDate: "2023-03-11",
    description: "The legendary White Cement colorway reimagined with vintage details. White tumbled leather with elephant print overlays and Nike Air branding.",
    images: ["https://images.stockx.com/images/Air-Jordan-3-Retro-White-Cement-Reimagined-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 146,
    name: "Nike Dunk Low 'Grey Fog'",
    brand: "Nike",
    category: "nike",
    price: 135,
    retail: 110,
    releaseDate: "2022-01-20",
    description: "A clean, versatile Dunk Low in white leather with grey fog overlays. Perfect for everyday wear.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Grey-Fog-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 147,
    name: "Air Jordan 5 Retro 'Aqua'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 200,
    releaseDate: "2022-11-25",
    description: "The Air Jordan 5 Aqua features black suede with aqua blue accents on the midsole and tongue. A fresh take on a classic silhouette.",
    images: ["https://images.stockx.com/images/Air-Jordan-5-Retro-Aqua-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 148,
    name: "Air Jordan 6 Retro 'Toro Bravo'",
    brand: "Jordan",
    category: "jordan",
    price: 215,
    retail: 200,
    releaseDate: "2023-01-28",
    description: "An all-red Air Jordan 6 inspired by the raging bull. Premium suede upper with matching red accents throughout.",
    images: ["https://images.stockx.com/images/Air-Jordan-6-Retro-Toro-Bravo-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 149,
    name: "Nike Air Max 90 'Infrared' (2020)",
    brand: "Nike",
    category: "nike",
    price: 165,
    retail: 140,
    releaseDate: "2020-01-23",
    description: "The iconic Air Max 90 Infrared returns for its 30th anniversary. White mesh and leather with infrared accents.",
    images: ["https://images.stockx.com/images/Nike-Air-Max-90-Infrared-2020-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 150,
    name: "Air Jordan 12 Retro 'Playoffs' (2022)",
    brand: "Jordan",
    category: "jordan",
    price: 225,
    retail: 200,
    releaseDate: "2022-03-12",
    description: "The Playoffs 12 returns with black tumbled leather and white accents. A fan favorite originally worn by MJ in 1997.",
    images: ["https://images.stockx.com/images/Air-Jordan-12-Retro-Playoffs-2022-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 151,
    name: "Air Jordan 1 Retro High OG 'Stage Haze'",
    brand: "Jordan",
    category: "jordan",
    price: 175,
    retail: 180,
    releaseDate: "2022-07-02",
    description: "A unique Jordan 1 with grey suede and bleached coral accents. Features cracked leather detailing for a vintage aesthetic.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Stage-Haze-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 152,
    name: "New Balance 550 'White Grey'",
    brand: "New Balance",
    category: "new-balance",
    price: 130,
    retail: 110,
    releaseDate: "2021-09-01",
    description: "The New Balance 550 in a clean white and grey colorway. Retro basketball style with modern appeal.",
    images: ["https://images.stockx.com/images/New-Balance-550-White-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 153,
    name: "Nike SB Dunk Low 'Jarritos'",
    brand: "Nike",
    category: "nike",
    price: 425,
    retail: 125,
    releaseDate: "2023-05-06",
    description: "A vibrant collaboration with the Mexican soda brand. Features green suede with multicolor accents and special packaging.",
    images: ["https://images.stockx.com/images/Nike-SB-Dunk-Low-Jarritos-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 154,
    name: "New Balance 990v6 'Grey'",
    brand: "New Balance",
    category: "new-balance",
    price: 205,
    retail: 200,
    releaseDate: "2023-06-15",
    description: "The latest iteration of the iconic 990 series. Made in USA with premium grey suede and mesh construction.",
    images: ["https://images.stockx.com/images/New-Balance-990v6-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 155,
    name: "Air Jordan 1 Retro High OG 'Yellow Ochre'",
    brand: "Jordan",
    category: "jordan",
    price: 185,
    retail: 180,
    releaseDate: "2022-10-29",
    description: "A toe-inspired colorway with sail leather and yellow ochre accents. Features Nike Air branding and vintage aesthetic.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Yellow-Ochre-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 156,
    name: "Air Jordan 1 Retro High OG 'Rebellionaire'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 180,
    releaseDate: "2022-03-12",
    description: "A banned-inspired design with newspaper print graphics. Black and white with red accents and rebel messaging.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Rebellionaire-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 157,
    name: "Air Jordan 4 Retro 'Red Thunder'",
    brand: "Jordan",
    category: "jordan",
    price: 295,
    retail: 210,
    releaseDate: "2022-01-15",
    description: "A striking Jordan 4 with black nubuck and crimson red accents. Features visible Air cushioning and signature mesh panels.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Red-Thunder-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 158,
    name: "Air Jordan 5 Retro 'Green Bean' (2022)",
    brand: "Jordan",
    category: "jordan",
    price: 205,
    retail: 200,
    releaseDate: "2022-05-28",
    description: "The Green Bean 5 returns with silver reflective tongue and green Bean accents. A unique colorway from 2006 finally re-released.",
    images: ["https://images.stockx.com/images/Air-Jordan-5-Retro-Green-Bean-2022-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 159,
    name: "Air Jordan 1 Retro High OG 'Heritage'",
    brand: "Jordan",
    category: "jordan",
    price: 165,
    retail: 180,
    releaseDate: "2022-04-09",
    description: "A classic Chicago-inspired colorway with white leather and red overlays. Features Heritage branding on the tongue.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Heritage-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 160,
    name: "Nike SB Dunk Low 'FTC Lagoon Pulse'",
    brand: "Nike",
    category: "nike",
    price: 285,
    retail: 120,
    releaseDate: "2021-10-09",
    description: "A collaboration with San Francisco's FTC skate shop. Features lagoon pulse blue suede with special FTC branding.",
    images: ["https://images.stockx.com/images/Nike-SB-Dunk-Low-FTC-Lagoon-Pulse-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 161,
    name: "Adidas Yeezy 500 'Utility Black'",
    brand: "Yeezy",
    category: "yeezy",
    price: 245,
    retail: 200,
    releaseDate: "2018-07-07",
    description: "The Yeezy 500 in an all-black utility colorway. Features suede, mesh, and leather overlays with adiPRENE+ cushioning.",
    images: ["https://images.stockx.com/images/Adidas-Yeezy-500-Utility-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 162,
    name: "New Balance 550 x Aime Leon Dore 'White Navy Red'",
    brand: "New Balance",
    category: "new-balance",
    price: 385,
    retail: 130,
    releaseDate: "2020-11-13",
    description: "The collaboration that sparked the 550 revival. White leather with navy and red accents, featuring ALD branding.",
    images: ["https://images.stockx.com/images/New-Balance-550-Aime-Leon-Dore-White-Navy-Red-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 163,
    name: "Air Jordan 2 Retro Low SP x Off-White 'Black Blue'",
    brand: "Jordan",
    category: "jordan",
    price: 425,
    retail: 275,
    releaseDate: "2022-08-12",
    description: "Virgil Abloh's take on the Air Jordan 2. Features deconstructed design with signature Off-White branding and blue accents.",
    images: ["https://images.stockx.com/images/Air-Jordan-2-Retro-Low-SP-Off-White-Black-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: false
  },
  {
    id: 164,
    name: "Air Jordan 11 Retro Low 'Legend Blue'",
    brand: "Jordan",
    category: "jordan",
    price: 185,
    retail: 185,
    releaseDate: "2023-05-20",
    description: "The Jordan 11 Low in the classic Legend Blue colorway. White leather with icy translucent outsole and legend blue accents.",
    images: ["https://images.stockx.com/images/Air-Jordan-11-Retro-Low-Legend-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 165,
    name: "Nike SB Dunk Low 'Chlorophyll'",
    brand: "Nike",
    category: "nike",
    price: 145,
    retail: 110,
    releaseDate: "2022-06-01",
    description: "Inspired by the classic Air Trainer 1 Chlorophyll. Green suede overlays on a white leather base with gum sole.",
    images: ["https://images.stockx.com/images/Nike-SB-Dunk-Low-Chlorophyll-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 166,
    name: "Air Jordan 1 Retro High OG 'Craft Ivory'",
    brand: "Jordan",
    category: "jordan",
    price: 175,
    retail: 180,
    releaseDate: "2023-03-18",
    description: "Premium craft construction with ivory leather and light olive accents. Features crinkled leather and vintage aesthetic.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Craft-Ivory-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 167,
    name: "Air Jordan 12 Retro 'Stealth'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 200,
    releaseDate: "2022-03-05",
    description: "An all-grey Jordan 12 with stealth styling. Features premium leather and suede construction with metallic accents.",
    images: ["https://images.stockx.com/images/Air-Jordan-12-Retro-Stealth-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 168,
    name: "Nike Dunk Low 'Fossil Rose'",
    brand: "Nike",
    category: "nike",
    price: 145,
    retail: 110,
    releaseDate: "2022-05-03",
    description: "A women's exclusive Dunk Low with fossil rose and aura pink accents. Clean leather construction perfect for spring.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Fossil-Rose-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 169,
    name: "Air Jordan 3 Retro 'Fire Red' (2022)",
    brand: "Jordan",
    category: "jordan",
    price: 215,
    retail: 210,
    releaseDate: "2022-09-10",
    description: "The Fire Red 3 returns with OG-style Nike Air branding on the heel. White cement with fire red accents.",
    images: ["https://images.stockx.com/images/Air-Jordan-3-Retro-Fire-Red-2022-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 170,
    name: "Air Jordan 4 Retro 'Military Black'",
    brand: "Jordan",
    category: "jordan",
    price: 325,
    retail: 210,
    releaseDate: "2022-05-21",
    description: "A clean Jordan 4 with white leather, neutral grey accents, and military black detailing. Instant classic.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Military-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 171,
    name: "Air Jordan 1 Retro High OG 'Lucky Green'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 180,
    releaseDate: "2023-05-06",
    description: "A women's Jordan 1 with white leather and lucky green accents. Clean, classic colorway.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Lucky-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 172,
    name: "Air Jordan 5 Retro 'Racer Blue'",
    brand: "Jordan",
    category: "jordan",
    price: 185,
    retail: 200,
    releaseDate: "2022-02-12",
    description: "The Jordan 5 in black with racer blue accents on the midsole and 3M reflective tongue.",
    images: ["https://images.stockx.com/images/Air-Jordan-5-Retro-Racer-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 173,
    name: "Air Jordan 1 Retro High OG 'Denim'",
    brand: "Jordan",
    category: "jordan",
    price: 175,
    retail: 180,
    releaseDate: "2023-02-11",
    description: "A unique Jordan 1 featuring premium denim panels with white leather. Japanese-inspired craftsmanship.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Denim-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 174,
    name: "Nike Dunk Low 'Court Purple'",
    brand: "Nike",
    category: "nike",
    price: 145,
    retail: 110,
    releaseDate: "2022-01-06",
    description: "A vibrant Dunk Low with white leather and court purple overlays. Bold and eye-catching.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Court-Purple-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 175,
    name: "Air Jordan 13 Retro 'Wheat' (2023)",
    brand: "Jordan",
    category: "jordan",
    price: 205,
    retail: 200,
    releaseDate: "2023-10-21",
    description: "The Jordan 13 in a wheat colorway with brown suede and leather. Perfect for fall.",
    images: ["https://images.stockx.com/images/Air-Jordan-13-Retro-Wheat-2023-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 176,
    name: "Nike SB Dunk Low 'Court Purple'",
    brand: "Nike",
    category: "nike",
    price: 195,
    retail: 110,
    releaseDate: "2021-03-20",
    description: "The SB version with extra padding and purple suede overlays on white leather.",
    images: ["https://images.stockx.com/images/Nike-SB-Dunk-Low-Court-Purple-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 177,
    name: "New Balance 990v3 x JJJJound 'Olive'",
    brand: "New Balance",
    category: "new-balance",
    price: 545,
    retail: 260,
    releaseDate: "2022-09-22",
    description: "A minimalist collaboration with JJJJound. Olive mesh and suede with tonal branding.",
    images: ["https://images.stockx.com/images/New-Balance-990v3-JJJJound-Olive-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 178,
    name: "Air Jordan 1 Retro High OG 'Visionaire'",
    brand: "Jordan",
    category: "jordan",
    price: 165,
    retail: 180,
    releaseDate: "2022-03-26",
    description: "A women's Jordan 1 with volt green overlays and white leather base. Bright and bold.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Visionaire-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 179,
    name: "New Balance 650R x Aime Leon Dore 'White Green'",
    brand: "New Balance",
    category: "new-balance",
    price: 285,
    retail: 175,
    releaseDate: "2023-03-31",
    description: "ALD brings back the 650 in white leather with green accents. Retro basketball styling.",
    images: ["https://images.stockx.com/images/New-Balance-650R-Aime-Leon-Dore-White-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 180,
    name: "Air Jordan 11 Retro 'Cool Grey' (2021)",
    brand: "Jordan",
    category: "jordan",
    price: 275,
    retail: 225,
    releaseDate: "2021-12-11",
    description: "The iconic Cool Grey 11 returns with medium grey patent leather and white accents.",
    images: ["https://images.stockx.com/images/Air-Jordan-11-Retro-Cool-Grey-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 181,
    name: "Nike SB Dunk Low 'Wheat'",
    brand: "Nike",
    category: "nike",
    price: 165,
    retail: 110,
    releaseDate: "2021-10-01",
    description: "A fall favorite with wheat suede and bronze accents. Gum sole completes the look.",
    images: ["https://images.stockx.com/images/Nike-SB-Dunk-Low-Wheat-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 182,
    name: "Air Jordan 1 Retro High OG 'Palomino'",
    brand: "Jordan",
    category: "jordan",
    price: 175,
    retail: 180,
    releaseDate: "2023-10-07",
    description: "A premium Jordan 1 with palomino brown leather and white accents. Subtle and sophisticated.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Palomino-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 183,
    name: "Air Jordan 5 Retro 'Burgundy'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 200,
    releaseDate: "2023-03-25",
    description: "The Jordan 5 in sail with burgundy accents. Premium materials and vintage aesthetic.",
    images: ["https://images.stockx.com/images/Air-Jordan-5-Retro-Burgundy-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 184,
    name: "New Balance 2002R x Salehe Bembury 'Water Be The Guide'",
    brand: "New Balance",
    category: "new-balance",
    price: 465,
    retail: 150,
    releaseDate: "2021-10-02",
    description: "Salehe Bembury's nature-inspired 2002R. Wavy textured upper in blue-green tones.",
    images: ["https://images.stockx.com/images/New-Balance-2002R-Salehe-Bembury-Water-Be-The-Guide-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: false
  },
  {
    id: 185,
    name: "Air Jordan 12 Retro 'Black Taxi'",
    brand: "Jordan",
    category: "jordan",
    price: 225,
    retail: 200,
    releaseDate: "2022-12-03",
    description: "A bold Jordan 12 with black tumbled leather and taxi yellow accents on the mudguard.",
    images: ["https://images.stockx.com/images/Air-Jordan-12-Retro-Black-Taxi-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 186,
    name: "Nike Dunk Low 'Valerian Blue'",
    brand: "Nike",
    category: "nike",
    price: 135,
    retail: 110,
    releaseDate: "2022-04-08",
    description: "A classic Dunk Low in white leather with valerian blue overlays. Clean everyday option.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Valerian-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 187,
    name: "Nike SB Dunk Low x Concepts 'Orange Lobster'",
    brand: "Nike",
    category: "nike",
    price: 685,
    retail: 130,
    releaseDate: "2022-12-02",
    description: "The latest in the iconic Lobster series. Orange gradient suede with signature lobster details.",
    images: ["https://images.stockx.com/images/Nike-SB-Dunk-Low-Concepts-Orange-Lobster-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 188,
    name: "Air Jordan 4 Retro 'Infrared'",
    brand: "Jordan",
    category: "jordan",
    price: 245,
    retail: 210,
    releaseDate: "2022-06-25",
    description: "The Jordan 4 in dark grey with infrared accents. A highly anticipated release.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-Infrared-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 189,
    name: "Nike Dunk Low 'UCLA'",
    brand: "Nike",
    category: "nike",
    price: 140,
    retail: 110,
    releaseDate: "2021-08-03",
    description: "A classic college colorway with light blue and gold accents on white leather.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-UCLA-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 190,
    name: "Air Jordan 13 Retro 'Playoffs' (2023)",
    brand: "Jordan",
    category: "jordan",
    price: 205,
    retail: 200,
    releaseDate: "2023-02-18",
    description: "The iconic Playoffs 13 returns with black leather, white, and red accents.",
    images: ["https://images.stockx.com/images/Air-Jordan-13-Retro-Playoffs-2023-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 191,
    name: "New Balance 550 'White Burgundy'",
    brand: "New Balance",
    category: "new-balance",
    price: 130,
    retail: 110,
    releaseDate: "2022-01-20",
    description: "The 550 in white leather with burgundy accents. Classic basketball style for everyday.",
    images: ["https://images.stockx.com/images/New-Balance-550-White-Burgundy-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 192,
    name: "Air Jordan 1 Retro High OG 'Skyline'",
    brand: "Jordan",
    category: "jordan",
    price: 175,
    retail: 180,
    releaseDate: "2023-01-21",
    description: "A Jordan 1 with sky blue and red accents on white leather. City skyline inspired.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Skyline-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 193,
    name: "Reebok Question Mid 'Red Toe' 25th Anniversary",
    brand: "Reebok",
    category: "other",
    price: 145,
    retail: 150,
    releaseDate: "2021-11-05",
    description: "Allen Iverson's signature shoe celebrating 25 years. White leather with red toe and Reebok branding.",
    images: ["https://images.stockx.com/images/Reebok-Question-Mid-Red-Toe-25th-Anniversary-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 194,
    name: "Vans Old Skool 'Black White'",
    brand: "Vans",
    category: "other",
    price: 70,
    retail: 70,
    releaseDate: "2020-01-01",
    description: "The classic Vans Old Skool in black canvas with the iconic white sidestripe.",
    images: ["https://images.stockx.com/images/Vans-Old-Skool-Black-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 195,
    name: "Adidas NMD R1 'Triple Black'",
    brand: "Adidas",
    category: "adidas",
    price: 145,
    retail: 140,
    releaseDate: "2019-08-01",
    description: "The NMD R1 in an all-black colorway. Boost cushioning with Primeknit upper.",
    images: ["https://images.stockx.com/images/Adidas-NMD-R1-Triple-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 196,
    name: "Adidas Ultra Boost 4.0 'Triple Black'",
    brand: "Adidas",
    category: "adidas",
    price: 185,
    retail: 180,
    releaseDate: "2018-11-01",
    description: "The Ultra Boost 4.0 in all-black with Primeknit upper and full-length Boost midsole.",
    images: ["https://images.stockx.com/images/Adidas-Ultra-Boost-4-0-Triple-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 197,
    name: "Converse Chuck Taylor All-Star 70s Hi 'Black'",
    brand: "Converse",
    category: "other",
    price: 90,
    retail: 90,
    releaseDate: "2020-01-01",
    description: "The premium Chuck 70 with vintage styling. Black canvas with egret midsole.",
    images: ["https://images.stockx.com/images/Converse-Chuck-Taylor-All-Star-70s-Hi-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 198,
    name: "Puma Suede Classic XXI 'Black White'",
    brand: "Puma",
    category: "other",
    price: 75,
    retail: 75,
    releaseDate: "2021-01-01",
    description: "The iconic Puma Suede in black with white formstrip and gum sole.",
    images: ["https://images.stockx.com/images/Puma-Suede-Classic-XXI-Black-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 199,
    name: "Air Jordan 1 Retro Low OG 'Black Toe'",
    brand: "Jordan",
    category: "jordan",
    price: 185,
    retail: 140,
    releaseDate: "2023-07-08",
    description: "The Black Toe colorway on the Jordan 1 Low OG. White leather with black toe and red accents.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-Low-OG-Black-Toe-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 200,
    name: "Nike Air VaporMax Plus 'Triple Black'",
    brand: "Nike",
    category: "nike",
    price: 195,
    retail: 200,
    releaseDate: "2018-03-22",
    description: "A hybrid of Air Max Plus and VaporMax. All-black with gradient upper and visible Air units.",
    images: ["https://images.stockx.com/images/Nike-Air-VaporMax-Plus-Triple-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 201,
    name: "Air Jordan 4 Retro SB 'Pine Green'",
    brand: "Jordan",
    category: "jordan",
    price: 625,
    retail: 225,
    releaseDate: "2023-03-21",
    description: "Nike SB x Jordan Brand collaboration. Pine green suede with signature SB tongue branding.",
    images: ["https://images.stockx.com/images/Air-Jordan-4-Retro-SB-Pine-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 202,
    name: "Air Jordan 3 Retro 'Dark Iris'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 200,
    releaseDate: "2022-08-20",
    description: "A women's Jordan 3 with white leather and dark iris purple accents. Elephant print overlays.",
    images: ["https://images.stockx.com/images/Air-Jordan-3-Retro-Dark-Iris-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 203,
    name: "Nike Dunk High 'Syracuse' (2021)",
    brand: "Nike",
    category: "nike",
    price: 145,
    retail: 120,
    releaseDate: "2021-08-03",
    description: "The classic Syracuse colorway on the Dunk High. White leather with orange overlays.",
    images: ["https://images.stockx.com/images/Nike-Dunk-High-Syracuse-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 204,
    name: "Nike SB Dunk Low 'Safari'",
    brand: "Nike",
    category: "nike",
    price: 295,
    retail: 110,
    releaseDate: "2022-03-12",
    description: "Inspired by the original Safari pattern. Brown safari print with suede overlays.",
    images: ["https://images.stockx.com/images/Nike-SB-Dunk-Low-Safari-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 205,
    name: "Air Jordan 7 Retro 'Flint' (2021)",
    brand: "Jordan",
    category: "jordan",
    price: 175,
    retail: 190,
    releaseDate: "2021-05-01",
    description: "The Jordan 7 in white with flint grey and purple accents. Retro styling with modern comfort.",
    images: ["https://images.stockx.com/images/Air-Jordan-7-Retro-Flint-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 206,
    name: "Air Jordan 1 Retro High OG 'Black Metallic Gold'",
    brand: "Jordan",
    category: "jordan",
    price: 195,
    retail: 180,
    releaseDate: "2020-11-30",
    description: "A bold Jordan 1 with black patent leather and metallic gold accents. Premium materials throughout.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Black-Metallic-Gold-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 207,
    name: "Nike Dunk Low 'Polar Blue'",
    brand: "Nike",
    category: "nike",
    price: 130,
    retail: 110,
    releaseDate: "2022-06-15",
    description: "A clean Dunk Low in white with polar blue overlays. Fresh summer colorway.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Polar-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 208,
    name: "Nike Dunk Low 'Industrial Blue'",
    brand: "Nike",
    category: "nike",
    price: 135,
    retail: 115,
    releaseDate: "2023-01-26",
    description: "A women's Dunk Low with sail leather and industrial blue accents. Vintage aesthetic.",
    images: ["https://images.stockx.com/images/Nike-Dunk-Low-Industrial-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 209,
    name: "Air Jordan 1 Retro Low OG 'UNC'",
    brand: "Jordan",
    category: "jordan",
    price: 165,
    retail: 140,
    releaseDate: "2021-08-28",
    description: "The classic UNC colorway on the Jordan 1 Low. White leather with university blue overlays.",
    images: ["https://images.stockx.com/images/Air-Jordan-1-Retro-Low-OG-UNC-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 210,
    name: "New Balance 2002R 'Black'",
    brand: "New Balance",
    category: "new-balance",
    price: 175,
    retail: 140,
    releaseDate: "2022-04-01",
    description: "The 2002R in an all-black colorway. Suede and mesh with N-ERGY cushioning.",
    images: ["https://images.stockx.com/images/New-Balance-2002R-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 211,
    name: "Adidas Yeezy Boost 350 V2 'Blue Tint'",
    brand: "Yeezy",
    category: "yeezy",
    price: 285,
    retail: 220,
    releaseDate: "2017-12-16",
    description: "A standout 350 V2 with blue tint Primeknit and the signature stripe. Grey base with hi-res red accent.",
    images: ["https://images.stockx.com/images/Adidas-Yeezy-Boost-350-V2-Blue-Tint-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 212,
    name: "Adidas Yeezy Boost 350 V2 'Zebra'",
    brand: "Yeezy",
    category: "yeezy",
    price: 295,
    retail: 220,
    releaseDate: "2017-02-25",
    description: "One of the most iconic Yeezy colorways. White and black Primeknit with SPLY-350 branding in red.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Zebra-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 213,
    name: "Adidas Yeezy Boost 350 V2 'Black' (Non-Reflective)",
    brand: "Yeezy",
    category: "yeezy",
    price: 325,
    retail: 220,
    releaseDate: "2019-06-07",
    description: "The all-black Yeezy 350 V2. Murdered out Primeknit with matching black Boost midsole and pull tab.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Black-Non-Reflective-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 214,
    name: "Adidas Yeezy Boost 350 V2 'Cream White'",
    brand: "Yeezy",
    category: "yeezy",
    price: 265,
    retail: 220,
    releaseDate: "2017-04-29",
    description: "The triple cream Yeezy. All-white Primeknit upper with cream Boost midsole. Clean and versatile.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Cream-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 215,
    name: "Adidas Yeezy Boost 350 V2 'Static' (Non-Reflective)",
    brand: "Yeezy",
    category: "yeezy",
    price: 295,
    retail: 220,
    releaseDate: "2018-12-27",
    description: "A unique patterned 350 V2 with static woven Primeknit. Off-white with transparent stripe.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Static-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 216,
    name: "Adidas Yeezy Boost 350 V2 'Butter'",
    brand: "Yeezy",
    category: "yeezy",
    price: 245,
    retail: 220,
    releaseDate: "2018-06-30",
    description: "A smooth butter yellow Primeknit upper with matching Boost midsole. Subtle and wearable.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Butter-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 217,
    name: "Adidas Yeezy Boost 350 V2 'Semi Frozen Yellow'",
    brand: "Yeezy",
    category: "yeezy",
    price: 345,
    retail: 220,
    releaseDate: "2017-11-18",
    description: "A bold frozen yellow Primeknit with gum sole. Features bright red SPLY-350 stripe.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Semi-Frozen-Yellow-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 218,
    name: "Adidas Yeezy Boost 350 V2 'Sesame'",
    brand: "Yeezy",
    category: "yeezy",
    price: 275,
    retail: 220,
    releaseDate: "2018-11-23",
    description: "A neutral sesame colorway with no stripe. Clean, earth-toned Primeknit perfect for any outfit.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Sesame-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 219,
    name: "Adidas Yeezy Boost 350 V2 'Clay'",
    brand: "Yeezy",
    category: "yeezy",
    price: 285,
    retail: 220,
    releaseDate: "2019-03-30",
    description: "Regional exclusive in clay orange. Primeknit upper with transparent stripe and Boost cushioning.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Clay-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 220,
    name: "Adidas Yeezy Boost 350 V2 'Glow'",
    brand: "Yeezy",
    category: "yeezy",
    price: 315,
    retail: 220,
    releaseDate: "2019-05-25",
    description: "The glow-in-the-dark Yeezy. Green-tinted Primeknit that illuminates in low light conditions.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Glow-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 221,
    name: "Adidas Yeezy Boost 350 V2 'True Form'",
    brand: "Yeezy",
    category: "yeezy",
    price: 275,
    retail: 220,
    releaseDate: "2019-03-16",
    description: "Europe exclusive in muted clay tones. True form Primeknit with transparent side stripe.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-True-Form-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 222,
    name: "Adidas Yeezy Boost 350 V2 'Hyperspace'",
    brand: "Yeezy",
    category: "yeezy",
    price: 295,
    retail: 220,
    releaseDate: "2019-03-16",
    description: "Asia/Africa exclusive with mint and yellow Primeknit. Unique regional colorway.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Hyperspace-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 223,
    name: "Adidas Yeezy 500 'Salt'",
    brand: "Yeezy",
    category: "yeezy",
    price: 225,
    retail: 200,
    releaseDate: "2018-11-30",
    description: "The 500 in a light salt colorway. Suede, mesh, and leather with adiPRENE+ cushioning.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-500-Salt-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 224,
    name: "Adidas Yeezy 500 'Bone White'",
    brand: "Yeezy",
    category: "yeezy",
    price: 235,
    retail: 200,
    releaseDate: "2019-08-24",
    description: "The 500 in bone white. Mixed materials upper with chunky dad shoe silhouette.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-500-Bone-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 225,
    name: "Adidas Yeezy Boost 380 'Mist'",
    brand: "Yeezy",
    category: "yeezy",
    price: 195,
    retail: 230,
    releaseDate: "2020-03-25",
    description: "The 380 in mist grey. Extended Primeknit cage with Boost midsole and unique outsole pattern.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-380-Mist-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 226,
    name: "Adidas Yeezy Boost 380 'Pepper'",
    brand: "Yeezy",
    category: "yeezy",
    price: 205,
    retail: 230,
    releaseDate: "2020-12-12",
    description: "The 380 in pepper grey with reflective threads. Higher cut Primeknit and translucent outsole.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-380-Pepper-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 227,
    name: "Adidas Yeezy Boost 350 V2 'Desert Sage'",
    brand: "Yeezy",
    category: "yeezy",
    price: 255,
    retail: 220,
    releaseDate: "2020-03-14",
    description: "Sage green Primeknit with orange stripe accent. Muted earth tones with Boost cushioning.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Desert-Sage-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 228,
    name: "Adidas Yeezy Boost 350 V2 'Marsh'",
    brand: "Yeezy",
    category: "yeezy",
    price: 245,
    retail: 220,
    releaseDate: "2020-03-21",
    description: "Yellow-green marsh colorway. Vibrant Primeknit with matching Boost midsole.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Marsh-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 229,
    name: "Adidas Yeezy Boost 350 V2 'Linen'",
    brand: "Yeezy",
    category: "yeezy",
    price: 255,
    retail: 220,
    releaseDate: "2020-04-18",
    description: "Soft linen-toned Primeknit upper. Neutral beige with matching Boost cushioning.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Linen-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 230,
    name: "Adidas Yeezy Boost 350 V2 'Flax'",
    brand: "Yeezy",
    category: "yeezy",
    price: 245,
    retail: 220,
    releaseDate: "2020-02-22",
    description: "Rich flax brown Primeknit. Earth-toned upper with gum-colored outsole.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Flax-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 231,
    name: "Adidas Yeezy Boost 350 V2 'Sulfur'",
    brand: "Yeezy",
    category: "yeezy",
    price: 235,
    retail: 220,
    releaseDate: "2020-05-09",
    description: "Yellow-green sulfur Primeknit with translucent stripe. Matching Boost midsole.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Sulfur-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 232,
    name: "Adidas Yeezy Boost 350 V2 'Natural'",
    brand: "Yeezy",
    category: "yeezy",
    price: 255,
    retail: 220,
    releaseDate: "2020-10-24",
    description: "Creamy natural Primeknit upper. Neutral tones with matching Boost midsole.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Natural-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 233,
    name: "Adidas Yeezy Boost 350 V2 'Carbon'",
    brand: "Yeezy",
    category: "yeezy",
    price: 265,
    retail: 220,
    releaseDate: "2020-10-02",
    description: "Dark carbon grey Primeknit. Sleek tonal look with muted stripe and Boost cushioning.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Carbon-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 234,
    name: "Adidas Yeezy Boost 350 V2 'Ash Stone'",
    brand: "Yeezy",
    category: "yeezy",
    price: 245,
    retail: 220,
    releaseDate: "2021-02-27",
    description: "Muted ash stone Primeknit with matching stripe. Versatile grey-brown colorway.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Ash-Stone-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 235,
    name: "Adidas Yeezy Boost 350 V2 'Ash Blue'",
    brand: "Yeezy",
    category: "yeezy",
    price: 255,
    retail: 220,
    releaseDate: "2021-02-27",
    description: "Ash blue Primeknit with subtle stripe. Blue-grey tones with Boost comfort.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Ash-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 236,
    name: "Adidas Yeezy Boost 350 V2 'Mono Ice'",
    brand: "Yeezy",
    category: "yeezy",
    price: 225,
    retail: 220,
    releaseDate: "2021-06-21",
    description: "Icy blue mono-color Primeknit. Translucent monofilament upper with Boost midsole.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Mono-Ice-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 237,
    name: "Adidas Yeezy Boost 350 V2 'Mono Mist'",
    brand: "Yeezy",
    category: "yeezy",
    price: 215,
    retail: 220,
    releaseDate: "2021-06-21",
    description: "Misty grey mono-color upper. Translucent monofilament construction with Boost cushioning.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Mono-Mist-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 238,
    name: "Adidas Yeezy Boost 350 V2 'Mono Cinder'",
    brand: "Yeezy",
    category: "yeezy",
    price: 235,
    retail: 220,
    releaseDate: "2021-06-21",
    description: "All-black mono-color construction. Translucent monofilament upper in cinder black.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Mono-Cinder-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 239,
    name: "Adidas Yeezy Boost 350 V2 'Mono Clay'",
    brand: "Yeezy",
    category: "yeezy",
    price: 215,
    retail: 220,
    releaseDate: "2021-06-21",
    description: "Clay orange mono-color design. Translucent monofilament with matching Boost midsole.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Mono-Clay-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 240,
    name: "Adidas Yeezy Boost 350 V2 'Light'",
    brand: "Yeezy",
    category: "yeezy",
    price: 285,
    retail: 220,
    releaseDate: "2021-08-28",
    description: "UV-reactive Primeknit that changes color in sunlight. Light grey base transforms outdoors.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Light-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 241,
    name: "Adidas Yeezy Boost 350 V2 'MX Rock'",
    brand: "Yeezy",
    category: "yeezy",
    price: 265,
    retail: 230,
    releaseDate: "2021-12-22",
    description: "Swirled pattern Primeknit in rocky brown tones. Marbled design with Boost cushioning.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-MX-Rock-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 242,
    name: "Adidas Yeezy Boost 350 V2 'Dazzling Blue'",
    brand: "Yeezy",
    category: "yeezy",
    price: 275,
    retail: 230,
    releaseDate: "2022-02-26",
    description: "Grey Primeknit with bold dazzling blue stripe. A standout colorway in the 350 V2 lineup.",
    images: ["https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Dazzling-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 243,
    name: "Adidas Samba OG 'Cloud White'",
    brand: "Adidas",
    category: "adidas",
    price: 115,
    retail: 100,
    releaseDate: "2023-01-01",
    description: "The iconic Samba in cloud white leather with black stripes and gum sole. A timeless classic.",
    images: ["https://images.stockx.com/images/adidas-Samba-OG-Cloud-White-Core-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 244,
    name: "Adidas Campus 00s 'Core Black'",
    brand: "Adidas",
    category: "adidas",
    price: 105,
    retail: 100,
    releaseDate: "2023-03-01",
    description: "The Campus 00s revives the classic silhouette. Black suede with white stripes and thick sole.",
    images: ["https://images.stockx.com/images/adidas-Campus-00s-Core-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 245,
    name: "Adidas Forum 84 Low 'Off White'",
    brand: "Adidas",
    category: "adidas",
    price: 125,
    retail: 110,
    releaseDate: "2021-06-01",
    description: "Retro basketball style from 1984. Off-white leather with vintage styling and ankle strap.",
    images: ["https://images.stockx.com/images/adidas-Forum-84-Low-Off-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 246,
    name: "Adidas Campus 00s 'Grey White'",
    brand: "Adidas",
    category: "adidas",
    price: 100,
    retail: 100,
    releaseDate: "2023-04-01",
    description: "The Campus 00s in grey suede with white stripes. Chunky sole with vintage look.",
    images: ["https://images.stockx.com/images/adidas-Campus-00s-Grey-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 247,
    name: "Adidas Handball Spezial 'Navy Gum'",
    brand: "Adidas",
    category: "adidas",
    price: 115,
    retail: 100,
    releaseDate: "2023-02-01",
    description: "Indoor court classic in collegiate navy suede with gum sole. Retro handball styling.",
    images: ["https://images.stockx.com/images/adidas-Handball-Spezial-Navy-Gum-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 248,
    name: "Adidas Samba x Wales Bonner 'Black'",
    brand: "Adidas",
    category: "adidas",
    price: 385,
    retail: 180,
    releaseDate: "2023-04-15",
    description: "Wales Bonner's elevated Samba. Black leather with premium materials and refined details.",
    images: ["https://images.stockx.com/images/adidas-Samba-Wales-Bonner-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 249,
    name: "Adidas Samba x Wales Bonner 'Cream White'",
    brand: "Adidas",
    category: "adidas",
    price: 425,
    retail: 180,
    releaseDate: "2023-04-15",
    description: "Premium Wales Bonner collaboration. Cream leather with gold accents and elevated construction.",
    images: ["https://images.stockx.com/images/adidas-Samba-Wales-Bonner-Cream-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: true, trending: true
  },
  {
    id: 250,
    name: "Adidas Response CL x Bad Bunny 'Wonder White'",
    brand: "Adidas",
    category: "adidas",
    price: 195,
    retail: 160,
    releaseDate: "2023-09-01",
    description: "Bad Bunny's chunky Response CL. Wonder white with oversized proportions and unique lacing.",
    images: ["https://images.stockx.com/images/adidas-Response-CL-Bad-Bunny-Wonder-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 251,
    name: "Adidas Campus 80s x South Park 'Towelie'",
    brand: "Adidas",
    category: "adidas",
    price: 285,
    retail: 110,
    releaseDate: "2021-04-20",
    description: "Limited South Park collab featuring Towelie. Light blue suede with special terry cloth details.",
    images: ["https://images.stockx.com/images/adidas-Campus-80s-South-Park-Towelie-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 252,
    name: "Adidas Ozweego 'Core Black Solar Green'",
    brand: "Adidas",
    category: "adidas",
    price: 125,
    retail: 120,
    releaseDate: "2019-08-01",
    description: "Chunky retro runner in black with solar green accents. adiPRENE cushioning throughout.",
    images: ["https://images.stockx.com/images/adidas-Ozweego-Core-Black-Solar-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 253,
    name: "Adidas Samba OG 'Collegiate Green'",
    brand: "Adidas",
    category: "adidas",
    price: 110,
    retail: 100,
    releaseDate: "2023-05-01",
    description: "The Samba OG in collegiate green suede with white stripes and gum sole.",
    images: ["https://images.stockx.com/images/adidas-Samba-OG-Collegiate-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 254,
    name: "Adidas Forum Low 'White Royal Blue'",
    brand: "Adidas",
    category: "adidas",
    price: 105,
    retail: 100,
    releaseDate: "2022-01-01",
    description: "Classic Forum Low in white leather with royal blue accents. Retro basketball style.",
    images: ["https://images.stockx.com/images/adidas-Forum-Low-White-Royal-Blue-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 255,
    name: "Adidas Superstar 'Cloud White Core Black'",
    brand: "Adidas",
    category: "adidas",
    price: 95,
    retail: 100,
    releaseDate: "2020-01-01",
    description: "The iconic shell-toe Superstar in white leather with black stripes. A hip-hop legend.",
    images: ["https://images.stockx.com/images/adidas-Superstar-Cloud-White-Core-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 256,
    name: "Adidas Superstar 'Core Black Cloud White'",
    brand: "Adidas",
    category: "adidas",
    price: 95,
    retail: 100,
    releaseDate: "2020-01-01",
    description: "The Superstar inverted in black leather with white shell toe and stripes.",
    images: ["https://images.stockx.com/images/adidas-Superstar-Core-Black-Cloud-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 257,
    name: "Adidas Stan Smith 'Primegreen Cloud White'",
    brand: "Adidas",
    category: "adidas",
    price: 95,
    retail: 95,
    releaseDate: "2021-06-01",
    description: "The sustainable Stan Smith with Primegreen recycled materials. Classic white with green heel.",
    images: ["https://images.stockx.com/images/adidas-Stan-Smith-Primegreen-Cloud-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 258,
    name: "Adidas Samba OG 'Core Black'",
    brand: "Adidas",
    category: "adidas",
    price: 110,
    retail: 100,
    releaseDate: "2023-01-01",
    description: "The Samba OG in all black leather with white stripes and gum sole. Versatile classic.",
    images: ["https://images.stockx.com/images/adidas-Samba-OG-Core-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 259,
    name: "Adidas Forum Low 'The Grinch'",
    brand: "Adidas",
    category: "adidas",
    price: 145,
    retail: 110,
    releaseDate: "2022-12-01",
    description: "Holiday special inspired by Dr. Seuss. Green furry upper with Grinch details.",
    images: ["https://images.stockx.com/images/adidas-Forum-Low-The-Grinch-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 260,
    name: "Adidas Gazelle Indoor 'Beam Orange'",
    brand: "Adidas",
    category: "adidas",
    price: 125,
    retail: 110,
    releaseDate: "2023-08-01",
    description: "The Gazelle Indoor in bold beam orange suede. Indoor court styling with gum sole.",
    images: ["https://images.stockx.com/images/adidas-Gazelle-Indoor-Beam-Orange-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: true
  },
  {
    id: 261,
    name: "Adidas Ozweego 'Core Black'",
    brand: "Adidas",
    category: "adidas",
    price: 115,
    retail: 120,
    releaseDate: "2019-06-01",
    description: "Chunky 90s-inspired runner in all-black. Gel cushioning with mesh and suede upper.",
    images: ["https://images.stockx.com/images/adidas-Ozweego-Core-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 262,
    name: "Adidas Stan Smith 'Core Black'",
    brand: "Adidas",
    category: "adidas",
    price: 95,
    retail: 95,
    releaseDate: "2020-01-01",
    description: "The Stan Smith in all-black leather. Minimalist tennis style with signature perforated stripes.",
    images: ["https://images.stockx.com/images/adidas-Stan-Smith-Core-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 263,
    name: "Adidas Continental 80 'Cloud White'",
    brand: "Adidas",
    category: "adidas",
    price: 85,
    retail: 80,
    releaseDate: "2019-01-01",
    description: "80s tennis style in cloud white leather. Split tongue design with muted side stripes.",
    images: ["https://images.stockx.com/images/adidas-Continental-80-Cloud-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 264,
    name: "Adidas Ultra Boost Light 'Triple Black'",
    brand: "Adidas",
    category: "adidas",
    price: 175,
    retail: 190,
    releaseDate: "2023-03-01",
    description: "The lightest Ultra Boost ever in murdered out black. Light Boost midsole with Primeknit upper.",
    images: ["https://images.stockx.com/images/adidas-Ultra-Boost-Light-Triple-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 265,
    name: "Adidas Ultra Boost 22 'Triple White'",
    brand: "Adidas",
    category: "adidas",
    price: 165,
    retail: 190,
    releaseDate: "2022-02-01",
    description: "The Ultra Boost 22 in all-white. LEP torsion system with full-length Boost cushioning.",
    images: ["https://images.stockx.com/images/adidas-Ultra-Boost-22-Triple-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 266,
    name: "Adidas Superstar 82 'Cloud White'",
    brand: "Adidas",
    category: "adidas",
    price: 115,
    retail: 110,
    releaseDate: "2023-01-01",
    description: "Vintage-inspired Superstar with 1982 details. Premium leather with slightly slimmer toe.",
    images: ["https://images.stockx.com/images/adidas-Superstar-82-Cloud-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  },
  {
    id: 267,
    name: "Adidas NMD S1 'Core Black'",
    brand: "Adidas",
    category: "adidas",
    price: 165,
    retail: 180,
    releaseDate: "2023-05-01",
    description: "The laceless NMD S1 in all-black. Sock-like Primeknit with full-length Boost midsole.",
    images: ["https://images.stockx.com/images/adidas-NMD-S1-Core-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90"],
    inStock: true, featured: false, trending: false
  }
];

// Helper function to generate vendor prices dynamically
function generateVendorPrices(product) {
  const { vendors, getRetailVendors, getResaleVendors } = window.KicksListVendors;
  const vendorPrices = [];
  const basePrice = product.price;
  const retailPrice = product.retail;
  const id = product.id;

  const seededRandom = (seed, index) => {
    const x = Math.sin(seed * 9999 + index * 7777) * 10000;
    return x - Math.floor(x);
  };

  const retailVendors = getRetailVendors();
  const resaleVendors = getResaleVendors();

  retailVendors.forEach((vendor, index) => {
    const rand = seededRandom(id, index);
    const inStock = rand > 0.6;
    let price = retailPrice;
    if (rand > 0.85) {
      price = Math.round(retailPrice * (0.85 + rand * 0.1));
    }

    const searchTerm = encodeURIComponent(product.name);
    let url;
    switch(vendor.id) {
      case 'nike': url = `https://nike.com/w?q=${searchTerm}`; break;
      case 'footlocker': url = `https://footlocker.com/search?query=${searchTerm}`; break;
      case 'finishline': url = `https://finishline.com/store/browse/search.jsp?searchTerm=${searchTerm}`; break;
      case 'champssports': url = `https://champssports.com/search?query=${searchTerm}`; break;
      case 'jdsports': url = `https://jdsports.com/search/${searchTerm}`; break;
      case 'dickssporting': url = `https://dickssportinggoods.com/search/SearchDisplay?searchTerm=${searchTerm}`; break;
      default: url = `${vendor.url}/search?q=${searchTerm}`;
    }

    vendorPrices.push({ vendorId: vendor.id, price, url, inStock, type: 'retail' });
  });

  resaleVendors.forEach((vendor, index) => {
    const rand = seededRandom(id, index + 100);
    const variance = (rand - 0.5) * 0.3;
    let price = Math.round(basePrice * (1 + variance));
    if (vendor.id === 'flightclub') price = Math.round(price * 1.12);
    else if (vendor.id === 'goat') price = Math.round(price * 0.97);
    const inStock = rand > 0.1;

    const searchTerm = encodeURIComponent(product.name);
    let url;
    switch(vendor.id) {
      case 'stockx': url = `https://stockx.com/search?s=${searchTerm}`; break;
      case 'goat': url = `https://goat.com/search?query=${searchTerm}`; break;
      case 'ebay': url = `https://ebay.com/sch/i.html?_nkw=${searchTerm}`; break;
      case 'flightclub': url = `https://flightclub.com/search?q=${searchTerm}`; break;
      default: url = `${vendor.url}/search?q=${searchTerm}`;
    }

    vendorPrices.push({ vendorId: vendor.id, price, url, inStock, type: 'resale' });
  });

  return vendorPrices;
}

function getLowestPrice(product) {
  const vendors = generateVendorPrices(product);
  const inStockVendors = vendors.filter(v => v.inStock);
  if (inStockVendors.length === 0) return null;
  return Math.min(...inStockVendors.map(v => v.price));
}

function getHighestPrice(product) {
  const vendors = generateVendorPrices(product);
  const inStockVendors = vendors.filter(v => v.inStock);
  if (inStockVendors.length === 0) return null;
  return Math.max(...inStockVendors.map(v => v.price));
}

function getPriceRange(product) {
  return { low: getLowestPrice(product), high: getHighestPrice(product) };
}

function getVendorCount(product) {
  const vendors = generateVendorPrices(product);
  return vendors.filter(v => v.inStock).length;
}

function getBestDeal(product) {
  const vendors = generateVendorPrices(product);
  const inStockVendors = vendors.filter(v => v.inStock);
  if (inStockVendors.length === 0) return null;
  return inStockVendors.reduce((min, v) => v.price < min.price ? v : min);
}

function getSavings(product) {
  const low = getLowestPrice(product);
  const high = getHighestPrice(product);
  if (!low || !high) return 0;
  return high - low;
}

const categories = [
  { id: "all", name: "All Sneakers", count: products.length },
  { id: "jordan", name: "Jordan", count: products.filter(p => p.category === "jordan").length },
  { id: "nike", name: "Nike", count: products.filter(p => p.category === "nike").length },
  { id: "yeezy", name: "Yeezy", count: products.filter(p => p.category === "yeezy").length },
  { id: "adidas", name: "Adidas", count: products.filter(p => p.category === "adidas").length },
  { id: "new-balance", name: "New Balance", count: products.filter(p => p.category === "new-balance").length },
  { id: "other", name: "Other Brands", count: products.filter(p => p.category === "other").length }
];

function getProductById(id) { return products.find(p => p.id === parseInt(id)); }
function getProductsByCategory(category) { return category === "all" ? products : products.filter(p => p.category === category); }
function searchProducts(query) {
  const q = query.toLowerCase();
  return products.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
}
function getFeaturedProducts() { return products.filter(p => p.featured); }
function getTrendingProducts() { return products.filter(p => p.trending); }
function getNewDrops() { return [...products].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)).slice(0, 8); }
function getRelatedProducts(productId, limit = 4) {
  const product = getProductById(productId);
  if (!product) return [];
  return products.filter(p => p.id !== productId && p.category === product.category).slice(0, limit);
}

window.KicksListData = {
  products, categories, getProductById, getProductsByCategory, searchProducts,
  getFeaturedProducts, getTrendingProducts, getNewDrops, getRelatedProducts,
  generateVendorPrices, getLowestPrice, getHighestPrice, getPriceRange,
  getVendorCount, getBestDeal, getSavings
};
