"use client";

import React, { useState } from 'react';
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { useAuth } from '@/contexts/AuthContext';
import { Camera, ShieldCheck, ShieldAlert, CheckCircle, AlertCircle } from 'lucide-react';

export default function UserProfile() {
  const { user, refreshUser } = useAuth();

  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');

  // 2FA Setup modal state
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [totpSecret, setTotpSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [totpError, setTotpError] = useState('');
  const [totpLoading, setTotpLoading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setAvatarError('');
    setAvatarSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload avatar');
      }

      setAvatarSuccess('Avatar updated successfully!');
      await refreshUser();
    } catch (err: any) {
      setAvatarError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleStart2FA = async () => {
    setTotpError('');
    setTotpLoading(true);
    try {
      const res = await fetch('/api/auth/2fa/setup', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to setup 2FA');

      setTotpSecret(data.secret);
      setQrCodeUrl(data.qrCodeUrl);
      setShow2FAModal(true);
    } catch (err: any) {
      setTotpError(err.message);
    } finally {
      setTotpLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setTotpError('');
    setTotpLoading(true);

    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: totpSecret, code: verifyCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid 2FA code');

      setShow2FAModal(false);
      await refreshUser();
      alert('2FA enabled successfully!');
    } catch (err: any) {
      setTotpError(err.message);
    } finally {
      setTotpLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable 2FA?')) return;
    try {
      const res = await fetch('/api/auth/2fa/disable', { method: 'POST' });
      if (res.ok) {
        await refreshUser();
        alert('2FA has been disabled.');
      }
    } catch (err) {
      alert('Failed to disable 2FA');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile & Security Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your personal details, avatar, and multi-factor authentication
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="text-center relative">
              <div className="relative w-28 h-28 mx-auto mb-4 group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-indigo-500/30 bg-slate-800 flex items-center justify-center text-4xl shadow-inner">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                  <Camera className="h-4 w-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploading} />
                </label>
              </div>

              {uploading && <p className="text-xs text-indigo-400 mb-2">Uploading avatar...</p>}
              {avatarSuccess && <p className="text-xs text-emerald-400 mb-2">{avatarSuccess}</p>}
              {avatarError && <p className="text-xs text-rose-400 mb-2">{avatarError}</p>}

              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.name || 'User'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                {user?.email}
              </p>
              <div className="mt-3 flex justify-center gap-2">
                <Badge variant={user?.emailVerified ? "success" : "warning"}>
                  {user?.emailVerified ? "Verified Account" : "Unverified Email"}
                </Badge>
                <Badge variant={user?.totpEnabled ? "success" : "info"}>
                  {user?.totpEnabled ? "2FA Active" : "2FA Off"}
                </Badge>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-400" /> Two-Factor Authentication
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Add an extra layer of security using an authenticator app (Google Authenticator, Authy, etc.).
            </p>
            {user?.totpEnabled ? (
              <Button variant="danger" onClick={handleDisable2FA} className="w-full">
                Disable 2FA
              </Button>
            ) : (
              <Button variant="primary" onClick={handleStart2FA} disabled={totpLoading} className="w-full">
                {totpLoading ? "Generating..." : "Enable 2FA"}
              </Button>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" defaultValue={user?.name || ''} />
              <Input label="Email Address" defaultValue={user?.email || ''} disabled />
              <Input label="Role" defaultValue={user?.role?.toUpperCase() || 'USER'} disabled />
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white space-y-4">
            <h3 className="text-xl font-bold">Setup Two-Factor Authentication</h3>
            <p className="text-sm text-slate-400">
              1. Scan this QR code with your Authenticator app:
            </p>

            {qrCodeUrl && (
              <div className="bg-white p-4 rounded-xl w-48 h-48 mx-auto flex items-center justify-center">
                <img src={qrCodeUrl} alt="2FA QR Code" className="w-full h-full" />
              </div>
            )}

            <p className="text-xs text-slate-400 text-center font-mono">
              Secret: {totpSecret}
            </p>

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  2. Enter 6-digit verification code:
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.trim())}
                  className="w-full px-4 py-2.5 text-center tracking-widest text-lg border border-slate-700 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="000000"
                />
              </div>

              {totpError && <p className="text-xs text-rose-400">{totpError}</p>}

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="secondary" onClick={() => setShow2FAModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={totpLoading}>
                  {totpLoading ? "Verifying..." : "Activate 2FA"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
