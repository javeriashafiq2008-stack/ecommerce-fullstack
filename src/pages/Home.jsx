import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ShopContext } from "../components/context/ShopContext";

// A soft ambient glow that drifts toward the cursor with a gentle lag,
// instead of snapping to it — gives it weight instead of feeling robotic.
function CursorGlow({ containerRef }) {
  const glowRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Start centered so it doesn't fly in from a corner on first paint
    const rect = container.getBoundingClientRect();
    target.current = { x: rect.width / 2, y: rect.height / 2 };
    pos.current = { ...target.current };

    const handleMove = (e) => {
      const r = container.getBoundingClientRect();
      target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    container.addEventListener("mousemove", handleMove);

    const animate = () => {
      // Ease toward the target — the smaller the factor, the lazier the trail
      pos.current.x += (target.current.x - pos.current.x) * 0.08;
      pos.current.y += (target.current.y - pos.current.y) * 0.08;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", handleMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [containerRef]);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(245,240,234,0.35) 0%, rgba(26,77,60,0.18) 45%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
}

function Home() {
  const { products } = useContext(ShopContext);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Lets the entrance animation kick in just after first paint
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  const goToProducts = () => {
    navigate("/products");
  };

  const scrollToProducts = () => {
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
 

      {/* INTRO HERO */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-[#0f3d2e] min-h-[88vh] flex items-center justify-center font-[Poppins]"
      >
        <CursorGlow containerRef={heroRef} />

        {/* Faint dot texture for depth, sits above the glow, below the text */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative text-center px-6 max-w-3xl mx-auto">
          <p
            className={`text-xs uppercase tracking-[0.35em] text-white/60 mb-6 transition-all duration-700 ease-out ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            Jaydor
          </p>

          <h1
            className={`text-5xl sm:text-7xl font-semibold text-white leading-[1.05] transition-all duration-700 ease-out ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            Things worth
            <br />
            <span className="italic font-light text-[#e8ddc8]">keeping.</span>
          </h1>

          <p
            className={`mt-7 text-white/65 text-sm sm:text-base max-w-md mx-auto leading-relaxed transition-all duration-700 ease-out ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            {products.length > 0
              ? `${products.length} pieces, chosen slowly, made to outlast the season.`
              : "Pieces chosen slowly, made to outlast the season."}
          </p>

          <div
            className={`mt-10 transition-all duration-700 ease-out ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <button
              onClick={goToProducts}
              className="bg-white text-[#0f3d2e] px-9 py-3.5 rounded-full text-sm font-semibold hover:bg-[#f5f0ea] transition-all duration-300 hover:scale-105"
            >
              Browse the shop
            </button>
          </div>
        </div>

        {/* Scroll cue */}
        <button
          onClick={scrollToProducts}
          aria-label="Scroll to products"
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-all duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </section>

     </>
  );
}

export default Home;