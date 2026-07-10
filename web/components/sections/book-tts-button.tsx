"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookTtsButtonProps {
  text: string;
  /** BCP-47 language tag, e.g. "ar-SA" or "en-US" */
  lang: string;
  label?: string;
}

type TtsState = "idle" | "playing" | "paused";

function stripMarkdown(md: string): string {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/gs, "$1")
    .replace(/\*(.+?)\*/gs, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/`+/g, "")
    .replace(/^>\s*/gm, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function BookTtsButton({ text, lang, label }: BookTtsButtonProps) {
  const [state, setState] = useState<TtsState>("idle");
  const [supported, setSupported] = useState(true);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const play = useCallback(() => {
    if (!window.speechSynthesis) return;

    if (state === "paused" && uttRef.current) {
      window.speechSynthesis.resume();
      setState("playing");
      return;
    }

    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(stripMarkdown(text));
    utt.lang = lang;
    utt.rate = 1;
    utt.onstart = () => setState("playing");
    utt.onend = () => setState("idle");
    utt.onerror = () => setState("idle");
    utt.onpause = () => setState("paused");
    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, [state, text, lang]);

  const pause = useCallback(() => {
    window.speechSynthesis?.pause();
    setState("paused");
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setState("idle");
  }, []);

  if (!supported) return null;

  const buttonLabel = label ?? (lang.startsWith("ar") ? "استمع للكتاب" : "Listen to book");

  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] px-4 py-3">
      {/* play / pause toggle */}
      <Button
        size="icon"
        variant="ghost"
        aria-label={state === "playing" ? (lang.startsWith("ar") ? "إيقاف مؤقت" : "Pause") : buttonLabel}
        onClick={state === "playing" ? pause : play}
        className="h-9 w-9 shrink-0 rounded-full bg-[var(--brand-red)] text-white hover:bg-[var(--brand-red)]/90 hover:text-white"
      >
        {state === "playing" ? (
          <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
        ) : (
          <Play className="h-4 w-4 fill-current" aria-hidden="true" />
        )}
      </Button>

      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--brand-gray-700)]">
        {state === "playing"
          ? lang.startsWith("ar") ? "جارٍ التشغيل…" : "Playing…"
          : state === "paused"
            ? lang.startsWith("ar") ? "متوقف مؤقتاً" : "Paused"
            : buttonLabel}
      </span>

      {/* stop — visible only while active */}
      {state !== "idle" && (
        <Button
          size="icon"
          variant="ghost"
          aria-label={lang.startsWith("ar") ? "إيقاف" : "Stop"}
          onClick={stop}
          className="h-8 w-8 shrink-0 rounded-full text-[var(--brand-gray-500)] hover:text-[var(--brand-red)]"
        >
          <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
