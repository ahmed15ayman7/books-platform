/** Mobile store URLs — set in env when the apps are published. */
export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() ?? "";
export const GOOGLE_PLAY_URL = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL?.trim() ?? "";

export function hasAppStoreLinks(): boolean {
  return Boolean(APP_STORE_URL || GOOGLE_PLAY_URL);
}
