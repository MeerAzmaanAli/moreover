const API_BASE="http://localhost:5000/api/";

export const getAllVariants = async (productId="-1") => {
  const res = await fetch(`${API_BASE}products/variants/${productId}`);
  if (!res.ok) throw new Error("Failed to fetch variants");
  const data = await res.json();
  return data.variants;
};
export const getAllProducts = async () => {
  const res = await fetch(`${API_BASE}products/`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products;

};

export const getSingleProduct = async (id) => {
  const res = await fetch(`${API_BASE}products/product/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const data = await res.json();
  return data.product;
};

export const addProduct = async (productData) => {
  const res = await fetch(`${API_BASE}products/add/product/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error("Failed to add product");
  const data = await res.json();
  return data.product;
}

export const addvariant = async (variantData) => {
  const res = await fetch(`${API_BASE}products/add/variant/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(variantData),
  });
  if (!res.ok) throw new Error("Failed to add variant");
  const data = await res.json();
  return data.variant;
}

// Delete product
export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE}products/delete/product/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
};

// Delete variant
export const deleteVariant = async (id) => {
  const res = await fetch(`${API_BASE}products/delete/variant/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete variant");
  return res.json();
};