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
