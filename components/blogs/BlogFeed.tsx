"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SocialShare from "@/components/ui/SocialShare";
import CreateBlogModal from "@/components/blogs/CreateBlogModal";
import BlogReaderModal from "@/components/blogs/BlogReaderModal";
import {
  Plus,
  BookOpen,
  Clock,
  Filter,
  Sparkles,
  User as UserIcon,
  LayoutDashboard,
  Search,
  ThumbsUp,
  MessageSquare,
  Repeat,
  Send,
  TrendingUp,
  Bookmark,
  Building2,
  PieChart,
  ShieldCheck,
  MoreHorizontal,
  Image as ImageIcon,
  PenTool,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: string;
  };
  createdAt: string;
}

const CATEGORIES = ["All", "Investment", "Market Analysis", "CRM & Tech", "Portfolio Strategy", "Guides"];

const TRENDING_NEPAL_NEWS = [
  { id: 1, title: "Nepal Hydropower Export to India Surges +18%", readers: "1.4k readers", tag: "Energy" },
  { id: 2, title: "NEPSE Index Closes 22 Points Higher on Hydro Rally", readers: "980 readers", tag: "NEPSE" },
  { id: 3, title: "Kathmandu Commercial Real Estate 2026 Outlook", readers: "720 readers", tag: "Realty" },
  { id: 4, title: "Worker Remittance Inflows Touch $11B Milestone", readers: "540 readers", tag: "Fintech" },
];

