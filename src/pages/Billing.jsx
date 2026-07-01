import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { ShopContext } from "../components/context/ShopContext";

// ─── tiny helpers ────────────────────────────────────────────────────────────

function Field({ label, error, half = false, ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${half ? "sm:col-span-1" : "sm:col-span-2"}`}>
      <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </label>
      <input
        {...props}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-4 transition-all duration-200 ${
          error
            ? "border-red-300 focus:ring-red-100 bg-red-50/60"
            : "border-gray-200 focus:ring-[#0f3d2e]/10 focus:border-[#0f3d2e] bg-gray-50/60 hover:bg-white"
        }`}
      />
      {error && (
        <span className="flex items-center gap-1 text-red-500 text-xs">
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

function StepIcon({ type }) {
  if (type === "shipping") {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v11.177m0-11.177L12 3 8.25 7.573m0 11.177H4.5" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a1.5 1.5 0 001.5-1.5V6.75a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5z" />
    </svg>
  );
}

function SectionCard({ title, subtitle, icon, children, step, activeStep }) {
  const isActive = step === activeStep;
  const isDone = step < activeStep;

  return (
    <div
      className={`rounded-2xl border bg-white transition-all duration-500 overflow-hidden ${
        isActive
          ? "border-[#0f3d2e]/20 shadow-[0_8px_30px_rgba(15,61,46,0.06)]"
          : isDone
          ? "border-green-100"
          : "border-gray-100 opacity-60"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3.5 px-6 py-5 ${isDone ? "bg-green-50/50" : ""}`}>
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isDone || isActive ? "bg-[#0f3d2e] text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          {isDone ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <StepIcon type={icon} />
          )}
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold leading-tight ${isActive || isDone ? "text-gray-900" : "text-gray-400"}`}>
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {isDone && (
          <span className="ml-auto text-xs font-medium text-[#0f3d2e] bg-[#0f3d2e]/8 px-2.5 py-1 rounded-full flex-shrink-0">
            Done
          </span>
        )}
      </div>

      {/* Body — only shows for active step */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isActive ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-6 pb-7 pt-1 border-t border-gray-50">{children}</div>
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Billing() {
  const navigate = useNavigate();
  const { cart } = useContext(ShopContext);

  const [activeStep, setActiveStep] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // ── shipping form ──
  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", zip: "", country: "",
  });
  const [shippingErrors, setShippingErrors] = useState({});

  // ── payment form ──
  const [payment, setPayment] = useState({
    cardName: "", cardNumber: "", expiry: "", cvv: "",
  });
  const [paymentErrors, setPaymentErrors] = useState({});

  // ── totals ──
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item?.price || 0) * Number(item?.qty || 1),
    0
  );
  const shipping_fee = cart.length > 0 ? 5.00 : 0;
  const total = subtotal + shipping_fee;
  const totalQty = cart.reduce((sum, item) => sum + Number(item?.qty || 1), 0);

  // ── validation helpers ──
  const validateShipping = () => {
    const e = {};
    if (!shipping.firstName.trim()) e.firstName = "Required";
    if (!shipping.lastName.trim()) e.lastName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) e.email = "Valid email required";
    if (!shipping.phone.trim()) e.phone = "Required";
    if (!shipping.address.trim()) e.address = "Required";
    if (!shipping.city.trim()) e.city = "Required";
    if (!shipping.zip.trim()) e.zip = "Required";
    if (!shipping.country.trim()) e.country = "Required";
    setShippingErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (!payment.cardName.trim()) e.cardName = "Required";
    if (payment.cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter 16-digit card number";
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) e.expiry = "MM/YY format";
    if (payment.cvv.length < 3) e.cvv = "3–4 digits";
    setPaymentErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleShippingContinue = () => {
    if (validateShipping()) setActiveStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    setPlacingOrder(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPlacingOrder(false);
    setOrderPlaced(true);
  };

  // ── card number formatter ──
  const formatCard = (val) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length >= 3 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
  };

  // ── order placed screen ──
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#f5f0ea] font-[Poppins] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div
            className="w-20 h-20 rounded-full bg-[#0f3d2e] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#0f3d2e]/20"
            style={{ animation: "popIn 0.5s ease-out" }}
          >
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order placed!</h1>
          <p className="text-sm text-gray-500 mb-2 leading-relaxed">
            Thanks, {shipping.firstName} — we'll send a confirmation to{" "}
            <span className="font-medium text-gray-700">{shipping.email}</span>.
          </p>
          <p className="text-xs text-gray-400 mb-8">
            {totalQty} item{totalQty !== 1 ? "s" : ""} · ${total.toFixed(2)} total
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#0f3d2e] text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#154d3b] transition"
          >
            Back to home
          </button>
        </div>
        <style>{`
          @keyframes popIn {
            0% { opacity:0; transform:scale(0.6); }
            70% { transform:scale(1.08); }
            100% { opacity:1; transform:scale(1); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0ea] font-[Poppins]">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12">

        {/* PAGE HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-xs font-medium mb-3 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Checkout</h1>
            <p className="text-sm text-gray-400 mt-1">
              Step {activeStep} of 2 · {activeStep === 1 ? "Shipping details" : "Payment"}
            </p>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-full">
            {totalQty} item{totalQty !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-200/70 rounded-full mb-10 overflow-hidden">
          <div
            className="h-full bg-[#0f3d2e] rounded-full transition-all duration-500"
            style={{ width: activeStep === 1 ? "50%" : "100%" }}
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

        {/* ── LEFT: STEPS ── */}
        <div className="lg:col-span-3 space-y-5">

          {/* STEP 1 — SHIPPING */}
          <SectionCard
            title="Shipping details"
            subtitle="Where should we send your order?"
            icon="shipping"
            step={1}
            activeStep={activeStep}
          >
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <Field label="First name" half
                value={shipping.firstName} error={shippingErrors.firstName}
                onChange={(e) => setShipping((s) => ({ ...s, firstName: e.target.value }))} />
              <Field label="Last name" half
                value={shipping.lastName} error={shippingErrors.lastName}
                onChange={(e) => setShipping((s) => ({ ...s, lastName: e.target.value }))} />
              <Field label="Email" type="email" placeholder="you@example.com"
                value={shipping.email} error={shippingErrors.email}
                onChange={(e) => setShipping((s) => ({ ...s, email: e.target.value }))} />
              <Field label="Phone" half placeholder="+1 234 567 8900"
                value={shipping.phone} error={shippingErrors.phone}
                onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))} />
              <Field label="Address" placeholder="Street address"
                value={shipping.address} error={shippingErrors.address}
                onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))} />
              <Field label="City" half
                value={shipping.city} error={shippingErrors.city}
                onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} />
              <Field label="ZIP / Postal code" half
                value={shipping.zip} error={shippingErrors.zip}
                onChange={(e) => setShipping((s) => ({ ...s, zip: e.target.value }))} />
              <Field label="Country"
                value={shipping.country} error={shippingErrors.country}
                onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))} />
            </div>
            <button
              onClick={handleShippingContinue}
              className="mt-6 w-full bg-[#0f3d2e] hover:bg-[#154d3b] text-white py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              Continue to payment
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </SectionCard>

          {/* STEP 2 — PAYMENT */}
          <SectionCard
            title="Payment"
            subtitle="All transactions are simulated — no card is charged"
            icon="payment"
            step={2}
            activeStep={activeStep}
          >
            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <Field label="Name on card"
                value={payment.cardName} error={paymentErrors.cardName}
                onChange={(e) => setPayment((p) => ({ ...p, cardName: e.target.value }))} />
              <Field label="Card number" placeholder="1234 5678 9012 3456"
                value={payment.cardNumber} error={paymentErrors.cardNumber}
                onChange={(e) => setPayment((p) => ({ ...p, cardNumber: formatCard(e.target.value) }))} />
              <Field label="Expiry" half placeholder="MM/YY"
                value={payment.expiry} error={paymentErrors.expiry}
                onChange={(e) => setPayment((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))} />
              <Field label="CVV" half placeholder="123" type="password" maxLength={4}
                value={payment.cvv} error={paymentErrors.cvv}
                onChange={(e) => setPayment((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} />
            </div>

            {/* Card brand hint row */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-1.5">
                {["VISA", "MC", "AMEX"].map((b) => (
                  <span key={b} className="text-[10px] font-bold text-gray-400 border border-gray-200 rounded-md px-2 py-1 bg-gray-50">
                    {b}
                  </span>
                ))}
              </div>
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Dummy — no real charge
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="mt-6 w-full bg-[#0f3d2e] hover:bg-[#154d3b] disabled:opacity-70 text-white py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              {placingOrder ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Placing order…
                </>
              ) : (
                `Place order · $${total.toFixed(2)}`
              )}
            </button>
          </SectionCard>
        </div>

        {/* ── RIGHT: ORDER SUMMARY ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(15,61,46,0.05)] sticky top-6 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Order summary</h2>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                {totalQty} item{totalQty !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center gap-3 text-center py-12 px-6">
                  <div className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.87-4.798 2.182-7.43.075-.635-.42-1.187-1.06-1.187H5.106M7.5 14.25L5.106 5.653M7.5 14.25L5.25 6M9.75 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Your cart is empty</p>
                  <button
                    onClick={() => navigate("/products")}
                    className="text-xs font-semibold text-[#0f3d2e] hover:underline"
                  >
                    Browse products
                  </button>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div key={item.id ?? i} className="flex gap-3 px-6 py-4 items-center">
                    <div className="w-14 h-14 rounded-xl bg-[#f0f7f3] overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                      ${(Number(item.price) * Number(item.qty)).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="px-6 py-5 border-t border-gray-100 space-y-3 bg-[#f5f0ea]/40">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">
                  {shipping_fee > 0 ? `$${shipping_fee.toFixed(2)}` : "—"}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-900 border-t border-dashed border-gray-200 pt-3">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        </div>

      </div>

      <style>{`
        @keyframes popIn {
          0% { opacity:0; transform:scale(0.6); }
          70% { transform:scale(1.08); }
          100% { opacity:1; transform:scale(1); }
        }
      `}</style>
    </div>
  );
}