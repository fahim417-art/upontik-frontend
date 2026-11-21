"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Printer,
  Calendar,
} from "lucide-react";

interface StatusHistoryItem {
  status: string;
  note?: string;
  updatedAt: string | Date;
  updatedBy?: string;
}

interface OrderTrackerProps {
  order: {
    _id?: string;
    orderNumber: string;
    orderStatus: string;
    createdAt: string | Date;
    courierName?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: string;
    shippingAddress?: {
      city: string;
      district: string;
      address: string;
    };
    statusHistory?: StatusHistoryItem[];
  };
  compact?: boolean;
}

const STEPS = [
  {
    key: "pending",
    title: "অর্ডার গৃহীত",
    sub: "Order Placed",
    desc: "Studio logged your order",
    icon: Clock,
  },
  {
    key: "confirmed",
    title: "অর্ডার কনফার্মড",
    sub: "Studio Confirmed",
    desc: "Verification complete",
    icon: ShieldCheck,
  },
  {
    key: "processing",
    title: "প্যাকিং ও প্রস্তুত",
    sub: "Handcrafted & Packed",
    desc: "Artisan team packaging",
    icon: Package,
  },
  {
    key: "shipped",
    title: "কুরিয়ারে হস্তান্তর",
    sub: "Dispatched / In Transit",
    desc: "With delivery partner",
    icon: Truck,
  },
  {
    key: "delivered",
    title: "ডেলিভারি সম্পন্ন",
    sub: "Delivered",
    desc: "Handed over to patron",
    icon: CheckCircle2,
  },
];

