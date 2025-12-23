import React from 'react';
import { motion } from 'framer-motion';
import CourseCard from './CourseCard';
import { useNavigate } from 'react-router-dom';   //  ← Thêm dòng này
import logoImage from '/home/snappys/Desktop/coinstructor-platform/assets/evol.png';
const MOCK_COURSES = [
  {
    id: '1',
    title: 'Toán 12 – Hình học không gian',
    description: 'Ôn luyện toàn bộ kiến thức hình học không gian và các dạng bài thi THPT Quốc Gia.',
    tutorId: '101',
    tutorName: 'Thầy Nguyễn Hoàng Nam',
    tutorInstitute: 'Giáo viên Toán – Trung tâm Luyện thi Omega',
    tutorAvatar: logoImage,
    enrolledStudents: 256,
    rating: 4.8,
    price: 19.99,
    tags: ['Toán 12', 'Hình học', 'Luyện thi'],
    duration: '8 tuần',
    level: 'Nâng cao',
    enrolledCount: 256,
    learningOutcomes: [
      "Nắm vững hệ trục tọa độ trong không gian Oxyz",
      "Phân tích vị trí tương đối giữa đường thẳng và mặt phẳng",
      "Tính khoảng cách, góc giữa hai đường thẳng trong không gian",
      "Tính thể tích khối đa diện, khối tròn xoay",
      "Giải thành thạo các dạng bài thi THPT Quốc Gia về hình học không gian"
    ]
  },

  {
    id: '2',
    title: 'Vật lý 12 – Điện xoay chiều',
    description: 'Nắm vững lý thuyết và bài tập khó của chuyên đề Điện xoay chiều.',
    tutorId: '102',
    tutorName: 'Thầy Trần Đức Minh',
    tutorAvatar: logoImage,
     tutorInstitute: 'Giảng viên Vật Lý – Đại học Sư phạm Hà Nội',
    enrolledStudents: 187,
    rating: 4.7,
    price: 24.99,
    tags: ['Vật lý 12', 'Điện xoay chiều', 'Luyện thi'],
    duration: '6 tuần',
    level: 'Trung cấp',
    enrolledCount: 187,
    learningOutcomes: [
      "Hiểu bản chất dòng điện xoay chiều và các đại lượng đặc trưng",
      "Giải mạch RLC nối tiếp và song song",
      "Vẽ và phân tích giản đồ vector",
      "Tìm điều kiện cộng hưởng điện",
      "Giải các bài tập cực trị và nâng cao trong đề thi THPT Quốc Gia"
    ]
  },

  {
    id: '3',
    title: 'Hóa học 12 – Oxi hóa – Khử',
    description: 'Ôn tập chuyên sâu chuyên đề Oxi hóa – Khử với phương pháp giải nhanh.',
    tutorId: '103',
    tutorName: 'Cô Phạm Thu Hà',
    tutorAvatar: logoImage,
    tutorInstitute: 'Sinh viên năm 4 – ĐH Khoa học Tự nhiên, ĐHQG Hà Nội',
    enrolledStudents: 221,
    rating: 4.9,
    price: 22.99,
    tags: ['Hóa học 12', 'Oxi hóa – Khử', 'Phản ứng'],
    duration: '7 tuần',
    level: 'Nâng cao',
    enrolledCount: 221,
    learningOutcomes: [
      "Xác định số oxi hóa của nguyên tố trong hợp chất",
      "Phân biệt phản ứng oxi hóa – khử và phản ứng không oxi hóa – khử",
      "Cân bằng phương trình bằng phương pháp thăng bằng electron",
      "Giải bài tập nâng cao liên quan đến chất oxi hóa – chất khử",
      "Vận dụng kỹ năng để giải nhanh bài tập trong đề thi"
    ]
  },

  {
    id: '4',
    title: 'Ngữ văn 12 – Nghị luận văn học',
    description: 'Phân tích các tác phẩm trọng tâm, hướng dẫn viết bài nghị luận mượt và logic.',
    tutorId: '104',
    tutorName: 'Cô Nguyễn Thúy An',
    tutorAvatar: logoImage,
    tutorInstitute: 'Sinh viên Sư phạm Ngữ văn – ĐH Sư phạm Hà Nội',
    enrolledStudents: 312,
    rating: 4.6,
    price: 14.99,
    tags: ['Ngữ văn 12', 'Nghị luận', 'Phân tích tác phẩm'],
    duration: '5 tuần',
    level: 'Cơ bản',
    enrolledCount: 312,
    learningOutcomes: [
      "Hiểu sâu giá trị nội dung và nghệ thuật của các tác phẩm trọng tâm",
      "Lập dàn ý nghị luận văn học rõ ràng – logic",
      "Phân tích nhân vật, hình tượng, chủ đề trong tác phẩm",
      "Viết đoạn văn và bài văn nghị luận hoàn chỉnh theo chuẩn",
      "Rèn kỹ năng viết nâng cao để đạt điểm cao trong bài thi THPT Quốc Gia"
    ]
  },

  {
    id: '5',
    title: 'Sinh học 12 – Di truyền học & Biến dị',
    description: 'Luyện toàn bộ chuyên đề di truyền học bằng sơ đồ tư duy & bài tập thực chiến.',
    tutorId: '105',
    tutorName: 'Thầy Lê Công Mạnh',
    tutorAvatar: logoImage,
    tutorInstitute: 'Sinh viên Y1 – ĐH Y Hà Nội',
    enrolledStudents: 198,
    rating: 4.8,
    price: 19.99,
    tags: ['Sinh học 12', 'Di truyền học', 'Biến dị'],
    duration: '6 tuần',
    level: 'Trung cấp',
    enrolledCount: 198,
    learningOutcomes: [
      "Nắm vững quy luật di truyền Mendel và các quy luật mở rộng",
      "Phân tích phả hệ và xác định kiểu gen – kiểu hình",
      "Giải bài tập liên quan đến gen, ADN, NST",
      "Hiểu cơ chế biến dị và ứng dụng trong chọn giống",
      "Luyện tập các dạng bài có độ khó cao trong đề thi THPT Quốc Gia"
    ]
  },

  {
    id: '6',
    title: 'Tiếng Anh 12 – Ngữ pháp & Đọc hiểu',
    description: 'Ôn luyện toàn diện ngữ pháp, từ vựng và kỹ năng đọc hiểu theo chuẩn đề thi THPT Quốc Gia.',
    tutorId: '106',
    tutorName: 'Cô Trần Hải Yến',
    tutorInstitute: 'Sinh viên năm 3 – Đại học Ngoại ngữ (ULIS – ĐHQG Hà Nội)',
    tutorAvatar: logoImage,
    enrolledStudents: 245,
    rating: 4.9,
    price: 21.99,
    tags: ['Tiếng Anh 12', 'Ngữ pháp', 'Đọc hiểu', 'Luyện thi'],
    duration: '7 tuần',
    level: 'Trung cấp – Nâng cao',
    enrolledCount: 245,
    learningOutcomes: [
      "Nắm vững toàn bộ ngữ pháp trọng tâm lớp 12",
      "Luyện tập 12 dạng bài đọc hiểu xuất hiện trong đề thi",
      "Xây dựng vốn từ vựng học thuật (academic vocabulary)",
      "Thành thạo kỹ năng phân tích câu dài và cấu trúc phức",
      "Áp dụng chiến thuật làm bài giúp tăng tốc độ và độ chính xác"
    ]
  }

];


interface CourseListProps {
  onSelectCourse: (course: any) => void;
}

const CourseList: React.FC<CourseListProps> = ({ onSelectCourse }) => {
  const navigate = useNavigate(); 
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {MOCK_COURSES.map((course, index) => (
        <CourseCard 
          key={course.id}
          course={course}
          onSelect={onSelectCourse}
          index={index}
        />
      ))}

      {/* Button "Browse all courses" */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12 col-span-full text-center"
      >
        <button
          onClick={() => navigate('/all-courses')}
          className="px-8 py-3 bg-[#E6F2FF] text-[#0078FF] border border-[#CCE5FF] rounded-lg hover:bg-[#CCE5FF] transition-colors flex items-center gap-2 mx-auto"
        >
          <span className="font-medium">Tham khảo tất cả khóa học</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16" height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-[#0078FF] group-hover:stroke-[#005FCC] transition-colors"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
};

export default CourseList;
export { MOCK_COURSES };
