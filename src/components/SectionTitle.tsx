import type { ReactNode } from "react";

type SectionTitleProps = { kicker?: string; children: ReactNode; light?: boolean };

export function SectionTitle({ kicker, children, light = false }: SectionTitleProps) {
  return <div className={`title ${light ? "light" : ""}`}>{kicker ? <p className="eyebrow">{kicker}</p> : null}<h2>{children}</h2></div>;
}

type AccentTitleProps = { title: string; accent: string };

export function AccentTitle({ title, accent }: AccentTitleProps) {
  const [before, after = ""] = title.split(accent);
  return <>{before}<span>{accent}</span>{after}</>;
}

type HighlightedTextProps = { text: string; highlight: string };

export function HighlightedText({ text, highlight }: HighlightedTextProps) {
  const [before, after = ""] = text.split(highlight);
  return <>{before}<b>{highlight}</b>{after}</>;
}
