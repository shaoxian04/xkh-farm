/**
 * The crop index — 36 lines grown and packed at Bertam Valley.
 *
 * `name` and `han` are kept as separate fields rather than one combined string
 * so the two scripts can be typeset independently: Fraunces for the Latin name,
 * Noto Serif SC for the Chinese. Crammed into one string they inherit one font
 * and the Chinese falls back to whatever the OS supplies.
 *
 * `slug` resolves to the keyed cut-outs — see imageFor() / thumbFor().
 */

export const CATEGORIES = [
  "Leafy",
  "Fruiting",
  "Root",
  "Gourd",
  "Bean",
  "Herb & Spice",
  "Specialty",
];

export const products = [
  {
    name: "Sawi",
    han: "菜心",
    slug: "sawi",
    category: "Leafy",
    note: "Our highest-volume line. Cut daily, field-cooled and packed upright to protect the stem.",
  },
  {
    name: "Kailan",
    han: "芥兰",
    slug: "kailan",
    category: "Leafy",
    note: "Thick-stemmed Chinese broccoli. Graded on stem diameter to a uniform pack.",
  },
  {
    name: "Siew Pak Choy",
    han: "小白菜",
    slug: "siew pak choy",
    category: "Leafy",
    note: "Small-leaf bok choy. Short shelf life, so it moves on the same-day run.",
  },
  {
    name: "Milk Cabbage",
    han: "奶白",
    slug: "milk cabbage",
    category: "Leafy",
    note: "White-stemmed and crisp. Consistent year-round at highland temperatures.",
  },
  {
    name: "Flowering Chinese Cabbage",
    han: "菜心花",
    slug: "flowering chinese cabbage",
    category: "Leafy",
    note: "Cut at bud stage before the flower opens. Sweeter than standard choy sum.",
  },
  {
    name: "Spinach",
    han: "菠菜",
    slug: "spinach",
    category: "Leafy",
    note: "Tender leaf, handled loose in shallow crates to avoid bruising.",
  },
  {
    name: "Mizuna",
    han: "水菜",
    slug: "mizuna",
    category: "Leafy",
    note: "Japanese mustard green. Grown for salad packers and specialty kitchens.",
  },
  {
    name: "Cabbage",
    han: "包菜",
    slug: "cabbage",
    category: "Leafy",
    note: "Round head cabbage. Stores and travels well; suits longer distribution runs.",
  },
  {
    name: "Mustard Green",
    han: "芥菜",
    slug: "mustard green",
    category: "Leafy",
    note: "Full-flavoured and robust. Steady demand through the cooler months.",
  },
  {
    name: "Water Spinach",
    han: "空心菜",
    slug: "water spinach",
    category: "Leafy",
    note: "Kangkung. Bundled at the field edge and delivered the same day.",
  },
  {
    name: "Sweet Potato Leaf",
    han: "番薯叶",
    slug: "sweet potato leaf",
    category: "Leafy",
    note: "Young shoots picked by hand. High turnover line for wet markets.",
  },
  {
    name: "Baby Romaine",
    han: "香旦",
    slug: "baby romaine",
    category: "Leafy",
    note: "Compact heads for foodservice. Sized to a consistent count per carton.",
  },
  {
    name: "Iceberg",
    han: "玻璃生菜",
    slug: "iceberg",
    category: "Leafy",
    note: "Firm, tight-wrapped heads. Graded by weight for quick-service buyers.",
  },
  {
    name: "Endive Lettuce",
    han: "菊苣",
    slug: "endive lettuce",
    category: "Leafy",
    note: "Frilled leaf with a clean bitter edge. Grown to order in small lots.",
  },

  {
    name: "Cherry Tomato",
    han: "小番茄",
    slug: "cherry tomato",
    category: "Fruiting",
    note: "Hand-graded for colour and size — the line you see in the film.",
  },
  {
    name: "Tomato",
    han: "番茄",
    slug: "tomato",
    category: "Fruiting",
    note: "Picked at breaker stage so it arrives at the buyer ready, not overripe.",
  },
  {
    name: "Cucumber",
    han: "黄瓜",
    slug: "cucumber",
    category: "Fruiting",
    note: "Straight-grade fruit, wiped and packed in single layers.",
  },
  {
    name: "Eggplant",
    han: "茄子",
    slug: "eggplant",
    category: "Fruiting",
    note: "Glossy purple long fruit. Cut with the calyx on to extend shelf life.",
  },

  {
    name: "White Radish",
    han: "白萝卜",
    slug: "white radish",
    category: "Root",
    note: "Topped and washed. Sized into two grades for soup and retail trade.",
  },
  {
    name: "Beetroot",
    han: "甜菜根",
    slug: "beetroot",
    category: "Root",
    note: "Deep-colour roots, brushed rather than washed to hold condition.",
  },
  {
    name: "Sweet Potato",
    han: "番薯",
    slug: "sweet potato",
    category: "Root",
    note: "Cured after lifting, which sets the skin and sweetens the flesh.",
  },
  {
    name: "Turnip",
    han: "小芜菁",
    slug: "turnip",
    category: "Root",
    note: "White globe turnip. Steady supply, tolerant of longer transport.",
  },
  {
    name: "Baby Carrot",
    han: "小红萝卜",
    slug: "baby carrot",
    category: "Root",
    note: "Pulled young for sweetness. Washed and packed in small counts.",
  },

  {
    name: "Chayote",
    han: "水瓜",
    slug: "chayote",
    category: "Gourd",
    note: "Highland staple. Hardy in transit and available nearly all year.",
  },
  {
    name: "Old Cucumber",
    han: "老黄瓜",
    slug: "old cucumber",
    category: "Gourd",
    note: "Left on the vine to mature. Sold by weight for soup trade.",
  },
  {
    name: "Japanese Pumpkin",
    han: "日本南瓜",
    slug: "japanese pumpkin",
    category: "Gourd",
    note: "Kabocha type. Cured before dispatch; holds for weeks in dry storage.",
  },

  {
    name: "French Bean",
    han: "龟豆",
    slug: "french bean",
    category: "Bean",
    note: "Snapped-grade pods, picked every second day through the flush.",
  },
  {
    name: "Indian Bean",
    han: "扁豆",
    slug: "indian bean",
    category: "Bean",
    note: "Flat pod. Seasonal line with a short, heavy cropping window.",
  },

  {
    name: "Red Chilli",
    han: "红辣椒",
    slug: "red chilli",
    category: "Herb & Spice",
    note: "Fully-coloured fruit, dry-picked to prevent rot in the carton.",
  },
  {
    name: "Green Chilli",
    han: "青辣椒",
    slug: "green chilli",
    category: "Herb & Spice",
    note: "Firm immature fruit. Core line for local kitchens and sauce makers.",
  },
  {
    name: "Spring Onion",
    han: "青葱",
    slug: "spring onion",
    category: "Herb & Spice",
    note: "Washed, trimmed and banded. Kept cold from field to delivery.",
  },
  {
    name: "Chives",
    han: "韭菜",
    slug: "chives",
    category: "Herb & Spice",
    note: "Cut to length and bundled. Regular order line for dumpling producers.",
  },

  {
    name: "Asparagus",
    han: "芦笋",
    slug: "asparagus",
    category: "Specialty",
    note: "Premium spears, cut daily and stood in water until dispatch.",
  },
  {
    name: "Avocado",
    han: "牛油果",
    slug: "avocado",
    category: "Specialty",
    note: "Picked hard and shipped unripe so the buyer controls the ripening.",
  },
  {
    name: "Roselle",
    han: "洛神花",
    slug: "roselle",
    category: "Specialty",
    note: "Calyces for cordial and preserve makers. Narrow seasonal window.",
  },
  {
    name: "Durian",
    han: "榴莲",
    slug: "durian",
    category: "Specialty",
    note: "Tree-dropped and collected the same morning. Strictly in season.",
  },
];

/**
 * Crop shots, with the white studio background keyed out so they sit on the
 * dark ground rather than punching white rectangles into it. Filenames carry
 * spaces, so they need encoding.
 *
 * `imageFor` is the full-size cut for the crops grid; `thumbFor` is the
 * smaller one used by the crop wall, whose tiles cannot be lazy-loaded.
 */
export function imageFor(product) {
  return encodeURI(`/img/cut/prod_${product.slug}.webp`);
}

export function thumbFor(product) {
  return encodeURI(`/img/cut-sm/prod_${product.slug}.webp`);
}

export const categoryCounts = CATEGORIES.map((c) => ({
  name: c,
  count: products.filter((p) => p.category === c).length,
}));
