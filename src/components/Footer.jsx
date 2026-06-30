import { Link } from "react-router";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0f3d2e] text-white font-[Poppins]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-semibold tracking-wide">
              Jaydor
            </Link>
            <p className="text-sm text-white/60 mt-3 leading-relaxed max-w-xs">
              Things worth keeping — chosen slowly, made to outlast the season.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              <SocialIcon label="Instagram">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a6 6 0 11-12 0 6 6 0 0112 0z" />
                <rect x="2" y="2" width="20" height="20" rx="5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
              </SocialIcon>
              <SocialIcon label="Twitter / X">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4l16 16M20 4L4 20" />
              </SocialIcon>
              <SocialIcon label="Facebook">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 8h2V4h-2a4 4 0 00-4 4v2H9v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1z" />
              </SocialIcon>
            </div>
          </div>

          {/* SHOP LINKS */}
          <FooterColumn title="Shop">
            <FooterLink to="/products">All products</FooterLink>
            <FooterLink to="/">New arrivals</FooterLink>
            <FooterLink to="/">Best sellers</FooterLink>
          </FooterColumn>

          {/* COMPANY LINKS */}
          <FooterColumn title="Company">
            <FooterLink to="/about">About us</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/">Careers</FooterLink>
          </FooterColumn>

          {/* SUPPORT LINKS */}
          <FooterColumn title="Support">
            <FooterLink to="/">Shipping &amp; returns</FooterLink>
            <FooterLink to="/">FAQs</FooterLink>
            <FooterLink to="/">Privacy policy</FooterLink>
          </FooterColumn>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-14 pt-6 border-t border-[#1a4d3c] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50">
            &copy; {year} Jaydor. All rights reserved.
          </p>
          <p className="text-xs text-white/50">
            Made with care in Karachi, Pakistan.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">
        {title}
      </h4>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-white/80 hover:text-white transition-colors duration-200 relative inline-block group"
      >
        {children}
        <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
      </Link>
    </li>
  );
}

function SocialIcon({ label, children }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#0f3d2e] transition-all duration-300 hover:scale-110"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        {children}
      </svg>
    </a>
  )
}