import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchOrderById } from "@/lib/server-api";
import { formatPrice } from "@/lib/utils";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrderTracker } from "@/components/orders/OrderTracker";
import { GuestDashboardCTA } from "@/components/orders/GuestDashboardCTA";
import {
  CheckCircle2,
  Package,
  Truck,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";

interface OrderConfirmationPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { id } = params;
  const order = await fetchOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <AnnouncementBar />
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Success Banner */}
        <div className="text-center pb-8 border-b border-sand/60">
          <div className="w-16 h-16 rounded-full bg-sand/30 flex items-center justify-center mx-auto mb-4 text-mustard">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs uppercase tracking-editorial text-earth font-bold block mb-1">
            Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mb-2">
            Thank you, {order.customerInformation.fullName}
          </h1>
          <p className="text-sm font-sans text-charcoal-muted max-w-md mx-auto leading-relaxed">
            Your order has been recorded in our studio ledger. Our artisan packing
            team is preparing your handcrafted pieces.
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-ivory-light border border-sand rounded text-xs font-mono text-charcoal">
            <span>Order Reference:</span>
            <span className="font-bold text-mustard">{order.orderNumber}</span>
          </div>
        </div>

        {/* Guest Bangla CTA for Google Sign-In & Live Tracking / Cancel */}
        <GuestDashboardCTA orderId={String(order._id || id)} orderNumber={order.orderNumber} />

        {/* Live Milestone Tracker */}
        <div className="py-6">
          <OrderTracker order={order} />
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-b border-sand/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-editorial text-earth font-semibold mb-2">
              <MapPin className="w-4 h-4 text-mustard" />
              Delivery Address
            </div>
            <p className="text-sm font-sans text-charcoal font-medium">
              {order.shippingAddress.address}
            </p>
            <p className="text-xs font-sans text-charcoal-muted mt-0.5">
              {order.shippingAddress.city}, {order.shippingAddress.district}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-editorial text-earth font-semibold mb-2">
              <Phone className="w-4 h-4 text-mustard" />
              Contact Information
            </div>
            <p className="text-sm font-sans text-charcoal">
              {order.customerInformation.phone}
            </p>
            <p className="text-xs font-sans text-charcoal-muted mt-0.5">
              {order.customerInformation.email}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-editorial text-earth font-semibold mb-2">
              <Truck className="w-4 h-4 text-mustard" />
              Payment & Dispatch
            </div>
            <p className="text-sm font-sans text-charcoal uppercase font-medium">
              {order.paymentMethod === "cod"
                ? "Cash On Delivery"
                : order.paymentMethod}
            </p>
            <p className="text-xs font-sans text-charcoal-muted mt-0.5 capitalize">
              Status: {order.orderStatus}
            </p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="py-8 border-b border-sand/60">
          <h2 className="font-serif text-xl text-charcoal mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-mustard" />
            Purchased Pieces ({order.items.length})
          </h2>

          <div className="divide-y divide-sand/40">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-sand/30 rounded overflow-hidden relative flex-shrink-0">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-sand/40 flex items-center justify-center text-xs text-charcoal-muted">
                        No Img
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-charcoal leading-snug">
                      {item.productName}
                    </h3>
                    {item.selectedVariant && (
                      <span className="text-xs text-earth block">
                        Variant: {item.selectedVariant}
                      </span>
                    )}
                    <span className="text-xs text-charcoal-muted font-mono block">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-mono font-bold text-charcoal">
                  {formatPrice(item.itemTotal || item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="py-6 border-b border-sand/60">
          <div className="max-w-xs ml-auto space-y-2 text-xs font-sans">
            <div className="flex justify-between text-charcoal-muted">
              <span>Subtotal:</span>
              <span className="font-mono text-charcoal font-medium">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Promotional Discount:</span>
                <span className="font-mono font-medium">
                  -{formatPrice(order.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-charcoal-muted">
              <span>Delivery Fee:</span>
              <span className="font-mono text-charcoal font-medium">
                {order.deliveryCharge === 0 ? "FREE" : formatPrice(order.deliveryCharge)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-sand">
              <span>Grand Total:</span>
              <span className="font-mono text-base text-mustard">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-ivory text-xs font-sans uppercase tracking-editorial hover:bg-mustard transition-colors rounded shadow-subtle"
          >
            Continue Exploring
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="text-xs font-sans text-charcoal-muted flex items-center gap-2">
            <span>Questions regarding this order?</span>
            <Link
              href="/contact"
              className="text-earth hover:text-mustard underline"
            >
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
