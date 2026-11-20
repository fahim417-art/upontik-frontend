"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react";

export default function AdminProductsPage() {
  const { showToast } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("10");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [secondaryImageUrl, setSecondaryImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [status, setStatus] = useState("published");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch {
      showToast("Failed to fetch products", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
        if (data.data.length > 0 && !categoryId) {
          setCategoryId(String(data.data[0]._id));
        }
      }
    } catch {}
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setName("");
    setSku(`UPK-BAG-${Math.floor(100 + Math.random() * 900)}`);
    setCategoryId(categories[0]?._id ? String(categories[0]._id) : "");
    setPrice("");
    setSalePrice("");
    setStock("12");
    setDescription("");
    setMaterials("Hand-spun cotton weave, reclaimed polished mahogany wood, brass alloy hardware.");
    setImageUrl("https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=85&w=800");
    setSecondaryImageUrl("https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800");
    setFeatured(false);
    setBestSeller(false);
    setNewArrival(true);
    setStatus("published");
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategoryId(
      p.categoryId?._id ? String(p.categoryId._id) : String(p.categoryId)
    );
    setPrice(String(p.price));
    setSalePrice(p.salePrice ? String(p.salePrice) : "");
    setStock(String(p.stock));
    setDescription(p.description);
    setMaterials(p.materials || "");
    setImageUrl(p.images?.[0]?.url || "");
    setSecondaryImageUrl(p.images?.[1]?.url || "");
    setFeatured(!!p.featured);
    setBestSeller(!!p.bestSeller);
    setNewArrival(!!p.newArrival);
    setStatus(p.status || "published");
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !price || !description || !imageUrl) {
      showToast("Please provide all required product fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        sku,
        categoryId,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : undefined,
        stock: parseInt(stock, 10) || 0,
        description,
        materials,
        featured,
        bestSeller,
        newArrival,
        status,
        images: [
          { url: imageUrl, alt: name, isMain: true },
          ...(secondaryImageUrl
            ? [{ url: secondaryImageUrl, alt: `${name} alternate`, isMain: false }]
            : []),
        ],
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/admin/products/${editingProduct._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(
          editingProduct ? "Product updated." : "New artisan product added.",
          "success"
        );
        setIsModalOpen(false);
        fetchProducts();
      } else {
        showToast(data.error || "Operation failed", "error");
      }
    } catch {
      showToast("Failed to save product", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this product?"))
      return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Product deleted successfully", "info");
        fetchProducts();
      } else {
        showToast(data.error || "Delete failed", "error");
      }
    } catch {
      showToast("Failed to delete product", "error");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sand/50 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Product Inventory
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Manage catalogue, BDT pricing, multi-angle images, and availability.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-2.5 px-5 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-charcoal-light shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-mustard" />
          <span>New Product</span>
        </button>
      </div>

      {/* Search and Table */}
      <div className="bg-ivory border border-sand/80 rounded-sm shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-sand flex items-center gap-3">
          <Search className="w-4 h-4 text-charcoal-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product title or SKU..."
            className="w-full bg-transparent text-xs text-charcoal focus:outline-none placeholder-charcoal-muted/60"
          />
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-charcoal-muted font-serif">
            Loading product roster...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-charcoal-muted">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-ivory-light border-b border-sand text-charcoal-muted uppercase tracking-editorial text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Piece</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Price (BDT)</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {filteredProducts.map((p) => {
                  const img =
                    p.images?.find((i: any) => i.isMain)?.url ||
                    p.images?.[0]?.url ||
                    "";
                  return (
                    <tr key={p._id || p.sku} className="hover:bg-sand/10 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3 min-w-[200px]">
                        <div className="relative w-10 h-12 rounded bg-sand/20 overflow-hidden shrink-0">
                          {img && (
                            <Image
                              src={img}
                              alt={p.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-medium text-charcoal">{p.name}</p>
                          <div className="flex gap-1.5 mt-0.5">
                            {p.featured && (
                              <span className="text-[9px] bg-mustard/20 text-mustard px-1 rounded font-bold">
                                Featured
                              </span>
                            )}
                            {p.bestSeller && (
                              <span className="text-[9px] bg-charcoal/10 text-charcoal px-1 rounded font-bold">
                                Best Seller
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-charcoal-muted">
                        {p.categoryId?.name || "Artisan Silhouette"}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-charcoal">
                        {p.sku}
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-charcoal">
                        {formatPrice(p.salePrice || p.price)}
                        {p.salePrice && p.salePrice < p.price && (
                          <span className="text-[10px] text-charcoal-muted line-through ml-1 font-normal">
                            {formatPrice(p.price)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            p.stock <= (p.lowStockThreshold || 5)
                              ? "text-red-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sand/40 text-charcoal">
                          {p.status || "published"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-charcoal hover:text-mustard transition-colors"
                            aria-label="Edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-1.5 text-charcoal hover:text-red-500 transition-colors"
                            aria-label="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative max-w-2xl mx-auto my-8 px-4">
            <div className="bg-ivory border border-sand shadow-elevated rounded-sm p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-sand mb-6">
                <h3 className="font-serif text-2xl text-charcoal font-normal">
                  {editingProduct ? "Edit Product" : "Create New Artisan Piece"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-charcoal hover:text-earth"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-charcoal mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Saffron Loom Dhol Bag"
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal mb-1">
                      SKU Code *
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value.toUpperCase())}
                      required
                      placeholder="e.g. UPK-DHOL-005"
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal uppercase font-mono focus:outline-none focus:border-mustard"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal mb-1">
                      Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                    >
                      {categories.map((c) => (
                        <option key={c._id || c.slug} value={String(c._id)}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal mb-1">
                      Price in BDT (৳) *
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      placeholder="3200"
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal mb-1">
                      Sale Price in BDT (Optional)
                    </label>
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder="2800"
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal mb-1">
                      Stock Inventory *
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-charcoal mb-1">
                      Publication Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium text-charcoal mb-1">
                      Primary Cover Image URL *
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      required
                      placeholder="https://..."
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium text-charcoal mb-1">
                      Secondary Hover Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={secondaryImageUrl}
                      onChange={(e) => setSecondaryImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium text-charcoal mb-1">
                      Product Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      required
                      placeholder="Describe the textile weave, wooden handles, and dimensions..."
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium text-charcoal mb-1">
                      Craftsmanship & Materials Note
                    </label>
                    <input
                      type="text"
                      value={materials}
                      onChange={(e) => setMaterials(e.target.value)}
                      placeholder="e.g. Hand-spun cotton weave, turned teak wood..."
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>

                  {/* Badges / Checkboxes */}
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="rounded border-sand accent-charcoal"
                      />
                      <span>Featured Collection</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bestSeller}
                        onChange={(e) => setBestSeller(e.target.checked)}
                        className="rounded border-sand accent-charcoal"
                      />
                      <span>Best Seller</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newArrival}
                        onChange={(e) => setNewArrival(e.target.checked)}
                        className="rounded border-sand accent-charcoal"
                      />
                      <span>New Arrival</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-sand flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2.5 px-5 border border-sand rounded text-charcoal hover:bg-sand/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-6 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-charcoal-light shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 text-mustard" />
                    <span>{isSubmitting ? "Saving..." : "Save Product"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
