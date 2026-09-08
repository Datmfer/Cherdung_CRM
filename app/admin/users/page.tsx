"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import { Download, ChevronLeft, ChevronRight, Search, UserPlus, Pencil, Trash2, AlertTriangle, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "support" | "user";
  emailVerified?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Create user form state
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "admin" | "support" | "user",
  });
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Edit user state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "user" as "admin" | "support" | "user",
    password: "",
  });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Delete user state
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "user", label: "User" },
    { value: "support", label: "Support" },
    { value: "admin", label: "Admin" },
  ];

  useEffect(() => {
    fetchUsers();
  }, [page, selectedRole, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        role: selectedRole,
        query: searchTerm,
      });

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalUsers(data.pagination.totalCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const params = new URLSearchParams({
      role: selectedRole,
      query: searchTerm,
      format: "csv",
    });
    window.open(`/api/admin/users?${params.toString()}`, "_blank");
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    if (createForm.password !== createForm.confirmPassword) {
      setCreateError("Passwords do not match");
      return;
    }

    if (createForm.password.length < 8) {
      setCreateError("Password must be at least 8 characters");
      return;
    }

    setCreateLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name,
          email: createForm.email,
          password: createForm.password,
          role: createForm.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCreateForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "user",
        });
        setShowCreateForm(false);
        fetchUsers();
      } else {
        setCreateError(data.error || "Failed to create user");
      }
    } catch (error) {
      setCreateError("Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setEditError("");
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditError("");
    setEditLoading(true);

    try {
      const body: any = {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      };
      if (editForm.password) {
        if (editForm.password.length < 8) {
          setEditError("New password must be at least 8 characters");
          setEditLoading(false);
          return;
        }
        body.password = editForm.password;
      }

      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setEditingUser(null);
        fetchUsers();
      } else {
        setEditError(data.error || "Failed to update user");
      }
    } catch (error) {
      setEditError("Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setDeleteError("");
    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setDeletingUser(null);
        fetchUsers();
      } else {
        setDeleteError(data.error || "Failed to delete user");
      }
    } catch (error) {
      setDeleteError("Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    support: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    user: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all platform users, assign role permissions, and export reports
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleExportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button variant="primary" onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> {showCreateForm ? "Cancel" : "Add User"}
          </Button>
        </div>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Create New User
          </h3>

          {createError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
              {createError}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, name: e.target.value })
                }
                required
              />
              <Input
                label="Email"
                type="email"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm({ ...createForm, email: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm({ ...createForm, password: e.target.value })
                }
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                value={createForm.confirmPassword}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <Select
              label="Role"
              options={roleOptions.filter((r) => r.value !== "all")}
              value={createForm.role}
              onChange={(e) =>
                setCreateForm({ ...createForm, role: e.target.value as any })
              }
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createLoading}>
                {createLoading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10"
              />
            </div>
          </div>
          <div>
            <Select
              options={roleOptions}
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Loading users...
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Total Users ({totalUsers})
            </h2>
            <div className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#111827]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#111827]"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${roleColors[user.role] || roleColors.user}`}>
                        {user.role ? user.role.toUpperCase() : "USER"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.emailVerified ? (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          disabled={currentUser?.id === user.id}
                          className={`p-1.5 rounded-lg transition-colors ${
                            currentUser?.id === user.id
                              ? "text-gray-600 cursor-not-allowed"
                              : "text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
                          }`}
                          title={currentUser?.id === user.id ? "Cannot delete yourself" : "Delete User"}
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

          {/* Pagination Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <span className="text-sm text-slate-400">
              Showing page {page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 text-sm"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Pencil className="h-5 w-5 text-indigo-400" /> Edit User Profile
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {editError}
              </div>
            )}

            <form onSubmit={handleEditUser} className="space-y-4">
              <Input
                label="Full Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />

              <Input
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />

              <Select
                label="User Role"
                options={roleOptions.filter((r) => r.value !== "all")}
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
              />

              <div>
                <Input
                  label="New Password (optional)"
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Leave blank to keep existing password"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <Button type="button" variant="secondary" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="text-xl font-bold">Confirm User Deletion</h3>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to permanently delete the account for{" "}
              <span className="font-bold text-white">{deletingUser.name}</span> ({deletingUser.email})? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-sm">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="secondary" onClick={() => setDeletingUser(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteUser} disabled={deleteLoading}>
                {deleteLoading ? "Deleting..." : "Permanently Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

