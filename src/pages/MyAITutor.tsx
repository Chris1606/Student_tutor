import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BookOpen, Brain, Settings, Trash2, Star, MessageSquare, Wand2, Shield, Bot, Edit, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import CloneAITutor from "@/components/chat/CloneAITutor";

// Mảng các gradient background cho AI tutors
const AI_BACKGROUNDS = [
  "bg-gradient-to-br from-amber-100 to-yellow-100",
  "bg-gradient-to-br from-amber-200 to-yellow-200",
  "bg-gradient-to-br from-yellow-100 to-amber-100",
  "bg-gradient-to-br from-yellow-200 to-amber-200",
  "bg-gradient-to-tl from-amber-100 to-yellow-100",
  "bg-gradient-to-tl from-yellow-100 to-amber-200",
  "bg-gradient-to-r from-amber-50 to-yellow-100",
  "bg-gradient-to-r from-yellow-50 to-amber-100",
];

// Hàm lấy background ngẫu nhiên
const getRandomBackground = () => {
  return AI_BACKGROUNDS[Math.floor(Math.random() * AI_BACKGROUNDS.length)];
};

interface AIAgent {
  id: string;
  name: string;
  subject: string;
  description: string;
  teachingStyle: string;
  rating: number;
  feedback: string[];
  background: string;
  fineTuneSettings: {
    patience: number;
    difficulty: number;
    interactivity: number;
    useExamples: boolean;
    useVisuals: boolean;
    usePractice: boolean;
  };
}