export function OrderTracker({ order, compact = false }: OrderTrackerProps) {
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const getStepIndex = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "processing":
        return 2;
      case "shipped":
        return 3;
      case "delivered":
        return 4;
      default:
        return 0;
    }
  };

  const isCancelled = order.orderStatus === "cancelled";
  const currentIndex = getStepIndex(order.orderStatus);

  const copyTracking = () => {
    if (!order.trackingNumber) return;
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const courierUrl =
    order.trackingUrl ||
    (order.trackingNumber
      ? order.courierName?.toLowerCase().includes("steadfast")
        ? `https://steadfast.com.bd/t/${encodeURIComponent(order.trackingNumber)}`
        : order.courierName?.toLowerCase().includes("pathao")
          ? `https://merchant.pathao.com/tracking?consignment_id=${encodeURIComponent(order.trackingNumber)}`
          : `https://www.google.com/search?q=${encodeURIComponent((order.courierName || "courier") + " tracking " + order.trackingNumber)}`
      : undefined);

  // Delivery timeframe estimate
  const isDhakaZone =
    order.shippingAddress?.district?.toLowerCase().includes("dhaka") ||
    order.shippingAddress?.district?.toLowerCase().includes("gazipur");
  const estimatedWindow =
    order.orderStatus === "delivered"
      ? "ডেলিভারি সফলভাবে সম্পন্ন হয়েছে"
      : isDhakaZone
        ? "সম্ভাব্য ডেলিভারি: ২৪ থেকে ৪৮ ঘণ্টার মধ্যে"
        : "সম্ভাব্য ডেলিভারি: ৪৮ থেকে ৭২ ঘণ্টার মধ্যে (Steadfast Express)";

  const whatsappInquiryUrl = `https://wa.me/8801917720875?text=${encodeURIComponent(
    `হ্যালো UPONTIK স্টুডিও, আমার অর্ডার #${order.orderNumber} সম্পর্কে সরাসরি আপডেট জানতে চাচ্ছি।`
  )}`;

  if (isCancelled) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-sm">
        <div className="flex items-center gap-2 text-red-800 dark:text-red-300 text-xs font-bold uppercase tracking-editorial">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>অর্ডার বাতিল করা হয়েছে (Order Cancelled)</span>
        </div>
        <p className="text-xs text-red-700 dark:text-red-400 mt-1 font-sans">
          This order was cancelled. If you wish to re-order, please contact our Gazipur studio via WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-ivory dark:bg-[#171411] border border-[#E8DFC8]/80 dark:border-[#2C2620] rounded-sm p-5 sm:p-7 shadow-sm transition-colors duration-300 space-y-6">

      {/* Top Banner with Tracking Code & Courier */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E8DFC8]/60 dark:border-[#2C2620] gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#80644B] dark:text-[#D49542] font-semibold block">
            LIVE TRACKING CONCIERGE
          </span>
          <h4 className="font-serif text-lg sm:text-xl text-[#211D1A] dark:text-[#F5EFE8] font-normal">
            Order #{order.orderNumber}
          </h4>
          <span className="text-xs text-[#80644B] dark:text-[#A39789] flex items-center gap-1.5 mt-1 font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#D49542]" />
            {estimatedWindow}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {order.trackingNumber && (
            <div className="flex items-center gap-2 bg-[#FAF7F2] dark:bg-[#1E1A16] border border-[#E8DFC8] dark:border-[#2C2620] px-3.5 py-1.5 rounded-full">
              <span className="text-[11px] font-mono text-[#80644B] dark:text-[#D49542]">
                {order.courierName || "Courier"}:
              </span>
              <span className="font-mono text-xs font-bold text-[#211D1A] dark:text-[#FAF6F0]">
                {order.trackingNumber}
              </span>
              <button
                onClick={copyTracking}
                className="p-1 hover:text-[#D49542] text-[#80644B] dark:text-[#A39789] transition-colors"
                title="Copy tracking code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {courierUrl && (
                <a
                  href={courierUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 hover:text-[#D49542] text-[#80644B] dark:text-[#A39789] transition-colors"
                  title="Open live tracking page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* WhatsApp Direct Support Button */}
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>স্টুডিও সাপোর্ট</span>
          </a>

          {/* Print Cash Memo */}
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-full border border-sand dark:border-[#2C2620] hover:border-[#D49542] text-[#80644B] dark:text-[#A39789] transition-colors"
            title="ইনভয়েস প্রিন্ট করুন"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5-Step Stepper - Desktop/Tablet Horizontal Layout */}
      <div className="py-4 hidden sm:block">
        <div className="grid grid-cols-5 gap-2 relative">

          {/* Background Connecting Bar */}
          <div className="absolute top-5 left-[10%] right-[10%] h-[2px] bg-[#E8DFC8] dark:bg-[#2C2620] z-0" />

          {/* Active Filled Connecting Bar */}
          <div
            className="absolute top-5 left-[10%] h-[2px] bg-[#D49542] z-0 transition-all duration-500"
            style={{ width: `${(currentIndex / 4) * 80}%` }}
          />

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                {/* Node Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted
                    ? "bg-[#D49542] text-[#0E0C0A] shadow-md"
                    : isCurrent
                      ? "bg-[#211D1A] dark:bg-[#D49542] text-white dark:text-[#0E0C0A] ring-4 ring-[#D49542]/30 scale-110 shadow-lg"
                      : "bg-[#EAE0D0] dark:bg-[#1E1A16] text-[#80644B] dark:text-[#A39789] border border-[#E8DFC8] dark:border-[#2C2620]"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Step Labels */}
                <span className={`text-[11px] sm:text-xs font-serif mt-2.5 font-medium leading-tight ${isCurrent ? "text-[#D49542] font-bold" : "text-[#211D1A] dark:text-[#F5EFE8]"
                  }`}>
                  {step.title}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#80644B] dark:text-[#A39789] font-mono mt-0.5">
                  {step.sub}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Step Stepper - Mobile Vertical Timeline Layout */}
      <div className="py-2 block sm:hidden">
        <div className="space-y-4 relative pl-4 border-l-2 border-[#E8DFC8] dark:border-[#2C2620]">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="relative flex items-center gap-3">
                {/* Timeline node */}
                <div
                  className={`absolute -left-[25px] w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-[#D49542] text-[#0E0C0A] shadow-sm"
                      : isCurrent
                      ? "bg-[#211D1A] dark:bg-[#D49542] text-white dark:text-[#0E0C0A] ring-4 ring-[#D49542]/30 scale-105 shadow-md"
                      : "bg-[#EAE0D0] dark:bg-[#1E1A16] text-[#80644B] dark:text-[#A39789] border border-[#E8DFC8] dark:border-[#2C2620]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="ml-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-serif font-medium ${
                      isCurrent ? "text-[#D49542] font-bold" : "text-[#211D1A] dark:text-[#F5EFE8]"
                    }`}>
                      {step.title}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D49542]/20 text-[#D49542] text-[9px] font-mono font-bold">
                        চলমান (Current)
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#80644B] dark:text-[#A39789] font-mono block">
                    {step.sub} • {step.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status History Collapsible */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="pt-4 border-t border-[#E8DFC8]/60 dark:border-[#2C2620]">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 text-xs text-[#80644B] dark:text-[#D49542] hover:text-[#211D1A] dark:hover:text-white font-mono uppercase tracking-wider transition-colors"
          >
            <span>Timeline Log ({order.statusHistory.length})</span>
            {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showHistory && (
            <div className="mt-3 space-y-2 pl-3 border-l-2 border-[#D49542]/40 text-xs">
              {order.statusHistory.map((item, i) => (
                <div key={i} className="py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#211D1A] dark:text-[#F5EFE8] capitalize">
                      {item.status}
                    </span>
                    <span className="text-[10px] text-[#80644B] dark:text-[#A39789] font-mono">
                      {new Date(item.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  {item.note && (
                    <p className="text-[11px] text-[#80644B] dark:text-[#A39789] italic mt-0.5">
                      {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
