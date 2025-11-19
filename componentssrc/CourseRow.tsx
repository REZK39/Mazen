import React from 'react';
import { Course } from '../types';
import { TrashIcon } from './Icons';

interface CourseRowProps {
  course: Course;
  onUpdate: (id: number, field: keyof Course, value: string | number) => void;
  onRemove: (id: number) => void;
  isReadOnly?: boolean;
}

const CourseRow: React.FC<CourseRowProps> = ({ course, onUpdate, onRemove, isReadOnly = false }) => {
  const handleInputChange = (field: 'name' | 'credits' | 'score', value: string) => {
    if (field === 'name') {
      onUpdate(course.id, field, value);
    } else {
      const numValue = value === '' ? null : Number(value);
      if (field === 'score' && (numValue !== null && (numValue < 0 || numValue > 100))) return;
      if (field === 'credits' && (numValue !== null && (numValue < 0))) return;
      onUpdate(course.id, field, numValue === null ? '' : numValue);
    }
  };

  const inputClasses = "w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-70 disabled:cursor-not-allowed text-left sm:text-right transition-all duration-200";

  return (
    <tr className="bg-white dark:bg-gray-800 sm:border-b dark:sm:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 block sm:table-row mb-4 sm:mb-0 rounded-lg shadow-md sm:shadow-none overflow-hidden transition-colors duration-200">
      <td className="px-4 py-2 sm:py-2 sm:table-cell flex justify-between items-center sm:block border-b sm:border-none dark:border-gray-700">
        <span className="font-semibold text-gray-600 dark:text-gray-300 sm:hidden">اسم المادة</span>
        <div className="w-3/5 sm:w-full">
            <input
              type="text"
              value={course.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={inputClasses + " !text-right"}
              disabled={isReadOnly}
              aria-label={`اسم المادة ${course.id}`}
            />
        </div>
      </td>
      <td className="px-4 py-2 sm:py-2 w-full sm:w-32 sm:table-cell flex justify-between items-center sm:block border-b sm:border-none dark:border-gray-700">
        <span className="font-semibold text-gray-600 dark:text-gray-300 sm:hidden">الساعات</span>
        <div className="w-3/5 sm:w-full">
            <input
              type="number"
              value={course.credits}
              onChange={(e) => handleInputChange('credits', e.target.value)}
              className={inputClasses}
              disabled={isReadOnly}
              aria-label={`الساعات المعتمدة للمادة ${course.id}`}
            />
        </div>
      </td>
      <td className="px-4 py-2 sm:py-2 w-full sm:w-32 sm:table-cell flex justify-between items-center sm:block border-b sm:border-none dark:border-gray-700">
        <span className="font-semibold text-gray-600 dark:text-gray-300 sm:hidden">الدرجة (%)</span>
        <div className="w-3/5 sm:w-full">
            <input
              type="number"
              value={course.score ?? ''}
              onChange={(e) => handleInputChange('score', e.target.value)}
              placeholder="e.g. 85"
              className={inputClasses}
              disabled={isReadOnly}
              aria-label={`درجة المادة ${course.id}`}
            />
        </div>
      </td>
      <td className="px-4 py-2 sm:py-2 w-full sm:w-16 text-center sm:table-cell flex justify-between items-center sm:block">
          <span className="font-semibold text-gray-600 dark:text-gray-300 sm:hidden">إجراء</span>
          <div>
            {!isReadOnly && (
              <button
                onClick={() => onRemove(course.id)}
                className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-125 duration-200"
                aria-label={`حذف المادة ${course.name}`}
              >
                <TrashIcon />
              </button>
            )}
          </div>
      </td>
    </tr>
  );
};

export default CourseRow;