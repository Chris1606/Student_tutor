import React, { useState } from 'react';
import CourseCard from '@/components/courses/CourseCard';
import { MOCK_COURSES } from '@/components/courses/CourseList';
import { motion } from 'framer-motion';

const subjects = [
  'Tất cả',
  'Toán học',
  'Vật lý',
  'Hóa học',
  'Ngữ văn',
  'Sinh học',
  'Tiếng Anh'
];

const grades = ['Tất cả', 'Lớp 10', 'Lớp 11', 'Lớp 12'];

const AllCourses: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('Tất cả');
  const [selectedGrade, setSelectedGrade] = useState('Tất cả');

  const filterCourses = () => {
    return MOCK_COURSES.filter((course) => {
      const matchSubject =
        selectedSubject === 'Tất cả' ||
        course.title.toLowerCase().includes(selectedSubject.toLowerCase());

      const matchGrade =
        selectedGrade === 'Tất cả' ||
        course.title.includes(selectedGrade.replace('Lớp ', ''));

      return matchSubject && matchGrade;
    });
  };

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

      {/* SIDEBAR FILTER */}
      <div className="md:col-span-1 bg-white shadow-md rounded-xl p-6 border border-[#E6F2FF] h-fit">

        <h2 className="text-lg font-bold text-[#0A2540] mb-4">Bộ lọc</h2>

        {/* MÔN HỌC */}
        <div className="mb-6">
          <h3 className="font-medium text-[#0A2540] mb-2">Môn học</h3>
          <div className="space-y-2">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all border ${
                  selectedSubject === sub
                    ? 'bg-[#E6F2FF] text-[#0078FF] border-[#CCE5FF]'
                    : 'border-transparent hover:bg-gray-100'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* LỚP HỌC */}
        <div>
          <h3 className="font-medium text-[#0A2540] mb-2">Lớp học</h3>
          <div className="space-y-2">
            {grades.map((gr) => (
              <button
                key={gr}
                onClick={() => setSelectedGrade(gr)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all border ${
                  selectedGrade === gr
                    ? 'bg-[#E6F2FF] text-[#0078FF] border-[#CCE5FF]'
                    : 'border-transparent hover:bg-gray-100'
                }`}
              >
                {gr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COURSE LIST */}
      <div className="md:col-span-3">
        <h1 className="text-2xl font-bold text-[#0A2540] mb-6">
          Danh sách toàn bộ khóa học
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filterCourses().map((course, index) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onSelect={() => {}} 
              index={index} 
            />
          ))}

          {filterCourses().length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 col-span-full mt-10"
            >
              Không tìm thấy khóa học phù hợp.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCourses;
