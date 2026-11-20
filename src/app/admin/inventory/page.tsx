"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Search,
} from "lucide-react";

export default function AdminInventoryPage() {
  const { showToast } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch {
      showToast("Failed to fetch inventory", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustStock = async (id: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, stock: newStock } : p))
        );
        showToast("Stock quantity updated.", "success");
      } else {
        showToast("Failed to update stock", "error");
      }
    } catch {
      showToast("Network error updating stock", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = products.filter(
    (p) => p.stock <= (p.lowStockThreshold || 5)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sand/50 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Real-time stock level maintenance with atomic decrement protection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-ivory border border-sand rounded flex items-center gap-2 text-xs font-sans">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>
              Low Stock Warnings: <strong>{lowStockCount}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-ivory border border-sand/80 rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-sand flex items-center gap-3">
          <Search className="w-4 h-4 text-charcoal-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search piece by title or SKU..."
            className="w-full bg-transparent text-xs text-charcoal focus:outline-none placeholder-charcoal-muted/60"
          />
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-charcoal-muted font-serif">
            Loading inventory records...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-ivory-light border-b border-sand text-charcoal-muted uppercase tracking-editorial text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Artisan Piece</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Current Stock</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4 text-right">Quick Stock Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {filtered.map((p) => {
                  const img =
                    p.images?.find((i: any) => i.isMain)?.url ||
                    p.images?.[0]?.url ||
                    "";
                  const isLow = p.stock <= (p.lowStockThreshold || 5);
                  return (
                    <tr key={p._id || p.sku} className="hover:bg-sand/10 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
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
                          <p className="text-[10px] text-charcoal-muted">
                            Threshold: {p.lowStockThreshold || 5} pieces
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-charcoal">
                        {p.sku}
                      </td>
                      <td className="py-3 px-4 text-charcoal-muted">
                        {p.categoryId?.name || "Silhouette"}
                      </td>
                      <td className="py-3 px-4 font-bold text-sm">
                        <span className={isLow ? "text-red-600" : "text-emerald-700"}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.stock === 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1 border border-sand rounded bg-ivory">
                          <button
                            onClick={() => handleAdjustStock(p._id, p.stock, -5)}
                            disabled={updatingId === p._id}
                            className="px-2 py-1 text-charcoal-muted hover:text-charcoal hover:bg-sand/30 text-[10px] font-mono border-r border-sand"
                            title="Remove 5"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleAdjustStock(p._id, p.stock, -1)}
                            disabled={updatingId === p._id}
                            className="p-1.5 text-charcoal hover:text-earth border-r border-sand"
                            title="Decrement 1"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-bold text-charcoal">
                            {p.stock}
                          </span>
                          <button
                            onClick={() => handleAdjustStock(p._id, p.stock, 1)}
                            disabled={updatingId === p._id}
                            className="p-1.5 text-charcoal hover:text-earth border-l border-sand"
                            title="Increment 1"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleAdjustStock(p._id, p.stock, 5)}
                            disabled={updatingId === p._id}
                            className="px-2 py-1 text-charcoal-muted hover:text-charcoal hover:bg-sand/30 text-[10px] font-mono border-l border-sand"
                            title="Add 5"
                          >
                            +5
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
    </div>
  );
}
