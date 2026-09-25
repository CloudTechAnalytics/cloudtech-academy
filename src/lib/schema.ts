/** schema.org structured data for search engines. */
import type { Course } from "@/content/types";
import { SITE } from "./site";
import { publishedLessons } from "./certificates";

const ORG_ID = `${SITE.url}/#organization`;

export function sitewideJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": ORG_ID,
      name: SITE.name,
      url: `${SITE.url}/`,
      logo: `${SITE.url}/icon-512.png`,
      description: "Practical, self-paced courses in data, analytics and technology from CloudTech Analytics.",
      parentOrganization: { "@type": "Organization", name: SITE.parent, url: SITE.parentUrl },
      address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
    },
  ];
}

export function webSiteJsonLd() {
  return { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: `${SITE.url}/`, publisher: { "@id": ORG_ID } };
}

export function breadcrumbs(items: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE.url}${path}` })),
  };
}

export function courseJsonLd(c: Course) {
  const lessons = publishedLessons(c);
  const minutes = lessons.reduce((m, l) => m + l.minutes, 0);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.title,
    description: c.description,
    url: `${SITE.url}/courses/${c.slug}`,
    provider: { "@type": "EducationalOrganization", "@id": ORG_ID, name: SITE.name, sameAs: `${SITE.url}/` },
    inLanguage: "en",
    isAccessibleForFree: c.isFree,
    teaches: c.skills,
    coursePrerequisites: c.prerequisites,
    educationalLevel: c.levelLabel,
    ...(c.certificate.enabled ? { educationalCredentialAwarded: `CloudTech Academy Certificate of Completion: ${c.title}` } : {}),
    offers: { "@type": "Offer", category: c.isFree ? "Free" : "Paid", price: 0, priceCurrency: "NGN" },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: minutes ? `PT${Math.round(minutes / 60)}H` : undefined,
    },
  };
}
