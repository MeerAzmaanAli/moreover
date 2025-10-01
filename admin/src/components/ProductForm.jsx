import React, { useState } from "react";
import "./productForm.css"
import { addProduct } from "../utils/services";
const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    categories: [""],
    attributes: {},
    tags: [""],
    variants:[],
    seo: {
      title: "",
      description: "",
      keywords: [""],
    },
    status: "active",
  });

  // Handle simple field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle SEO change
  const handleSeoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      seo: { ...prev.seo, [name]: value },
    }));
  };

  // Handle array updates (categories, tags, keywords)
  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Handle attributes (key-value)
  const handleAttributeChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [key]: value },
    }));
  };

  const removeAttribute = (key) => {
    const updated = { ...formData.attributes };
    delete updated[key];
    setFormData((prev) => ({ ...prev, attributes: updated }));
  };

  // Submit handler
  const handleSubmit = async(e) => {
    e.preventDefault();
   try{ 
    const res = await addProduct(formData)
    console.log(res)
    if(res.ok){
      setFormData({
        name: "",
        slug: "",
        description: "",
        categories: [""],
        attributes: {},
        tags: [""],
        variants:[],
        seo: {
          title: "",
          description: "",
          keywords: [""],
        },
        status: "active",
      })
     }
    }catch(error){
      console.log(error)
    }
  };

  return (
    <div className="forms">
    <form className="product-form">
      <h2>Add Product</h2>

      {/* Name */}
      <label>Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      {/* Slug */}
      <label>Slug</label>
      <input
        type="text"
        name="slug"
        value={formData.slug}
        onChange={handleChange}
        required
      />

      {/* Description */}
      <label>Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      {/* Categories */}
      <label>Categories</label>
      {formData.categories.map((cat, idx) => (
        <div key={idx} className="array-item">
          <input
            type="text"
            value={cat}
            onChange={(e) => handleArrayChange("categories", idx, e.target.value)}
          />
          <button type="button" onClick={() => removeArrayItem("categories", idx)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => addArrayItem("categories")}>
        Add Category
      </button>

      {/* Attributes */}
      <label>Attributes</label>
      {Object.entries(formData.attributes).map(([key, value], idx) => (
        <div key={idx} className="array-item">
          <input
            type="text"
            placeholder="Key"
            value={key}
            onChange={(e) => {
              const newKey = e.target.value;
              const newAttrs = { ...formData.attributes };
              newAttrs[newKey] = newAttrs[key];
              delete newAttrs[key];
              setFormData((prev) => ({ ...prev, attributes: newAttrs }));
            }}
          />
          <input
            type="text"
            placeholder="Value"
            value={value}
            onChange={(e) => handleAttributeChange(key, e.target.value)}
          />
          <button type="button" onClick={() => removeAttribute(key)}>Remove</button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => handleAttributeChange("", "")}
      >
        Add Attribute
      </button>

      {/* Tags */}
      <label>Tags</label>
      {formData.tags.map((tag, idx) => (
        <div key={idx} className="array-item">
          <input
            type="text"
            value={tag}
            onChange={(e) => handleArrayChange("tags", idx, e.target.value)}
          />
          <button type="button" onClick={() => removeArrayItem("tags", idx)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => addArrayItem("tags")}>
        Add Tag
      </button>

      {/* SEO */}
      <h3>SEO</h3>
      <label>SEO Title</label>
      <input
        type="text"
        name="title"
        value={formData.seo.title}
        onChange={handleSeoChange}
      />

      <label>SEO Description</label>
      <textarea
        name="description"
        value={formData.seo.description}
        onChange={handleSeoChange}
      />

      <label>SEO Keywords</label>
      {formData.seo.keywords.map((kw, idx) => (
        <div key={idx} className="array-item">
          <input
            type="text"
            value={kw}
            onChange={(e) =>
              setFormData((prev) => {
                const updated = [...prev.seo.keywords];
                updated[idx] = e.target.value;
                return { ...prev, seo: { ...prev.seo, keywords: updated } };
              })
            }
          />
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                seo: {
                  ...prev.seo,
                  keywords: prev.seo.keywords.filter((_, i) => i !== idx),
                },
              }))
            }
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setFormData((prev) => ({
            ...prev,
            seo: { ...prev.seo, keywords: [...prev.seo.keywords, ""] },
          }))
        }
      >
        Add Keyword
      </button>

      {/* Status */}
      <label>Status</label>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
      {/* Submit */}
      <button type="submit" onClick={handleSubmit}>Save Product</button>
    </form>
    
    </div>
  );
};

export default ProductForm;
