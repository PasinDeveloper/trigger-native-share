"use client";

import { useState, useCallback } from "react";
import { Share2, Link, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

type ShareState = "idle" | "sharing" | "copied" | "error";

/** Returns true when the browser exposes the native Web Share API. */
function isWebShareSupported(): boolean {
  return (
    typeof navigator !== "undefined" && "share" in navigator
  );
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [shareState, setShareState] = useState<ShareState>("idle");
  const supportsShare = isWebShareSupported();

  const handleShare = useCallback(async () => {
    setShareState("sharing");

    const shareData: ShareData = { title, text, url };

    if (supportsShare) {
      // Validate payload before attempting to share (defensive check)
      if (navigator.canShare && !navigator.canShare(shareData)) {
        await copyToClipboard(url, setShareState);
        return;
      }

      try {
        await navigator.share(shareData);
        setShareState("idle");
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          // User safely dismissed the native share dialog — not an error
          setShareState("idle");
        } else {
          // Real share error — fall back to clipboard copy
          console.error("Share failed:", error);
          await copyToClipboard(url, setShareState);
        }
      }
    } else {
      // Web Share API not supported — fall back to clipboard copy
      await copyToClipboard(url, setShareState);
    }
  }, [title, text, url, supportsShare]);

  if (shareState === "copied") {
    return (
      <Button variant="secondary" size="sm" className="gap-2" disabled>
        <CheckCheck className="h-4 w-4 text-green-600" />
        <span>Link Copied!</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleShare}
      disabled={shareState === "sharing"}
      aria-label="Share this recipe"
    >
      {supportsShare ? (
        <Share2 className="h-4 w-4" />
      ) : (
        <Link className="h-4 w-4" />
      )}
      <span>
        {shareState === "sharing"
          ? "Sharing…"
          : supportsShare
          ? "Share Recipe"
          : "Copy Link"}
      </span>
    </Button>
  );
}

async function copyToClipboard(
  url: string,
  setState: (s: ShareState) => void
) {
  try {
    await navigator.clipboard.writeText(url);
    setState("copied");
    setTimeout(() => setState("idle"), 2500);
  } catch {
    setState("error");
    setTimeout(() => setState("idle"), 2000);
  }
}

