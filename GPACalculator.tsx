import React from 'react';
import { Course } from '../types';
import CourseRow from './CourseRow';
import { PlusIcon } from './Icons';

interface GPACalculatorProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  isReadOnly?: boolean;
}

const GPACalculator: React.FC<GPACalculatorProps> = ({ courses, setCourses, isReadOnly = false }) => {
  const handleUpdateCourse = (id: number, field: keyof Course, value: string | number) => {
    setCourses(prevCourses =>
      prevCourses.map(c =>
        c.id === id ? { ...c, [field]: value === '' && (field === 'score' || field === 'credits') ? null : value } : c
      )
    );
  };

  const handleRemoveCourse = (id: number) => {
    setCourses(prevCourses => prevCourses.filter(c => c.id !== id));
  };

  const handleAddCourse = () => {
    const newCourse: Course = {
      id: Date.now(),
      name: 'مادة جديدة',
      credits: 3,
      score: null,
    };
    setCourses(prevCourses => [...prevCourses, newCourse]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 sm:p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 hidden sm:table-header-group">
            <tr>
              <th scope="col" className="px-4 py-3">اسم المادة</th>
              <th scope="col" className="px-4 py-3">الساعات المعتمدة</th>
              <th scope="col" className="px-4 py-3">الدرجة (%)</th>
              <th scope="col" className="px-4 py-3">إجراء</th>
            </tr>
          </thead>
          <tbody className="block sm:table-row-group">
            {courses.map(course => (
              <CourseRow
                key={course.id}
                course={course}
                onUpdate={handleUpdateCourse}
                onRemove={handleRemoveCourse}
                isReadOnly={isReadOnly}
              />
            ))}
          </tbody>
        </table>
      </div>
      {!isReadOnly && (
        <div className="mt-4 flex justify-start">
          <button
            onClick={handleAddCourse}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon />
            إضافة مادة
          </button>
        </div>
      )}
    </div>
  );
};

export default GPACalculator;