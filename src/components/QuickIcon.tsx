import {
  BarChart3,
  Clapperboard,
  FileUser,
  IdCard,
  Megaphone,
  MessageSquareText,
  Palette,
  Presentation,
  Sparkles,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

/** Icons a quick course can name in its front matter (`icon: sparkles`). */
export const QUICK_ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  chat: MessageSquareText,
  wand: WandSparkles,
  slides: Presentation,
  megaphone: Megaphone,
  video: Clapperboard,
  palette: Palette,
  cv: FileUser,
  chart: BarChart3,
  profile: IdCard,
};

export const quickIcon = (key: string): LucideIcon => QUICK_ICONS[key] ?? Sparkles;
