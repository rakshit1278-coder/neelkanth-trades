const GITHUB_API =
  "https://api.github.com/repos/rakshit1278-coder/neelkanth-trades/contents/data/products";

async function loadProductsFromCMS() {
  try {
    const res = await fetch(GITHUB_API);
    const files = await res.json();

    const productFiles = files.filter(f => f.name.endsWith(".json"));

    let PRODUCTS = [];

    for (let file of productFiles) {
      const fileRes = await fetch(file.download_url);
      const product = await fileRes.json();
      PRODUCTS.push(product);
    }

    renderProducts(PRODUCTS);
    renderHomeProducts(PRODUCTS);

  } catch (err) {
    console.error("Failed to load products", err);
  }
}

// ================= RENDER =================

function renderProducts(PRODUCTS) {
  const categoryMap = {
    grocery: document.getElementById("groceryProducts"),
    cosmetics: document.getElementById("cosmeticsProducts"),
    hygiene: document.getElementById("hygieneProducts")
  };

  Object.values(categoryMap).forEach(g => g && (g.innerHTML = ""));

  PRODUCTS.forEach(p => {
    const grid = categoryMap[p.category];
    if (!grid || p.active === false) return;

    const id = p.name.replace(/\s+/g, "_").toLowerCase();

    grid.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>

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

function renderHomeProducts(PRODUCTS) {
  const homeContainer = document.getElementById("home-products");
  if (!homeContainer) return;

  homeContainer.innerHTML = "";

  PRODUCTS.filter(p => p.popular).forEach(p => {
    const id = p.name.replace(/\s+/g, "_").toLowerCase();

    homeContainer.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}">
        <h4>${p.name}</h4>

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

document.addEventListener("DOMContentLoaded", loadProductsFromCMS);
