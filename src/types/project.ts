export const PROJECT_ICON_IDS = [
  "playstre",
  "aiJobAssistant",
  "weather",
  "faceRecognition",
  "soulDigits",
  "moreApartments",
  "roboFriends",
] as const;

export type ProjectIconId = (typeof PROJECT_ICON_IDS)[number];

export interface Project {
  id: string;
  title: string;
  description: string;
  /** Set when the card should show a video; omit if using `previewImage` only. May be a path under `public/` or a full `https` URL. With Supabase env vars, paths like `/projectsVideos/foo.mp4` resolve to the public bucket URL. */
  videoSrc?: string;
  /** When set, shown in the card media area instead of `videoSrc` (e.g. static screenshot). */
  previewImage?: string;
  /** Lucide icon for the card when `iconImage` is not set (see `projectIcons` map). */
  icon: ProjectIconId;
  /** Optional image in `public/` (e.g. `/projectsIcon/weather-news.png`). Takes precedence over `icon`. */
  iconImage?: string;
  technologies: string[];
  projectUrl?: string;
  /** Shown as a "Join Beta" action when set (e.g. waitlist or checkout). */
  betaUrl?: string;
  liveDemoUrl?: string;
  /** When set without `liveDemoUrl`, show a “coming soon” state instead of a link. */
  liveDemoComingSoon?: boolean;
  githubUrl?: string;
  /** If true, no public GitHub link; show a “private repository” note instead. */
  githubPrivate?: boolean;
  /** e.g. "beta" — shown in the card when set. */
  productStage?: string;
  linkedinUrl?: string;
}
