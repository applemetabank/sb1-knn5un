import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Book, Calendar, Users } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-indigo-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        <div className="flex items-center mb-8 px-4">
          <User className="h-8 w-8 mr-2" />
          <span className="text-2xl font-semibold">{user?.name}</span>
        </div>
        <Link to="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
          <Book className="inline-block mr-2" /> Dashboard
        </Link>
        {user?.role === 'STUDENT' && (
          <>
            <Link to="/courses" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
              <Calendar className="inline-block mr-2" /> My Courses
            </Link>
            <Link to="/grades" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
              <Users className="inline-block mr-2" /> Grades
            </Link>
          </>
        )}
        {user?.role === 'TEACHER' && (
          <>
            <Link to="/courses" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
              <Calendar className="inline-block mr-2" /> My Courses
            </Link>
            <Link to="/students" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
              <Users className="inline-block mr-2" /> Students
            </Link>
          </>
        )}
        {user?.role === 'ADMIN' && (
          <>
            <Link to="/users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
              <Users className="inline-block mr-2" /> Manage Users
            </Link>
            <Link to="/courses" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700">
              <Calendar className="inline-block mr-2" /> Manage Courses
            </Link>
          </>
        )}
        <button
          onClick={logout}
          className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700"
        >
          <LogOut className="inline-block mr-2" /> Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;