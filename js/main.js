// --------------------------------------------------
// CART INITIAL SETUP
// --------------------------------------------------

let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

function saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(cart));
}

function updateCartCount() {
    let count = cart.reduce((sum, item) => sum + item.qty, 0);
    let cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.innerText = count;
}

// --------------------------------------------------
// QUANTITY BUTTONS
// --------------------------------------------------

function increaseQty(id) {
    const span = document.getElementById(id + "_qty");
    if (!span) return;
    span.innerText = parseInt(span.innerText) + 1;
}

function decreaseQty(id) {
    const span = document.getElementById(id + "_qty");
    if (!span) return;
    let current = parseInt(span.innerText);
    if (current > 0) span.innerText = current - 1;
}

// --------------------------------------------------
// ADD TO CART
// --------------------------------------------------

function addToCartQty(productName, productId) {
  let qtyInput = document.getElementById(productId + "_qty");
  let qty = parseInt(qtyInput.value || qtyInput.innerText);

  if (!qty || qty <= 0) return;

  // rest of your existing cart code stays SAME
}

    let existing = cart.find(item => item.name === productName);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name: productName, qty });
    }

    saveCart();
    updateCartCount();
    alert(productName + " added x " + qty);
}

// --------------------------------------------------
// SEARCH (WORKS WITH DYNAMIC PRODUCTS)
// --------------------------------------------------

function filterProductsBySearch(query) {
    query = query.toLowerCase().trim();

    document.querySelectorAll(".product-card").forEach(card => {
        if (query === "") {
            card.style.display = "block";
            return;
        }

        const name = card.querySelector("h4")?.innerText.toLowerCase() || "";
        card.style.display = name.includes(query) ? "block" : "none";
    });
}

// --------------------------------------------------
// SEARCH SUGGESTIONS + SEARCH BUTTON
// --------------------------------------------------

function handleSearch(query) {
    filterProductsBySearch(query);
    showSearchSuggestions(query);
}

function showSearchSuggestions(query) {
    const box = document.getElementById("searchSuggestions");
    if (!box) return;

    query = query.toLowerCase().trim();
    box.innerHTML = "";

    if (query === "") {
        box.style.display = "none";
        return;
    }

    const matches = [];

    document.querySelectorAll(".product-card h4").forEach(h4 => {
        const name = h4.innerText.trim();
        if (name.toLowerCase().includes(query)) {
            matches.push(name);
        }
    });

    if (matches.length === 0) {
        box.style.display = "none";
        return;
    }

    matches.forEach(name => {
        const div = document.createElement("div");
        div.innerText = name;
        div.onclick = () => {
            document.getElementById("shopSearchInput").value = name;
            filterProductsBySearch(name);
            box.style.display = "none";
        };
        box.appendChild(div);
    });

    box.style.display = "block";
}

// --------------------------------------------------
// CART PAGE
// --------------------------------------------------

function loadCartItems() {
    const table = document.getElementById("cartTable");
    if (!table) return;

    table.innerHTML = "";
    cart.forEach((item, index) => {
        table.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td><button onclick="removeItem(${index})">Remove</button></td>
            </tr>`;
    });

    updateCartCount();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    loadCartItems();
}

// --------------------------------------------------
// CHECKOUT
// --------------------------------------------------

function submitOrder() {
    const name = document.getElementById("customerName")?.value.trim();
    const phone = document.getElementById("customerPhone")?.value.trim();

    if (!name || !phone) {
        alert("Please enter name and phone number!");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = `New Order from ${name} (${phone}):%0A%0A`;
    cart.forEach(item => {
        message += `${item.name} x ${item.qty}%0A`;
    });

    window.open(`https://wa.me/919416110032?text=${message}`, "_blank");

    cart = [];
    saveCart();
    updateCartCount();
    alert("Order placed successfully!");
    window.location.href = "index.html";
}

// --------------------------------------------------
// ON LOAD
// --------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});

