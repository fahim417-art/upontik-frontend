"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import {
  Layers,
  Plus,
  Edit2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const { showToast } = useStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit / Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState("1");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch {
      showToast("Failed to fetch categories", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=85&w=800");
    setDisplayOrder(String(categories.length + 1));
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImage(cat.image);
    setDisplayOrder(String(cat.displayOrder || 1));
    setIsActive(cat.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !image) {
      showToast("Please provide all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        slug: slug || undefined,
        description,
        image,
        displayOrder: parseInt(displayOrder, 10) || 1,
        isActive,
      };

      let res;
      if (editingCategory) {
        res = await fetch(`/api/admin/categories/${editingCategory._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        showToast(
          editingCategory ? "Category updated." : "New category established.",
          "success"
        );
        setIsModalOpen(false);
        fetchCategories();
      } else {
        showToast(data.error || "Save failed", "error");
      }
    } catch {
      showToast("Operation failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sand/50 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Category Architecture
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Maintain the five core silhouettes (Side Bag, Pouch Bag, Dhol Bag, Phone Bag, Tote Bag).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-2.5 px-5 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-bold rounded flex items-center gap-2 hover:bg-charcoal-light shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-mustard" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-charcoal-muted font-serif">
          Loading category silhouettes...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.slug || cat._id}
              className="bg-ivory border border-sand/80 rounded-sm shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full bg-sand/30 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-charcoal text-ivory">
                    Order: {cat.displayOrder}
                  </span>
                  {cat.slug === "dhol-bag" && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-mustard text-charcoal">
                      Signature Piece
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-xl text-charcoal font-medium mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] font-mono text-earth mb-3">
                    /category/{cat.slug}
                  </p>
                  <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-sand/40 flex items-center justify-between">
                <span
                  className={`text-[11px] font-medium ${
                    cat.isActive !== false ? "text-emerald-700" : "text-charcoal-muted"
                  }`}
                >
                  {cat.isActive !== false ? "● Active in Nav" : "○ Inactive"}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`/category/${cat.slug}`}
                    target="_blank"
                    className="p-1.5 text-charcoal-muted hover:text-charcoal"
                    aria-label="View on storefront"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-charcoal hover:text-mustard"
                    aria-label="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative max-w-lg mx-auto my-12 px-4">
            <div className="bg-ivory border border-sand shadow-elevated rounded-sm p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-sand mb-6">
                <h3 className="font-serif text-2xl text-charcoal font-normal">
                  {editingCategory ? "Edit Category" : "Establish New Category"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-charcoal hover:text-earth"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-medium text-charcoal mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Dhol Bag"
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                  />
                  {name.toLowerCase().includes("dhol") && (
                    <p className="text-[10px] text-earth mt-1">
                      Note: &ldquo;Dhol Bag&rdquo; is the protected brand category name.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-charcoal mb-1">
                    URL Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase())}
                    placeholder="dhol-bag"
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal font-mono focus:outline-none focus:border-mustard"
                  />
                </div>

                <div>
                  <label className="block font-medium text-charcoal mb-1">
                    Category Editorial Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    required
                    placeholder="Describe the silhouette and architectural features..."
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                  />
                </div>

                <div>
                  <label className="block font-medium text-charcoal mb-1">
                    Cover Banner Image URL *
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                    placeholder="https://..."
                    className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-charcoal mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(e.target.value)}
                      className="w-full p-2.5 bg-ivory-light border border-sand rounded text-charcoal focus:outline-none focus:border-mustard"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="rounded border-sand accent-charcoal"
                      />
                      <span>Active on Website</span>
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
                    <span>{isSubmitting ? "Saving..." : "Save Category"}</span>
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
