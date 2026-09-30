import type { Course } from "@/content/types";
import type { BadgeData } from "@/components/BadgeArtwork";
import { badgeIcon } from "@/components/BadgeIcon";
import type { Credential, PublicCredential } from "./backend/types";
import { credentialUrl } from "./certificates";
import { SITE } from "./site";

/** Everything needed to draw an earned credential as a badge. */
export function credentialBadge(c: PublicCredential | Credential, course?: Course | null): BadgeData {
  const mod = course?.modules.find((m) => m.title === c.moduleTitle);
  return {
    kind: c.kind,
    badgeName: c.badgeName,
    courseTitle: c.courseTitle,
    icon: badgeIcon({ code: mod?.badgeCode, categoryId: course?.categoryId, completion: c.kind === "course_completion" }),
    recipientName: c.recipientName,
    issuedAt: c.issuedAt,
    credentialId: c.credentialId,
  };
}

/** The text people share with a credential. */
export function shareText(c: Pick<PublicCredential, "kind" | "badgeName" | "courseTitle">) {
  return c.kind === "course_completion"
    ? `I've completed ${c.courseTitle} on CloudTech Academy and earned my course completion badge.`
    : `I've earned the "${c.badgeName}" badge from CloudTech Academy, part of ${c.courseTitle}.`;
}

/** Share links for each network. They open the network with the post or link ready. */
export function shareLinks(c: Pick<PublicCredential, "kind" | "badgeName" | "courseTitle" | "credentialId">) {
  const url = credentialUrl(SITE.url, c.credentialId);
  const text = shareText(c);
  const enc = encodeURIComponent;
  return {
    url,
    text: `${text}\n\nVerify it: ${url}`,
    linkedin: `https://www.linkedin.com/feed/?shareActive=true&text=${enc(`${text}\n\n${url}\n\n#CloudTechAcademy #Learning #Skills`)}`,
    whatsapp: `https://wa.me/?text=${enc(`${text} ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    x: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`,
  };
}

/** LinkedIn's "Add licence or certification" form, filled in. For course completions. */
export function linkedInAddToProfile(c: Pick<PublicCredential, "badgeName" | "credentialId" | "issuedAt">) {
  const d = new Date(c.issuedAt);
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: c.badgeName,
    organizationName: SITE.name,
    issueYear: String(d.getFullYear()),
    issueMonth: String(d.getMonth() + 1),
    certId: c.credentialId,
    certUrl: credentialUrl(SITE.url, c.credentialId),
  });
  return `https://www.linkedin.com/profile/add?${params}`;
}
