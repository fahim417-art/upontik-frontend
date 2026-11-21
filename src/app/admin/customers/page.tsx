"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Users, Search, Mail, Phone, Calendar, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";

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
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFC8]/70 dark:border-[#2C2620] gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#211D1A] dark:text-[#FAF6F0] font-normal">
            Customer Directory & Patron Inboxes
          </h1>
          <p className="text-xs text-[#80644B] dark:text-[#A39789] mt-1">
            Registered patrons with official Customer IDs. Click "Message" to open a direct support thread with any patron.
          </p>
        </div>
      </div>

      <div className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8] dark:border-[#2C2620] rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E8DFC8]/60 dark:border-[#2C2620] flex items-center gap-3">
          <Search className="w-4 h-4 text-[#80644B] dark:text-[#A39789]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patron by name, email or phone..."
            className="w-full bg-transparent text-xs text-[#211D1A] dark:text-[#FAF6F0] focus:outline-none placeholder-[#80644B]/60 dark:placeholder-[#A39789]/60"
          />
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#80644B] dark:text-[#D49542] font-serif">
            Loading patron records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#80644B] dark:text-[#A39789]">
            No customers registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF7F2] dark:bg-[#1E1A16] border-b border-[#E8DFC8] dark:border-[#2C2620] text-[#80644B] dark:text-[#D49542] uppercase tracking-editorial text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Customer ID</th>
                  <th className="py-3.5 px-4">Patron Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Member Since</th>
                  <th className="py-3.5 px-4">Role / Status</th>
                  <th className="py-3.5 px-4 text-right">Direct Inbox</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFC8]/40 dark:divide-[#2C2620]">
                {filtered.map((c) => {
                  const custId = String(c._id);
                  const chatParams = new URLSearchParams({
                    sessionId: `cust_${custId}`,
                    customerId: custId,
                    name: c.name || "Patron",
                    email: c.email || "",
                    phone: c.phone || "",
                  }).toString();

                  return (
                    <tr key={c._id || c.email} className="hover:bg-[#EAE0D0]/20 dark:hover:bg-[#1E1A16]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#D49542]">
                        #UPK-CUST-{custId.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4 font-serif font-medium text-[#211D1A] dark:text-[#F5EFE8]">
                        {c.name}
                      </td>
                      <td className="py-3.5 px-4 text-[#80644B] dark:text-[#A39789] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#D49542]" />
                        <span>{c.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#80644B] dark:text-[#A39789]">
                        {c.phone || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-[#80644B] dark:text-[#A39789] font-mono text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          {c.role || "customer"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/support?${chatParams}`}
                          className="inline-flex items-center gap-1.5 py-1 px-3 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] hover:border-[#D49542] text-[#211D1A] dark:text-[#FAF6F0] rounded-full text-xs font-medium transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#D49542]" />
                          <span>Message Customer</span>
                        </Link>
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
