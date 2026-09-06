export interface PersonalInfo {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  subtitle: string;
  description: string;
  bio: string;
  email: string;
  academicEmail: string;
  phone: string;
  location: string;
  profileImage: string;
  resumeUrl: string;
  baseUrl: string;
  socialLinks: SocialLink[];
  skills: SkillCategory[];
  initials: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export const personalInfo: PersonalInfo = {
  name: 'Vaibhav Soni',
  firstName: 'Vaibhav',
  lastName: 'Soni',
  title: 'Backend Developer',
  subtitle: 'Backend Developer • Problem Solver',
  description: 'Backend Developer with hands-on experience building RESTful APIs using Flask and FastAPI. Strong problem-solving mindset with expertise in integrating Generative AI into backend systems for data extraction, summarization, and content generation.',
  bio: 'Backend Developer with hands-on experience building RESTful APIs using Flask and FastAPI. Strong problem-solving mindset with expertise in integrating Generative AI into backend systems for data extraction, summarization, and content generation.',
  email: 'vaibhavsonisatya1@gmail.com',
  academicEmail: '23f2004675@ds.study.iitm.ac.in',
  phone: '+91-9530052382',
  location: 'Kolkata, West Bengal, India',
  profileImage: '/image.png',
  resumeUrl: '/resume.pdf',
  baseUrl: 'https://vaibhavsoni.dev',
  socialLinks: [
    { name: 'GitHub', url: 'https://github.com/VaibhavSoni11', icon: 'github' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/vaibhav-soni-11', icon: 'linkedin' },
  ],
  skills: [
    { category: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'Java'] },
    { category: 'Backend', items: ['Flask', 'FastAPI', 'Node.js', 'Express', 'REST APIs'] },
    { category: 'Databases', items: ['PostgreSQL', 'MongoDB', 'Redis', 'SQLite'] },
    { category: 'AI/ML', items: ['Generative AI', 'LLM Integration', 'Vector Databases', 'RAG'] },
  ],
  initials: 'VS',
};