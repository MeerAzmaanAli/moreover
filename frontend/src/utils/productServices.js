// src/services/productService.js
const API_BASE = "https://moreover-backend.onrender.com/api/products";

// Get all products
export const getAllProducts = async () => {
  const res = await fetch(`${API_BASE}/`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products;

};

export const getAllVariants = async (productId="") => {
  const res = await fetch(`${API_BASE}/variants/${productId}`);
  if (!res.ok) throw new Error("Failed to fetch variants");
  const data = await res.json();
  return data.variants;
};

// Get products by category
export const getProductsByCategory = async (category) => {
  const res = await fetch(`${API_BASE}/filter/categories/${category}`);
  console.log("Requesting:", `${API_BASE}/filter/categories/${category}`);
  if (!res.ok) {
    const errText = await res.text();
    console.error("Error response:", errText);
    throw new Error("Failed to fetch products by category");
  }
  return res.json();
};


// Get products by tag
export const getProductsByTag = async (tag) => {
  const res = await fetch(`${API_BASE}/filter/tags/${tag}`);
  if (!res.ok) throw new Error("Failed to fetch products by tag");
  return res.json();
};

// Get single product by ID
export const getSingleProduct = async (id) => {
  const res = await fetch(`${API_BASE}/product/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const data = await res.json();
  return data.product;
};
export const getSingleVariant = async (id) => {
  const res = await fetch(`${API_BASE}/variant/${id}`);
  //if (!res.ok) throw new Error("Failed to fetch variant");
 const data = await res.json();
  return data.variant;
};

// Add product
export const addProduct = async (productData) => {
  const res = await fetch(`${API_BASE}/add/product/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
};

// Add variant
export const addVariant = async (variantData) => {
  const res = await fetch(`${API_BASE}/add/variant/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(variantData),
  });
  if (!res.ok) throw new Error("Failed to add variant");
  return res.json();
};

// Update product
export const updateProduct = async (id, updateData) => {
  const res = await fetch(`${API_BASE}/update/product/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};

// Update variant
export const updateVariant = async (id, updateData) => {
  const res = await fetch(`${API_BASE}/update/variant/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error("Failed to update variant");
  return res.json();
};

// Delete product
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE}/delete/product/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
};

// Delete variant
export const deleteVariant = async (id) => {
  const res = await fetch(`${API_BASE}/delete/variant/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete variant");
  return res.json();
};

export const searchProducts = async (query) => {
  const res = await fetch(`${API_BASE}/search?q=${query}`);
  if (!res.ok) throw new Error("Failed to search products");
  return res.json();
}
