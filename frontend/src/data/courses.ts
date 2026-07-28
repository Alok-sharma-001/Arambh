export interface CourseTrack {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  totalRegions: number;
  description: string;
  status: 'active' | 'coming_soon';
}

export const COURSE_TRACKS: CourseTrack[] = [
  {
    id: 'python',
    name: 'Python Realm',
    subtitle: 'Variables to Algorithms',
    icon: '🐍',
    accentColor: '#34d399',
    totalRegions: 12,
    description: 'Master Python fundamentals, object-oriented programming, data structures, and capstone challenges.',
    status: 'active'
  },
  {
    id: 'javascript',
    name: 'JavaScript Citadel',
    subtitle: 'DOM & Async Programming',
    icon: '⚡',
    accentColor: '#fbbf24',
    totalRegions: 12,
    description: 'Master modern ES6+, async/await, DOM manipulation, closures, and web APIs.',
    status: 'coming_soon'
  },
  {
    id: 'sql',
    name: 'SQL Sanctuary',
    subtitle: 'Relational Queries & Joins',
    icon: '🗄️',
    accentColor: '#60a5fa',
    totalRegions: 8,
    description: 'Master SELECT queries, complex JOINs, GROUP BY aggregations, and subqueries.',
    status: 'coming_soon'
  }
];
