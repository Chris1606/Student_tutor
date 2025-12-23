import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAITutor from './pages/MyAITutor';
import Analytics from './pages/Analytics';

import TypeChoosing from './pages/TypeChoosing';
import LevelChoosing from './pages/LevelChoosing';
import GeneratingQuestions from './pages/GeneratingQuestions';
import Landing from './pages/Landing';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import PracticeExercise from './pages/PracticeExercise';
import Session from './pages/Session';
import TutorChat from './pages/TutorChat';
import Profile from './pages/Profile';
import KmapExercise from './pages/KmapExercise';
import AllCourses from './components/courses/AllCourses';
import LearningPath from './components/courses/LearningPath';

// Wrap Routes with AnimatePresence to ensure exit animations work
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout showRightPanel={false} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<Courses />} />
          <Route path="/my-ai-tutor" element={<MyAITutor />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/courses/:id/learning-path" element={<LearningPath/>}/>
          <Route path="/all-courses" element={<AllCourses />} />
        </Route>
        <Route element={<Layout showRightPanel={true} />}>
          <Route path="/chats" element={<Chat />} />
          <Route path="/chats/:chatId" element={<Chat />} />
          <Route path="/chats/new" element={<Chat />} />
          <Route path="/courses/:courseId/chat" element={<Chat courseMode={true} />} />
          <Route path="/courses/:courseId/tutor" element={<Chat realTutorMode={true} />} />
          <Route path="/tutor-chat/:courseId" element={<TutorChat />} />
          <Route path="/tutor-chat/:courseId/:studentId" element={<TutorChat />} />

        </Route>
        <Route path="/practice" element={<TypeChoosing />} />
        <Route path="/practice/level/:typeId" element={<LevelChoosing />} />
        <Route path="/practice/generating/:typeId/:levelId" element={<GeneratingQuestions />} />
        <Route path="/practice/exercise/:typeId/:levelId" element={<PracticeExercise />} />
        <Route path="/practice/kmap/:typeId/:levelId" element={<KmapExercise />} />
        <Route path="/practice/session/:sessionId" element={<Session />} />
        <Route path="/chat" element={<Navigate to="/chats" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <AppProvider>
        <AnimatedRoutes />
        <Toaster position="top-center" />
      </AppProvider>
    </Router>
  );
};

export default App;
