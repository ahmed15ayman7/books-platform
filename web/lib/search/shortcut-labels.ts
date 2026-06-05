/** Returns ⌘ on Apple platforms, Ctrl elsewhere — for shortcut hints in UI. */
export function modKeyLabel(): string {
  if (typeof navigator === "undefined") return "Ctrl";
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? "⌘" : "Ctrl";
}
