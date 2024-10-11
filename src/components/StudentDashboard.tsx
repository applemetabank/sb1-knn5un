import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Course {
  id: number;
  name: string;
  teacherName: string;
}

interface Attendance {
  date: string;
  present: boolean;
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await axios.get('/api/student/courses');
        setCourses(coursesResponse.data);

        const attendanceResponse = await axios.get('/api/student/attendance');
        setAttendance(attendanceResponse.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">My Courses</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {courses.map((course) => (
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Recent Attendance</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {attendance.slice(0, 5).map((record, index) => (
              <li key={index}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">{record.date}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.present ? 'Present' : 'Absent'}
                      </p>
                    </div>
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

export default StudentDashboard;