"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  image?: string;
  /** Muted loop played on hover/focus of the enclosing card. */
  preview?: string;
  /** Resolved on the server. False renders the placeholder outright. */
  hasImage?: boolean;
  hasPreview?: boolean;
  alt: string;
  /** Shown inside the placeholder when the real asset is absent. */
  label: string;
  ratio?: string;
  active?: boolean;
  className?: string;
  priority?: boolean;
};

/**
 * Media with an honest empty state.
 *
 * No real assets are committed yet, so every slot falls back to a typographic
 * placeholder that names what belongs there. It is styled to look deliberate
 * rather than broken, and it disappears the moment a file exists at the path.
 */
export default function MediaSlot({
  image,
  preview,
  hasImage = false,
  hasPreview = false,
  alt,
  label,
  ratio = "4 / 5",
  active = false,
  className = "",
  priority = false,
}: Props) {
  const [imageFailed, setImageFailed] = useState(!image || !hasImage);
  const [previewFailed, setPreviewFailed] = useState(!preview || !hasPreview);
  const videoRef = useRef<HTMLVideoElement>(null);

  const showPreview = active && !previewFailed;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (showPreview) void video.play().catch(() => {});
    else video.pause();
  }, [showPreview]);

  return (
    <div
      className={`relative overflow-hidden bg-ink-raised ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {!imageFailed && image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={image}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] will-change-transform"
          style={{ transform: active ? "scale(1.04)" : "scale(1)" }}
        />
      ) : (
        <Placeholder label={label} />
      )}

      {preview && !previewFailed ? (
        <video
          ref={videoRef}
          src={preview}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setPreviewFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[var(--ease-out-quart)]"
          style={{ opacity: showPreview ? 1 : 0 }}
        />
      ) : null}
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="grain absolute inset-0 flex items-end justify-between gap-4 bg-ink-raised p-4 sm:p-6">
      <span className="label-caps text-paper-45">{label}</span>
      <span className="label-caps text-paper-25">Awaiting asset</span>
    </div>
  );
}
