import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-black text-white border-green-500 border-2 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-3xl text-white">
            <User className="h-8 w-8 mr-3 text-green-500" />
            Profile Settings
          </CardTitle>
          <p className="text-gray-300 text-lg">Manage your personal information and preferences</p>
        </CardHeader>
      </Card>

      <Card className="bg-white border-gray-300 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-black">
            <User className="h-6 w-6 mr-2 text-green-500" />
            Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-gray-600">
            <p className="text-base">Profile information will be displayed here.</p>
            <p className="text-sm text-gray-500 mt-1">This section will allow you to view and edit your details.</p>
          </div>
          {/* Placeholder for future profile settings */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-gray-600 text-sm">Future profile settings and options will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;