import { useState } from "react";

const TOPICS = ["Order help", "Product question", "Wholesale", "Something else"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  const errors = {
    name: form.name.trim().length === 0 ? "Tell us your name" : "",
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "Enter a valid email" : "",
    message: form.message.trim().length < 10 ? "A few more words would help" : "",
  };
  const isValid = !errors.name && !errors.email && !errors.message;

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleBlur = (field) => () =>
    setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!isValid) return;

    setStatus("sending");
    await new Promise((resolve) => setTimeout(resolve, 1100)); // simulated send
    setStatus("sent");
  };

  const resetForm = () => {
    setForm({ name: "", email: "", topic: TOPICS[0], message: "" });
    setTouched({});
    setStatus("idle");
  };

  return (
    <div className="bg-[#f5f0ea] font-[Poppins] min-h-screen">

      {/* HERO */}
      <section className="relative bg-[#0f3d2e] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 sm:px-10 pt-20 pb-24 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-5 animate-[fadeSlide_0.6s_ease-out]">
            Say hello
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight animate-[fadeSlide_0.6s_ease-out_0.1s_both]">
            Let's talk
          </h1>
          <p className="mt-5 text-white/70 text-sm sm:text-base max-w-md mx-auto animate-[fadeSlide_0.6s_ease-out_0.2s_both]">
            Order questions, product details, or just want to tell us
            something — a real person reads every message here.
          </p>
        </div>
        <svg
          className="relative block w-full text-[#f5f0ea]"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,32 C240,60 480,0 720,16 C960,32 1200,60 1440,28 L1440,60 L0,60 Z"
          />
        </svg>
      </section>

      {/* FORM + INFO */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-16 grid md:grid-cols-5 gap-10">

        {/* Quick info column */}
        <div className="md:col-span-2 space-y-6">
          <InfoCard
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            }
            title="Email"
            value="hello@jaydor.com"
          />
          <InfoCard
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-1.93.965a11.04 11.04 0 005.516 5.516l.964-1.93a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            }
            title="Phone"
            value="+92 300 1234567"
          />
          <InfoCard
            icon={
              <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </>
            }
            title="Studio"
            value="Karachi, Pakistan"
          />

          <div className="bg-white rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Response time
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              We typically reply within one business day. Order issues are
              usually first.
            </p>
          </div>
        </div>

        {/* Form column */}
        <div className="md:col-span-3 bg-white rounded-2xl shadow-sm p-7 sm:p-9 relative overflow-hidden">

          {/* Success state */}
          <div
            className={`absolute inset-0 bg-white flex flex-col items-center justify-center text-center px-8 transition-all duration-500 ${
              status === "sent" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-[#0f3d2e] flex items-center justify-center mb-5 animate-[popIn_0.4s_ease-out]">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Message sent</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Thanks, {form.name.split(" ")[0] || "there"} — we'll get back to you at {form.email}.
            </p>
            <button
              onClick={resetForm}
              className="text-sm font-semibold text-[#0f3d2e] hover:underline"
            >
              Send another message
            </button>
          </div>

          {/* Form itself */}
          <form
            onSubmit={handleSubmit}
            className={`flex flex-col gap-5 transition-opacity duration-300 ${
              status === "sent" ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                label="Name"
                value={form.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                error={touched.name && errors.name}
                placeholder="Your name"
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                error={touched.email && errors.email}
                placeholder="you@example.com"
              />
            </div>

            {/* Topic chips */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Topic</label>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, topic: t }))}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                      form.topic === t
                        ? "bg-[#0f3d2e] border-[#0f3d2e] text-white scale-100"
                        : "bg-[#f5f0ea] border-transparent text-gray-600 hover:border-[#0f3d2e]/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={handleChange("message")}
                onBlur={handleBlur("message")}
                placeholder="What's on your mind?"
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition resize-none ${
                  touched.message && errors.message
                    ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                    : "border-gray-300 focus:ring-[#0f3d2e]/30 focus:border-[#0f3d2e]"
                }`}
              />
              <div className="flex justify-between items-center mt-0.5">
                <span className="text-red-600 text-xs">
                  {touched.message && errors.message}
                </span>
                <span className="text-xs text-gray-400">{form.message.length}/500</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-1 w-full py-3.5 rounded-full font-bold text-sm text-white bg-[#0f3d2e] hover:bg-[#154d3b] transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {status === "sending" ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                "Send message"
              )}
            </button>
          </form>
        </div>
      </section>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.7); }
          70% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function Field({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition ${
          error
            ? "border-red-400 focus:ring-red-200 focus:border-red-500"
            : "border-gray-300 focus:ring-[#0f3d2e]/30 focus:border-[#0f3d2e]"
        }`}
      />
      <span className="text-red-600 text-xs">{error}</span>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4 group hover:shadow-md transition-shadow duration-300">
      <div className="w-11 h-11 rounded-full bg-[#f5f0ea] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        <svg className="w-5 h-5 text-[#0f3d2e]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <div>
        <p className="text-xs text-gray-400">{title}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}