const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// FILE NAME (your excel)
const EXCEL_FILE = "cleaned_products.xlsx";
const OUTPUT_FOLDER = "data/products";

// Create folder if not exists
if (!fs.existsSync(OUTPUT_FOLDER)) {
  fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
}

// Read Excel
const workbook = XLSX.readFile(EXCEL_FILE);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet);

// Delete old json files
fs.readdirSync(OUTPUT_FOLDER).forEach(file => {
  if (file.endsWith(".json")) fs.unlinkSync(path.join(OUTPUT_FOLDER, file));
});

rows.forEach((row) => {
  const name = row.Name?.toString().trim();
  if (!name) return;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const product = {
    name: name,
    category: row.Category || "grocery",
    mrp: Number(row.MRP) || 0,
    stock: Number(row.Stock) || 0,
    popular: row.Popular === true || row.Popular === "true",
    active: row.Active !== false,
    image: row.Image || ""
  };

  const filePath = path.join(OUTPUT_FOLDER, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(product, null, 2));
});

console.log("✅ Products converted from Excel to JSON");
