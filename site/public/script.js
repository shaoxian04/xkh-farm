document.addEventListener('DOMContentLoaded', () => {
    // Product Data
    const products = [
        { name: "Cherry Tomato", image: "img/prod_cherry tomato.jpg" },
        { name: "Sawi 菜心", image: "img/prod_sawi.jpg" },
        { name: "Baby Romaine 香旦", image: "img/prod_baby romaine.png" }, // png
        { name: "Spinach 菠菜", image: "img/prod_spinach.jpg" },
        { name: "Mizuna 水菜", image: "img/prod_mizuna.jpg" },
        { name: "Cabbage 包菜", image: "img/prod_cabbage.jpg" },
        { name: "Cucumber 黄瓜", image: "img/prod_cucumber.jpg" },
        { name: "Tomato 番茄", image: "img/prod_tomato.jpg" },
        { name: "Eggplant 茄子", image: "img/prod_eggplant.jpg" },
        { name: "Chayote 水瓜", image: "img/prod_chayote.jpg" },
        { name: "Red Chilli 红辣椒", image: "img/prod_red chilli.jpg" },
        { name: "Green Chilli 青辣椒", image: "img/prod_green chilli.jpg" },
        { name: "Spring Onion 青葱", image: "img/prod_spring onion.png" }, // png
        { name: "Chives 韭菜", image: "img/prod_chives.jpg" },
        { name: "White Radish 白萝卜", image: "img/prod_white radish.jpg" },
        { name: "Kailan 芥兰", image: "img/prod_kailan.jpg" },
        { name: "French Bean 龟豆", image: "img/prod_french bean.png" }, // png
        { name: "Indian Bean 扁豆", image: "img/prod_indian bean.jpg" },
        { name: "Flowering Chinese Cabbage 菜心花", image: "img/prod_flowering chinese cabbage.png" }, // png
        { name: "Siew Pak Choy 小白菜", image: "img/prod_siew pak choy.png" }, // png
        { name: "Old Cucumber 老黄瓜", image: "img/prod_old cucumber.jpg" },
        { name: "Roselle 洛神花", image: "img/prod_roselle.jpg" },
        { name: "Avocado 牛油果", image: "img/prod_avocado.jpg" },
        { name: "Sweet Potato Leaf 番薯叶", image: "img/prod_sweet potato leaf.jpg" },
        { name: "Water Spinach 空心菜", image: "img/prod_water spinach.png" }, // png
        { name: "Milk Cabbage 奶白", image: "img/prod_milk cabbage.jpg" },
        { name: "Durian", image: "img/prod_durian.jpg" },
        { name: "Beetroot 甜菜根", image: "img/prod_beetroot.jpg" },
        { name: "Japanese Pumpkin 日本南瓜", image: "img/prod_japanese pumpkin.jpg" },
        { name: "Sweet Potato 番薯", image: "img/prod_sweet potato.jpg" },
        { name: "Iceberg 玻璃生菜", image: "img/prod_iceberg.jpg" },
        { name: "Mustard Green 芥菜", image: "img/prod_mustard green.jpg" },
        { name: "Asparagus 芦笋", image: "img/prod_asparagus.jpg" },
        { name: "Turnip 小芜菁", image: "img/prod_turnip.jpg" },
        { name: "Endive Lettuce 菊苣", image: "img/prod_endive lettuce.jpg" },
        { name: "Baby Carrot 小红萝卜", image: "img/prod_baby carrot.jpg" }
    ];

    const productGrid = document.getElementById('product-grid');

    // Render Products
    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in';
        card.style.animationDelay = `${(index % 5) * 0.1}s`; // Stagger animation

        // Brief descriptions mapping (simple generator)
        let desc = "Fresh and organic.";
        if (product.name.includes("Tomato")) desc = "Juicy and sweet.";
        if (product.name.includes("Chilli")) desc = "Spicy and flavorful.";
        if (product.name.includes("Cabbage")) desc = "Crisp and crunchy.";
        if (product.name.includes("Bean")) desc = "Tender and nutritious.";
        if (product.name.includes("Durian")) desc = "King of fruits.";

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${desc}</p>
            </div>
        `;
        productGrid.appendChild(card);
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Keep observing if we want it to animate every time? No, usually once.
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in, .product-card').forEach(el => {
        observer.observe(el);
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.right = '0';
                navLinks.style.backgroundColor = 'white';
                navLinks.style.width = '100%';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
             if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                navLinks.style.display = 'none'; // Close mobile menu on click
            }
        });
    });
});
