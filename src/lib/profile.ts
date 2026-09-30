/** Public skills profiles: address rules shared by the profile form and the demo backend (the database checks the same). */

export const PROFILE_SLUG_RE = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;

export const SLUG_HELP = "3 to 40 lowercase letters, numbers or hyphens, starting and ending with a letter or number.";

/** "Adaeze Okafor" -> "adaeze-okafor" */
export function suggestSlug(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");
}

export const profilePath = (slug: string) => `/learners/${encodeURIComponent(slug)}`;
