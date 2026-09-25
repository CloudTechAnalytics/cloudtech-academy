import { useSeo } from "@/lib/seo";
import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  useSeo({ title: "Page not found | CloudTech Academy", description: "This page doesn't exist.", noindex: true });
  return (
    <div className="container-page py-24 sm:py-32">
      <p className="kicker">404</p>
      <h1 className="mt-4 font-serif text-[2.6rem] leading-tight sm:text-[3.2rem]">We couldn't find that page.</h1>
      <p className="mt-4 max-w-xl text-[1.0625rem] text-muted">The link may be old or mistyped. The course catalogue is a good place to pick things up again.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/courses" arrow>
          Browse courses
        </ButtonLink>
        <ButtonLink to="/" variant="secondary">
          Home
        </ButtonLink>
      </div>
    </div>
  );
}
