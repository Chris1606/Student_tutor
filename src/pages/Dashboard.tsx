
import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  BookOpen, 
  Users, 
  Clock, 
  BarChart3, 
  TrendingUp,
  Award,
  Calendar,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useApp();

  // Mock data
  const stats = [
    { label: 'Courses', value: user?.role === 'student' ? '3' : '2', icon: <BookOpen size={18} /> },
    { label: 'Students', value: user?.role === 'tutor' ? '45' : '0', icon: <Users size={18} /> },
    { label: 'Hours', value: '24', icon: <Clock size={18} /> },
    { label: 'Completed', value: '12', icon: <CheckCircle size={18} /> }
  ];

  const recentActivities = [
    { id: '1', type: 'course', title: 'Joined Advanced Calculus', time: '2 days ago' },
    { id: '2', type: 'assignment', title: 'Submitted Homework #3', time: '3 days ago' },
    { id: '3', type: 'chat', title: 'Chat with Jane Tutor', time: '4 days ago' },
    { id: '4', type: 'quiz', title: 'Completed Quiz: Derivatives', time: '1 week ago' }
  ];

  const upcomingEvents = [
    { id: '1', title: 'Live Session: Vector Calculus', time: 'Tomorrow, 3:00 PM' },
    { id: '2', title: 'Assignment Due: Integration', time: 'Friday, 11:59 PM' },
    { id: '3', title: 'Quiz: Differential Equations', time: 'Next Monday, 2:00 PM' }
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-4 border border-border flex flex-col hover:shadow-md transition-all hover:border-tutu-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">{stat.label}</span>
              <div className="w-8 h-8 rounded-full bg-tutu-100 flex items-center justify-center text-tutu-700">
                {stat.icon}
              </div>
            </div>
            <span className="text-2xl font-bold">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Section */}
        <div className="md:col-span-2 bg-white rounded-xl border border-border p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Your Progress</h2>
            <div className="text-muted-foreground">
              <TrendingUp size={18} />
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Course progress bars */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Advanced Calculus</span>
                <span className="text-xs text-muted-foreground">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-tutu-600 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Physics Fundamentals</span>
                <span className="text-xs text-muted-foreground">40%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-tutu-600 h-2 rounded-full" style={{ width: "40%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Linear Algebra</span>
                <span className="text-xs text-muted-foreground">22%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-tutu-600 h-2 rounded-full" style={{ width: "22%" }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-md font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-tutu-100 flex items-center justify-center text-tutu-700 flex-shrink-0">
                    {activity.type === 'course' ? <BookOpen size={16} /> : 
                     activity.type === 'assignment' ? <CheckCircle size={16} /> :
                     activity.type === 'chat' ? <Users size={16} /> : <Award size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <div className="text-muted-foreground">
              <Calendar size={18} />
            </div>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="border-l-2 border-tutu-600 pl-4 py-2">
                <p className="font-medium text-sm">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.time}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <button className="btn-secondary w-full">View Full Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
