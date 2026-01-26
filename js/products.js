let PRODUCTS = [];

async function loadProducts() {
  const res = await fetch("/data/products/index.json");
  const files = await res.json();

  const productPromises = files.map(file =>
    fetch(`/data/products/${file}`).then(r => r.json())
  );

  PRODUCTS = await Promise.all(productPromises);

  renderProducts();
  renderHomeProducts();
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

    const imageFile = p.image?.src || p.image || "no-image.png";

    grid.innerHTML += `
      <div class="product-card">
        <img src="img/${imageFile}" alt="${p.name}">
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
    const imageFile = p.image?.src || p.image || "no-image.png";

    homeContainer.innerHTML += `
      <div class="product-card">
        <img src="img/${imageFile}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>MRP: ₹${p.mrp}</p>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", loadProducts);
