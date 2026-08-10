"use client";

import React from 'react';

interface PasswordStrengthMeterProps {
  password?: string;
}

export default function PasswordStrengthMeter({ password = '' }: PasswordStrengthMeterProps) {
  const getScore = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;
    return score;
  };

  const score = getScore(password);

  const getLabel = (s: number) => {
    switch (s) {
      case 0:
        return { text: 'Empty', color: 'bg-slate-700', textColor: 'text-slate-400' };
      case 1:
        return { text: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-400' };
      case 2:
        return { text: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-400' };
      case 3:
        return { text: 'Good', color: 'bg-blue-500', textColor: 'text-blue-400' };
      case 4:
        return { text: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
      default:
        return { text: '', color: 'bg-slate-700', textColor: 'text-slate-400' };
    }
  };

  const { text, color, textColor } = getLabel(score);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400">Password strength:</span>
        <span className={`font-semibold ${textColor}`}>{text}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-full rounded-full transition-all duration-300 ${
              score >= level ? color : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