export default function BlogFeed() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readingBlog, setReadingBlog] = useState<BlogItem | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [portfolioVal, setPortfolioVal] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetch("/api/user/portfolio")
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.metrics) {
            setPortfolioVal(d.metrics.totalPortfolioValue);
          }
        })
        .catch(() => setPortfolioVal(0));
    }
  }, [user]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === "All" ? "/api/blogs" : `/api/blogs?category=${encodeURIComponent(selectedCategory)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error("Error loading blog feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-Column LinkedIn Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================= LEFT SIDEBAR (PROFILE & SHORTCUTS) ================= */}
          <aside className="lg:col-span-3 space-y-4">
            {/* User Profile Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {/* Cover Banner */}
              <div className="h-20 bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-900 relative">
                <div className="absolute inset-0 bg-slate-950/20" />
              </div>

              {/* Avatar & User Details */}
              <div className="px-5 pb-5 relative text-center">
                <div className="-mt-10 mb-3 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-slate-900 border-4 border-slate-900 shadow-xl overflow-hidden flex items-center justify-center">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name ? user.name[0].toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                </div>

                <h2 className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
                  {user?.name || "Guest Investor"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {user?.role ? `${user.role} • Portfolio Analyst` : "Investment Member"}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-800/80 text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Profile Views</span>
                    <span className="font-semibold text-indigo-400">342</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Post Impressions</span>
                    <span className="font-semibold text-indigo-400">1.8k</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Portfolio Net Worth</span>
                    <span className="font-semibold text-emerald-400">
                      NPR {portfolioVal !== null ? portfolioVal.toLocaleString() : "0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Shortcuts Footer */}
              <div className="p-3 bg-slate-950/40 border-t border-slate-800 text-xs space-y-1">
                <Link
                  href={user?.role?.toUpperCase() === "ADMIN" ? "/admin/dashboard" : "/user-dashboard/dashboard"}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  <span>My CRM Dashboard</span>
                </Link>
                <Link
                  href="/user-dashboard/portfolio"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800/80 transition-colors"
                >
                  <PieChart className="w-4 h-4 text-emerald-400" />
                  <span>Portfolio & Assets</span>
                </Link>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800/80 cursor-pointer transition-colors">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Saved Articles</span>
                </div>
              </div>
            </div>

            {/* Platform Badges Widget */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Platform Verification
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2FA & Encryption Active</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>SEBON & NEPSE Compliant</span>
              </div>
            </div>
          </aside>


          {/* ================= CENTER FEED (LINKEDIN POST CREATOR & POSTS) ================= */}
          <main className="lg:col-span-6 space-y-4">
            
            {/* LinkedIn-Style "Start a Post" Creator Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0 overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-indigo-400" />
                  )}
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full text-left px-4 py-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-full text-sm text-slate-400 hover:text-slate-200 transition-all"
                >
                  Start a post, share a market analysis or article...
                </button>
              </div>

              {/* Creator Quick Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 px-2 text-xs text-slate-400">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <PenTool className="w-4 h-4 text-indigo-400" />
                  <span>Write Article</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Media Image</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Market Insight</span>
                </button>
              </div>
            </div>

            {/* Filter Pills & Search Bar */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
                <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-48 shrink-0">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search feed..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Feed Cards (LinkedIn Post Style) */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <h3 className="text-base font-bold text-white">No Posts Match Search</h3>
                <p className="text-slate-400 text-xs mt-1">Try switching categories or create a new post.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBlogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition-all space-y-4"
                  >
                    {/* Post Author Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center overflow-hidden shrink-0">
                          {blog.author.avatarUrl ? (
                            <img src={blog.author.avatarUrl} alt={blog.author.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-indigo-400" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white hover:text-indigo-400 transition-colors">
                              {blog.author.name}
                            </h3>
                            <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold rounded-full">
                              {blog.author.role || "Analyst"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{blog.category}</span>
                            <span>•</span>
                            <span>
                              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </p>
                        </div>
                      </div>

                      <button className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Post Content / Body */}
                    <div className="space-y-2">
                      <h2
                        onClick={() => setReadingBlog(blog)}
                        className="text-base font-bold text-white hover:text-indigo-400 cursor-pointer transition-colors"
                      >
                        {blog.title}
                      </h2>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <button
                        onClick={() => setReadingBlog(blog)}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 mt-1"
                      >
                        <span>Read Full Article</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Embedded Article Cover Card */}
                    {blog.coverImage && (
                      <div
                        onClick={() => setReadingBlog(blog)}
                        className="relative rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 bg-slate-950 cursor-pointer group"
                      >
                        <div className="h-52 w-full overflow-hidden">
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-3 bg-slate-950/80 backdrop-blur-sm border-t border-slate-800">
                          <p className="text-xs font-semibold text-white truncate">{blog.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{blog.excerpt}</p>
                        </div>
                      </div>
                    )}

                    {/* Engagement Stats Bar */}
                    <div className="flex items-center justify-between pt-3 text-[11px] text-slate-400 border-b border-slate-800/60 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 bg-indigo-600 rounded-full text-white">
                          <ThumbsUp className="w-2.5 h-2.5" />
                        </span>
                        <span>{likedPosts[blog.id] ? 13 : 12} Likes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span>4 Comments</span>
                        <span>2 Reposts</span>
                      </div>
                    </div>

                    {/* LinkedIn Interaction Buttons */}
                    <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                      <button
                        onClick={() => toggleLike(blog.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-all ${
                          likedPosts[blog.id] ? "text-indigo-400 font-semibold" : ""
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{likedPosts[blog.id] ? "Liked" : "Like"}</span>
                      </button>

                      <button
                        onClick={() => setReadingBlog(blog)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-all"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Comment</span>
                      </button>

                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-all">
                        <Repeat className="w-4 h-4" />
                        <span>Repost</span>
                      </button>

                      <SocialShare title={blog.title} text={blog.excerpt} variant="compact" />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>


          {/* ================= RIGHT SIDEBAR (TRENDING MARKET NEWS & INSIGHTS) ================= */}
          <aside className="lg:col-span-3 space-y-4">
            {/* Trending Insights Widget */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Nepal Market Trends 🇳🇵</h3>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Live</span>
              </div>

              <div className="space-y-3">
                {TRENDING_NEPAL_NEWS.map((news) => (
                  <div key={news.id} className="group cursor-pointer">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors leading-snug">
                        {news.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                      <span>{news.tag}</span>
                      <span>•</span>
                      <span>{news.readers}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Communities / Advisory Widget */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Recommended Networks
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800">
                  <div>
                    <p className="font-semibold text-slate-200">NEPSE Hydropower Club</p>
                    <p className="text-[10px] text-slate-400">4,200 members</p>
                  </div>
                  <button className="px-2.5 py-1 text-[11px] font-semibold text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 rounded-lg transition-all">
                    Join
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800">
                  <div>
                    <p className="font-semibold text-slate-200">Nepal Real Estate Advisory</p>
                    <p className="text-[10px] text-slate-400">2,850 members</p>
                  </div>
                  <button className="px-2.5 py-1 text-[11px] font-semibold text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 rounded-lg transition-all">
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Footer Links */}
            <div className="px-2 text-[11px] text-slate-500 space-y-2 text-center">
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                <a href="#" className="hover:underline">About</a>
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">NEPSE Guide</a>
                <a href="#" className="hover:underline">Help Center</a>
              </div>
              <p>Cherdung CRM © 2026. All rights reserved.</p>
            </div>
          </aside>

        </div>
      </div>

      {/* Blog Creation Modal */}
      <CreateBlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBlogCreated={fetchBlogs}
      />

      {/* Full Article Reader Modal */}
      <BlogReaderModal
        blog={readingBlog}
        onClose={() => setReadingBlog(null)}
      />
    </div>
  );
}
