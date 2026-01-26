let PRODUCTS = [];

async function loadProducts() {
  // Fetch list of product files from GitHub raw (Netlify can't list folders)
  const res = await fetch("https://raw.githubusercontent.com/rakshit1278-coder/neelkanth-trades/main/data/products/index.json");
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

    grid.innerHTML += `
      <div class="product-card">
        <img src="img/${p.image || 'no-image.png'}" alt="${p.name}">
        <h4>${p.name}</h4>

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
        <img src="img/${p.image || 'no-image.png'}" alt="${p.name}">
        <h4>${p.name}</h4>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", loadProducts);
