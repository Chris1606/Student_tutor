import React, { useState } from 'react';
import { Brain, Bot, Search, Trash2, Edit, Activity, Star, PlayCircle, PauseCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAvatar } from '@/components/ui/avatar';

// Định nghĩa cấu trúc dữ liệu cho AI Tutor
interface AITutor {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'paused' | 'training';
  usageCount: number;
  accuracy: number;
  conversationCount: number;
}

interface AITutorManagerProps {
  courseId?: string;
  onSelect?: (tutorId: string) => void;
}

const MOCK_AI_TUTORS: AITutor[] = [
  {
    id: 'ai-tutor-course1-1683644321',
    name: 'Mạch Logic Tutor',
    courseId: 'course1',
    courseName: 'Mạch Logic Số',
    createdAt: '2023-05-10T14:25:21Z',
    lastUsed: '2023-05-15T09:12:33Z',
    status: 'active',
    usageCount: 142,
    accuracy: 95,
    conversationCount: 32
  },
  {
    id: 'ai-tutor-course2-1685432109',
    name: 'Hệ thống số Tutor',
    courseId: 'course2',
    courseName: 'Hệ thống số',
    createdAt: '2023-05-30T08:15:09Z',
    lastUsed: '2023-06-02T16:45:12Z',
    status: 'active',
    usageCount: 98,
    accuracy: 92,
    conversationCount: 24
  },
  {
    id: 'ai-tutor-course3-1687654321',
    name: 'FPGA & Verilog Tutor',
    courseId: 'course3',
    courseName: 'FPGA & Verilog',
    createdAt: '2023-06-25T11:32:01Z',
    lastUsed: '2023-06-30T14:22:45Z',
    status: 'paused',
    usageCount: 65,
    accuracy: 88,
    conversationCount: 18
  },
  {
    id: 'ai-tutor-course1-1689876543',
    name: 'Mạch Logic Nâng cao',
    courseId: 'course1',
    courseName: 'Mạch Logic Số',
    createdAt: '2023-07-20T15:42:23Z',
    lastUsed: '2023-07-25T10:33:21Z',
    status: 'training',
    usageCount: 12,
    accuracy: 78,
    conversationCount: 8
  }
];

const AITutorManager: React.FC<AITutorManagerProps> = ({ courseId, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTutors, setFilteredTutors] = useState<AITutor[]>(MOCK_AI_TUTORS);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'paused'>('all');
  
  // Lọc AI Tutors dựa trên khóa học, tab và tìm kiếm
  React.useEffect(() => {
    let filtered = [...MOCK_AI_TUTORS];
    
    // Lọc theo courseId nếu được chỉ định
    if (courseId) {
      filtered = filtered.filter(tutor => tutor.courseId === courseId);
    }
    
    // Lọc theo tab
    if (activeTab === 'active') {
      filtered = filtered.filter(tutor => tutor.status === 'active');
    } else if (activeTab === 'paused') {
      filtered = filtered.filter(tutor => tutor.status === 'paused');
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        tutor => 
          tutor.name.toLowerCase().includes(query) || 
          tutor.courseName.toLowerCase().includes(query)
      );
    }
    
    setFilteredTutors(filtered);
  }, [searchQuery, activeTab, courseId]);
  
  const getStatusColor = (status: AITutor['status']) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-amber-100 text-amber-700';
      case 'training': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusLabel = (status: AITutor['status']) => {
    switch(status) {
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'training': return 'Training';
      default: return 'Unknown';
    }
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-xs border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-1.5"
        onClick={() => setOpen(true)}
      >
        <Bot size={14} className="text-gray-600" />
        <span>AI Tutor Manager</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-white rounded-xl">
          <DialogHeader className="p-6 pb-3 border-b">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Brain size={18} className="text-tutu-600" />
              AI Tutor Manager
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Manage and track AI Tutors created from conversations with students
            </p>
          </DialogHeader>

          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search AI Tutor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-200"
                />
              </div>
              
              <Tabs 
                value={activeTab} 
                onValueChange={(v) => setActiveTab(v as 'all' | 'active' | 'paused')}
                className="w-full md:w-auto"
              >
                <TabsList className="grid grid-cols-3 w-full md:w-auto">
                  <TabsTrigger value="all" className="text-xs">
                    All ({MOCK_AI_TUTORS.length})
                  </TabsTrigger>
                  <TabsTrigger value="active" className="text-xs">
                    Active ({MOCK_AI_TUTORS.filter(t => t.status === 'active').length})
                  </TabsTrigger>
                  <TabsTrigger value="paused" className="text-xs">
                    Paused ({MOCK_AI_TUTORS.filter(t => t.status === 'paused').length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="overflow-y-auto max-h-[400px] rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI Tutor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTutors.length > 0 ? (
                    filteredTutors.map((tutor) => (
                      <tr key={tutor.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-tutu-100 flex items-center justify-center">
                              <Brain size={16} className="text-tutu-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{tutor.name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[150px]">ID: {tutor.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{tutor.courseName}</div>
                          <div className="text-xs text-gray-500">ID: {tutor.courseId}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge className={`${getStatusColor(tutor.status)} text-xs`}>
                            {getStatusLabel(tutor.status)}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">
                            Sử dụng lần cuối: {formatDate(tutor.lastUsed)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                              <div className="flex items-center text-sm text-gray-900">
                                <Activity size={14} className="text-gray-400 mr-1" />
                                <span>{tutor.usageCount}</span>
                              </div>
                              <div className="text-xs text-gray-500">Lượt sử dụng</div>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center text-sm text-gray-900">
                                <Star size={14} className="text-amber-500 mr-1" />
                                <span>{tutor.accuracy}%</span>
                              </div>
                              <div className="text-xs text-gray-500">Độ chính xác</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(tutor.createdAt)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {tutor.status === 'active' ? (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600">
                                <PauseCircle size={16} />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                                <PlayCircle size={16} />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-tutu-600">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                              <Copy size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                        <div className="flex flex-col items-center">
                          <Bot size={32} className="text-gray-300 mb-2" />
                          <p>No AI Tutor found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter className="p-4 pt-0">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-gray-200"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AITutorManager; 