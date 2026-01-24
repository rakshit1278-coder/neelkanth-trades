// ==================================================
// LOAD PRODUCTS FROM CMS (data/products/*.json)
// ==================================================

let PRODUCTS = [];

async function loadProducts() {
    try {
        const response = await fetch("/data/products/");
        const text = await response.text();

        // Get all json file names from directory listing
        const files = [...text.matchAll(/href="([^"]+\.json)"/g)]
            .map(m => m[1])
            .filter(f => !f.includes("keep"));

        const requests = files.map(f => fetch("/data/products/" + f).then(r => r.json()));
        PRODUCTS = await Promise.all(requests);

        renderProducts();
        renderHomeProducts();
    } catch (err) {
        console.error("Failed to load products from CMS", err);
    }
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

        const id = p.name.toLowerCase().replace(/\s+/g, "_");

        grid.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>

                <div class="qty-box">
                    <button class="qty-btn" onclick="decreaseQty('${id}')">-</button>
                    <span id="${id}_qty" class="qty-number">0</span>
                    <button class="qty-btn" onclick="increaseQty('${id}')">+</button>
                </div>

                <button class="add-btn"
                    onclick="addToCartQty('${p.name} - ₹${p.price}', '${id}')">
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
        const id = p.name.toLowerCase().replace(/\s+/g, "_");

        homeContainer.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>

                <div class="qty-box">
                    <button class="qty-btn" onclick="decreaseQty('${id}')">-</button>
                    <span id="${id}_qty" class="qty-number">0</span>
                    <button class="qty-btn" onclick="increaseQty('${id}')">+</button>
                </div>

                <button onclick="addToCartQty('${p.name} - ₹${p.price}', '${id}')"
                        class="qty-btn" style="margin-top:10px;">
                    Add to Cart
                </button>
            </div>
        `;
    });
}

// ==================================================

document.addEventListener("DOMContentLoaded", loadProducts);
