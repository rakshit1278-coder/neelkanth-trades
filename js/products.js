// ==================================================
// PRODUCT DATA (FROM CMS via GitHub)
// ==================================================

let PRODUCTS = [];

// ===============================
// LOAD PRODUCTS FROM GITHUB (CMS)
// ===============================

async function loadProducts() {
    try {
        const apiUrl = "https://api.github.com/repos/rakshit1278-coder/neelkanth-trades/contents/data/products";

        const res = await fetch(apiUrl);
        const files = await res.json();

        const jsonFiles = files.filter(f => f.name.endsWith(".json"));

        const productPromises = jsonFiles.map(f =>
            fetch(f.download_url).then(r => r.json())
        );

        PRODUCTS = await Promise.all(productPromises);

        renderProducts();
        renderHomeProducts();
    } catch (err) {
        console.error("Failed to load products:", err);
    }
}

// ==================================================
// HELPER: AUTO GENERATE ID FROM NAME
// ==================================================

function makeId(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
}

// ==================================================
// RENDER PRODUCTS INTO SHOP PAGE
// ==================================================

function renderProducts() {
    const categoryMap = {
        "grocery": document.getElementById("groceryProducts"),
        "cosmetics": document.getElementById("cosmeticsProducts"),
        "hygiene": document.getElementById("hygieneProducts")
    };

    if (!categoryMap.grocery || !categoryMap.cosmetics || !categoryMap.hygiene) return;

    Object.values(categoryMap).forEach(grid => grid.innerHTML = "");

    PRODUCTS.forEach(p => {
        const grid = categoryMap[p.category];
        if (!grid) return;

        const pid = makeId(p.name);

        grid.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>

                <div class="qty-box">
                    <button class="qty-btn" onclick="decreaseQty('${pid}')">-</button>
                    <span id="${pid}_qty" class="qty-number">0</span>
                    <button class="qty-btn" onclick="increaseQty('${pid}')">+</button>
                </div>

                <button class="add-btn"
                    onclick="addToCartQty('${p.name} - ₹${p.price}', '${pid}')">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

// ==================================================
// HOME PAGE: POPULAR PRODUCTS ONLY
// ==================================================

function renderHomeProducts() {
    const homeContainer = document.getElementById("home-products");
    if (!homeContainer) return;

    homeContainer.innerHTML = "";

    PRODUCTS.filter(p => p.popular).forEach(p => {
        const pid = makeId(p.name);

        homeContainer.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>

                <div class="qty-box">
                    <button class="qty-btn" onclick="decreaseQty('${pid}')">-</button>
                    <span id="${pid}_qty" class="qty-number">0</span>
                    <button class="qty-btn" onclick="increaseQty('${pid}')">+</button>
                </div>

                <button onclick="addToCartQty('${p.name} - ₹${p.price}', '${pid}')"
                        class="qty-btn" style="margin-top:10px;">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

// ==================================================
// INIT
// ==================================================

document.addEventListener("DOMContentLoaded", loadProducts);
