export async function fetchFavicon(url: string): Promise<string | null> {
  try {
    const parsed = new URL(url);
    const domain = parsed.origin;

    // Try Google's favicon service first
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
  } catch {
    return null;
  }
}
