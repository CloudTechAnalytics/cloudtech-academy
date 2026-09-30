export const SITE = {
  name: "CloudTech Academy",
  parent: "CloudTech Analytics",
  parentUrl: "https://www.cloudtechanalytics.com",
  email: "cloudtechanalytics.consultant@gmail.com",
  /** Public address used for canonical URLs, previews, the sitemap and certificate verification links. */
  url: ((import.meta.env.VITE_SITE_URL as string | undefined) || "https://academy.cloudtechanalytics.com").replace(/\/$/, ""),
  googleVerification: (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined) ?? "",
  products: [
    { name: "The Counsel", href: "https://thecounsels.org" },
    { name: "The Manifest", href: "https://the-manifest-test.vercel.app" },
    { name: "CloudTech Analytics", href: "https://www.cloudtechanalytics.com" },
  ],
} as const;

export const NAV_LINKS = [
  { to: "/courses", label: "Courses" },
  { to: "/quick", label: "Quick Skills" },
  { to: "/paths", label: "Learning Paths" },
  { to: "/projects", label: "Projects" },
  { to: "/certificates", label: "Certificates" },
  { to: "/about", label: "About" },
] as const;
