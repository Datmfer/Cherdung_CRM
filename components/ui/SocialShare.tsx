"use client";

import React, { useState } from "react";
import { Share2, Link, Check, MessageCircle } from "lucide-react";

interface SocialShareProps {
  title?: string;
  text?: string;
  url?: string;
  variant?: "inline" | "dropdown" | "compact";
  className?: string;
}

export default function SocialShare({
  title = "Check this out!",
  text = "Have a look at this page from our platform.",
  url,
  variant = "inline",
  className = "",
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Resolve target URL (falls back to window location on client)
  const targetUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const encodedUrl = encodeURIComponent(targetUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${text} ${targetUrl}`);

  const shareLinks = [
    {
      name: "X (Twitter)",
      icon: (
        <svg className="w-4 h-4 fill-sky-400" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      bgColor: "hover:bg-sky-500/10 hover:border-sky-500/30",
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="w-4 h-4 fill-blue-500" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.64a1.6 1.6 0 1 0 1.6 1.6 1.6 1.6 0 0 0-1.6-1.6z" />
        </svg>
      ),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bgColor: "hover:bg-blue-500/10 hover:border-blue-500/30",
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-4 h-4 text-emerald-400" />,
      href: `https://api.whatsapp.com/send?text=${encodedText}`,
      bgColor: "hover:bg-emerald-500/10 hover:border-emerald-500/30",
    },
    {
      name: "Facebook",
      icon: (
        <svg className="w-4 h-4 fill-blue-600" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.6 13.73 5.6c1.07 0 2.19.19 2.19.19v2.41h-1.24c-1.23 0-1.62.77-1.62 1.56V12h2.72l-.43 3h-2.29v6.8c4.56-.93 8-4.96 8-9.8z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bgColor: "hover:bg-blue-600/10 hover:border-blue-600/30",
    },
  ];

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: targetUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "compact") {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          title="Share page"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 rounded-lg border border-transparent transition-all ${link.bgColor}`}
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </a>
            ))}
            <button
              onClick={() => {
                handleCopyLink();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 rounded-lg border border-transparent hover:bg-slate-800 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link className="w-4 h-4 text-slate-400" />}
              <span>{copied ? "Link Copied!" : "Copy Link"}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mr-1">
        <Share2 className="w-3.5 h-3.5 text-indigo-400" /> Share:
      </span>

      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/80 hover:text-white border border-slate-700/60 rounded-lg transition-all ${link.bgColor}`}
        >
          {link.icon}
          <span className="hidden sm:inline">{link.name}</span>
        </a>
      ))}

      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-lg transition-all"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Link className="w-3.5 h-3.5 text-slate-400" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
