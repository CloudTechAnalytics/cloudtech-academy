import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { getBackend, type CommunitySource, type PublicCommunity } from "./backend";
import { buttonClass } from "@/components/Button";

type CommunityState = { loaded: boolean; community: PublicCommunity | null; refresh: () => Promise<void> };

const CommunityContext = createContext<CommunityState>({ loaded: false, community: null, refresh: async () => undefined });

/**
 * The Academy's WhatsApp community, loaded once. It's null while the community is switched off or has no
 * link yet, and every Community button and link in the app reads from here: there is no hardcoded link.
 * Starts empty on both server and client so prerendered pages match.
 */
export function CommunityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ loaded: boolean; community: PublicCommunity | null }>({ loaded: false, community: null });
  const refresh = useCallback(async () => {
    try {
      const community = await (await getBackend()).getCommunity();
      setState({ loaded: true, community });
    } catch {
      setState({ loaded: true, community: null });
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return <CommunityContext.Provider value={{ ...state, refresh }}>{children}</CommunityContext.Provider>;
}

export const useCommunity = () => useContext(CommunityContext);

/**
 * The button that opens the WhatsApp community. It uses the admin's current link and button text, counts the
 * press (never blocking it), and renders nothing while the community is off.
 */
export function CommunityButton({
  source,
  variant = "primary",
  className = "",
  children,
  icon = true,
}: {
  source: CommunitySource;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  /** Overrides the admin's button text, e.g. "Join WhatsApp Community" on the welcome step. */
  children?: ReactNode;
  icon?: boolean;
}) {
  const { community } = useCommunity();
  if (!community) return null;
  return (
    <a
      href={community.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClass(variant, className)}
      onClick={() => void getBackend().then((b) => b.trackCommunityClick(source)).catch(() => undefined)}
    >
      {icon && <MessageCircle aria-hidden className="h-4 w-4" />}
      {children ?? community.buttonText}
      <span className="sr-only"> (opens WhatsApp in a new tab)</span>
    </a>
  );
}
