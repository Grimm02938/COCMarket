import React from 'react';
import { UserDashboard } from '@/components/UserDashboard';
import FuturisticHeader from '@/components/FuturisticHeader';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <FuturisticHeader />
      <UserDashboard />
    </div>
  );
}