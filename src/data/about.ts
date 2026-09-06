export interface AboutCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const aboutCards: AboutCard[] = [
  {
    id: 'who-i-am',
    icon: 'code',
    title: 'Who I Am',
    description: 'I\'m a Backend Developer with hands-on experience building RESTful APIs using Flask and FastAPI. I have a strong problem-solving mindset with a generic approach, specializing in integrating Generative AI into backend systems for tasks such as data extraction, summarization, and content generation.',
  },
  {
    id: 'what-i-do',
    icon: 'server',
    title: 'What I Do',
    description: 'At Tata Consultancy Services, I build multiple GenAI proof-of-concept applications using Streamlit and develop end-to-end GenAI solutions including Smart Claim Reader, Invoice Extractor, and Insurance Agent Chatbots. I work with LLaMA, Gemini, and vector databases like pgvector with PostgreSQL.',
  },
  {
    id: 'my-approach',
    icon: 'brain',
    title: 'My Approach',
    description: 'I focus on building scalable, efficient backend systems using Python, FastAPI, and Flask. I leverage AI processing tools like LLMWhisperer, Whisper, and Roboflow, along with RAG, LangGraph, and prompt engineering to create innovative solutions that solve real-world problems.',
  },
];

export interface AboutStat {
  id: string;
  value: string;
  label: string;
}

export const aboutStats: AboutStat[] = [
  { id: 'experience', value: '0+', label: 'Year Experience' },
  { id: 'projects', value: '9', label: 'Major Projects' },
  { id: 'certifications', value: '3', label: 'Certifications' },
  { id: 'cgpa', value: '8.01', label: 'Current CGPA' },
];