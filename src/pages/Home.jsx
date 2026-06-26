import React, { useEffect, useState, useContext } from 'react';
import ProductCard from '../components/product/ProductCard';
import Navbar from '../components/Navbar';
import { ShopContext } from '../components/context/ShopContext';

function Home() {
  // Global context state
  const { products, cart, isCartOpen, setIsCartOpen, HandleAddToCart } = useContext(ShopContext);

  // Sync state to delay unmounting until slide-out animation finishes
  const [shouldRenderCart, setShouldRenderCart] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      setShouldRenderCart(true);
    } else if (shouldRenderCart) {
      const timer = setTimeout(() => setShouldRenderCart(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen, shouldRenderCart]);

  // Order total calculations
  const totalAmount = cart.reduce((total, item) => total + Number(item.price), 0);
  const shippingAndTax = cart.length > 0 ? 5.00 : 0;
  const grandTotal = totalAmount + shippingAndTax;

  // Aggregate duplicate line items into a single display with quantities
  const groupedCart = cart.reduce((acc, item) => {
    const existing = acc.find((g) => g.name === item.name);
    if (existing) {
      existing.qty += 1;
    } else {
      acc.push({ ...item, qty: 1 });
    }
    return acc;
  }, []);

  return (
    <>
      {/* Navigation */}
      <Navbar cartItems={cart} onCartClick={() => setIsCartOpen(true)} />

      {/* Product Catalog Grid */}
      <div className="w-full px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {products.map((item) => (
            <ProductCard
              product={item}
              key={item.id}
              image={item.image}
              name={item.title}
              price={item.price}
              rating={4}
              reviews={18}
              onAddToCart={HandleAddToCart}
            />
          ))}
        </div>
      </div>

      {/* Sliding Sidebar Cart */}
      {shouldRenderCart && (
        <div className="fixed inset-0 z-50 overflow-hidden font-[Poppins]">
          {/* Background Overlay */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              isCartOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Slide Container */}
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div
              className={`pointer-events-auto w-screen max-w-md transform bg-[#f5f0ea] shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
                isCartOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0f3d2e] shadow-sm hover:bg-[#f0f7f3] transition"
                  aria-label="Close cart"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <h2 className="text-lg font-semibold text-gray-900">Cart</h2>

                <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0f3d2e] shadow-sm hover:bg-[#f0f7f3] transition" aria-label="More options">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="5" cy="12" r="1.6" />
                    <circle cx="12" cy="12" r="1.6" />
                    <circle cx="19" cy="12" r="1.6" />
                  </svg>
                </button>
              </div>

              {/* Product Line Items */}
              <div className="mx-4 mb-4 bg-white rounded-2xl shadow-sm flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 text-sm">Your cart is empty</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {groupedCart.map((item, index) => (
                      <div key={item.name ?? index} className="flex gap-4 p-4 items-start">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-[#f0f7f3] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{item.name}</h4>
                          <p className="text-xs text-[#1a4d3c] mt-0.5">Jaydor</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1.5">${Number(item.price).toFixed(2)}</p>

                          {/* Quantity Adjustment */}
                          <div className="mt-2.5 inline-flex items-center bg-[#f5f0ea] rounded-full px-1 py-1">
                            <button className="w-6 h-6 rounded-full flex items-center justify-center text-gray-500 hover:bg-white transition" aria-label="Decrease quantity">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" d="M5 12h14" />
                              </svg>
                            </button>
                            <span className="w-7 text-center text-sm font-medium text-gray-800">{item.qty}</span>
                            <button
                              onClick={() => HandleAddToCart({ name: item.name, price: item.price, image: item.image })}
                              className="w-6 h-6 rounded-full flex items-center justify-center bg-[#0f3d2e] text-white hover:bg-[#154d3b] transition"
                              aria-label="Increase quantity"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout & Totals Breakdown */}
              {cart.length > 0 && (
                <div className="mx-4 mb-5 bg-white rounded-2xl shadow-sm p-5 space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <p>Sub total</p>
                    <p className="font-semibold text-gray-900">${totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <p>Shipping &amp; tax</p>
                    <p className="font-semibold text-gray-900">${shippingAndTax.toFixed(2)}</p>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                    <p className="text-base font-semibold text-gray-900">Total</p>
                    <p className="text-base font-bold text-gray-900">${grandTotal.toFixed(2)}</p>
                  </div>

                  <button className="w-full bg-[#0f3d2e] hover:bg-[#154d3b] text-white py-3.5 rounded-full font-medium transition text-center text-sm cursor-pointer">
                    Checkout Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;