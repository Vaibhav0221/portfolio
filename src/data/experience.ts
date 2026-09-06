export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  period: string;
  duration: string;
  responsibilities: string[];
}

export const experiences: Experience[] = [
  {
    id: 'tcs',
    company: 'Tata Consultancy Services',
    position: 'Backend Developer',
    location: 'Kolkata, West Bengal',
    period: 'Jan 2025 – Present',
    duration: '1 Year',
    responsibilities: [
      'Built multiple GenAI proof-of-concept applications using Streamlit to explore feasibility, user flow, and model performance before moving to production.',
      'Developed end-to-end GenAI solutions such as a Smart Claim Reader, Invoice Extractor (OCR + Roboflow), and an Insurance Agent Chatbot/Call Agent/Mail Agent, using pgvector with PostgreSQL for vector storage.',
      'Worked with LLaMA and Gemini as inference models and used MiniLM and Nomic as embedding models to support semantic search and retrieval-based workflows.'
    ]
  }
];