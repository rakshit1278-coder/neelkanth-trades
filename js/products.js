let PRODUCTS = [];

async function loadProducts() {
  try {
    const res = await fetch("/data/products/index.json");
    PRODUCTS = await res.json();

    renderProducts();
    renderHomeProducts();
  } catch (err) {
    console.error("Failed to load products:", err);
  }
}

// =============================
// RENDER SHOP PRODUCTS
// =============================
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

    grid.innerHTML += `
      <div class="product-card">
        <img src="img/products/${p.image || 'no-image.jpg'}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>MRP: ₹${p.mrp}</p>

        <div class="qty-box">
          <button onclick="decreaseQty('${p.name}')">-</button>
          <span id="${p.name}_qty">0</span>
          <button onclick="increaseQty('${p.name}')">+</button>
        </div>

        <button onclick="addToCartQty('${p.name}', '${p.name}')">
          Add to Cart
        </button>
      </div>
    `;
  });
}

// =============================
// HOME POPULAR PRODUCTS
// =============================
function renderHomeProducts() {
  const homeContainer = document.getElementById("home-products");
  if (!homeContainer) return;

  homeContainer.innerHTML = "";

  PRODUCTS.filter(p => p.popular).forEach(p => {
    homeContainer.innerHTML += `
      <div class="product-card">
        <img src="img/products/${p.image || 'no-image.jpg'}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>MRP: ₹${p.mrp}</p>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", loadProducts);
