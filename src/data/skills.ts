export interface SkillCategory {
  id: string;
  title: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'programming-languages',
    title: 'Programming Languages',
    skills: ['Python', 'SQL', 'Java']
  },
  {
    id: 'backend-frameworks',
    title: 'Backend Frameworks & APIs',
    skills: ['FastAPI', 'Flask', 'RESTful API Development']
  },
  {
    id: 'databases',
    title: 'Databases & Vector Stores',
    skills: ['PostgreSQL', 'SQLite', 'ChromaDB', 'pgvector']
  },
  {
    id: 'ai-llm-engineering',
    title: 'AI Processing & LLM Engineering',
    skills: ['LLMWhisperer (OCR)', 'Whisper (Audio-to-Text)', 'Roboflow (Vision)', 'RAG', 'LangGraph', 'Prompt Engineering']
  }
];