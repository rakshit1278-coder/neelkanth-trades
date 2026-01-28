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
    console.error("Error loading products:", err);
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
    if (!p.active) return;

    const grid = categoryMap[p.category];
    if (!grid) return;

    const safeId = p.name.replace(/[^a-zA-Z0-9]/g, "_");

    grid.innerHTML += `
      <div class="product-card">
        <img src="img/${encodeURIComponent(p.image || 'no-image.jpg')}" alt="${p.name}">
        <h4>${p.name}</h4>

        <div class="qty-box">
          <button class="qty-btn" onclick="changeQty('${safeId}', -1)">−</button>

          <input 
            type="number" 
            min="0" 
            value="0"
            id="${safeId}_qty"
            class="qty-input"
            oninput="onManualQty('${safeId}')"
          />

          <button class="qty-btn" onclick="changeQty('${safeId}', 1)">+</button>
        </div>

        <button 
          class="add-btn"
          id="${safeId}_addBtn"
          style="display:none;margin-top:8px;"
          onclick="confirmManualQty('${safeId}')">
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

  PRODUCTS.filter(p => p.popular && p.active).forEach(p => {
    homeContainer.innerHTML += `
      <div class="product-card">
        <img src="img/${encodeURIComponent(p.image || 'no-image.jpg')}" alt="${p.name}">
        <h4>${p.name}</h4>
      </div>
    `;
  });
}

// =============================
// QTY LOGIC
// =============================

// + / - = instant cart update
function changeQty(id, delta) {
  const input = document.getElementById(id + "_qty");
  let currentQty = parseInt(input.value) || 0;
  let newQty = currentQty + delta;
  if (newQty < 0) return;

  input.value = newQty;
  document.getElementById(id + "_addBtn").style.display = "none";
  updateCartFromQty(id, newQty);
}

// manual typing = show Add button
function onManualQty(id) {
  const btn = document.getElementById(id + "_addBtn");
  btn.style.display = "inline-block";
}

// confirm manual qty
function confirmManualQty(id) {
  const input = document.getElementById(id + "_qty");
  let qty = parseInt(input.value) || 0;
  document.getElementById(id + "_addBtn").style.display = "none";
  updateCartFromQty(id, qty);
}

// common cart update
function updateCartFromQty(id, qty) {
  const product = PRODUCTS.find(p => p.name.replace(/[^a-zA-Z0-9]/g, "_") === id);
  if (!product) return;

  if (qty === 0) {
    removeFromCart(product.name);
  } else {
    addToCartQty(product.name, product.name, qty);
  }
}

// =============================
document.addEventListener("DOMContentLoaded", loadProducts);
