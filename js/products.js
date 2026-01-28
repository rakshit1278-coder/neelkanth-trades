let PRODUCTS = [];

// =============================
// LOAD PRODUCTS
// =============================
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

    const safeId = encodeURIComponent(p.name);

    grid.innerHTML += `
      <div class="product-card">
        <img src="img/${encodeURIComponent(p.image || 'no-image.jpg')}" alt="${p.name}">
        <h4>${p.name}</h4>

        <div class="qty-box">
          <button onclick="changeQty('${safeId}', -1)">-</button>
          <input type="number" id="${safeId}_qty" value="0" min="0">
          <button onclick="changeQty('${safeId}', 1)">+</button>
        </div>

        <button onclick="addToCartFromInput('${safeId}', '${p.name}')">
          Add to Cart
        </button>
      </div>
    `;
  });
}

// =============================
// CHANGE QTY
// =============================
function changeQty(id, delta) {
  const input = document.getElementById(id + "_qty");
  let val = parseInt(input.value) || 0;
  val += delta;
  if (val < 0) val = 0;
  input.value = val;
}

// =============================
// ADD TO CART FROM INPUT
// =============================
function addToCartFromInput(id, name) {
  const input = document.getElementById(id + "_qty");
  const qty = parseInt(input.value) || 0;

  if (qty <= 0) {
    alert("Enter quantity first");
    return;
  }

  addToCart(name, qty);
  input.value = 0;
}

// =============================
// HOME PRODUCTS
// =============================
function renderHomeProducts() {
  const homeContainer = document.getElementById("home-products");
  if (!homeContainer) return;

  homeContainer.innerHTML = "";

  PRODUCTS.filter(p => p.popular).forEach(p => {
    const safeId = encodeURIComponent(p.name);

    homeContainer.innerHTML += `
      <div class="product-card">
        <img src="img/${encodeURIComponent(p.image || 'no-image.jpg')}" alt="${p.name}">
        <h4>${p.name}</h4>

        <div class="qty-box">
          <button onclick="changeQty('${safeId}', -1)">-</button>
          <input type="number" id="${safeId}_qty" value="0" min="0">
          <button onclick="changeQty('${safeId}', 1)">+</button>
        </div>

        <button onclick="addToCartFromInput('${safeId}', '${p.name}')">
          Add to Cart
        </button>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", loadProducts);
