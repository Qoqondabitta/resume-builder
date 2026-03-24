export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  period: string;
  note?: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  link?: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  achievements: string[];
  languages?: string[];
}

export const SAMPLE_RESUME: ResumeData = {
  name: 'Alex Johnson',
  title: 'Senior Software Engineer',
  email: 'alex@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  website: 'alexjohnson.dev',
  linkedin: 'linkedin.com/in/alexjohnson',
  summary:
    'Passionate software engineer with 6+ years of experience building scalable web applications and developer tools. Proven track record of leading cross-functional teams, shipping features used by millions, and driving 40%+ performance improvements across critical systems.',
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'Acme Corp',
      location: 'San Francisco, CA',
      period: 'Jan 2022 – Present',
      bullets: [
        'Led a team of 5 engineers to redesign the core API, reducing latency by 42%.',
        'Architected a real-time notification system serving 2M+ users with 99.9% uptime.',
        'Mentored 3 junior engineers and introduced code review standards adopted org-wide.',
        'Reduced CI pipeline time from 18 min to 6 min by parallelising test suites.',
      ],
    },
    {
      role: 'Software Engineer',
      company: 'Startup Inc.',
      location: 'Remote',
      period: 'Jun 2019 – Dec 2021',
      bullets: [
        'Built the company\'s first mobile-responsive dashboard used by 500+ enterprise clients.',
        'Integrated Stripe and PayPal payment flows, increasing conversion rate by 18%.',
        'Wrote comprehensive unit and integration tests, lifting coverage from 34% to 87%.',
      ],
    },
    {
      role: 'Junior Developer',
      company: 'Tech Agency',
      location: 'New York, NY',
      period: 'Aug 2018 – May 2019',
      bullets: [
        'Developed 12 client websites using React and WordPress, on time and under budget.',
        'Collaborated with designers to implement pixel-perfect UI components.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.S. Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      period: '2014 – 2018',
      note: 'GPA 3.8 · Dean\'s List · ACM Chapter President',
    },
  ],
  skills: [
    'TypeScript', 'React', 'Next.js', 'Node.js',
    'PostgreSQL', 'Redis', 'Docker', 'AWS',
    'GraphQL', 'Python', 'Tailwind CSS', 'Git',
  ],
  projects: [
    {
      name: 'OpenMetrics Dashboard',
      description:
        'Open-source real-time analytics dashboard with customisable widgets, used by 3,000+ developers.',
      tech: ['React', 'D3.js', 'WebSockets', 'Node.js'],
      link: 'github.com/alexj/openmetrics',
    },
    {
      name: 'DevFlow CLI',
      description:
        'Command-line tool that automates Git workflows and PR creation, reducing developer overhead by 30%.',
      tech: ['Node.js', 'TypeScript', 'GitHub API'],
      link: 'github.com/alexj/devflow',
    },
  ],
  achievements: [
    'Speaker at React Conf 2023 – "Scaling State Without Tears"',
    'AWS Certified Solutions Architect (2023)',
    'Open-source contributor: 400+ GitHub stars across personal projects',
    'Hackathon winner – SF TechJam 2022 (Best Developer Tool)',
  ],
  languages: ['English (Native)', 'Spanish (Conversational)', 'French (Basic)'],
};

export const TEMPLATE_IDS = [
  'modern',
  'minimalist',
  'creative',
  'corporate',
  'elegant',
] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];
