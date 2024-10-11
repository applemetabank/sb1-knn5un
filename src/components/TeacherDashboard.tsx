import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Course {
  id: number;
  name: string;
  studentCount: number;
}

interface UpcomingClass {
  id: number;
  courseName: string;
  date: string;
  time: string;
}

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await axios.get('/api/teacher/courses');
        setCourses(coursesResponse.data);

        const classesResponse = await axios.get('/api/teacher/upcoming-classes');
        setUpcomingClasses(classesResponse.data);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
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
                        {course.studentCount} students
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
        <h2 className="text-xl font-semibold mb-2">Upcoming Classes</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {upcomingClasses.map((class_) => (
              <li key={class_.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{class_.courseName}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {class_.date} at {class_.time}
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

export default TeacherDashboard;