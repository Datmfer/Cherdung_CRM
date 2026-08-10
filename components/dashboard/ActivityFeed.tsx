"use client";

import React, { useEffect, useState } from 'react';

interface ActivityItem {
  id: string;
  userName: string;
  userEmail: string;
  action: string;
  metadata: any;
  createdAt: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activity');
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch (err) {
      console.error('Failed to fetch activity feed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-slate-400">
        Loading activities...
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-slate-400">
        No recent activities recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            ⚡
          </div>
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-semibold text-white">{activity.userName}</span>
              <span className="text-slate-300"> ({activity.action.replace(/_/g, ' ')})</span>
            </p>
            {activity.metadata && (
              <p className="text-xs text-slate-400 mt-0.5">
                {JSON.stringify(activity.metadata)}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              {new Date(activity.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}