import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { AcademyLogo } from "./Logo";
import { navLinks, SITE } from "@/lib/site";
import { useCommunity } from "@/lib/community";

export function Footer() {
  const links = navLinks(!!useCommunity().community);
  const link = "text-[0.9375rem] text-cream/75 transition-colors hover:text-cream";
  return (
    <footer className="bg-night text-cream">
      <div className="container-page grid gap-12 pb-10 pt-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <AcademyLogo size="lg" light />
          <p className="mt-6 max-w-sm text-[0.975rem] leading-relaxed text-cream/70">Practical technology education from CloudTech Analytics.</p>
          <p className="mt-4 text-[0.875rem] text-cream/55">
            A product of{" "}
            <a href={SITE.parentUrl} target="_blank" rel="noopener noreferrer" className="text-cream underline decoration-brass/60 underline-offset-2 hover:decoration-brass-light">
              CloudTech Analytics
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
        <nav aria-label="Academy" className="lg:col-span-3">
          <h2 className="mb-4 text-[0.875rem] font-medium text-cream/50">Academy</h2>
          <ul className="space-y-3">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="CloudTech" className="lg:col-span-4">
          <h2 className="mb-4 text-[0.875rem] font-medium text-cream/50">CloudTech</h2>
          <ul className="space-y-3">
            {SITE.products.map((p) => (
              <li key={p.name}>
                <a href={p.href} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-1.5`}>
                  {p.name}
                  <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-brass-light" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container-page border-t border-cream/12 py-7 text-[0.8125rem] text-cream/55">
        © {new Date().getFullYear()} CloudTech Analytics. All rights reserved.
      </div>
    </footer>
  );
}
