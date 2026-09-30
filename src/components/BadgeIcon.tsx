import {
  Award,
  BarChart3,
  Clapperboard,
  Database,
  FileUser,
  IdCard,
  LayoutDashboard,
  Megaphone,
  MessageSquareText,
  Palette,
  Presentation,
  Sparkles,
  Table2,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

/** Icon on a module badge, by the module's badge code. */
const BY_CODE: Record<string, LucideIcon> = {
  PROMPT: WandSparkles,
  CLAUDE: Sparkles,
  CHATGPT: MessageSquareText,
  SLIDES: Presentation,
  SOCIAL: Megaphone,
  CANVA: Palette,
  CAPCUT: Clapperboard,
  CV: FileUser,
  LINKEDIN: IdCard,
  EXCEL: BarChart3,
};

/** Fallback icon by course category. */
const BY_CATEGORY: Record<string, LucideIcon> = {
  "ai-productivity": Sparkles,
  "design-content": Palette,
  career: FileUser,
  "data-analytics": BarChart3,
  "business-intelligence": LayoutDashboard,
  databases: Database,
};

export function badgeIcon(opts: { code?: string | null; categoryId?: string; completion?: boolean }): LucideIcon {
  if (opts.completion) return Award;
  return (opts.code && BY_CODE[opts.code]) || (opts.categoryId && BY_CATEGORY[opts.categoryId]) || Table2;
}
