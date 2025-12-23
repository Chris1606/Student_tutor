import React from 'react';
import { useApp } from '@/context/AppContext';
import { User, Mail, Book, Award, Clock, Coins, Edit, Bell, MessageSquare } from 'lucide-react';

const Profile = () => {
  const { user } = useApp();

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - User info */}
        <div className="md:col-span-1">
          <div className="bg-white border border-border rounded-xl shadow-sm p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <img 
                  src={user?.avatar || 'https://i.pravatar.cc/150?img=default'} 
                  alt={user?.name} 
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-tutu-600 text-white rounded-full p-1.5 shadow-md">
                  <Edit size={14} />
                </button>
              </div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground text-sm">{user?.role === 'student' ? 'Student' : 'Tutor'}</p>
              
              <div className="mt-2 flex items-center gap-1.5 bg-tutu-50 text-tutu-700 px-3 py-1 rounded-full">
                <Coins size={14} />
                <span className="text-sm font-medium">{user?.coins} LUX</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-muted-foreground" size={18} />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Book className="text-muted-foreground" size={18} />
                <div>
                  <p className="text-sm text-muted-foreground">Learning focus</p>
                  <p className="font-medium">Digital Electronics</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="text-muted-foreground" size={18} />
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">January 2024</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-medium mb-4">Account settings</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    <span>Edit profile</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-muted-foreground" />
                    <span>Notifications</span>
                  </div>
                </button>
                
                <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-muted-foreground" />
                    <span>Messages</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Learning stats */}
        <div className="md:col-span-2">
          <div className="bg-white border border-border rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-medium mb-6">Learning statistics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm text-muted-foreground">Courses enrolled</h4>
                  <Book size={16} className="text-tutu-600" />
                </div>
                <p className="text-2xl font-bold">3</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm text-muted-foreground">Completed courses</h4>
                  <Award size={16} className="text-amber-500" />
                </div>
                <p className="text-2xl font-bold">1</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm text-muted-foreground">Total practice time</h4>
                  <Clock size={16} className="text-green-600" />
                </div>
                <p className="text-2xl font-bold">12h 30m</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-4">Progress overview</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Digital Electronics Basics</span>
                    <span className="text-sm text-muted-foreground">85%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-tutu-600 h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Circuit Design Principles</span>
                    <span className="text-sm text-muted-foreground">43%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-tutu-600 h-full rounded-full" style={{ width: '43%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Microprocessor Architecture</span>
                    <span className="text-sm text-muted-foreground">12%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-tutu-600 h-full rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-border rounded-xl shadow-sm p-6">
            <h3 className="font-medium mb-6">Recent activity</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Award size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Completed "Logic Gates" quiz</p>
                  <p className="text-sm text-muted-foreground">Score: 9/10 - Great job!</p>
                  <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 pb-4 border-b border-border">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Book size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Started "Microprocessor Architecture" course</p>
                  <p className="text-sm text-muted-foreground">Module 1: Introduction</p>
                  <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={16} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Chat session with AI Tutor</p>
                  <p className="text-sm text-muted-foreground">Topic: Sequential circuit design</p>
                  <p className="text-xs text-muted-foreground mt-1">5 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 