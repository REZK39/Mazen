import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Course } from '../types';
import { GRADING_SCALE } from '../constants';

// Helper function to get grade details from a percentage score
const getGradeDetails = (score: number | null): { grade: string, points: number } => {
  if (score === null || score < 0 || score > 100) return { grade: 'N/A', points: 0 };
  const gradeInfo = GRADING_SCALE.find(g => score >= g.minPercentage);
  return gradeInfo ? { grade: gradeInfo.grade, points: gradeInfo.points } : { grade: 'F', points: 0 };
};

// Helper function to determine bar color based on score
const getGradeColor = (score: number | null): string => {
    if (score === null) return '#9ca3af'; // Gray-400 for no score
    if (score >= 93) return '#10B981';    // Green-500 (A+, A)
    if (score >= 89) return '#34D399';    // Green-400 (A-)
    if (score >= 84) return '#FBBF24';    // Amber-400 (B+)
    if (score >= 80) return '#FCD34D';    // Amber-300 (B)
    if (score >= 76) return '#FB923C';    // Orange-400 (B-)
    if (score >= 70) return '#F59E0B';    // Amber-500 (C+, C)
    if (score >= 60) return '#F87171';    // Red-400   (C-, D+, D)
    return '#EF4444';                     // Red-500   (F)
};

// Custom Tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="p-3 bg-gray-700/90 dark:bg-gray-900/90 border border-gray-500 rounded-lg shadow-xl text-white">
                <p className="font-bold text-base mb-2">{`${label}`}</p>
                <p className="text-sm" style={{ color: data.fill }}>{`التقدير: ${data.grade}`}</p>
                <p className="text-sm">{`الدرجة: ${data.score}%`}</p>
                <p className="text-sm">{`النقاط: ${data.points.toFixed(2)}`}</p>
            </div>
        );
    }
    return null;
};


const GradeChart: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const chartData = courses
    .filter(c => c.score !== null && c.credits > 0)
    .map(course => {
        const { grade, points } = getGradeDetails(course.score);
        return {
          name: course.name,
          score: course.score,
          grade: grade,
          points: points,
          fill: getGradeColor(course.score),
        };
    });

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 bg-gray-50 dark:bg-gray-700/50 rounded-lg mt-6">
        <p className="text-gray-500 dark:text-gray-400">أدخل الدرجات لعرض الرسم البياني</p>
      </div>
    );
  }

  // Check dark mode for tick fill color
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const tickFillColor = isDarkMode ? '#d1d5db' : '#374151';

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 h-96 mt-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            تحليل أداء المواد
        </h3>
        <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                    tick={{ fill: tickFillColor, fontSize: 12 }} 
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: tickFillColor, fontSize: 12 }} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}/>
                <Bar dataKey="score" animationDuration={800}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default GradeChart;