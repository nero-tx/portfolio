"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectCodePreview } from "@/utils/main-data";

gsap.registerPlugin(ScrollTrigger);

const KEYWORDS =
  /\b(const|let|fn|use|pub|impl|struct|async|await|return|if|else|match|for|while|import|export|function|from)\b/g;
const STRINGS = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
const COMMENTS = /(\/\/.*$|#.*$)/gm;

function highlight(line: string) {
  const tokens: { text: string; cls: string }[] = [];
  let rest = line;
  let cursor = 0;

  const matches = [
    ...[...line.matchAll(COMMENTS)].map((m) => ({
      ...m,
      cls: "text-[#E8DCC8]/35",
    })),
    ...[...line.matchAll(STRINGS)].map((m) => ({
      ...m,
      cls: "text-[#7C8B7A]",
    })),
    ...[...line.matchAll(KEYWORDS)].map((m) => ({
      ...m,
      cls: "text-[#D98C4A]/90",
    })),
  ].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  for (const m of matches) {
    const start = m.index ?? 0;
    if (start < cursor) continue; // skip overlaps
    if (start > cursor)
      tokens.push({
        text: line.slice(cursor, start),
        cls: "text-[#E8DCC8]/80",
      });
    tokens.push({ text: m[0], cls: m.cls });
    cursor = start + m[0].length;
  }
  if (cursor < line.length)
    tokens.push({ text: line.slice(cursor), cls: "text-[#E8DCC8]/80" });
  return tokens.length ? tokens : [{ text: line, cls: "text-[#E8DCC8]/80" }];
}

interface Props {
  preview: ProjectCodePreview;
  className?: string;
}

export default function CodePreview({ preview, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const hasCode = !!preview.code;
  const hasTerminal = !!preview.terminal;
  const codeLines = preview.code?.snippet.split("\n") ?? [];
  const termLines = preview.terminal?.lines ?? [];

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const codeEls = gsap.utils.toArray<HTMLElement>(
        ".code-line-mask",
        root.current,
      );
      const termEls = gsap.utils.toArray<HTMLElement>(
        ".term-line-mask",
        root.current,
      );
      const cursor = root.current?.querySelector<HTMLElement>(".term-cursor");

      if (reduceMotion) {
        gsap.set([...codeEls, ...termEls], { clipPath: "inset(0% 0% 0% 0%)" });
        cursor?.classList.add("term-cursor-active");
        return;
      }

      gsap.set([...codeEls, ...termEls], { clipPath: "inset(0% 100% 0% 0%)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      const revealLines = (els: HTMLElement[], startLabel?: string) => {
        els.forEach((el, i) => {
          const charCount = Math.max(el.textContent?.length ?? 10, 1);
          const duration = Math.min(Math.max(charCount * 0.024, 0.2), 1.1);
          tl.to(
            el,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration,
              ease: `steps(${charCount})`,
            },
            i === 0 ? (startLabel ?? 0) : "+=0.08",
          );
        });
      };

      // code types in first
      if (codeEls.length) revealLines(codeEls);
      // then, after a beat (like switching to the terminal), the command runs
      if (termEls.length) revealLines(termEls, "+=0.35");

      tl.call(() => cursor?.classList.add("term-cursor-active"), [], "+=0.1");
    },
    { scope: root, dependencies: [preview] },
  );

  return (
    <div
      ref={root}
      className={`overflow-hidden rounded-lg border h-full border-[#E8DCC8]/10 bg-[#0A0908] ${className}`}
    >
      {hasCode && preview.code && (
        <>
          <div className="flex items-center gap-2 border-b border-[#E8DCC8]/10 px-4 py-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C8B7A]/50" />
            <span className="font-mono text-[11px] tracking-wide text-[#E8DCC8]/40">
              {preview.code.language}
            </span>
          </div>
          <div className="space-y-1 px-5 py-5 font-mono text-[13px] leading-relaxed">
            {codeLines.map((line, i) => (
              <div
                key={i}
                className="code-line-mask"
                style={{ clipPath: "inset(0% 0% 0% 0%)" }}
              >
                {highlight(line).map((t, j) => (
                  <span key={j} className={t.cls}>
                    {t.text}
                  </span>
                ))}
                {line === "" && "\u00A0"}
              </div>
            ))}
          </div>
        </>
      )}

      {hasTerminal && preview.terminal && (
        <>
          <div
            className={`flex items-center gap-2 px-4 py-2.5 ${
              hasCode
                ? "border-t border-[#E8DCC8]/10"
                : "border-b border-[#E8DCC8]/10"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#D98C4A]/50" />
            <span className="font-mono text-[11px] tracking-wide text-[#E8DCC8]/40">
              {preview.terminal.prompt}
            </span>
          </div>
          <div className="space-y-1.5 px-5 py-5 font-mono text-[13px] leading-relaxed">
            {termLines.map((line, i) => (
              <div
                key={i}
                className="term-line-mask"
                style={{ clipPath: "inset(0% 0% 0% 0%)" }}
              >
                <span
                  className={
                    line.type === "input"
                      ? "text-[#E8DCC8]"
                      : line.type === "comment"
                        ? "text-[#E8DCC8]/35"
                        : "text-[#D98C4A]/85"
                  }
                >
                  {line.type === "input"
                    ? "❯ "
                    : line.type === "comment"
                      ? "# "
                      : ""}
                  {line.text}
                </span>
              </div>
            ))}
            <span
              className="term-cursor inline-block h-3.5 w-2 translate-y-0.5 bg-[#D98C4A]/80 opacity-0"
              aria-hidden="true"
            />
          </div>
        </>
      )}

      <style jsx>{`
        .term-cursor.term-cursor-active {
          opacity: 1;
          animation: term-blink 1s steps(1) infinite;
        }
        @keyframes term-blink {
          50% {
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .term-cursor.term-cursor-active {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
