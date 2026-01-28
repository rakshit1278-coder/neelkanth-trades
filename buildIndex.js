const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "data/products");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));

const allProducts = files.map(f => {
  const data = fs.readFileSync(path.join(dir, f), "utf-8");
  return JSON.parse(data);
});

fs.writeFileSync(
  path.join(dir, "index.json"),
  JSON.stringify(allProducts, null, 2)
);

console.log("index.json created with", allProducts.length, "products");
