import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';

const products = [
    { name: "Cherry Tomato", image: "/img/prod_cherry tomato.jpg", category: "Fruit Veg", description: "Sweet, bite-sized tomatoes bursting with flavor. Perfect for salads and snacking." },
    { name: "Sawi 菜心", image: "/img/prod_sawi.jpg", category: "Leafy", description: "Classic leafy green with crunchy stems and tender leaves. ideal for stir-frying." },
    { name: "Baby Romaine 香旦", image: "/img/prod_baby romaine.png", category: "Leafy", description: "Crisp and refreshing, widely used in Caesar salads and sandwiches." },
    { name: "Spinach 菠菜", image: "/img/prod_spinach.jpg", category: "Leafy", description: "Nutrient-rich greens with a mild flavor, great for soups and smoothies." },
    { name: "Mizuna 水菜", image: "/img/prod_mizuna.jpg", category: "Leafy", description: "Japanese mustard greens with a peppery bite, excellent for salads." },
    { name: "Cabbage 包菜", image: "/img/prod_cabbage.jpg", category: "Leafy", description: "Versatile and crunchy, essential for coleslaw, stir-frys, and soups." },
    { name: "Cucumber 黄瓜", image: "/img/prod_cucumber.jpg", category: "Fruit Veg", description: "Cool and hydrating, perfect for salads, pickling, or fresh eating." },
    { name: "Tomato 番茄", image: "/img/prod_tomato.jpg", category: "Fruit Veg", description: "Juicy and versatile, a kitchen staple for sauces, salads, and cooking." },
    { name: "Eggplant 茄子", image: "/img/prod_eggplant.jpg", category: "Fruit Veg", description: "Tender and absorbent, delicious in curries, stir-frys, and grilled dishes." },
    { name: "Chayote 水瓜", image: "/img/prod_chayote.jpg", category: "Gourd", description: "Mild and crisp gourd, great for soups and stir-frys." },
    { name: "Red Chilli 红辣椒", image: "/img/prod_red chilli.jpg", category: "Spice", description: "Add vibrant color and spicy heat to your culinary creations." },
    { name: "Green Chilli 青辣椒", image: "/img/prod_green chilli.jpg", category: "Spice", description: "Fresh and spicy, essential for many local Malaysian dishes." },
    { name: "Spring Onion 青葱", image: "/img/prod_spring onion.png", category: "Herb", description: "Aromatic garnish that adds a fresh oniony kick to any dish." },
    { name: "Chives 韭菜", image: "/img/prod_chives.jpg", category: "Herb", description: "Garlicky herb commonly used in dumplings and omelets." },
    { name: "White Radish 白萝卜", image: "/img/prod_white radish.jpg", category: "Root", description: "Crisp root vegetable, perfect for clear soups and braised dishes." },
    { name: "Kailan 芥兰", image: "/img/prod_kailan.jpg", category: "Leafy", description: "Chinese broccoli with thick stems and dark leaves, best served with oyster sauce." },
    { name: "French Bean 龟豆", image: "/img/prod_french bean.png", category: "Bean", description: "Sweet and crunchy beans, delicious steamed or stir-fried." },
    { name: "Indian Bean 扁豆", image: "/img/prod_indian bean.jpg", category: "Bean", description: "Flat, tender beans that absorb flavors well in curries and stir-frys." },
    { name: "Flowering Chinese Cabbage 菜心花", image: "/img/prod_flowering chinese cabbage.png", category: "Leafy", description: "Tender flowering stalks with a sweeter taste than regular choy sum." },
    { name: "Siew Pak Choy 小白菜", image: "/img/prod_siew pak choy.png", category: "Leafy", description: "Small, tender bok choy variety, quick to cook and mild in flavor." },
    { name: "Old Cucumber 老黄瓜", image: "/img/prod_old cucumber.jpg", category: "Gourd", description: "Mature cucumber with a distinct flavor, traditionally used in nourishing soups." },
    { name: "Roselle 洛神花", image: "/img/prod_roselle.jpg", category: "Flower", description: "Tart and tangy flowers, used for making refreshing drinks and jams." },
    { name: "Avocado 牛油果", image: "/img/prod_avocado.jpg", category: "Fruit", description: "Creamy and nutritious, perfect for toast, smoothies, and salads." },
    { name: "Sweet Potato Leaf 番薯叶", image: "/img/prod_sweet potato leaf.jpg", category: "Leafy", description: "Nutritious greens that become tender and silky (mucilaginous) when cooked." },
    { name: "Water Spinach 空心菜", image: "/img/prod_water spinach.png", category: "Leafy", description: "Also known as Kangkung, famous for its hollow stems and affinity for belacan." },
    { name: "Milk Cabbage 奶白", image: "/img/prod_milk cabbage.jpg", category: "Leafy", description: "Crunchy white stems and dark crinkly leaves, sweet and crisp." },
    { name: "Durian", image: "/img/prod_durian.jpg", category: "Fruit", description: "The King of Fruits. Rich, custardy, and intensely flavorful." },
    { name: "Beetroot 甜菜根", image: "/img/prod_beetroot.jpg", category: "Root", description: "Earthy and sweet root vegetable, packed with antioxidants." },
    { name: "Japanese Pumpkin 日本南瓜", image: "/img/prod_japanese pumpkin.jpg", category: "Gourd", description: "Sweet and nutty Kabocha squash, excellent for roasting and soups." },
    { name: "Sweet Potato 番薯", image: "/img/prod_sweet potato.jpg", category: "Root", description: "Naturally sweet and starchy, great steamed, roasted, or in desserts." },
    { name: "Iceberg 玻璃生菜", image: "/img/prod_iceberg.jpg", category: "Leafy", description: "Crisp and watery lettuce, the classic choice for fresh salads." },
    { name: "Mustard Green 芥菜", image: "/img/prod_mustard green.jpg", category: "Leafy", description: "Pungent and slightly bitter greens, often used in soups and stews." },
    { name: "Asparagus 芦笋", image: "/img/prod_asparagus.jpg", category: "Stalk", description: "Tender stalks with a unique flavor, considered a premium vegetable." },
    { name: "Turnip 小芜菁", image: "/img/prod_turnip.jpg", category: "Root", description: "Mild, white root vegetable, versatile in soups and stir-frys." },
    { name: "Endive Lettuce 菊苣", image: "/img/prod_endive lettuce.jpg", category: "Leafy", description: "Frilly leaves with a slightly bitter taste, adding texture to salads." },
    { name: "Baby Carrot 小红萝卜", image: "/img/prod_baby carrot.jpg", category: "Root", description: "Sweet, tender, and bite-sized. A favorite snack for all ages." }
];

export default function ProductGallery() {
    const [filter, setFilter] = useState("All");

    return (
        <section className="py-20 bg-bg min-h-screen">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-serif font-bold text-primary mb-4"
                    >
                        Our Fresh Produce
                    </motion.h2>
                    <p className="text-xl text-gray-600">Straight from our farm to your table.</p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full"
                        >
                            <div className="h-48 overflow-hidden bg-white relative shrink-0">
                                <img
                                    src={encodeURI(product.image)}
                                    alt={product.name}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                                    }}
                                    className="w-full h-full object-contain p-2 transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-6 text-center flex flex-col flex-grow">
                                <span className="text-xs uppercase tracking-wider text-accent font-bold mb-2 block">{product.category}</span>
                                <h3 className="text-lg font-bold text-text mb-2">{product.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{product.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
