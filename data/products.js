/**
 * KicksList Product Database
 * Comprehensive sneaker data with accurate information
 */

const products = [
  {
    id: 1,
    name: "Air Jordan 4 Retro 'Red Thunder'",
    brand: "Jordan",
    model: "Air Jordan 4 Retro",
    styleId: "CT8527-016",
    colorway: "Black/White-Red",
    category: "jordan",
    price: 245,
    retail: 190,
    condition: "New",
    releaseYear: 2022,
    releaseDate: "2022-01-15",
    description: "The Air Jordan 4 Retro 'Red Thunder' draws inspiration from the original 'Thunder' colorway from 2006. This iteration features a black nubuck upper with bold Crimson red accents on the eyelets, heel tab, and Jumpman branding on the tongue. The shoe maintains the iconic AJ4 design elements including the mesh panels, visible Air unit in the heel, and signature wing eyelets. A white midsole provides contrast while the black outsole completes the striking look. Released in January 2022, this colorway quickly became a fan favorite for its bold take on a classic silhouette.",
    images: [
      "https://images.stockx.com/images/Air-Jordan-4-Retro-Red-Thunder-Product.jpg",
      "https://images.stockx.com/360/Air-Jordan-4-Retro-Red-Thunder/Images/Air-Jordan-4-Retro-Red-Thunder/Lv2/img01.jpg",
      "https://images.stockx.com/360/Air-Jordan-4-Retro-Red-Thunder/Images/Air-Jordan-4-Retro-Red-Thunder/Lv2/img06.jpg",
      "https://images.stockx.com/360/Air-Jordan-4-Retro-Red-Thunder/Images/Air-Jordan-4-Retro-Red-Thunder/Lv2/img12.jpg",
      "https://images.stockx.com/360/Air-Jordan-4-Retro-Red-Thunder/Images/Air-Jordan-4-Retro-Red-Thunder/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "7", available: true },
      { size: "7.5", available: true },
      { size: "8", available: true },
      { size: "8.5", available: false },
      { size: "9", available: true },
      { size: "9.5", available: true },
      { size: "10", available: true },
      { size: "10.5", available: false },
      { size: "11", available: true },
      { size: "11.5", available: false },
      { size: "12", available: true },
      { size: "13", available: true }
    ],
    inStock: true,
    badge: null,
    featured: true,
    trending: true,
    tags: ["retro", "thunder", "crimson", "nubuck"]
  },
  {
    id: 2,
    name: "Nike Air Max 1 Travis Scott 'Wheat'",
    brand: "Nike",
    model: "Air Max 1",
    styleId: "DO9392-700",
    colorway: "Wheat/Wheat-Lemon Drop",
    category: "nike",
    price: 310,
    retail: 160,
    condition: "New",
    releaseYear: 2022,
    releaseDate: "2022-12-15",
    description: "The Nike Air Max 1 Travis Scott 'Wheat' is a collaboration between Nike and Travis Scott's Cactus Jack label. This outdoor-inspired design features a premium construction with reversed Swooshes, a hallmark of Travis Scott collaborations. The upper combines wheat-toned suede, canvas, and mesh materials with a utilitarian aesthetic. Multiple lace options and removable patches allow for customization. The shoe features a visible Air unit in the heel and a rugged outsole pattern inspired by outdoor footwear. This release represents the evolution of the Air Max 1 silhouette through Scott's creative vision.",
    images: [
      "https://images.stockx.com/images/Nike-Air-Max-1-Travis-Scott-Wheat-Product.jpg",
      "https://images.stockx.com/360/Nike-Air-Max-1-Travis-Scott-Wheat/Images/Nike-Air-Max-1-Travis-Scott-Wheat/Lv2/img01.jpg",
      "https://images.stockx.com/360/Nike-Air-Max-1-Travis-Scott-Wheat/Images/Nike-Air-Max-1-Travis-Scott-Wheat/Lv2/img06.jpg",
      "https://images.stockx.com/360/Nike-Air-Max-1-Travis-Scott-Wheat/Images/Nike-Air-Max-1-Travis-Scott-Wheat/Lv2/img12.jpg",
      "https://images.stockx.com/360/Nike-Air-Max-1-Travis-Scott-Wheat/Images/Nike-Air-Max-1-Travis-Scott-Wheat/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "7", available: false },
      { size: "7.5", available: false },
      { size: "8", available: true },
      { size: "8.5", available: true },
      { size: "9", available: true },
      { size: "9.5", available: false },
      { size: "10", available: true },
      { size: "10.5", available: true },
      { size: "11", available: false },
      { size: "11.5", available: false },
      { size: "12", available: true },
      { size: "13", available: false }
    ],
    inStock: true,
    badge: "New",
    featured: true,
    trending: true,
    tags: ["travis scott", "cactus jack", "collaboration", "wheat"]
  },
  {
    id: 3,
    name: "Yeezy Boost 350 V2 'Onyx'",
    brand: "Adidas",
    model: "Yeezy Boost 350 V2",
    styleId: "HQ4540",
    colorway: "Onyx/Onyx/Onyx",
    category: "yeezy",
    price: 275,
    retail: 230,
    condition: "New",
    releaseYear: 2022,
    releaseDate: "2022-04-09",
    description: "The Adidas Yeezy Boost 350 V2 'Onyx' presents Kanye West's iconic silhouette in a sleek all-black colorway. The shoe features a Primeknit upper in a tonal black finish with the signature side stripe seamlessly integrated into the design. The full-length Boost midsole provides exceptional comfort and energy return, while the rubber outsole ensures durability and traction. The sock-like construction offers a snug, comfortable fit. This monochromatic colorway represents the versatility of the 350 V2, making it suitable for any outfit while maintaining the distinctive Yeezy aesthetic.",
    images: [
      "https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Onyx-Product.jpg",
      "https://images.stockx.com/360/adidas-Yeezy-Boost-350-V2-Onyx/Images/adidas-Yeezy-Boost-350-V2-Onyx/Lv2/img01.jpg",
      "https://images.stockx.com/360/adidas-Yeezy-Boost-350-V2-Onyx/Images/adidas-Yeezy-Boost-350-V2-Onyx/Lv2/img06.jpg",
      "https://images.stockx.com/360/adidas-Yeezy-Boost-350-V2-Onyx/Images/adidas-Yeezy-Boost-350-V2-Onyx/Lv2/img12.jpg",
      "https://images.stockx.com/360/adidas-Yeezy-Boost-350-V2-Onyx/Images/adidas-Yeezy-Boost-350-V2-Onyx/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "4", available: true },
      { size: "5", available: true },
      { size: "6", available: true },
      { size: "7", available: true },
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: true },
      { size: "13", available: true },
      { size: "14", available: false }
    ],
    inStock: true,
    badge: null,
    featured: false,
    trending: true,
    tags: ["yeezy", "kanye", "boost", "primeknit", "black"]
  },
  {
    id: 4,
    name: "Air Jordan 1 Retro High OG 'Chicago Lost & Found'",
    brand: "Jordan",
    model: "Air Jordan 1 Retro High OG",
    styleId: "DZ5485-612",
    colorway: "Varsity Red/Black-Sail-Muslin",
    category: "jordan",
    price: 320,
    retail: 180,
    condition: "New",
    releaseYear: 2022,
    releaseDate: "2022-11-19",
    description: "The Air Jordan 1 Retro High OG 'Chicago Lost & Found' reimagines the iconic Chicago colorway with vintage-inspired details. The shoe tells a story of discovering a forgotten pair in the back of a store decades later. Premium leather in varsity red and white features intentional cracking and aging, while the sail midsole and muslin inner lining add to the vintage aesthetic. The packaging includes aged paper wrapping and a mismatched box to complete the nostalgic experience. This release celebrates the heritage of the Air Jordan 1 while acknowledging the thrill of finding deadstock sneakers from the past.",
    images: [
      "https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Lost-and-Found-Product.jpg",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-High-OG-Lost-and-Found/Images/Air-Jordan-1-Retro-High-OG-Lost-and-Found/Lv2/img01.jpg",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-High-OG-Lost-and-Found/Images/Air-Jordan-1-Retro-High-OG-Lost-and-Found/Lv2/img06.jpg",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-High-OG-Lost-and-Found/Images/Air-Jordan-1-Retro-High-OG-Lost-and-Found/Lv2/img12.jpg",
      "https://images.stockx.com/360/Air-Jordan-1-Retro-High-OG-Lost-and-Found/Images/Air-Jordan-1-Retro-High-OG-Lost-and-Found/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "7", available: false },
      { size: "7.5", available: false },
      { size: "8", available: false },
      { size: "8.5", available: true },
      { size: "9", available: true },
      { size: "9.5", available: true },
      { size: "10", available: true },
      { size: "10.5", available: true },
      { size: "11", available: true },
      { size: "11.5", available: false },
      { size: "12", available: true },
      { size: "13", available: false }
    ],
    inStock: true,
    badge: null,
    featured: true,
    trending: true,
    tags: ["chicago", "og", "vintage", "lost and found", "iconic"]
  },
  {
    id: 5,
    name: "Nike Dunk Low Retro 'Panda'",
    brand: "Nike",
    model: "Dunk Low Retro",
    styleId: "DD1391-100",
    colorway: "White/Black-White",
    category: "dunk",
    price: 115,
    retail: 110,
    condition: "New",
    releaseYear: 2021,
    releaseDate: "2021-03-10",
    description: "The Nike Dunk Low Retro 'Panda' has become one of the most sought-after sneakers in recent years. The simple yet striking black and white colorway features a white leather base with black leather overlays, creating the 'Panda' nickname. Originally designed as a basketball shoe in 1985, the Dunk has transcended its athletic roots to become a streetwear staple. The padded collar provides comfort, while the rubber cupsole ensures durability. This colorway's versatility and clean aesthetic have made it a modern classic that pairs effortlessly with any outfit.",
    images: [
      "https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg",
      "https://images.stockx.com/360/Nike-Dunk-Low-Retro-White-Black-2021/Images/Nike-Dunk-Low-Retro-White-Black-2021/Lv2/img01.jpg",
      "https://images.stockx.com/360/Nike-Dunk-Low-Retro-White-Black-2021/Images/Nike-Dunk-Low-Retro-White-Black-2021/Lv2/img06.jpg",
      "https://images.stockx.com/360/Nike-Dunk-Low-Retro-White-Black-2021/Images/Nike-Dunk-Low-Retro-White-Black-2021/Lv2/img12.jpg",
      "https://images.stockx.com/360/Nike-Dunk-Low-Retro-White-Black-2021/Images/Nike-Dunk-Low-Retro-White-Black-2021/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "6", available: true },
      { size: "6.5", available: true },
      { size: "7", available: true },
      { size: "7.5", available: true },
      { size: "8", available: true },
      { size: "8.5", available: true },
      { size: "9", available: true },
      { size: "9.5", available: true },
      { size: "10", available: true },
      { size: "10.5", available: true },
      { size: "11", available: true },
      { size: "12", available: true },
      { size: "13", available: true }
    ],
    inStock: true,
    badge: null,
    featured: false,
    trending: true,
    tags: ["panda", "black white", "classic", "versatile"]
  },
  {
    id: 6,
    name: "New Balance 550 'White Green'",
    brand: "New Balance",
    model: "550",
    styleId: "BB550WT1",
    colorway: "White/Green",
    category: "new balance",
    price: 135,
    retail: 120,
    condition: "New",
    releaseYear: 2021,
    releaseDate: "2021-03-25",
    description: "The New Balance 550 'White Green' brings back a basketball silhouette from the archives that originally debuted in 1989. This retro model features a leather upper in clean white with forest green accents on the 'N' logo, heel, and outsole. The shoe's chunky aesthetic and vintage basketball styling have resonated with modern sneaker enthusiasts, making the 550 one of New Balance's most popular recent releases. The ENCAP midsole technology provides cushioning and stability, while the rubber outsole delivers reliable traction. This colorway exemplifies the 550's ability to bridge heritage design with contemporary style.",
    images: [
      "https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg",
      "https://images.stockx.com/360/New-Balance-550-White-Green/Images/New-Balance-550-White-Green/Lv2/img01.jpg",
      "https://images.stockx.com/360/New-Balance-550-White-Green/Images/New-Balance-550-White-Green/Lv2/img06.jpg",
      "https://images.stockx.com/360/New-Balance-550-White-Green/Images/New-Balance-550-White-Green/Lv2/img12.jpg",
      "https://images.stockx.com/360/New-Balance-550-White-Green/Images/New-Balance-550-White-Green/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "6", available: true },
      { size: "7", available: true },
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: false },
      { size: "13", available: false }
    ],
    inStock: true,
    badge: "New",
    featured: false,
    trending: false,
    tags: ["retro", "basketball", "green", "classic"]
  },
  {
    id: 7,
    name: "Nike SB Dunk Low 'Orange Lobster'",
    brand: "Nike",
    model: "SB Dunk Low",
    styleId: "FD8776-800",
    colorway: "Orange Frost/Orange Frost-Electro Orange",
    category: "dunk",
    price: 485,
    retail: 130,
    condition: "New",
    releaseYear: 2022,
    releaseDate: "2022-12-02",
    description: "The Nike SB Dunk Low 'Orange Lobster' continues Concepts' legendary Lobster Dunk series. This iteration features a vibrant orange colorway inspired by rare orange lobsters found in nature. The upper combines orange suede and leather with speckled detailing reminiscent of a lobster shell. True to the series tradition, the shoe includes a hidden lobster graphic on the sockliner and comes with special packaging that pays homage to New England seafood culture. The collaboration between Nike SB and Concepts has produced some of the most coveted Dunks in history, and the Orange Lobster maintains that prestigious legacy.",
    images: [
      "https://images.stockx.com/images/Nike-SB-Dunk-Low-Concepts-Orange-Lobster-Product.jpg",
      "https://images.stockx.com/360/Nike-SB-Dunk-Low-Concepts-Orange-Lobster/Images/Nike-SB-Dunk-Low-Concepts-Orange-Lobster/Lv2/img01.jpg",
      "https://images.stockx.com/360/Nike-SB-Dunk-Low-Concepts-Orange-Lobster/Images/Nike-SB-Dunk-Low-Concepts-Orange-Lobster/Lv2/img06.jpg",
      "https://images.stockx.com/360/Nike-SB-Dunk-Low-Concepts-Orange-Lobster/Images/Nike-SB-Dunk-Low-Concepts-Orange-Lobster/Lv2/img12.jpg",
      "https://images.stockx.com/360/Nike-SB-Dunk-Low-Concepts-Orange-Lobster/Images/Nike-SB-Dunk-Low-Concepts-Orange-Lobster/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "7", available: false },
      { size: "8", available: false },
      { size: "9", available: true },
      { size: "9.5", available: false },
      { size: "10", available: true },
      { size: "10.5", available: false },
      { size: "11", available: false },
      { size: "12", available: false }
    ],
    inStock: true,
    badge: null,
    featured: false,
    trending: false,
    tags: ["concepts", "lobster", "collaboration", "sb"]
  },
  {
    id: 8,
    name: "Air Jordan 11 Retro 'Cherry'",
    brand: "Jordan",
    model: "Air Jordan 11 Retro",
    styleId: "CT8012-116",
    colorway: "White/Varsity Red-Black",
    category: "jordan",
    price: 235,
    retail: 225,
    condition: "New",
    releaseYear: 2022,
    releaseDate: "2022-12-10",
    description: "The Air Jordan 11 Retro 'Cherry' brings back a beloved colorway for the holiday season. The shoe features a white ballistic mesh upper with patent leather mudguard in matching white, while varsity red accents appear on the Jumpman logo, outsole, and inner lining. The iconic carbon fiber spring plate in the midsole provides stability, and the full-length Air unit delivers responsive cushioning. Originally worn by Michael Jordan during the 1995-96 season, the Air Jordan 11 is considered one of the most influential sneaker designs in history. The Cherry colorway adds a festive touch while maintaining the silhouette's elegant aesthetic.",
    images: [
      "https://images.stockx.com/images/Air-Jordan-11-Retro-Cherry-2022-Product.jpg",
      "https://images.stockx.com/360/Air-Jordan-11-Retro-Cherry-2022/Images/Air-Jordan-11-Retro-Cherry-2022/Lv2/img01.jpg",
      "https://images.stockx.com/360/Air-Jordan-11-Retro-Cherry-2022/Images/Air-Jordan-11-Retro-Cherry-2022/Lv2/img06.jpg",
      "https://images.stockx.com/360/Air-Jordan-11-Retro-Cherry-2022/Images/Air-Jordan-11-Retro-Cherry-2022/Lv2/img12.jpg",
      "https://images.stockx.com/360/Air-Jordan-11-Retro-Cherry-2022/Images/Air-Jordan-11-Retro-Cherry-2022/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "7", available: true },
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: true },
      { size: "13", available: true },
      { size: "14", available: false }
    ],
    inStock: true,
    badge: null,
    featured: false,
    trending: true,
    tags: ["cherry", "holiday", "patent leather", "iconic"]
  },
  {
    id: 9,
    name: "Nike Air Force 1 Low '07 'White'",
    brand: "Nike",
    model: "Air Force 1 Low '07",
    styleId: "315122-111",
    colorway: "White/White",
    category: "nike",
    price: 115,
    retail: 115,
    condition: "New",
    releaseYear: 2023,
    releaseDate: "2023-01-01",
    description: "The Nike Air Force 1 Low '07 'White' is the quintessential sneaker that has remained a staple in footwear culture since its debut in 1982. Designed by Bruce Kilgore, it was the first basketball shoe to feature Nike Air technology. The all-white leather upper delivers a clean, timeless look that has made it one of the best-selling sneakers of all time. The perforated toe box provides breathability, while the thick rubber cupsole offers durability and the classic AF1 aesthetic. From hip-hop culture to high fashion, the white-on-white Air Force 1 transcends trends and generations.",
    images: [
      "https://images.stockx.com/images/Nike-Air-Force-1-Low-07-White-Product.jpg",
      "https://images.stockx.com/360/Nike-Air-Force-1-Low-07-White/Images/Nike-Air-Force-1-Low-07-White/Lv2/img01.jpg",
      "https://images.stockx.com/360/Nike-Air-Force-1-Low-07-White/Images/Nike-Air-Force-1-Low-07-White/Lv2/img06.jpg",
      "https://images.stockx.com/360/Nike-Air-Force-1-Low-07-White/Images/Nike-Air-Force-1-Low-07-White/Lv2/img12.jpg",
      "https://images.stockx.com/360/Nike-Air-Force-1-Low-07-White/Images/Nike-Air-Force-1-Low-07-White/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "6", available: true },
      { size: "7", available: true },
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: true },
      { size: "13", available: true },
      { size: "14", available: true },
      { size: "15", available: true }
    ],
    inStock: true,
    badge: null,
    featured: false,
    trending: true,
    tags: ["classic", "white", "essential", "iconic"]
  },
  {
    id: 10,
    name: "Adidas Samba OG 'White Black Gum'",
    brand: "Adidas",
    model: "Samba OG",
    styleId: "B75806",
    colorway: "Cloud White/Core Black/Clear Granite",
    category: "adidas",
    price: 100,
    retail: 100,
    condition: "New",
    releaseYear: 2023,
    releaseDate: "2023-01-01",
    description: "The Adidas Samba OG 'White Black Gum' is a timeless classic that has transitioned from the soccer pitch to street style icon. Originally designed in 1950 for soccer training on frozen pitches, the Samba features a full-grain leather upper with the iconic serrated 3-Stripes in black. The T-toe design and gold Samba logo on the tongue pay homage to its heritage. The gum rubber outsole provides excellent traction and adds a vintage aesthetic. This colorway represents the Samba at its purest form, embodying decades of cultural significance while remaining relevant in contemporary fashion.",
    images: [
      "https://images.stockx.com/images/adidas-Samba-OG-Cloud-White-Core-Black-Product.jpg",
      "https://images.stockx.com/360/adidas-Samba-OG-Cloud-White-Core-Black/Images/adidas-Samba-OG-Cloud-White-Core-Black/Lv2/img01.jpg",
      "https://images.stockx.com/360/adidas-Samba-OG-Cloud-White-Core-Black/Images/adidas-Samba-OG-Cloud-White-Core-Black/Lv2/img06.jpg",
      "https://images.stockx.com/360/adidas-Samba-OG-Cloud-White-Core-Black/Images/adidas-Samba-OG-Cloud-White-Core-Black/Lv2/img12.jpg",
      "https://images.stockx.com/360/adidas-Samba-OG-Cloud-White-Core-Black/Images/adidas-Samba-OG-Cloud-White-Core-Black/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "6", available: true },
      { size: "7", available: true },
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: true },
      { size: "13", available: false }
    ],
    inStock: true,
    badge: "New",
    featured: false,
    trending: true,
    tags: ["samba", "classic", "gum sole", "soccer"]
  },
  {
    id: 11,
    name: "Air Jordan 3 Retro 'White Cement Reimagined'",
    brand: "Jordan",
    model: "Air Jordan 3 Retro",
    styleId: "DN3707-100",
    colorway: "Summit White/Fire Red-Black-Cement Grey",
    category: "jordan",
    price: 250,
    retail: 200,
    condition: "New",
    releaseYear: 2023,
    releaseDate: "2023-03-11",
    description: "The Air Jordan 3 Retro 'White Cement Reimagined' celebrates the iconic silhouette designed by Tinker Hatfield in 1988. This version stays true to the original with its white tumbled leather upper, elephant print overlays, and visible Air unit in the heel. The 'Reimagined' treatment features premium materials and a vintage aesthetic with a slightly aged midsole. The shoe includes the iconic Jumpman logo on the tongue, Fire Red accents, and the distinctive elephant print that made the AJ3 revolutionary. This release marks a return to the roots of one of the most important sneakers in Jordan history.",
    images: [
      "https://images.stockx.com/images/Air-Jordan-3-Retro-White-Cement-Reimagined-Product.jpg",
      "https://images.stockx.com/360/Air-Jordan-3-Retro-White-Cement-Reimagined/Images/Air-Jordan-3-Retro-White-Cement-Reimagined/Lv2/img01.jpg",
      "https://images.stockx.com/360/Air-Jordan-3-Retro-White-Cement-Reimagined/Images/Air-Jordan-3-Retro-White-Cement-Reimagined/Lv2/img06.jpg",
      "https://images.stockx.com/360/Air-Jordan-3-Retro-White-Cement-Reimagined/Images/Air-Jordan-3-Retro-White-Cement-Reimagined/Lv2/img12.jpg",
      "https://images.stockx.com/360/Air-Jordan-3-Retro-White-Cement-Reimagined/Images/Air-Jordan-3-Retro-White-Cement-Reimagined/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "7", available: true },
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: true },
      { size: "13", available: false }
    ],
    inStock: true,
    badge: null,
    featured: true,
    trending: true,
    tags: ["white cement", "elephant print", "tinker hatfield", "iconic"]
  },
  {
    id: 12,
    name: "Nike Dunk Low 'Grey Fog'",
    brand: "Nike",
    model: "Dunk Low",
    styleId: "DD1391-103",
    colorway: "White/Grey Fog",
    category: "dunk",
    price: 130,
    retail: 110,
    condition: "New",
    releaseYear: 2022,
    releaseDate: "2022-01-14",
    description: "The Nike Dunk Low 'Grey Fog' offers a subtle, sophisticated take on the classic silhouette. The shoe features a white leather base with soft grey overlays, creating a versatile colorway that works with any wardrobe. The muted color palette gives the shoe a premium, understated appearance. The padded collar provides comfort for all-day wear, while the rubber cupsole delivers durability and the classic Dunk aesthetic. This colorway represents the refined side of Dunk culture, appealing to those who prefer subtle elegance over bold statements.",
    images: [
      "https://images.stockx.com/images/Nike-Dunk-Low-Grey-Fog-Product.jpg",
      "https://images.stockx.com/360/Nike-Dunk-Low-Grey-Fog/Images/Nike-Dunk-Low-Grey-Fog/Lv2/img01.jpg",
      "https://images.stockx.com/360/Nike-Dunk-Low-Grey-Fog/Images/Nike-Dunk-Low-Grey-Fog/Lv2/img06.jpg",
      "https://images.stockx.com/360/Nike-Dunk-Low-Grey-Fog/Images/Nike-Dunk-Low-Grey-Fog/Lv2/img12.jpg",
      "https://images.stockx.com/360/Nike-Dunk-Low-Grey-Fog/Images/Nike-Dunk-Low-Grey-Fog/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "6", available: true },
      { size: "7", available: true },
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: true }
    ],
    inStock: true,
    badge: null,
    featured: false,
    trending: false,
    tags: ["grey", "minimal", "versatile", "clean"]
  },
  {
    id: 13,
    name: "New Balance 2002R 'Protection Pack Rain Cloud'",
    brand: "New Balance",
    model: "2002R",
    styleId: "M2002RDA",
    colorway: "Rain Cloud/Phantom",
    category: "new balance",
    price: 165,
    retail: 150,
    condition: "New",
    releaseYear: 2022,
    releaseDate: "2022-04-01",
    description: "The New Balance 2002R 'Protection Pack Rain Cloud' showcases the brand's commitment to comfort and style. Part of the popular Protection Pack series, this colorway features a grey suede and mesh upper with a deconstructed, worn-in aesthetic. The ABZORB midsole cushioning provides exceptional comfort, while the N-ERGY technology in the heel absorbs impact. The shoe's vintage running silhouette combined with premium materials has made the 2002R a favorite among sneaker enthusiasts. The Rain Cloud colorway offers a versatile, neutral option that complements the shoe's premium construction.",
    images: [
      "https://images.stockx.com/images/New-Balance-2002R-Protection-Pack-Rain-Cloud-Product.jpg",
      "https://images.stockx.com/360/New-Balance-2002R-Protection-Pack-Rain-Cloud/Images/New-Balance-2002R-Protection-Pack-Rain-Cloud/Lv2/img01.jpg",
      "https://images.stockx.com/360/New-Balance-2002R-Protection-Pack-Rain-Cloud/Images/New-Balance-2002R-Protection-Pack-Rain-Cloud/Lv2/img06.jpg",
      "https://images.stockx.com/360/New-Balance-2002R-Protection-Pack-Rain-Cloud/Images/New-Balance-2002R-Protection-Pack-Rain-Cloud/Lv2/img12.jpg",
      "https://images.stockx.com/360/New-Balance-2002R-Protection-Pack-Rain-Cloud/Images/New-Balance-2002R-Protection-Pack-Rain-Cloud/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "7", available: true },
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: true }
    ],
    inStock: true,
    badge: null,
    featured: false,
    trending: false,
    tags: ["protection pack", "comfort", "vintage", "runner"]
  },
  {
    id: 14,
    name: "Air Jordan 1 Low 'Mocha'",
    brand: "Jordan",
    model: "Air Jordan 1 Low",
    styleId: "DC0774-200",
    colorway: "Mocha/White-Black",
    category: "jordan",
    price: 150,
    retail: 110,
    condition: "New",
    releaseYear: 2022,
    releaseDate: "2022-09-01",
    description: "The Air Jordan 1 Low 'Mocha' delivers the popular colorway in a low-top silhouette. The shoe features a white leather base with mocha brown overlays and black accents on the Swoosh and collar. This colorway draws inspiration from the highly coveted Air Jordan 1 High 'Travis Scott' while offering a more accessible price point and everyday wearability. The low-cut design provides ankle mobility while maintaining the classic AJ1 aesthetic. Premium leather construction ensures durability, making this a versatile option for Jordan enthusiasts.",
    images: [
      "https://images.stockx.com/images/Air-Jordan-1-Low-Mocha-Product.jpg",
      "https://images.stockx.com/360/Air-Jordan-1-Low-Mocha/Images/Air-Jordan-1-Low-Mocha/Lv2/img01.jpg",
      "https://images.stockx.com/360/Air-Jordan-1-Low-Mocha/Images/Air-Jordan-1-Low-Mocha/Lv2/img06.jpg",
      "https://images.stockx.com/360/Air-Jordan-1-Low-Mocha/Images/Air-Jordan-1-Low-Mocha/Lv2/img12.jpg",
      "https://images.stockx.com/360/Air-Jordan-1-Low-Mocha/Images/Air-Jordan-1-Low-Mocha/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "7", available: true },
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: true },
      { size: "13", available: false }
    ],
    inStock: true,
    badge: null,
    featured: false,
    trending: false,
    tags: ["mocha", "low top", "brown", "versatile"]
  },
  {
    id: 15,
    name: "Yeezy Slide 'Onyx'",
    brand: "Adidas",
    model: "Yeezy Slide",
    styleId: "HQ6448",
    colorway: "Onyx/Onyx/Onyx",
    category: "yeezy",
    price: 130,
    retail: 70,
    condition: "New",
    releaseYear: 2022,
    releaseDate: "2022-03-14",
    description: "The Yeezy Slide 'Onyx' showcases Kanye West's minimalist design philosophy in a comfortable slide silhouette. The one-piece EVA foam construction features a ridged upper and footbed that conforms to the foot over time. The all-black colorway maintains the clean, monochromatic aesthetic that has become synonymous with the Yeezy brand. Despite its simple appearance, the Yeezy Slide has become one of the most sought-after casual footwear options, blending comfort with the distinctive Yeezy aesthetic. The lightweight construction makes it perfect for everyday wear.",
    images: [
      "https://images.stockx.com/images/adidas-Yeezy-Slide-Onyx-Product.jpg",
      "https://images.stockx.com/360/adidas-Yeezy-Slide-Onyx/Images/adidas-Yeezy-Slide-Onyx/Lv2/img01.jpg",
      "https://images.stockx.com/360/adidas-Yeezy-Slide-Onyx/Images/adidas-Yeezy-Slide-Onyx/Lv2/img06.jpg",
      "https://images.stockx.com/360/adidas-Yeezy-Slide-Onyx/Images/adidas-Yeezy-Slide-Onyx/Lv2/img12.jpg",
      "https://images.stockx.com/360/adidas-Yeezy-Slide-Onyx/Images/adidas-Yeezy-Slide-Onyx/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "5", available: true },
      { size: "6", available: true },
      { size: "7", available: true },
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: true },
      { size: "13", available: true }
    ],
    inStock: true,
    badge: null,
    featured: false,
    trending: true,
    tags: ["slide", "comfort", "casual", "black"]
  },
  {
    id: 16,
    name: "Nike Air Max 90 'Infrared' (2020)",
    brand: "Nike",
    model: "Air Max 90",
    styleId: "CT1685-100",
    colorway: "White/Black-Cool Grey-Infrared",
    category: "nike",
    price: 150,
    retail: 140,
    condition: "New",
    releaseYear: 2020,
    releaseDate: "2020-01-30",
    description: "The Nike Air Max 90 'Infrared' celebrates the 30th anniversary of Tinker Hatfield's iconic design. This 2020 release stays faithful to the original 1990 colorway with its white leather and mesh upper, grey mudguard, and signature infrared accents on the heel, Swoosh, and Air unit. The visible Air cushioning in the heel revolutionized sneaker design and remains as relevant today as it was three decades ago. The Infrared colorway is considered the definitive Air Max 90, representing the perfect balance of innovation and timeless style.",
    images: [
      "https://images.stockx.com/images/Nike-Air-Max-90-Infrared-2020-Product.jpg",
      "https://images.stockx.com/360/Nike-Air-Max-90-Infrared-2020/Images/Nike-Air-Max-90-Infrared-2020/Lv2/img01.jpg",
      "https://images.stockx.com/360/Nike-Air-Max-90-Infrared-2020/Images/Nike-Air-Max-90-Infrared-2020/Lv2/img06.jpg",
      "https://images.stockx.com/360/Nike-Air-Max-90-Infrared-2020/Images/Nike-Air-Max-90-Infrared-2020/Lv2/img12.jpg",
      "https://images.stockx.com/360/Nike-Air-Max-90-Infrared-2020/Images/Nike-Air-Max-90-Infrared-2020/Lv2/img18.jpg"
    ],
    sizes: [
      { size: "7", available: false },
      { size: "8", available: true },
      { size: "9", available: true },
      { size: "10", available: true },
      { size: "11", available: true },
      { size: "12", available: false }
    ],
    inStock: true,
    badge: null,
    featured: false,
    trending: false,
    tags: ["infrared", "og", "anniversary", "classic"]
  }
];

