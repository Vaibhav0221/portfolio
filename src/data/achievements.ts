export interface Achievement {
  id: string;
  title: string;
  org: string;
  period: string;
  description: string;
  icon: string;
}

/**
 * Achievements & leadership roles, derived from education/experience data.
 * Add new entries here and they appear in every mode automatically.
 */
export const achievements: Achievement[] = [
  {
    id: 'genai-at-scale',
    title: 'GenAI Systems in Production',
    org: 'Tata Consultancy Services',
    period: '2025 – Present',
    description:
      'Shipped end-to-end GenAI solutions — Smart Claim Reader, Invoice Extractor (OCR + Roboflow), and Insurance Agent Chatbot/Call/Mail agents — using pgvector + PostgreSQL for retrieval.',
    icon: 'brain',
  },
  {
    id: 'nine-projects',
    title: '9 Major Projects Shipped',
    org: 'Personal & Academic',
    period: '2023 – Present',
    description:
      'Built and released projects spanning backend engineering (FastAPI/Flask), machine learning (XGBoost, VGG16 transfer learning), IoT (ESP8266 smart farming), and developer tooling.',
    icon: 'code',
  },
  {
    id: 'chess-club-coordinator',
    title: "Coordinator, King's Court Club",
    org: 'MBM University (Official Chess Club)',
    period: '2020 – 2024',
    description:
      'Coordinated the university\'s official chess club — organizing matches, events, and community for fellow players.',
    icon: 'award',
  },
  {
    id: 'house-captain',
    title: 'House Captain',
    org: 'Mahaveer Public School',
    period: 'Grade 12',
    description:
      'Elected House Captain in Grade 12 — led the house across academic, cultural, and sports competitions.',
    icon: 'star',
  },
];
