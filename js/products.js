let PRODUCTS = [];

// =============================
// LOAD PRODUCTS
// =============================
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
    grocery: document.getElementById("groceryProducts"),
    cosmetics: document.getElementById("cosmeticsProducts"),
    hygiene: document.getElementById("hygieneProducts")
  };

  if (!categoryMap.grocery || !categoryMap.cosmetics || !categoryMap.hygiene) return;

  Object.values(categoryMap).forEach(grid => grid.innerHTML = "");

  PRODUCTS.forEach(p => {
    const grid = categoryMap[p.category];
    if (!grid) return;

    const safeId = encodeURIComponent(p.name);

    grid.innerHTML += `
      <div class="product-card">
        <img src="img/${encodeURIComponent(p.image || "no-image.jpg")}" alt="${p.name}">
        <h4>${p.name}</h4>

        <div class="qty-box">
          <button class="qty-btn" onclick="changeQty('${safeId}', -1)">-</button>
          <input type="number" id="${safeId}_qty" value="0" min="0">
          <button class="qty-btn" onclick="changeQty('${safeId}', 1)">+</button>
        </div>

        <button class="add-btn" onclick="addToCartFromInput('${safeId}', '${p.name}')">
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
  if (!input) return;

  let val = parseInt(input.value) || 0;
  val += delta;
  if (val < 0) val = 0;
  input.value = val;

  const card = input.closest(".product-card");

  if (val > 0) {
    card.classList.add("selected");
  } else {
    card.classList.remove("selected");
  }
}
  

// =============================
// ADD TO CART FROM INPUT
// =============================
function addToCartFromInput(id, name) {
  const input = document.getElementById(id + "_qty");
  if (!input) return;

  const qty = parseInt(input.value) || 0;
  if (qty <= 0) return;

  addToCartQty(name, id);

  const card = input.closest(".product-card");
  card.classList.add("added");
  setTimeout(() => card.classList.remove("added"), 300);

  input.value = 0;
  card.classList.remove("selected");
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
        <img src="img/${encodeURIComponent(p.image || "no-image.jpg")}" alt="${p.name}">
        <h4>${p.name}</h4>

        <div class="qty-box">
          <button class="qty-btn" onclick="changeQty('${safeId}', -1)">-</button>
          <input type="number" id="${safeId}_qty" value="0" min="0">
          <button class="qty-btn" onclick="changeQty('${safeId}', 1)">+</button>
        </div>

        <button class="add-btn" onclick="addToCartFromInput('${safeId}', '${p.name}')">
          Add to Cart
        </button>
      </div>
    `;
  });
}

// =============================
document.addEventListener("DOMContentLoaded", loadProducts);
