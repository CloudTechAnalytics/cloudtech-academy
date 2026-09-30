import { useState, type RefObject } from "react";
import { Check, Copy, Download, Link2, Share2 } from "lucide-react";
import type { PublicCredential } from "@/lib/backend";
import { linkedInAddToProfile, shareLinks } from "@/lib/badges";
import { downloadSvgPng } from "./CertificateArtwork";
import { buttonClass } from "./Button";

type Props = {
  credential: Pick<PublicCredential, "kind" | "badgeName" | "courseTitle" | "credentialId" | "issuedAt">;
  /** The badge artwork, for Download image. */
  art?: RefObject<SVGSVGElement | null>;
};

const net = "inline-flex items-center justify-center gap-2 rounded-lg border border-line-strong bg-paper px-3.5 py-2 text-[0.875rem] font-semibold text-ink hover:border-ink/40";

/** Every way to share a credential: networks, copy link or text, and the badge image. */
export function ShareMenu({ credential, art }: Props) {
  const links = shareLinks(credential);
  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const copy = async (what: "link" | "text") => {
    try {
      await navigator.clipboard.writeText(what === "link" ? links.url : links.text);
      setCopied(what);
      setTimeout(() => setCopied(null), 2500);
    } catch {
      setError("Your browser blocked copying. Select the link and copy it instead.");
    }
  };
  const download = async () => {
    setError(null);
    try {
      if (art?.current) await downloadSvgPng(art.current, `${credential.credentialId}.png`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't download the image.");
    }
  };

  return (
    <div>
      <p className="flex items-center gap-2 text-[0.875rem] font-semibold">
        <Share2 aria-hidden className="h-4 w-4 text-brass-dark" /> Share your badge
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className={net}>
          LinkedIn
        </a>
        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={net}>
          WhatsApp
        </a>
        <a href={links.facebook} target="_blank" rel="noopener noreferrer" className={net}>
          Facebook
        </a>
        <a href={links.x} target="_blank" rel="noopener noreferrer" className={net}>
          X
        </a>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => copy("link")} className={net}>
          {copied === "link" ? <Check aria-hidden className="h-4 w-4" /> : <Link2 aria-hidden className="h-4 w-4" />}
          {copied === "link" ? "Link copied" : "Copy credential link"}
        </button>
        <button type="button" onClick={() => copy("text")} className={net}>
          {copied === "text" ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />}
          {copied === "text" ? "Text copied" : "Copy text"}
        </button>
        {art && (
          <button type="button" onClick={download} className={net}>
            <Download aria-hidden className="h-4 w-4" /> Download image
          </button>
        )}
      </div>
      {credential.kind === "course_completion" && (
        <a href={linkedInAddToProfile({ ...credential, issuedAt: credential.issuedAt })} target="_blank" rel="noopener noreferrer" className={`mt-3 ${buttonClass("ghost")} px-0`}>
          Add to your LinkedIn profile (Licences & certifications) →
        </a>
      )}
      {error && <p className="mt-2 text-[0.8125rem] text-danger">{error}</p>}
      <span className="sr-only" aria-live="polite">
        {copied ? `${copied === "link" ? "Link" : "Text"} copied` : ""}
      </span>
    </div>
  );
}