// Categories
const categories = [
  { id: 'jordan', name: 'Jordan', slug: 'jordan' },
  { id: 'nike', name: 'Nike', slug: 'nike' },
  { id: 'adidas', name: 'Adidas', slug: 'adidas' },
  { id: 'new-balance', name: 'New Balance', slug: 'new-balance' },
  { id: 'yeezy', name: 'Yeezy', slug: 'yeezy' },
  { id: 'dunk', name: 'Dunk', slug: 'dunk' }
];

// Helper functions
const getProductById = (id) => products.find(p => p.id === parseInt(id));

const getProductsByCategory = (category) => {
  if (!category || category === 'all') return products;
  return products.filter(p =>
    p.category.toLowerCase() === category.toLowerCase() ||
    p.brand.toLowerCase() === category.toLowerCase()
  );
};

const getFeaturedProducts = () => products.filter(p => p.featured);

const getTrendingProducts = () => products.filter(p => p.trending);

const getNewDrops = () => products.filter(p => p.badge === 'New' || p.featured);

const getRelatedProducts = (productId, limit = 4) => {
  const product = getProductById(productId);
  if (!product) return [];

  return products
    .filter(p => p.id !== productId && (p.brand === product.brand || p.category === product.category))
    .slice(0, limit);
};

const searchProducts = (query) => {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.model.toLowerCase().includes(q) ||
    p.styleId.toLowerCase().includes(q) ||
    p.tags.some(tag => tag.toLowerCase().includes(q))
  );
};

// Export for use in browser
if (typeof window !== 'undefined') {
  window.KicksListData = {
    products,
    categories,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getTrendingProducts,
    getNewDrops,
    getRelatedProducts,
    searchProducts
  };
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    products,
    categories,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getTrendingProducts,
    getNewDrops,
    getRelatedProducts,
    searchProducts
  };
}
