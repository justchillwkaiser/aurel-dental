"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/format";

interface ProgressiveImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  wrapperClassName?: string;
  /** Keep LCP hero image visible immediately on paint without opacity fade-in delay. */
  skipFadeOnPriority?: boolean;
  /** Optional subtle caption shown inside the loading skeleton box. */
  skeletonLabel?: string;
}

export function ProgressiveImage({
  className,
  wrapperClassName,
  alt,
  src,
  fill,
  skipFadeOnPriority = false,
  skeletonLabel,
  ...props
}: ProgressiveImageProps) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
    skipFadeOnPriority ? "loaded" : "loading"
  );
  const [attempt, setAttempt] = React.useState(0);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  // Reset cleanly if src changes (e.g., DisciplineIndex specimen tab switch).
  const srcKey = typeof src === "string" ? src : JSON.stringify(src);
  const [prevSrcKey, setPrevSrcKey] = React.useState(srcKey);
  if (srcKey !== prevSrcKey) {
    setPrevSrcKey(srcKey);
    if (!skipFadeOnPriority) {
      setStatus("loading");
    }
  }

  // Handle cached images whose onLoad fired before hydration attached the listener.
  React.useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      const rafId = window.requestAnimationFrame(() => setStatus("loaded"));
      return () => window.cancelAnimationFrame(rafId);
    }
  }, [srcKey, attempt]);

  const showSkeleton = status === "loading" && !skipFadeOnPriority;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--panel)]",
        fill && "h-full w-full",
        wrapperClassName
      )}
    >
      {showSkeleton && (
        <div
          aria-hidden="true"
          className="atelier-skeleton absolute inset-0 z-10 flex items-end p-3"
        >
          {skeletonLabel && (
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[var(--ink-9)]">
              {skeletonLabel}
            </span>
          )}
        </div>
      )}

      {status === "error" ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 border border-[var(--line)] bg-[var(--panel)] p-4 text-center"
        >
          <ImageOff
            className="size-5 text-[var(--ink-9)]"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          <p className="max-w-[220px] text-[12px] leading-[18px] text-[var(--ink-10)]">
            {alt}
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus("loading");
              setAttempt((a) => a + 1);
            }}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--raised)] px-3 text-[12px] font-medium text-[var(--ink-12)] hover:border-[var(--ink-8)]"
          >
            <RefreshCw className="size-3" aria-hidden="true" />
            <span>Retry Image</span>
          </button>
        </div>
      ) : (
        <Image
          key={`${srcKey}-${attempt}`}
          ref={imgRef}
          src={src}
          alt={alt}
          fill={fill}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            skipFadeOnPriority
              ? "opacity-100"
              : "transition-opacity duration-300 ease-[var(--ease-atelier)] motion-reduce:transition-none",
            !skipFadeOnPriority &&
              (status === "loaded" ? "opacity-100" : "opacity-0"),
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}
