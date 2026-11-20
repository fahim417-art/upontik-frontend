"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export function CartDrawer() {
  const {
    cart,
    cartSubtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 5000;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-ivory shadow-elevated flex flex-col justify-between">
        {/* Header */}
        <div className="p-6 border-b border-sand flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-charcoal" />
            <h2 className="font-serif text-xl text-charcoal font-medium">
              Shopping Bag
            </h2>
            <span className="text-xs font-sans text-charcoal-muted ml-1">
              ({cart.reduce((total, i) => total + i.quantity, 0)})
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1 text-charcoal hover:text-earth transition-colors"
            aria-label="Close bag drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {cart.length > 0 && (
          <div className="px-6 py-3 bg-sand/20 border-b border-sand/40 text-xs text-charcoal font-sans">
            {remainingForFreeShipping > 0 ? (
              <p>
                Add{" "}
                <span className="font-semibold text-mustard">
                  {formatPrice(remainingForFreeShipping)}
                </span>{" "}
                more to enjoy complimentary courier delivery!
              </p>
            ) : (
              <p className="text-earth font-medium flex items-center gap-1.5">
                ✦ You have unlocked complimentary courier delivery!
              </p>
            )}
            <div className="w-full bg-sand/40 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-mustard h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-sand/30 flex items-center justify-center mb-4 text-earth">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl text-charcoal mb-2">
                Your bag is empty
              </h3>
              <p className="text-xs text-charcoal-muted max-w-xs mb-6">
                Discover thoughtfully handcrafted pieces woven with heritage and designed for today.
              </p>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="py-2.5 px-6 bg-charcoal text-ivory text-xs uppercase tracking-editorial rounded hover:bg-charcoal-light transition-colors"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.selectedVariant || "default"}`}
                className="flex gap-4 pb-4 border-b border-sand/40"
              >
                {/* Product Thumbnail */}
                <div className="relative w-20 h-24 rounded bg-sand/20 overflow-hidden shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setIsCartDrawerOpen(false)}
                        className="font-serif text-sm text-charcoal hover:text-mustard transition-colors line-clamp-1 font-medium"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() =>
                          removeFromCart(item.productId, item.selectedVariant)
                        }
                        className="text-charcoal-muted hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedVariant && (
                      <p className="text-[11px] font-sans text-charcoal-muted mt-0.5">
                        Variant: {item.selectedVariant}
                      </p>
                    )}

                    <p className="text-xs font-semibold text-charcoal mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-sand rounded bg-ivory-light">
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.productId,
                            item.quantity - 1,
                            item.selectedVariant
                          )
                        }
                        className="p-1 text-charcoal hover:text-earth transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-medium text-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.productId,
                            item.quantity + 1,
                            item.selectedVariant
                          )
                        }
                        className="p-1 text-charcoal hover:text-earth transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-serif text-charcoal-muted">
                      Total: {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Actions */}
        {cart.length > 0 && (
          <div className="p-6 bg-ivory-light border-t border-sand space-y-4">
            <div className="flex items-center justify-between text-sm font-sans">
              <span className="text-charcoal-muted uppercase tracking-editorial text-xs font-medium">
                Subtotal
              </span>
              <span className="font-serif text-lg font-bold text-charcoal">
                {formatPrice(cartSubtotal)}
              </span>
            </div>
            <p className="text-[11px] text-charcoal-muted">
              Taxes and delivery charges calculated at checkout.
            </p>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-3.5 bg-charcoal text-ivory text-xs uppercase tracking-editorial font-medium rounded flex items-center justify-center gap-2 hover:bg-charcoal-light shadow-luxury transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-2.5 border border-charcoal/40 text-charcoal text-xs uppercase tracking-editorial text-center rounded hover:bg-sand/20 transition-colors"
              >
                View Full Bag
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
