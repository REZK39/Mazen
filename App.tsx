import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Course, Term, CalculationResult } from './types';
import { GRADING_SCALE, INITIAL_TERM_1_COURSES, INITIAL_TERM_2_COURSES } from './constants';
import GPACalculator from './components/GPACalculator';
import GradeChart from './components/GradeChart';

// Updated logo URL
const logoSrc = "https://i.postimg.cc/fT8qkXwJ/Asset-6-3x.png";

// Helper function to get grade details from a percentage score
const getGradeDetails = (score: number | null): { grade: string, points: number } => {
  if (score === null || score < 0 || score > 100) return { grade: 'N/A', points: 0 };
  const gradeInfo = GRADING_SCALE.find(g => score >= g.minPercentage);
  return gradeInfo ? { grade: gradeInfo.grade, points: gradeInfo.points } : { grade: 'F', points: 0 };
};

// Main calculation logic
const calculateGPA = (courses: Course[]): CalculationResult => {
    const coursesWithScores = courses.filter(c => c.score !== null && c.credits > 0);
    if (coursesWithScores.length === 0) {
      return { gpa: 0, totalCredits: 0, totalPoints: 0, maxPoints: 0 };
    }

    let totalPoints = 0;
    let totalCredits = 0;
    
    coursesWithScores.forEach(course => {
      const { points } = getGradeDetails(course.score);
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const maxPoints = totalCredits * 4.0;

    return {
      gpa: parseFloat(gpa.toFixed(3)),
      totalCredits,
      totalPoints: parseFloat(totalPoints.toFixed(2)),
      maxPoints: parseFloat(maxPoints.toFixed(2)),
    };
};

// AnimatedNumber Component for count-up effect
const AnimatedNumber: React.FC<{ value: number; decimals?: number }> = ({ value, decimals = 0 }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const prevValueRef = useRef(value);
    // FIX: Initialize useRef with an explicit initial value (undefined) to prevent potential issues.
    // The type is also updated to reflect it can be a number or undefined.
    const animationFrameRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const startValue = prevValueRef.current;
        const endValue = value;
        const duration = 500; // ms
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const animatedValue = startValue + (endValue - startValue) * percentage;
            
            setDisplayValue(animatedValue);

            if (progress < duration) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue); // Ensure it ends on the exact value
                prevValueRef.current = endValue;
            }
        };
        
        // Only animate if the value has changed significantly
        if (Math.abs(startValue - endValue) > 1e-9) {
          if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
          }
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
           // If no change, just set the value
           setDisplayValue(endValue);
           prevValueRef.current = endValue;
        }


        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [value]);

    return <span>{displayValue.toFixed(decimals)}</span>;
};


const App: React.FC = () => {
  const [term1Courses, setTerm1Courses] = useState<Course[]>(INITIAL_TERM_1_COURSES);
  const [term2Courses, setTerm2Courses] = useState<Course[]>(INITIAL_TERM_2_COURSES);
  const [activeTerm, setActiveTerm] = useState<Term>('term1');
  const [pulse, setPulse] = useState(false);

  const calculationResult = useMemo<CalculationResult>(() => {
    if (activeTerm === 'term1') {
      return calculateGPA(term1Courses);
    }
    if (activeTerm === 'term2') {
      return calculateGPA(term2Courses);
    }
    // Combined
    return calculateGPA([...term1Courses, ...term2Courses]);
  }, [activeTerm, term1Courses, term2Courses]);

  const prevGpaRef = useRef(calculationResult.gpa);
  useEffect(() => {
      if (calculationResult.gpa !== prevGpaRef.current) {
          setPulse(true);
          const timer = setTimeout(() => setPulse(false), 500); // Corresponds to animation duration
          prevGpaRef.current = calculationResult.gpa;
          return () => clearTimeout(timer);
      }
  }, [calculationResult.gpa]);

  const coursesForChart = useMemo(() => {
     if (activeTerm === 'term1') return term1Courses;
     if (activeTerm === 'term2') return term2Courses;
     return [...term1Courses, ...term2Courses];
  }, [activeTerm, term1Courses, term2Courses]);
  

  const renderTab = (term: Term, label: string) => {
    const isActive = activeTerm === term;
    const activeClasses = "bg-blue-600 text-white shadow-md";
    const inactiveClasses = "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600";
    return (
      <button
        onClick={() => setActiveTerm(term)}
        className={`px-4 py-2 font-semibold rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500 ${isActive ? activeClasses : inactiveClasses}`}
      >
        {label}
      </button>
    );
  };
  
  const StatCard: React.FC<{ title: string; value: number, color: string, decimals?: number }> = ({ title, value, color, decimals = 0 }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex-1 text-center transform hover:scale-105 transition-transform duration-300">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>
          <AnimatedNumber value={value} decimals={decimals} />
        </p>
    </div>
  );
  
  const mainContent = useMemo(() => {
    const contentMap = {
        term1: <GPACalculator courses={term1Courses} setCourses={setTerm1Courses} />,
        term2: <GPACalculator courses={term2Courses} setCourses={setTerm2Courses} />,
        combined: (
            <div className='space-y-6'>
                <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">مواد الترم الأول</h3>
                    <GPACalculator courses={term1Courses} setCourses={setTerm1Courses} isReadOnly={true} />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">مواد الترم الثاني</h3>
                    <GPACalculator courses={term2Courses} setCourses={setTerm2Courses} isReadOnly={true} />
                </div>
            </div>
        )
    };
    return (
        <div key={activeTerm} className="animate-fadeIn">
            {contentMap[activeTerm]}
        </div>
    );
  }, [activeTerm, term1Courses, term2Courses]);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300 bg-transparent">
      <header className="py-4 px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md sticky top-0 z-10 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '100ms' }}>
        <div className="container mx-auto flex items-center justify-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
                <img src={logoSrc} alt="شعار كلية الهندسة" className="h-14 w-14 object-contain transition-transform duration-300 hover:rotate-6"/>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">جامعة بورسعيد</h1>
                    <h2 className="text-md sm:text-lg text-gray-600 dark:text-gray-300">كلية الهندسة - حاسبة المعدل</h2>
                </div>
            </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6">
        <div className="flex justify-center space-x-2 rtl:space-x-reverse mb-6 p-1 bg-gray-200 dark:bg-gray-900/50 rounded-lg animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '200ms' }}>
            {renderTab('term1', 'الترم الأول')}
            {renderTab('term2', 'الترم الثاني')}
            {renderTab('combined', 'الإجمالي')}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '300ms' }}>
                {mainContent}
            </div>

            <div className="lg:col-span-1 space-y-4 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '400ms' }}>
                <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center ${pulse ? 'animate-pulse-once' : ''}`}>
                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400">المعدل التراكمي (GPA)</p>
                    <p className="text-6xl font-extrabold text-blue-600 dark:text-blue-400 my-2 tracking-tight">
                        <AnimatedNumber value={calculationResult.gpa} decimals={3} />
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 gpa-progress-bar">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(calculationResult.gpa / 4.0) * 100}%` }}></div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <StatCard title="إجمالي الساعات" value={calculationResult.totalCredits} color="text-green-600 dark:text-green-400" />
                    <StatCard title="إجمالي النقاط" value={calculationResult.totalPoints} color="text-yellow-600 dark:text-yellow-400" decimals={2} />
                </div>
            </div>
        </div>
        
        <div className="animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '500ms' }}>
            <GradeChart courses={coursesForChart} />
        </div>

      </main>
      
      <footer className="mt-8 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>تم الإعداد بواسطة دفعة اعدادي 2025</p>
      </footer>
    </div>
  );
};

export default App;