import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, BookOpen, Clock, Calendar, CheckCircle, XCircle, Edit, Trash, Eye, FileText, MoreHorizontal, Download } from 'lucide-react';

// Dữ liệu mẫu cho danh sách bài tập
const MOCK_EXERCISES = [
  {
    id: 'ex-1',
    title: 'Basic digital circuit design',
    type: 'assignment',
    dueDate: '2023-10-15',
    createdDate: '2023-09-01',
    status: 'active',
    submissions: 85,
    totalStudents: 128,
    difficulty: 'medium',
    description: 'Design basic digital circuits using logic gates AND, OR, and NOT.'
  },
  {
    id: 'ex-2',
    title: 'Midterm exam',
    type: 'exam',
    dueDate: '2023-10-20',
    createdDate: '2023-09-10',
    status: 'active',
    submissions: 0,
    totalStudents: 128,
    difficulty: 'hard',
    description: 'Midterm exam about digital circuit, including combinational and sequential circuits.'
  },
  {
    id: 'ex-3',
    title: 'Counting circuit practice',
    type: 'lab',
    dueDate: '2023-09-25',
    createdDate: '2023-09-15',
    status: 'closed',
    submissions: 120,
    totalStudents: 128,
    difficulty: 'medium',
    description: 'Practice designing and simulating counting circuits.'
  },
  {
    id: 'ex-4',
    title: 'Karnaugh chart',
    type: 'quiz',
    dueDate: '2023-09-18',
    createdDate: '2023-09-05',
    status: 'closed',
    submissions: 115,
    totalStudents: 128,
    difficulty: 'easy',
    description: 'Quick quiz about using Karnaugh chart to optimize digital circuits.'
  },
  {
    id: 'ex-5',
    title: 'Final project',
    type: 'project',
    dueDate: '2023-12-01',
    createdDate: '2023-09-20',
    status: 'active',
    submissions: 10,
    totalStudents: 128,
    difficulty: 'hard',
    description: 'Design and implement a complete digital project according to requirements.'
  }
];

const ManageExercises = () => {
  const [exercises, setExercises] = useState(MOCK_EXERCISES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState({
    title: '',
    type: 'assignment',
    dueDate: '',
    description: '',
    difficulty: 'medium'
  });

  // Lọc bài tập theo từ khóa, trạng thái và loại
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || exercise.status === filterStatus;
    const matchesType = filterType === 'all' || exercise.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Xử lý thêm bài tập mới
  const handleAddExercise = () => {
    if (!newExercise.title || !newExercise.dueDate) return;
    
    const newExerciseObject = {
      id: `ex-${Math.floor(Math.random() * 1000)}`,
      title: newExercise.title,
      type: newExercise.type,
      dueDate: newExercise.dueDate,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'active',
      submissions: 0,
      totalStudents: 128,
      difficulty: newExercise.difficulty,
      description: newExercise.description
    };
    
    setExercises([...exercises, newExerciseObject]);
    setNewExercise({
      title: '',
      type: 'assignment',
      dueDate: '',
      description: '',
      difficulty: 'medium'
    });
    setShowAddForm(false);
  };

  // Xử lý xóa bài tập
  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  // Xử lý đóng/mở bài tập
  const handleToggleStatus = (id: string) => {
    setExercises(exercises.map(exercise => 
      exercise.id === id 
        ? { ...exercise, status: exercise.status === 'active' ? 'closed' : 'active' } 
        : exercise
    ));
  };

  // Format lại ngày giờ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  // Tính toán thời gian còn lại
  const getRemainingTime = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (due < now) return 'Expired';
    
    const diffTime = Math.abs(due.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 1 ? '1 day left' : `${diffDays} days left`;
  };

  // Hiển thị màu dựa trên độ khó
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Hiển thị màu dựa trên loại bài tập
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'bg-blue-100 text-blue-800';
      case 'exam': return 'bg-purple-100 text-purple-800';
      case 'quiz': return 'bg-green-100 text-green-800';
      case 'lab': return 'bg-amber-100 text-amber-800';
      case 'project': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-border rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-border bg-gradient-to-r from-amber-50 to-amber-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="p-3 bg-white rounded-full shadow-sm"
            >
              <FileText size={24} className="text-amber-600" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">Manage Exercises</h1>
              <p className="text-muted-foreground">
                Total: {exercises.length} exercises
              </p>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Exercise
          </motion.button>
        </div>
      </div>
      
      <div className="p-6">
        {/* Form thêm bài tập */}
        {showAddForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 p-4 border border-border rounded-lg bg-gray-50"
          >
            <h2 className="font-medium mb-4">Add new exercise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newExercise.title}
                  onChange={(e) => setNewExercise({...newExercise, title: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter exercise title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due date</label>
                <input
                  type="date"
                  value={newExercise.dueDate}
                  onChange={(e) => setNewExercise({...newExercise, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Exercise type</label>
                <select
                  value={newExercise.type}
                  onChange={(e) => setNewExercise({...newExercise, type: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="assignment">Assignment</option>
                  <option value="exam">Exam</option>
                  <option value="quiz">Quiz</option>
                  <option value="lab">Lab</option>
                  <option value="project">Project</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select
                  value={newExercise.difficulty}
                  onChange={(e) => setNewExercise({...newExercise, difficulty: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newExercise.description}
                  onChange={(e) => setNewExercise({...newExercise, description: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]"
                  placeholder="Enter detailed description of the exercise"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddExercise}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                Add
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Thanh tìm kiếm và bộ lọc */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All types</option>
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
              <option value="quiz">Quiz</option>
              <option value="lab">Lab</option>
              <option value="project">Project</option>
            </select>
          </div>
        </div>
        
        {/* Bảng danh sách bài tập */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Exercise</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Due date</th>
                <th className="px-4 py-3 text-left font-medium">Submissions</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredExercises.map((exercise) => (
                <motion.tr 
                  key={exercise.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <div className="font-medium">{exercise.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{exercise.description}</div>
                        <div className="flex items-center mt-1 gap-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty === 'easy' ? 'Easy' : 
                             exercise.difficulty === 'medium' ? 'Medium' : 'Hard'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Created date {formatDate(exercise.createdDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(exercise.type)}`}>
                      {exercise.type === 'assignment' ? 'Assignment' :
                       exercise.type === 'exam' ? 'Exam' :
                       exercise.type === 'quiz' ? 'Quiz' :
                       exercise.type === 'lab' ? 'Lab' : 'Project'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar size={14} className="text-gray-400" />
                        <span>{formatDate(exercise.dueDate)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock size={12} />
                        <span>{getRemainingTime(exercise.dueDate)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span>{exercise.submissions}/{exercise.totalStudents}</span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-amber-600 h-1.5 rounded-full" 
                          style={{ width: `${(exercise.submissions / exercise.totalStudents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      exercise.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {exercise.status === 'active' ? 'Active' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleStatus(exercise.id)} 
                        className={`p-1 rounded-full ${
                          exercise.status === 'active' 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={exercise.status === 'active' ? 'Close exercise' : 'Open exercise'}
                      >
                        {exercise.status === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button 
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-1 text-amber-600 hover:bg-amber-50 rounded-full"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteExercise(exercise.id)} 
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredExercises.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No exercises found matching the search criteria
            </div>
          )}
        </div>
        
        {/* Các nút thao tác hàng loạt */}
        <div className="mt-6 flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
              <Download size={16} />
              <span>Export list</span>
            </button>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredExercises.length} of {exercises.length} exercises
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageExercises; 