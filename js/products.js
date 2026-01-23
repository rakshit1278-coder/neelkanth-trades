// ==================================================
// PRODUCT DATA (THIS COMES FROM EXCEL)
// ==================================================

const PRODUCTS = [
    {
        name: "Vim Liquid 200ml",
        price: "₹60 (Pack of 12)",
        image: "vim-liquid-200ml.jpg",
        category: "Grocery",
        id: "vim",
        popular: true
    },
    {
        name: "Surf Excel 1KG",
        price: "₹120",
        image: "surf-excel-1kg.jpg",
        category: "Grocery",
        id: "surf"
    },
    {
        name: "Aashirvaad Atta 10KG",
        price: "₹380",
        image: "aashirvad-atta-10kg.jpg",
        category: "Grocery",
        id: "atta"
    },
    {
        name: "Sugar 1KG",
        price: "₹45",
        image: "sugar-1kg.jpg",
        category: "Grocery",
        id: "sugar"
    },
    {
        name: "Oil 1L",
        price: "₹120",
        image: "oil-1l.jpg",
        category: "Grocery",
        id: "oil"
    },
    {
        name: "Fair and Lovely 10ml",
        price: "₹20 (Pack of 144)",
        image: "fair-and-lovely-10ml.jpg",
        category: "Cosmetics",
        id: "fair",
        popular: true
    },
    {
        name: "Patanjali Facewash",
        price: "₹60 (Pack of 84)",
        image: "patanjali-facewash.jpg",
        category: "Cosmetics",
        id: "patanjali"
    },
    {
        name: "Harpic 500ml",
        price: "₹94 (Pack of 24)",
        image: "harpic-500ml.jpg",
        category: "Hygiene",
        id: "harpic",
        popular: true
    }
];

// ==================================================
// RENDER PRODUCTS INTO SHOP PAGE
// ==================================================

function renderProducts() {
    const categoryMap = {
        "Grocery": document.getElementById("groceryProducts"),
        "Cosmetics": document.getElementById("cosmeticsProducts"),
        "Hygiene": document.getElementById("hygieneProducts")
    };

    if (!categoryMap.Grocery || !categoryMap.Cosmetics || !categoryMap.Hygiene) return;

    Object.values(categoryMap).forEach(grid => grid.innerHTML = "");

    PRODUCTS.forEach(p => {
        const grid = categoryMap[p.category];
        if (!grid) return;

        grid.innerHTML += `
            <div class="product-card">
                <img src="img/${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>${p.price}</p>

                <div class="qty-box">
                    <button class="qty-btn" onclick="decreaseQty('${p.id}')">-</button>
                    <span id="${p.id}_qty" class="qty-number">0</span>
                    <button class="qty-btn" onclick="increaseQty('${p.id}')">+</button>
                </div>

                <button class="add-btn"
                    onclick="addToCartQty('${p.name} - ${p.price}', '${p.id}')">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", renderProducts);

// ==================================================
// HOME PAGE: POPULAR PRODUCTS ONLY
// ==================================================

function renderHomeProducts() {
    const homeContainer = document.getElementById("home-products");
    if (!homeContainer) return;

    homeContainer.innerHTML = "";

    PRODUCTS.filter(p => p.popular).forEach(p => {
        homeContainer.innerHTML += `
            <div class="product-card">
                <img src="img/${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>${p.price}</p>

                <div class="qty-box">
                    <button class="qty-btn" onclick="decreaseQty('${p.id}')">-</button>
                    <span id="${p.id}_qty" class="qty-number">0</span>
                    <button class="qty-btn" onclick="increaseQty('${p.id}')">+</button>
                </div>

                <button onclick="addToCartQty('${p.name} - ${p.price}', '${p.id}')"
                        class="qty-btn" style="margin-top:10px;">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", renderHomeProducts);
