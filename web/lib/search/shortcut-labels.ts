/** Returns ⌘ on Apple platforms, Ctrl elsewhere — for save/draft shortcut hints in UI. */
export function modKeyLabel(): string {
  if (typeof navigator === "undefined") return "Ctrl";
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform) ? "⌘" : "Ctrl";
}

/** Modifier shown for opening search (Alt+K). */
export function searchShortcutLabel(): string {
  return "Alt";
}

/** Full search shortcut label for UI hints, e.g. Alt+K. */
export function searchShortcutKeyLabel(): string {
  return `${searchShortcutLabel()}+K`;
}
