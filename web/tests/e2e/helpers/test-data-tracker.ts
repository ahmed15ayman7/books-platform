export { trackArticle, trackProduct, readTracker } from "../lib/tracker";

export function e2eTitle(runId: string, label: string): string {
  return `e2e-${runId}-${label}`;
}

export function getRunId(): string {
  return process.env["E2E_RUN_ID"] ?? "local";
}
