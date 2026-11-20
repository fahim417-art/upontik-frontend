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
  const isReturned = order.orderStatus === "returned";
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

  if (isCancelled) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-sm">
        <div className="flex items-center gap-2 text-red-800 text-xs font-bold uppercase tracking-editorial">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>অর্ডার বাতিল করা হয়েছে (Order Cancelled)</span>
        </div>
        <p className="text-xs text-red-700 mt-1 font-sans">
          This order was cancelled. If you believe this is an error or wish to re-order, please contact our Gazipur studio via WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-ivory-light border border-sand/70 rounded-sm p-4 sm:p-6 space-y-5">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sand/40">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <h4 className="font-serif text-sm sm:text-base font-bold text-charcoal tracking-wide">
            Live Order Tracking • লাইভ ট্র্যাকিং
          </h4>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-charcoal-muted">Current State:</span>
          <span className="px-2 py-0.5 bg-mustard/20 text-mustard border border-mustard/30 rounded font-bold uppercase text-[11px] font-mono">
            {STEPS[currentIndex]?.sub || order.orderStatus}
          </span>
        </div>
      </div>

      {/* 5-Step Visual Stepper */}
      <div className="py-2">
        <div className="grid grid-cols-5 relative gap-1 sm:gap-2">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-4 right-4 h-0.5 bg-sand/60 -z-0 hidden sm:block" />
          
          {/* Completed Connecting Line */}
          <div
            className="absolute top-5 left-4 h-0.5 bg-mustard transition-all duration-700 -z-0 hidden sm:block"
            style={{
              width: `${(Math.min(currentIndex, 4) / 4) * 88}%`,
            }}
          />

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPending = idx > currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 border ${
                    isCurrent
                      ? "bg-mustard text-ivory border-mustard ring-4 ring-mustard/20 scale-105 shadow-md"
                      : isDone
                      ? "bg-earth text-ivory border-earth"
                      : "bg-ivory border-sand text-sand-dark"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <div className="mt-2 space-y-0.5">
                  <span
                    className={`block text-[10px] sm:text-xs font-bold leading-tight ${
                      isCurrent
                        ? "text-mustard"
                        : isDone
                        ? "text-charcoal"
                        : "text-charcoal-muted"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] text-charcoal-muted font-mono leading-none">
                    {step.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Courier & Tracking Details Card */}
      {(order.courierName || order.trackingNumber || currentIndex >= 3) && (
        <div className="p-3.5 sm:p-4 bg-sand/20 border border-sand rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded bg-mustard/20 text-mustard flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase font-bold tracking-editorial text-earth">
                  Courier Partner:
                </span>
                <span className="font-bold text-charcoal font-sans">
                  {order.courierName || "Steadfast Courier"}
                </span>
              </div>
              {order.trackingNumber ? (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-charcoal-muted font-mono text-[11px]">
                    Consignment ID: <strong className="text-charcoal">{order.trackingNumber}</strong>
                  </span>
                  <button
                    onClick={copyTracking}
                    className="p-1 hover:bg-sand/40 rounded transition-colors text-charcoal-muted hover:text-charcoal"
                    title="Copy Consignment ID"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-charcoal-muted mt-0.5">
                  Dispatched from studio hub. Courier tracking ID will sync shortly.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {courierUrl && (
              <a
                href={courierUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-charcoal text-ivory text-[11px] uppercase font-bold tracking-editorial rounded hover:bg-mustard transition-colors"
              >
                <span>Track on Courier</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <a
              href={`https://wa.me/8801917720875?text=Hello%20Upontik%20Studio,%20inquiring%20about%20my%20Order%20%23${encodeURIComponent(order.orderNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-700 text-ivory text-[11px] uppercase font-bold tracking-editorial rounded hover:bg-emerald-800 transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      )}

      {/* Status History Accordion */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-editorial text-earth hover:text-mustard py-1"
          >
            <span>Timeline Audit Log ({order.statusHistory.length} events)</span>
            {showHistory ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showHistory && (
            <div className="mt-3 space-y-2 border-l-2 border-sand/80 pl-3 ml-2">
              {order.statusHistory.map((item, idx) => (
                <div key={idx} className="relative pb-2 last:pb-0">
                  <div className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-mustard ring-2 ring-ivory" />
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="text-xs font-bold uppercase text-charcoal">
                      {item.status}
                    </span>
                    <span className="text-[10px] text-charcoal-muted font-mono">
                      {new Date(item.updatedAt).toLocaleDateString("en-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(item.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {item.note && (
                    <p className="text-[11px] text-charcoal-muted font-sans mt-0.5">
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
