import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, User, Mail, MoreHorizontal, Check, X, Edit, Trash } from 'lucide-react';

// Dữ liệu mẫu cho danh sách học viên
const MOCK_STUDENTS = [
  {
    id: 'student-1',
    name: 'Joe',
    email: 'joe@gmail.com',
    enrolledDate: '2023-08-15',
    progress: 75,
    lastActive: '2023-09-28',
    status: 'active'
  },
  {
    id: 'student-2',
    name: 'Jane',
    email: 'jane@gmail.com',
    enrolledDate: '2023-07-22',
    progress: 45,
    lastActive: '2023-09-27',
    status: 'active'
  },
  {
    id: 'student-3',
    name: 'John',
    email: 'john@gmail.com',
    enrolledDate: '2023-09-05',
    progress: 15,
    lastActive: '2023-09-25',
    status: 'active'
  },
  {
    id: 'student-4',
    name: 'Lily',
    email: 'lily@gmail.com',
    enrolledDate: '2023-08-10',
    progress: 90,
    lastActive: '2023-09-28',
    status: 'active'
  },
  {
    id: 'student-5',
    name: 'Ethan',
    email: 'ethan@gmail.com',
    enrolledDate: '2023-07-30',
    progress: 60,
    lastActive: '2023-09-20',
    status: 'inactive'
  }
];

const ManageStudents = () => {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', status: 'active' });
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', status: 'active' });

  // Lọc học viên theo từ khóa tìm kiếm
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý thêm học viên mới
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email) return;
    
    const newStudentObject = {
      id: `student-${Math.floor(Math.random() * 1000)}`,
      name: newStudent.name,
      email: newStudent.email,
      enrolledDate: new Date().toISOString().split('T')[0],
      progress: 0,
      lastActive: new Date().toISOString().split('T')[0],
      status: newStudent.status
    };
    
    setStudents([...students, newStudentObject]);
    setNewStudent({ name: '', email: '', status: 'active' });
    setShowAddForm(false);
  };

  // Xử lý bắt đầu chỉnh sửa học viên
  const handleEditStart = (student: typeof MOCK_STUDENTS[0]) => {
    setEditingStudentId(student.id);
    setEditFormData({
      name: student.name,
      email: student.email,
      status: student.status
    });
  };

  // Xử lý lưu thông tin học viên sau khi chỉnh sửa
  const handleEditSave = (id: string) => {
    setStudents(students.map(student => 
      student.id === id 
        ? { ...student, name: editFormData.name, email: editFormData.email, status: editFormData.status } 
        : student
    ));
    setEditingStudentId(null);
  };

  // Xử lý xóa học viên
  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id));
  };

  // Format lại ngày giờ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
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
              <User size={24} className="text-amber-600" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">Manage students</h1>
              <p className="text-muted-foreground">
                Total: {students.length} students
              </p>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors flex items-center gap-2"
          >
            <UserPlus size={16} />
            Add student
          </motion.button>
        </div>
      </div>
      
      <div className="p-6">
        {/* Form thêm học viên */}
        {showAddForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 p-4 border border-border rounded-lg bg-gray-50"
          >
            <h2 className="font-medium mb-4">Add new student</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter student email"
                />
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
                onClick={handleAddStudent}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                Add
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Thanh tìm kiếm */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        {/* Bảng danh sách học viên */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Enrolled date</th>
                <th className="px-4 py-3 text-left font-medium">Progress</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {editingStudentId === student.id ? (
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                        className="w-full px-2 py-1 border border-border rounded-md"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <User size={16} />
                        </div>
                        <span>{student.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingStudentId === student.id ? (
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                        className="w-full px-2 py-1 border border-border rounded-md"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <span>{student.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(student.enrolledDate)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-amber-600 h-2.5 rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-right mt-1">{student.progress}%</div>
                  </td>
                  <td className="px-4 py-3">
                    {editingStudentId === student.id ? (
                      <select
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                        className="px-2 py-1 border border-border rounded-md"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {student.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingStudentId === student.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditSave(student.id)} 
                          className="p-1 text-green-600 hover:bg-green-50 rounded-full"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingStudentId(null)} 
                          className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditStart(student)} 
                          className="p-1 text-amber-600 hover:bg-amber-50 rounded-full"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(student.id)} 
                          className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No students found matching the search criteria
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ManageStudents; 