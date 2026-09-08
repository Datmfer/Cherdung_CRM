"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { Plus, Search, Pencil, Trash2, FileText, CheckCircle2, Eye, X, AlertCircle } from "lucide-react";

interface BlogAuthor {
  id: string;
  name: string;
  email?: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category: string;
  published: boolean;
  author?: BlogAuthor;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = ["All", "Investment", "Trading", "CRM & Tech", "Crypto", "Market Analysis", "Platform News"];

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Create state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    category: "Investment",
    excerpt: "",
    content: "",
    coverImage: "",
    published: true,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit state
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "Investment",
    excerpt: "",
    content: "",
    coverImage: "",
    published: true,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete state
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateLoading(true);

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create blog post");

      setCreateForm({
        title: "",
        category: "Investment",
        excerpt: "",
        content: "",
        coverImage: "",
        published: true,
      });
      setShowCreateModal(false);
      fetchBlogs();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    setEditForm({
      title: blog.title,
      category: blog.category,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage || "",
      published: blog.published,
    });
    setEditError("");
  };

  const handleEditBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    setEditError("");
    setEditLoading(true);

    try {
      const res = await fetch(`/api/admin/blogs/${editingBlog.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update blog post");

      setEditingBlog(null);
      fetchBlogs();
    } catch (err: any) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (!deletingBlog) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/blogs/${deletingBlog.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeletingBlog(null);
        fetchBlogs();
      } else {
        alert("Failed to delete blog post");
      }
    } catch (err) {
      alert("Failed to delete blog post");
    } finally {
      setDeleteLoading(false);
    }
  };

  const togglePublishStatus = async (blog: Blog) => {
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !blog.published }),
      });
      if (res.ok) fetchBlogs();
    } catch (err) {
      console.error("Failed to toggle publish status", err);
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const publishedCount = blogs.filter((b) => b.published).length;
  const draftCount = blogs.filter((b) => !b.published).length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Blog & News Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create, edit, publish, and manage knowledge articles and market news
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create Article
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-4 bg-slate-900/60 border border-slate-800">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Total Articles</p>
            <p className="text-2xl font-bold text-white">{blogs.length}</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 bg-slate-900/60 border border-slate-800">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Published Live</p>
            <p className="text-2xl font-bold text-white">{publishedCount}</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 bg-slate-900/60 border border-slate-800">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Drafts / Unpublished</p>
            <p className="text-2xl font-bold text-white">{draftCount}</p>
          </div>
        </Card>
      </div>

      {/* Search & Category Bar */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by article title, excerpt, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading blog posts...</div>
      ) : filteredBlogs.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-slate-400 mb-4">No articles found.</p>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            Create First Article
          </Button>
        </Card>
      ) : (
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#111827]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Article Title & Excerpt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-[#111827]">
                    <td className="px-6 py-4 max-w-md">
                      <div className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">
                        {blog.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {blog.excerpt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {blog.author?.name || "Admin"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePublishStatus(blog)}
                        title="Click to toggle publish status"
                        className="focus:outline-none"
                      >
                        {blog.published ? (
                          <Badge variant="success">Published</Badge>
                        ) : (
                          <Badge variant="warning">Draft</Badge>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(blog)}
                          className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Article"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingBlog(blog)}
                          className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Article Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-white space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-400" /> Create Blog Article
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {createError}
              </div>
            )}

            <form onSubmit={handleCreateBlog} className="space-y-4">
              <Input
                label="Article Title"
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder="e.g. Navigating Crypto Market Volatility in 2026"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Cover Image URL (optional)"
                  value={createForm.coverImage}
                  onChange={(e) => setCreateForm({ ...createForm, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Summary / Excerpt</label>
                <textarea
                  value={createForm.excerpt}
                  onChange={(e) => setCreateForm({ ...createForm, excerpt: e.target.value })}
                  placeholder="Brief summary to highlight on blog lists..."
                  className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Article Content</label>
                <textarea
                  value={createForm.content}
                  onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                  placeholder="Full article content in Markdown or text..."
                  className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-40"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="create-published"
                  checked={createForm.published}
                  onChange={(e) => setCreateForm({ ...createForm, published: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="create-published" className="text-sm text-slate-300 cursor-pointer">
                  Publish immediately (visible to visitors)
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-800">
                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? "Saving..." : "Create Post"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {editingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-white space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Pencil className="h-5 w-5 text-indigo-400" /> Edit Article
              </h3>
              <button onClick={() => setEditingBlog(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {editError}
              </div>
            )}

            <form onSubmit={handleEditBlog} className="space-y-4">
              <Input
                label="Article Title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Cover Image URL"
                  value={editForm.coverImage}
                  onChange={(e) => setEditForm({ ...editForm, coverImage: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Excerpt</label>
                <textarea
                  value={editForm.excerpt}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Article Content</label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-700 rounded-xl bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-40"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-published"
                  checked={editForm.published}
                  onChange={(e) => setEditForm({ ...editForm, published: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                />
                <label htmlFor="edit-published" className="text-sm text-slate-300 cursor-pointer">
                  Published (visible to visitors)
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-800">
                <Button type="button" variant="secondary" onClick={() => setEditingBlog(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? "Saving..." : "Update Article"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to delete <span className="font-bold text-white">"{deletingBlog.title}"</span>? This article will be removed permanently.
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="secondary" onClick={() => setDeletingBlog(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteBlog} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Permanently Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
