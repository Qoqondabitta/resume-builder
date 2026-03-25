export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  photoUrl: string;
}

export type SectionPosition = 'left' | 'right' | 'full';

export interface ResumeSection {
  id: string;
  title: string;
  content: string; // innerHTML (may contain basic HTML like <strong>, <br>)
  position: SectionPosition;
  visible: boolean;
}

export interface ResumeStyles {
  fontFamily: string;
  fontSize: number;
  accentColor: string;
  textColor: string;
}

export interface CanvasResumeData {
  personalInfo: PersonalInfo;
  sections: ResumeSection[];
  styles: ResumeStyles;
}

export const DEFAULT_RESUME: CanvasResumeData = {
  personalInfo: {
    name: 'Alex Johnson',
    title: 'Senior Software Engineer',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'alexjohnson.dev',
    linkedin: 'linkedin.com/in/alexjohnson',
    photoUrl: '',
  },
  sections: [
    {
      id: 'summary',
      title: 'Professional Summary',
      content:
        'Passionate software engineer with 6+ years building scalable web applications. Proven track record of leading cross-functional teams and driving 40%+ performance improvements.',
      position: 'full',
      visible: true,
    },
    {
      id: 'experience',
      title: 'Work Experience',
      content:
        '<strong>Senior Software Engineer</strong> — Acme Corp (2022–Present)<br>• Led team of 5 engineers, reducing API latency by 42%<br>• Built real-time notification system serving 2M+ users<br><br><strong>Software Engineer</strong> — Startup Inc. (2019–2021)<br>• Built company\'s first mobile-responsive dashboard<br>• Integrated payment flows, increasing conversion by 18%',
      position: 'full',
      visible: true,
    },
    {
      id: 'skills',
      title: 'Skills',
      content:
        'TypeScript · React · Next.js · Node.js<br>PostgreSQL · Redis · Docker · AWS<br>GraphQL · Python · Tailwind CSS',
      position: 'left',
      visible: true,
    },
    {
      id: 'education',
      title: 'Education',
      content:
        '<strong>B.S. Computer Science</strong><br>University of California, Berkeley<br>2014–2018 · GPA 3.8',
      position: 'right',
      visible: true,
    },
    {
      id: 'projects',
      title: 'Projects',
      content:
        '<strong>OpenMetrics Dashboard</strong><br>Real-time analytics dashboard used by 3,000+ developers.<br>React · D3.js · WebSockets<br><br><strong>DevFlow CLI</strong><br>Automates Git workflows, reducing overhead by 30%.<br>Node.js · TypeScript · GitHub API',
      position: 'full',
      visible: true,
    },
  ],
  styles: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    accentColor: '#2563eb',
    textColor: '#1e293b',
  },
};
