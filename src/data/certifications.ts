export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  icon: string;
  url: string;
}

export const certifications: Certification[] = [
  {
    id: 'google-cloud-genai',
    title: 'Google Cloud Certified Generative AI Leader',
    issuer: 'Google Cloud',
    date: 'August 2025',
    icon: '☁️',
    url: 'https://www.credly.com/badges/b241c460-2ef3-46d7-bcb2-19e11efb1b13/public_url'
  },
  {
    id: 'openai-api',
    title: 'Introduction to OpenAI API & ChatGPT API for Developers',
    issuer: 'Udemy',
    date: 'May 2025',
    icon: '🤖',
    url: 'https://drive.google.com/file/d/1IFW_Oisko_Evx0q6g-p_fkwIjRR-GESr/view?usp=sharing'
  },
  {
    id: 'ollama-llm',
    title: 'Mastering Ollama: Build Private Local LLM Apps with Python',
    issuer: 'Udemy',
    date: 'May 2025',
    icon: '🦙',
    url: 'https://drive.google.com/file/d/1H2XrnJ2OwK_V20uLqUXKnN8N0Hxa8mDl/view?usp=sharing'
  }
];