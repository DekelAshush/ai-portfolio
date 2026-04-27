/**
 * Resolves a video URL for video elements and demo links.
 *
 * **Full `https` URLs** — returned as-is (e.g. CDN or pasted Supabase link).
 *
 * **Supabase public bucket** — when `NEXT_PUBLIC_SUPABASE_URL` and
 * `NEXT_PUBLIC_PORTFOLIO_VIDEOS_BUCKET` are set, relative paths become
 * `/storage/v1/object/public/{bucket}/...` URLs.
 *
 * **Otherwise** — relative paths are used as static files from `public/`.
 */
export function resolveVideoUrl(href: string | undefined): string | undefined {
  if (href == null || href === "" || href === "NA") return undefined;

  if (/^https?:\/\//i.test(href)) {
    return href;
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = process.env.NEXT_PUBLIC_PORTFOLIO_VIDEOS_BUCKET;

  if (base && bucket) {
    const key = href.replace(/^\//, "");
    if (!key) return undefined;
    const origin = base.replace(/\/$/, "");
    return `${origin}/storage/v1/object/public/${bucket}/${encodePathSegments(key)}`;
  }

  return href;
}

/** Encode each path segment for URL (spaces, non-ASCII) without double-encoding `/`. */
function encodePathSegments(path: string): string {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}
