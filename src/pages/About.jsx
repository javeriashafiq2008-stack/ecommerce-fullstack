import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

// Reveals children with a fade/slide once they scroll into view.
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

const MILESTONES = [
  {
    year: "2018",
    title: "A workbench in Lahore",
    text: "Jaydor started as a single workbench and a stubborn belief: everyday objects deserve the same care as heirlooms.",
  },
  {
    year: "2020",
    title: "First hundred pieces",
    text: "We sold our first hundred pieces by hand, packing every order ourselves and reading every piece of feedback twice.",
  },
  {
    year: "2022",
    title: "Slower, on purpose",
    text: "We capped our product count instead of chasing more SKUs, choosing fewer things made properly over a flooded catalogue.",
  },
  {
    year: "Now",
    title: "Still the workbench",
    text: "Bigger team, same instinct — every product earns its place because someone on our team would actually keep it.",
  },
];

const VALUES = [
  {
    title: "Made to be used",
    text: "Nothing leaves our shelves until it survives daily, unglamorous use — not just a photoshoot.",
  },
  {
    title: "Honest materials",
    text: "We name what things are made of, in plain language, before you ever add them to your cart.",
  },
  {
    title: "Slow by design",
    text: "Fewer releases, longer testing. We'd rather ship four good things a year than forty forgettable ones.",
  },
];

export default function About() {
  return (
    <div className="bg-[#f5f0ea] font-[Poppins] overflow-hidden">

      {/* HERO */}
      <section className="relative bg-[#0f3d2e] text-white">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 pt-24 pb-28 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-5">
              Our story
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-4xl sm:text-6xl font-semibold leading-tight">
              Things worth
              <br />
              <span className="italic font-light text-[#e8ddc8]">keeping.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-xl mx-auto text-white/70 text-sm sm:text-base leading-relaxed">
              Jaydor began as a question: what if the things in your home had
              to earn the right to stay there? Six years later, that question
              still runs the company.
            </p>
          </Reveal>
        </div>

        {/* Bottom wave divider */}
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

      {/* MILESTONES — animated vertical timeline */}
      <section className="max-w-3xl mx-auto px-6 sm:px-10 py-20">
        <Reveal>
          <h2 className="text-xs uppercase tracking-[0.3em] text-[#1a4d3c] font-medium text-center mb-2">
            How we got here
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="text-center text-2xl sm:text-3xl font-semibold text-gray-900 mb-16">
            A slow, deliberate build
          </p>
        </Reveal>

        <div className="relative pl-10 sm:pl-14">
          {/* Growing line */}
          <TimelineSpine />

          <div className="space-y-14">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.year} delay={i * 80} className="relative">
                <span className="absolute -left-10 sm:-left-14 top-1 w-5 h-5 rounded-full bg-[#0f3d2e] ring-4 ring-[#f5f0ea] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0f3d2e]">
                  {m.year}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-1">
                  {m.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed max-w-md">
                  {m.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <Reveal>
            <h2 className="text-xs uppercase tracking-[0.3em] text-[#1a4d3c] font-medium text-center mb-2">
              What we hold onto
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-center text-2xl sm:text-3xl font-semibold text-gray-900 mb-14">
              Three rules we don't break
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className="group h-full bg-[#f5f0ea] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-[#0f3d2e]/10">
                  <div className="w-10 h-10 rounded-full bg-[#0f3d2e] text-white flex items-center justify-center text-sm font-semibold mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    {i + 1}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {v.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0f3d2e] py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              Curious how something's made?
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-white/70 text-sm sm:text-base mb-8">
              We answer every materials question ourselves — no scripts, no bots.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <Link
              to="/contact"
              className="inline-block bg-white text-[#0f3d2e] px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#f5f0ea] transition-all duration-300 hover:scale-105"
            >
              Get in touch
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

// The vertical line that "grows" downward once the timeline scrolls into view.
function TimelineSpine() {
  const ref = useRef(null);
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGrown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute left-0 top-1 bottom-0 w-px bg-gray-200 sm:left-0"
      style={{ marginLeft: "0px" }}
    >
      <div
        className="w-px bg-[#0f3d2e] transition-all duration-[1500ms] ease-out"
        style={{ height: grown ? "100%" : "0%" }}
      />
    </div>
  );
}