"use client";

import React, { useState, useEffect, useRef } from "react";
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
  UploadCloud,
  ImageIcon,
  Sparkles,
  Percent,
  Truck,
  Check,
} from "lucide-react";

interface ProductImageItem {
  url: string;
  alt?: string;
  isMain: boolean;
}

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
  const [discountPercent, setDiscountPercent] = useState("0");
  const [stock, setStock] = useState("10");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState("");
  const [imagesList, setImagesList] = useState<ProductImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
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
    setDiscountPercent("0");
    setStock("12");
    setDescription("");
    setMaterials("Hand-spun cotton weave, reclaimed polished mahogany wood, brass alloy hardware.");
    setImagesList([]);
    setFeatured(false);
    setBestSeller(false);
    setNewArrival(true);
    setIsFreeShipping(false);
    setStatus("published");
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setCategoryId(p.categoryId?._id ? String(p.categoryId._id) : String(p.categoryId));
    setPrice(String(p.price));
    setSalePrice(p.salePrice ? String(p.salePrice) : "");
    if (p.price && p.salePrice && p.salePrice < p.price) {
      setDiscountPercent(String(Math.round(((p.price - p.salePrice) / p.price) * 100)));
    } else {
      setDiscountPercent(p.discountPercentage ? String(p.discountPercentage) : "0");
    }
    setStock(String(p.stock));
    setDescription(p.description);
    setMaterials(p.materials || "");

    const existingImages: ProductImageItem[] = (p.images || []).map((img: any, idx: number) => ({
      url: typeof img === "string" ? img : img.url,
      alt: img.alt || p.name,
      isMain: img.isMain ?? idx === 0,
    }));
    setImagesList(existingImages);

    setFeatured(!!p.featured);
    setBestSeller(!!p.bestSeller);
    setNewArrival(!!p.newArrival);
    setIsFreeShipping(!!p.isFreeShipping);
    setStatus(p.status || "published");
    setIsModalOpen(true);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      showToast("Please select valid image files (JPG, PNG, WEBP)", "error");
      return;
    }

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64 = loadEvent.target?.result as string;
        if (base64) {
          setImagesList((prev) => {
            const isFirst = prev.length === 0;
            return [...prev, { url: base64, alt: file.name, isMain: isFirst }];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const setMainImage = (index: number) => {
    setImagesList((prev) =>
      prev.map((item, idx) => ({
        ...item,
        isMain: idx === index,
      }))
    );
  };

  const removeImage = (index: number) => {
    setImagesList((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isMain)) {
        filtered[0].isMain = true;
      }
      return filtered;
    });
  };

  // Price & Discount Calculations
  const handlePriceChange = (val: string) => {
    setPrice(val);
    const p = parseFloat(val);
    const d = parseFloat(discountPercent);
    if (p > 0 && d > 0) {
      setSalePrice(String(Math.round(p * (1 - d / 100))));
    }
  };

  const handleDiscountChange = (val: string) => {
    setDiscountPercent(val);
    const d = parseFloat(val);
    const p = parseFloat(price);
    if (p > 0 && d >= 0 && d <= 100) {
      if (d > 0) {
        setSalePrice(String(Math.round(p * (1 - d / 100))));
      } else {
        setSalePrice("");
      }
    }
  };

  const handleSalePriceChange = (val: string) => {
    setSalePrice(val);
    const sp = parseFloat(val);
    const p = parseFloat(price);
    if (p > 0 && sp > 0 && sp < p) {
      setDiscountPercent(String(Math.round(((p - sp) / p) * 100)));
    } else if (!val || sp >= p) {
      setDiscountPercent("0");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !price || !description) {
      showToast("Please provide all required product fields", "error");
      return;
    }

    if (imagesList.length === 0) {
      showToast("Please upload at least one product image via drag-and-drop", "error");
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
        discountPercentage: discountPercent ? parseFloat(discountPercent) : 0,
        stock: parseInt(stock, 10) || 0,
        description,
        materials,
        featured,
        bestSeller,
        newArrival,
        isFreeShipping,
        status,
        images: imagesList.map((img, idx) => ({
          url: img.url,
          alt: img.alt || `${name} view ${idx + 1}`,
          isMain: img.isMain,
        })),
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
          editingProduct
            ? `Product "${payload.name}" updated!`
            : `Product "${payload.name}" created!`,
          "success"
        );
        setIsModalOpen(false);
        fetchProducts();
      } else {
        showToast(data.error || "Failed to save product", "error");
      }
    } catch {
      showToast("Failed to save product", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Are you sure you want to delete "${prodName}" from the catalogue?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`"${prodName}" deleted`, "success");
        fetchProducts();
      } else {
        showToast(data.error || "Failed to delete product", "error");
      }
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categorySlug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFC8]/70 dark:border-[#2C2620] gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#211D1A] dark:text-[#FAF6F0] font-normal">
            Product Inventory & Pricing
          </h1>
          <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1">
            Manage catalogue, BDT pricing, discount percentages, drag-and-drop imagery, and free delivery rules.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-2.5 px-5 bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-[#80644B] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#D49542] dark:text-[#0E0C0A]" />
          <span>New Product</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#1E1A16] px-3 py-2 rounded border border-[#E8DFC8]/60 dark:border-[#2C2620] max-w-md">
          <Search className="w-4 h-4 text-[#80644B] dark:text-[#D49542]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search piece by name, SKU, or category..."
            className="w-full bg-transparent text-xs text-[#211D1A] dark:text-[#FAF6F0] focus:outline-none placeholder-[#80644B]/60 dark:placeholder-[#A39789]/60"
          />
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#80644B] dark:text-[#D49542] font-serif">
            Loading product roster...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#80644B] dark:text-[#A39789]">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF7F2] dark:bg-[#1E1A16] border-b border-[#E8DFC8] dark:border-[#2C2620] text-[#80644B] dark:text-[#D49542] uppercase tracking-editorial text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Piece</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Price (BDT)</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Badges & Delivery</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8]/40 dark:divide-[#2C2620]">
                {filteredProducts.map((p) => {
                  const img =
                    p.images?.find((i: any) => i.isMain)?.url ||
                    p.images?.[0]?.url ||
                    "";
                  const hasDiscount = p.salePrice && p.salePrice < p.price;
                  const discountPct = hasDiscount
                    ? Math.round(((p.price - p.salePrice) / p.price) * 100)
                    : p.discountPercentage || 0;

                  return (
                    <tr key={p._id || p.sku} className="hover:bg-[#EAE0D0]/20 dark:hover:bg-[#1E1A16]/50 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3 min-w-[200px]">
                        <div className="relative w-10 h-12 rounded bg-[#EAE0D0]/30 dark:bg-[#1E1A16] overflow-hidden shrink-0 border border-[#E8DFC8]/60 dark:border-[#2C2620]">
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
                          <p className="font-serif font-medium text-[#211D1A] dark:text-[#F5EFE8]">{p.name}</p>
                          <div className="flex gap-1.5 mt-0.5 flex-wrap">
                            {p.featured && (
                              <span className="text-[9px] bg-[#D49542]/20 text-[#D49542] px-1 rounded font-bold">
                                Featured
                              </span>
                            )}
                            {p.bestSeller && (
                              <span className="text-[9px] bg-[#211D1A]/10 dark:bg-white/10 text-[#211D1A] dark:text-[#F5EFE8] px-1 rounded font-bold">
                                Best Seller
                              </span>
                            )}
                            {hasDiscount && (
                              <span className="text-[9px] bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-1 rounded font-bold">
                                {discountPct}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#80644B] dark:text-[#A39789] capitalize">
                        {p.categorySlug?.replace("-", " ") || "Collection"}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                        {p.sku}
                      </td>
                      <td className="py-3 px-4">
                        {hasDiscount ? (
                          <div>
                            <span className="font-serif font-bold text-[#D49542]">
                              {formatPrice(p.salePrice)}
                            </span>
                            <span className="font-serif text-[10px] text-[#80644B] dark:text-[#A39789] line-through ml-1.5 opacity-70">
                              {formatPrice(p.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-serif font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                            {formatPrice(p.price)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#211D1A] dark:text-[#F5EFE8]">
                        <span className={p.stock <= 3 ? "text-red-600 font-bold" : ""}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.isFreeShipping ? (
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 w-fit">
                            <Truck className="w-3 h-3" /> Free Delivery
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#80644B] dark:text-[#A39789]">Standard</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.status === "published"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                              : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            title="Edit Piece"
                            className="p-1.5 text-[#80644B] dark:text-[#D49542] hover:text-[#211D1A] dark:hover:text-white rounded hover:bg-[#EAE0D0]/30 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id, p.name)}
                            title="Delete Piece"
                            className="p-1.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative max-w-2xl mx-auto my-8 px-4">
            <div className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] shadow-2xl rounded-sm p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8] dark:border-[#2C2620] mb-6">
                <div>
                  <h3 className="font-serif text-2xl text-[#211D1A] dark:text-[#FAF6F0] font-normal">
                    {editingProduct ? "Modify Artisan Piece" : "Add New Artisan Bag"}
                  </h3>
                  <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-0.5">
                    Drag and drop images, assign discount percentage, and configure free shipping.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-[#80644B] hover:text-[#211D1A] dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Ochre Heritage Dhol Bag"
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    />
                  </div>

                  {/* Category & SKU */}
                  <div>
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={String(c._id)}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      SKU Code *
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      required
                      placeholder="e.g. UPK-DHOL-001"
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] font-mono focus:border-[#D49542] focus:outline-none"
                    />
                  </div>

                  {/* Pricing and Discount Section */}
                  <div>
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      Regular Price (BDT ৳) *
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      required
                      min="0"
                      placeholder="3500"
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1 flex items-center gap-1">
                        <Percent className="w-3 h-3 text-[#D49542]" /> ছাড় (% Off)
                      </label>
                      <input
                        type="number"
                        value={discountPercent}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        min="0"
                        max="100"
                        placeholder="0"
                        className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                        Sale Price (৳)
                      </label>
                      <input
                        type="number"
                        value={salePrice}
                        onChange={(e) => handleSalePriceChange(e.target.value)}
                        min="0"
                        placeholder="Auto"
                        className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#D49542] font-bold focus:border-[#D49542] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Stock & Status */}
                  <div>
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      Stock Count *
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                      min="0"
                      placeholder="10"
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      Catalogue Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    >
                      <option value="published">Published (Live in Studio)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Drag and Drop Image Dropzone (Replaces URL Links) */}
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4 text-[#D49542]" />
                        <span>Product Images (Drag & Drop or Browse) *</span>
                      </span>
                      <span className="text-[10px] text-[#80644B] dark:text-[#A39789]">
                        {imagesList.length} image(s) selected
                      </span>
                    </label>

                    {/* Hidden input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />

                    {/* Dropzone Box */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-colors ${
                        isDragging
                          ? "border-[#D49542] bg-[#D49542]/10"
                          : "border-[#E8DFC8] dark:border-[#2C2620] hover:border-[#D49542] bg-[#FAF7F2]/60 dark:bg-[#1E1A16]/40"
                      }`}
                    >
                      <UploadCloud className="w-8 h-8 text-[#D49542] mx-auto mb-2 opacity-80" />
                      <p className="font-serif text-sm text-[#211D1A] dark:text-[#FAF6F0]">
                        ছবি এখানে টেনে এনে ড্রপ করুন অথবা ক্লিক করে নির্বাচন করুন
                      </p>
                      <p className="text-[11px] text-[#80644B] dark:text-[#A39789] mt-1">
                        JPG, PNG, WEBP ফরম্যাট সমর্থিত। একাধিক ছবি একসাথে ড্রপ করতে পারবেন।
                      </p>
                    </div>

                    {/* Uploaded Thumbnails Grid */}
                    {imagesList.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {imagesList.map((img, idx) => (
                          <div
                            key={idx}
                            className={`relative aspect-[4/5] rounded border overflow-hidden group bg-[#EAE0D0]/20 dark:bg-[#1E1A16] ${
                              img.isMain
                                ? "border-[#D49542] ring-2 ring-[#D49542]/40"
                                : "border-[#E8DFC8] dark:border-[#2C2620]"
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={img.alt || `Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Main Badge */}
                            {img.isMain ? (
                              <span className="absolute top-1 left-1 bg-[#D49542] text-[#0E0C0A] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                Cover Photo
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMainImage(idx);
                                }}
                                className="absolute top-1 left-1 bg-black/70 hover:bg-[#D49542] hover:text-[#0E0C0A] text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Set Cover
                              </button>
                            )}

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(idx);
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      Product Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      required
                      placeholder="Describe the textile weave, wooden handles, and dimensions..."
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium text-[#211D1A] dark:text-[#F5EFE8] mb-1">
                      Craftsmanship & Materials Note
                    </label>
                    <input
                      type="text"
                      value={materials}
                      onChange={(e) => setMaterials(e.target.value)}
                      placeholder="e.g. Hand-spun cotton weave, turned teak wood..."
                      className="w-full p-2.5 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#211D1A] dark:text-[#FAF6F0] focus:border-[#D49542] focus:outline-none"
                    />
                  </div>

                  {/* Delivery & Badges Checkboxes */}
                  <div className="sm:col-span-2 p-3 bg-[#FAF7F2] dark:bg-[#1E1A16] rounded border border-[#E8DFC8]/60 dark:border-[#2C2620] flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-700 dark:text-emerald-400">
                      <input
                        type="checkbox"
                        checked={isFreeShipping}
                        onChange={(e) => setIsFreeShipping(e.target.checked)}
                        className="rounded border-[#E8DFC8] accent-emerald-600"
                      />
                      <Truck className="w-3.5 h-3.5" />
                      <span>Free Delivery For This Product (ফ্রি ডেলিভারি প্রযোজ্য)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[#211D1A] dark:text-[#F5EFE8]">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="rounded border-[#E8DFC8] accent-[#D49542]"
                      />
                      <span>Featured</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[#211D1A] dark:text-[#F5EFE8]">
                      <input
                        type="checkbox"
                        checked={bestSeller}
                        onChange={(e) => setBestSeller(e.target.checked)}
                        className="rounded border-[#E8DFC8] accent-[#D49542]"
                      />
                      <span>Best Seller</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[#211D1A] dark:text-[#F5EFE8]">
                      <input
                        type="checkbox"
                        checked={newArrival}
                        onChange={(e) => setNewArrival(e.target.checked)}
                        className="rounded border-[#E8DFC8] accent-[#D49542]"
                      />
                      <span>New Arrival</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E8DFC8] dark:border-[#2C2620] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2.5 px-5 border border-[#E8DFC8] dark:border-[#2C2620] rounded text-[#80644B] dark:text-[#A39789] hover:bg-[#EAE0D0]/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-2.5 px-6 bg-[#211D1A] dark:bg-[#D49542] text-[#FAF6F0] dark:text-[#0E0C0A] text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-[#80644B] transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 text-[#D49542] dark:text-[#0E0C0A]" />
                    <span>{isSubmitting ? "Saving Piece..." : "Save Product"}</span>
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
