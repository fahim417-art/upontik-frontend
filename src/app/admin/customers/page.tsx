"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { Users, Search, Mail, Phone, Calendar } from "lucide-react";

export default function AdminCustomersPage() {
  const { showToast } = useStore();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch {
      showToast("Failed to fetch customer directory", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sand/50 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
            Customer Directory
          </h1>
          <p className="text-xs text-charcoal-muted mt-1">
            Registered customer patrons. Password hashes and credentials are strictly protected.
          </p>
        </div>
      </div>

      <div className="bg-ivory border border-sand/80 rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-sand flex items-center gap-3">
          <Search className="w-4 h-4 text-charcoal-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patron by name, email or phone..."
            className="w-full bg-transparent text-xs text-charcoal focus:outline-none placeholder-charcoal-muted/60"
          />
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-charcoal-muted font-serif">
            Loading patron records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-charcoal-muted">
            No customers registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-ivory-light border-b border-sand text-charcoal-muted uppercase tracking-editorial text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Customer ID</th>
                  <th className="py-3.5 px-4">Patron Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Member Since</th>
                  <th className="py-3.5 px-4">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/40">
                {filtered.map((c) => (
                  <tr key={c._id || c.email} className="hover:bg-sand/10">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#D49542]">
                      #UPK-CUST-{String(c._id).slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-medium text-charcoal">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-muted flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-earth" />
                      <span>{c.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {c.phone || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-charcoal-muted">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {c.accountStatus || "active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
