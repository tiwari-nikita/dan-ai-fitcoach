import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-700 shadow-lg rounded-xl p-4 sm:p-6 transition-all duration-300 ease-in-out">
        <CardHeader className="text-center mb-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-white">Notifications</CardTitle>
          <p className="text-zinc-400 text-sm mt-1">Manage your notification preferences.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-zinc-300">
            <p className="text-base sm:text-lg">No new notifications.</p>
            <p className="text-xs sm:text-sm text-zinc-500 mt-2">Your inbox is clear. We'll let you know when something new comes up!</p>
          </div>
          {/* Placeholder for future notification settings */}
          <div className="border-t border-zinc-700 pt-4 mt-4">
            <p className="text-zinc-400 text-sm">Future notification settings will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;