import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Video } from "lucide-react";

const dummyLessons = [
  { id: "l1", title: "Bài 1: Kiến thức cơ bản", type: "video", description: "Nắm vững lý thuyết nền tảng cho chương học." },
  { id: "l2", title: "Bài 2: Ví dụ minh họa", type: "pdf", description: "Tài liệu PDF bài tập mẫu và phân tích." },
  { id: "l3", title: "Bài 3: Bài tập thực hành", type: "video", description: "Video hướng dẫn giải bài tập từ dễ đến khó." },
];

const LearningPath: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const course = JSON.parse(localStorage.getItem("practiceCourse") || "{}");

  return (
    <motion.div
      className="flex-1 bg-[#FF66F] min-h-screen overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Giảm toàn bộ khoảng trống ở container */}
      <div className="w-full px-3 py-3">

        {/* Back button – sát mép trên trái */}
        <div className="mb-2">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Quay về khóa học</span>
          </button>
        </div>

        {/* Title – margin gọn */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Lộ trình khóa học</h1>
          <p className="text-md text-gray-600">
            Khóa học: {course?.title || "N/A"}
          </p>
        </div>

        {/* Lessons list – spacing nhỏ */}
        <div className="space-y-4">
          {dummyLessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/courses/${courseId}/lesson/${lesson.id}`)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 cursor-pointer"
            >
              <div className="flex items-center gap-4">

                {lesson.type === "video" ? (
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {lesson.title}
                  </h2>
                  <p className="text-gray-600">{lesson.description}</p>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </motion.div>
  );
};

export default LearningPath;