const MyAITutor: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>([
    {
      id: '1',
      name: 'Math Tutor AI',
      subject: 'Mathematics',
      description: 'Specialized in algebra and calculus',
      teachingStyle: 'Interactive problem-solving approach',
      rating: 4.5,
      background: "bg-gradient-to-br from-amber-100 to-yellow-100",
      feedback: [
        "Great at explaining complex concepts",
        "Very patient with students",
        "Excellent problem-solving approach"
      ],
      fineTuneSettings: {
        patience: 7,
        difficulty: 5,
        interactivity: 8,
        useExamples: true,
        useVisuals: true,
        usePractice: true
      }
    },
    {
      id: '2',
      name: 'Science Guide AI',
      subject: 'Physics',
      description: 'Focuses on practical experiments and real-world applications',
      teachingStyle: 'Hands-on learning with visual aids',
      rating: 4.8,
      background: "bg-gradient-to-r from-amber-50 to-yellow-100",
      feedback: [
        "Makes physics fun and engaging",
        "Clear explanations of concepts",
        "Great use of real-world examples"
      ],
      fineTuneSettings: {
        patience: 8,
        difficulty: 6,
        interactivity: 9,
        useExamples: true,
        useVisuals: true,
        usePractice: true
      }
    }
  ]);

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isFineTuneDialogOpen, setIsFineTuneDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [deletePassword, setDeletePassword] = useState('');

  // Lắng nghe sự kiện từ CloneAITutor
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Kiểm tra xem thông điệp có phải từ CloneAITutor không
      if (event.data && event.data.type === 'clone-complete' && event.data.tutorId) {
        handleCloneComplete(event.data.tutorId);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Cleanup listener
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleDeleteAgent = (agentId: string) => {
    if (deletePassword === 'edabk123') {
      setAgents(agents.filter(agent => agent.id !== agentId));
      setDeletePassword('');
    }
  };

  const openFeedbackDialog = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setIsFeedbackDialogOpen(true);
  };

  const openFineTuneDialog = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setIsFineTuneDialogOpen(true);
  };

  const openEditDialog = (agent: AIAgent) => {
    setSelectedAgent(agent);
    setIsEditDialogOpen(true);
  };

  const handleFineTuneUpdate = (agentId: string, settings: Partial<AIAgent['fineTuneSettings']>) => {
    setAgents(agents.map(agent => {
      if (agent.id === agentId) {
        return {
          ...agent,
          fineTuneSettings: {
            ...agent.fineTuneSettings,
            ...settings
          }
        };
      }
      return agent;
    }));
  };

  const getSubjectColor = (subject: string) => {
    switch(subject) {
      case 'Mathematics': return 'bg-amber-100 text-amber-800';
      case 'Physics': return 'bg-amber-200 text-amber-900';
      case 'Chemistry': return 'bg-yellow-100 text-yellow-800';
      case 'Biology': return 'bg-amber-50 text-amber-800';
      case 'Computer Science': return 'bg-yellow-50 text-yellow-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  // Xử lý khi clone hoàn tất tạo AI tutor mới
  const handleCloneComplete = (tutorId: string) => {
    const newAgent: AIAgent = {
      id: tutorId,
      name: `AI Tutor ${agents.length + 1}`,
      subject: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'][
        Math.floor(Math.random() * 5)
      ],
      description: 'Newly cloned AI tutor based on your teaching style',
      teachingStyle: 'Personalized teaching approach based on your methods',
      rating: 0,
      background: getRandomBackground(),
      feedback: [],
      fineTuneSettings: {
        patience: 5,
        difficulty: 5,
        interactivity: 5,
        useExamples: true,
        useVisuals: true,
        usePractice: true
      }
    };
    
    setAgents(prevAgents => [...prevAgents, newAgent]);
  };

  // Xử lý cập nhật thông tin AI tutor
  const handleEditAgent = (agentId: string, updates: Partial<AIAgent>) => {
    setAgents(agents.map(agent => {
      if (agent.id === agentId) {
        return { ...agent, ...updates };
      }
      return agent;
    }));
    setIsEditDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-b from-amber-50 to-amber-50/30 min-h-screen">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-600 mb-2">
          My AI Tutors
        </h1>
        <p className="text-amber-700 max-w-2xl mx-auto mb-6">
          Your personal AI tutors, trained on your teaching style and ready to help students anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {agents.map((agent) => (
          <Card 
            key={agent.id} 
            className={`group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl relative h-64 ${agent.background}`}
          >
            <div className="absolute top-0 right-0 p-3 flex gap-2 z-10">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => openEditDialog(agent)}
                className="h-8 w-8 rounded-full bg-amber-50/80 hover:bg-amber-100 text-amber-800 shadow-sm"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => openFineTuneDialog(agent)}
                className="h-8 w-8 rounded-full bg-amber-50/80 hover:bg-amber-100 text-amber-800 shadow-sm"
              >
                <Wand2 className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => openFeedbackDialog(agent)}
                className="h-8 w-8 rounded-full bg-amber-50/80 hover:bg-amber-100 text-amber-800 shadow-sm"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-red-50/80 hover:bg-red-100 text-red-600 shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-xl border-red-100">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                      <Shield className="h-5 w-5" /> 
                      Delete AI Tutor
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Please enter the password to confirm deletion.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="border-slate-200 focus:border-red-300 focus:ring-red-200"
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteAgent(agent.id)}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="p-6 flex flex-col h-full relative">
              <div className="mb-2">
                <Badge className={cn("font-normal", getSubjectColor(agent.subject))}>
                  <BookOpen className="h-3 w-3 mr-1" />
                  {agent.subject}
                </Badge>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  {agent.name}
                </h3>
                <p className="text-sm text-amber-800 mb-4">{agent.description}</p>
                
                <div className="flex items-center gap-2 text-sm bg-amber-50/70 p-2 rounded-lg">
                  <Settings className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-amber-700">Teaching Style:</span>
                  <span className="text-amber-600">{agent.teachingStyle}</span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="w-6 h-6 rounded-full bg-amber-100/70 border border-white flex items-center justify-center text-xs text-amber-700">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-amber-700 ml-1">3 students</span>
                </div>
                
                <div className="flex items-center gap-1 bg-amber-50/70 px-2 py-1 rounded-md">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-amber-700">{agent.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        <Card 
          className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl relative h-64 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-dashed border-amber-200 flex items-center justify-center cursor-pointer"
          onClick={() => document.querySelector<HTMLElement>('.clone-ai-tutor-btn')?.click()}
        >
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <Bot size={30} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-amber-800 mb-2">Clone New AI Tutor</h3>
            <p className="text-sm text-amber-600">
              Create a customized AI tutor based on your teaching style
            </p>
            <div className="mt-4 opacity-0">
              <CloneAITutor
                courseId="demo-course"
                courseName="Demo Course"
                onCloneComplete={handleCloneComplete}
              />
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="rounded-xl border-amber-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-amber-600" />
              </div>
              <span>{selectedAgent?.name} - Student Feedback</span>
            </DialogTitle>
            <DialogDescription className="text-amber-600">
              View student feedback and ratings for this AI tutor
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4 py-2">
              <div className={`p-3 ${selectedAgent.background} rounded-lg`}>
                <h3 className="font-medium text-amber-800">{selectedAgent.name}</h3>
                <div className="flex items-center mt-1">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span className="text-lg font-semibold text-amber-700 ml-1">{selectedAgent.rating.toFixed(1)}</span>
                  <span className="text-sm text-amber-600 ml-1">/ 5.0</span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-amber-700">Student Feedback:</h4>
                <ul className="space-y-2">
                  {selectedAgent.feedback.length > 0 ? (
                    selectedAgent.feedback.map((feedback, index) => (
                      <li key={index} className="flex items-start gap-2 p-2 hover:bg-amber-50 rounded-md transition-colors">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <p className="text-sm text-amber-700 flex-1">{feedback}</p>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-amber-600 italic">No feedback yet</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isFineTuneDialogOpen} onOpenChange={setIsFineTuneDialogOpen}>
        <DialogContent className="rounded-xl border-amber-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Wand2 className="h-4 w-4 text-amber-600" />
              </div>
              <span>Fine-tune {selectedAgent?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-amber-600">
              Customize your AI tutor's teaching parameters to match your teaching style
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-6 py-4">
              <div className={`p-3 ${selectedAgent.background} rounded-lg mb-4`}>
                <h3 className="font-medium text-amber-800">{selectedAgent.name}</h3>
                <p className="text-xs text-amber-600">{selectedAgent.subject}</p>
              </div>
              
              <div className="space-y-5">
                <div>
                  <Label className="text-amber-800 mb-2 block">Patience Level</Label>
                  <Slider
                    value={[selectedAgent.fineTuneSettings.patience]}
                    onValueChange={(value) => handleFineTuneUpdate(selectedAgent.id, { patience: value[0] })}
                    max={10}
                    step={1}
                    className="my-3"
                  />
                  <div className="flex justify-between text-xs text-amber-600">
                    <span>Less Patient</span>
                    <span>More Patient</span>
                  </div>
                </div>

                <div>
                  <Label className="text-amber-800 mb-2 block">Difficulty Level</Label>
                  <Slider
                    value={[selectedAgent.fineTuneSettings.difficulty]}
                    onValueChange={(value) => handleFineTuneUpdate(selectedAgent.id, { difficulty: value[0] })}
                    max={10}
                    step={1}
                    className="my-3"
                  />
                  <div className="flex justify-between text-xs text-amber-600">
                    <span>Easier</span>
                    <span>Harder</span>
                  </div>
                </div>

                <div>
                  <Label className="text-amber-800 mb-2 block">Interactivity Level</Label>
                  <Slider
                    value={[selectedAgent.fineTuneSettings.interactivity]}
                    onValueChange={(value) => handleFineTuneUpdate(selectedAgent.id, { interactivity: value[0] })}
                    max={10}
                    step={1}
                    className="my-3"
                  />
                  <div className="flex justify-between text-xs text-amber-600">
                    <span>Less Interactive</span>
                    <span>More Interactive</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-amber-50 p-4 rounded-lg">
                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-amber-700 cursor-pointer">Use Examples</Label>
                  <Switch
                    checked={selectedAgent.fineTuneSettings.useExamples}
                    onCheckedChange={(checked) => handleFineTuneUpdate(selectedAgent.id, { useExamples: checked })}
                  />
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-amber-700 cursor-pointer">Use Visuals</Label>
                  <Switch
                    checked={selectedAgent.fineTuneSettings.useVisuals}
                    onCheckedChange={(checked) => handleFineTuneUpdate(selectedAgent.id, { useVisuals: checked })}
                  />
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <Label className="text-amber-700 cursor-pointer">Use Practice Problems</Label>
                  <Switch
                    checked={selectedAgent.fineTuneSettings.usePractice}
                    onCheckedChange={(checked) => handleFineTuneUpdate(selectedAgent.id, { usePractice: checked })}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-xl border-amber-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Edit className="h-4 w-4 text-amber-600" />
              </div>
              <span>Edit {selectedAgent?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-amber-600">
              Update AI tutor information
            </DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4 py-2">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-amber-800 mb-1 block">Name</Label>
                  <Input 
                    id="name"
                    value={selectedAgent.name}
                    onChange={(e) => setSelectedAgent({...selectedAgent, name: e.target.value})}
                    className="border-amber-200 focus:border-amber-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject" className="text-amber-800 mb-1 block">Subject</Label>
                  <Select 
                    value={selectedAgent.subject}
                    onValueChange={(value) => setSelectedAgent({...selectedAgent, subject: value})}
                  >
                    <SelectTrigger className="border-amber-200">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-amber-800 mb-1 block">Description</Label>
                  <Input 
                    id="description"
                    value={selectedAgent.description}
                    onChange={(e) => setSelectedAgent({...selectedAgent, description: e.target.value})}
                    className="border-amber-200 focus:border-amber-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="style" className="text-amber-800 mb-1 block">Teaching Style</Label>
                  <Input 
                    id="style"
                    value={selectedAgent.teachingStyle}
                    onChange={(e) => setSelectedAgent({...selectedAgent, teachingStyle: e.target.value})}
                    className="border-amber-200 focus:border-amber-300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="background" className="text-amber-800 mb-1 block">Background Style</Label>
                  <div className="grid grid-cols-4 gap-2 mt-1">
                    {AI_BACKGROUNDS.map((bg, index) => (
                      <div 
                        key={index}
                        className={`h-10 rounded-md cursor-pointer ${bg} ${selectedAgent.background === bg ? 'ring-2 ring-amber-500' : ''}`}
                        onClick={() => setSelectedAgent({...selectedAgent, background: bg})}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-amber-200 text-amber-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleEditAgent(selectedAgent.id, {
                    name: selectedAgent.name,
                    subject: selectedAgent.subject,
                    description: selectedAgent.description,
                    teachingStyle: selectedAgent.teachingStyle,
                    background: selectedAgent.background
                  })}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Ẩn nút Clone AI Tutor để xử lý nhấn từ card */}
      <div className="hidden">
        <span className="clone-ai-tutor-btn">
          <CloneAITutor
            courseId="demo-course"
            courseName="Demo Course"
            onCloneComplete={handleCloneComplete}
          />
        </span>
      </div>
    </div>
  );
};

export default MyAITutor; 