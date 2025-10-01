import React, { useState } from "react";
import "./variantForm.css";
import { addvariant } from "../utils/services";
import imageCompression from 'browser-image-compression';

const CLOUDINARY_UPLOAD_PRESET = "Moreover";
const CLOUDINARY_CLOUD_NAME = "dknbm49rl";

const VariantForm = ({productId}) => {
  const [formData, setFormData] = useState({
    productId:productId,
    sku: "",
    color: "",
    size: [""],
    price: "",
    discountPrice: "",
    currency: "INR",
    stock: "",
    sold: 0,
    images: [""],
    additionalAttributes: {},
  });
  const [selectedImages, setSelectedImages] = useState([]);

  // Simple field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Array field change (size, images)
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

  // Additional attributes
  const handleAttributeChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      additionalAttributes: { ...prev.additionalAttributes, [key]: value },
    }));
  };

  const removeAttribute = (key) => {
    const updated = { ...formData.additionalAttributes };
    delete updated[key];
    setFormData((prev) => ({ ...prev, additionalAttributes: updated }));
  };

 const handleImageChange = async (file, idx) => {
  try {
    console.log('compressing file ',file)
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,        // keep it under 1MB
      maxWidthOrHeight: 1920, // resize large images
      useWebWorker: true,
    });
    console.log('compressed!! ')
    const updated = [...selectedImages];
    updated[idx] = compressedFile;
    setSelectedImages(updated);
  } catch (error) {
    console.error("Image compression error:", error);
  }
};

  const addImageSlot = () => {
    setSelectedImages((prev) => [...prev, null]);
  };

  const removeImageSlot = (idx) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
  };


  const uploadToCloudinary = async (file) => {
    try {
      const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`; // <-- fixed
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary response error:", data);
        throw new Error(data.error?.message || "Image upload failed");
      }

      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };


  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
       // upload all images first
      const urls = await Promise.all(
          selectedImages.map((file) => (file ? uploadToCloudinary(file) : null))
      );

    // update formData with cloud URLs
    const updatedFormData = { ...formData, images: urls.filter(Boolean) };
      const res = await addvariant(updatedFormData)
      console.log(res)
      if(res.ok){
        setFormData({
          sku: "",
          color: "",
          size: [""],
          price: "",
          discountPrice: "",
          currency: "INR",
          stock: "",
          sold: 0,
          images: [""],
          additionalAttributes: {},
        })
      }
    }catch(error){
      console.log(error)
    }
  };

  return (
    <form className="variant-form">
      <h2>Add Variant</h2>

      {/* SKU */}
      <label>SKU</label>
      <input
        type="text"
        name="sku"
        value={formData.sku}
        onChange={handleChange}
        required
      />

      {/* Color */}
      <label>Color</label>
      <input
        type="text"
        name="color"
        value={formData.color}
        onChange={handleChange}
        required
      />

      {/* Size */}
      <label>Sizes</label>
      {formData.size.map((s, idx) => (
        <div key={idx} className="array-item">
          <input
            type="text"
            value={s}
            onChange={(e) => handleArrayChange("size", idx, e.target.value)}
          />
          <button type="button" onClick={() => removeArrayItem("size", idx)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => addArrayItem("size")}>
        Add Size
      </button>

      {/* Price */}
      <label>Price</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        required
      />

      {/* Discount Price */}
      <label>Discount Price</label>
      <input
        type="number"
        name="discountPrice"
        value={formData.discountPrice}
        onChange={handleChange}
      />

      {/* Currency */}
      <label>Currency</label>
      <input
        type="text"
        name="currency"
        value={formData.currency}
        onChange={handleChange}
      />

      {/* Stock */}
      <label>Stock</label>
      <input
        type="number"
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        required
      />

      {/* Sold */}
      <label>Sold</label>
      <input
        type="number"
        name="sold"
        value={formData.sold}
        onChange={handleChange}
        min="0"
      />

       {/* Images */}
      <label>Images</label>
      {selectedImages.map((file, idx) => (
        <div key={idx} className="array-item">
          {/* Preview */}
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt={`preview-${idx}`}
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files[0], idx)}
          />

          <button type="button" onClick={() => removeImageSlot(idx)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={addImageSlot}>
        Add Image
      </button>


      {/* Additional Attributes */}
      <h3>Additional Attributes</h3>
      {Object.entries(formData.additionalAttributes).map(([key, value], idx) => (
        <div key={idx} className="attr-pair">
          <input
            type="text"
            placeholder="Key"
            value={key}
            onChange={(e) => {
              const newKey = e.target.value;
              const updated = { ...formData.additionalAttributes };
              updated[newKey] = updated[key];
              delete updated[key];
              setFormData((prev) => ({
                ...prev,
                additionalAttributes: updated,
              }));
            }}
          />
          <input
            type="text"
            placeholder="Value"
            value={value}
            onChange={(e) => handleAttributeChange(key, e.target.value)}
          />
          <button type="button" onClick={() => removeAttribute(key)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={() => handleAttributeChange("", "")}>
        Add Attribute
      </button>

      {/* Submit */}
      <button type="submit" onClick={handleSubmit}>Save Variant</button>
    </form>
  );
};

export default VariantForm;
