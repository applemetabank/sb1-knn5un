import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface UserCount {
  students: number;
  teachers: number;
  admins: number;
}

interface Course {
  id: number;
  name: string;
  teacherName: string;
  studentCount: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [userCount, setUserCount] = useState<UserCount>({ students: 0, teachers: 0, admins: 0 });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCountResponse = await axios.get('/api/admin/user-count');
        setUserCount(userCountResponse.data);

        const coursesResponse = await axios.get('/api/admin/recent-courses');
        setRecentCourses(coursesResponse.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Students</h2>
          <p className="text-3xl font-bold text-indigo-600">{userCount.students}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Teachers</h2>
          <p className="text-3xl font-bold text-indigo-600">{userCount.teachers}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Admins</h2>
          <p className="text-3xl font-bold text-indigo-600">{userCount.admins}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Recently Added Courses</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentCourses.map((course) => (
              <li key={course.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{course.name}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {course.teacherName}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <p className="flex items-center text-sm text-gray-500">
                      {course.studentCount} students enrolled
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;