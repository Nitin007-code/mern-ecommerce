import React, { useEffect, useState } from "react";
import axios from "axios";
import { ImagePlus, Save, X } from "lucide-react";

const blankProduct = { name: "", description: "", price: "", category: "Electronics", stock: "", image: "" };

export default function ProductForm({ initialProduct, onSave, submitLabel = "Create product" }) {
  const [form, setForm] = useState(blankProduct);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const next = initialProduct
      ? { ...blankProduct, ...initialProduct, price: initialProduct.price ?? "", stock: initialProduct.stock ?? "" }
      : blankProduct;
    setForm(next);
    setPreview(next.image || "");
  }, [initialProduct]);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const chooseFile = (event) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      let image = form.image;

      if (file) {
        const data = new FormData();
        data.append("image", file);
        const response = await axios.post("http://localhost:5000/api/upload", data, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        image = response.data.imageUrl;
      }

      if (!image) throw new Error("Choose an image file or provide an image URL.");
      await onSave({ ...form, image, price: Number(form.price), stock: Number(form.stock) }, token);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="product-form" onSubmit={submit}>
      <div className="product-form-fields">
        <label>
          Product name
          <input name="name" value={form.name} onChange={update} required />
        </label>

        <label>
          Category
          <select name="category" value={form.category} onChange={update}>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Footwear</option>
            <option>Accessories</option>
            <option>Home & Living</option>
            <option>Gaming</option>
          </select>
        </label>

        <label>
          Price (₹)
          <input name="price" min="0" type="number" value={form.price} onChange={update} required />
        </label>

        <label>
          Stock quantity
          <input name="stock" min="0" type="number" value={form.stock} onChange={update} required />
        </label>

        <label className="wide">
          Description
          <textarea name="description" value={form.description} onChange={update} required />
        </label>

        <label className="wide">
          Image URL
          <small>(optional if you upload a file)</small>
          <input
            name="image"
            type="url"
            value={form.image}
            onChange={(event) => {
              update(event);
              if (!file) setPreview(event.target.value);
            }}
            placeholder="https://…"
          />
        </label>
      </div>

      <div className="product-image-picker">
        <div className="image-preview">
          {preview ? (
            <img src={preview} onError={() => setPreview("")} alt="Product preview" />
          ) : (
            <ImagePlus size={30} />
          )}
        </div>

        <label className="file-button">
          <ImagePlus size={17} /> Choose image
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseFile} />
        </label>

        {file && (
          <button
            type="button"
            className="clear-file"
            onClick={() => {
              setFile(null);
              setPreview(form.image);
            }}
          >
            <X size={15} /> Remove file
          </button>
        )}
      </div>

      {error && <p className="auth-error">{error}</p>}

      <button className="primary-btn form-submit" disabled={saving}>
        <Save size={17} /> {saving ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
