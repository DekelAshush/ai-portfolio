import {
  Bot,
  Briefcase,
  Building2,
  CloudSun,
  Gamepad2,
  ScanFace,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ProjectIconId } from "@/types/project";

export const PROJECT_ICONS: Record<ProjectIconId, LucideIcon> = {
  playstre: Gamepad2,
  aiJobAssistant: Briefcase,
  weather: CloudSun,
  faceRecognition: ScanFace,
  soulDigits: Sparkles,
  moreApartments: Building2,
  roboFriends: Bot,
};
