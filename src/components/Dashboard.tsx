import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <main className="p-6">
          <Routes>
            {user?.role === 'STUDENT' && (
              <Route path="/" element={<StudentDashboard />} />
            )}
            {user?.role === 'TEACHER' && (
              <Route path="/" element={<TeacherDashboard />} />
            )}
            {user?.role === 'ADMIN' && (
              <Route path="/" element={<AdminDashboard />} />
            )}
            {/* Add more routes for specific features */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;