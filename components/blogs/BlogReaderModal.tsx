"use client";

import React from "react";
import { X, Calendar, User as UserIcon, Tag, Clock, BookOpen } from "lucide-react";
import SocialShare from "@/components/ui/SocialShare";
import { BlogItem } from "./BlogFeed";

interface BlogReaderModalProps {
  blog: BlogItem | null;
  onClose: () => void;
}

export default function BlogReaderModal({ blog, onClose }: BlogReaderModalProps) {
  if (!blog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Article Reader
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Category Badge */}
          <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
            {blog.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            {blog.title}
          </h1>

          {/* Author & Timestamp Bar */}
          <div className="flex items-center justify-between pt-2 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center overflow-hidden">
                {blog.author.avatarUrl ? (
                  <img src={blog.author.avatarUrl} alt={blog.author.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5 text-indigo-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{blog.author.name}</p>
                <p className="text-xs text-slate-400">{blog.author.role || "Financial Analyst"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> 4 min read
              </span>
            </div>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="rounded-xl overflow-hidden max-h-96 w-full border border-slate-800">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Excerpt Lead */}
          <p className="text-slate-300 font-medium text-base leading-relaxed p-4 bg-slate-800/40 border-l-4 border-indigo-500 rounded-r-xl">
            {blog.excerpt}
          </p>

          {/* Full Article Content */}
          <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line">
            {blog.content}
          </div>

          {/* Bottom Social Share */}
          <div className="pt-6 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Share this article:
            </p>
            <SocialShare title={blog.title} text={blog.excerpt} variant="inline" />
          </div>
        </div>
      </div>
    </div>
  );
}
