export interface Project {
  id: string;
  title: string;
  period: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string | null;
  imageUrl: string;
}

export const projects: Project[] = [
  {
    id: 'llm-backend',
    title: 'LLM Generic Backend',
    period: 'Jan 2026',
    description: 'Designed and implemented a scalable FastAPI-based LLM backend that serves AI chat requests through OpenRouter. The backend exposes a generic /chat API accepting model name and prompt as parameters, supports multiple LLM providers, includes health monitoring, structured logging, CORS handling, and is optimized for serverless deployment on Vercel.',
    technologies: ['FastAPI', 'Python', 'OpenRouter API', 'REST APIs', 'Serverless (Vercel)', 'Logging', 'CORS'],
    githubUrl: 'https://github.com/Vaibhav0221/LLM-Backend',
    liveUrl: 'https://llm-backend-one.vercel.app/',
    imageUrl: '/project_images/LLM_Backend.png'
  },
  {
    id: 'bdm-project',
    title: 'BDM Project',
    period: 'Jul 2025 – Nov 2025',
    description: 'Designed and implemented a data-driven business analysis for a restaurant domain using 3 months of real data. Built structured master data and transactional datasets, performed data cleaning and analysis to generate business insights including top-selling items, peak hours, and revenue trends.',
    technologies: ['Python', 'Data Science', 'EDA', 'Business Analytics'],
    githubUrl: 'https://github.com/Vaibhav0221/Business-Data-Management',
    liveUrl: null,
    imageUrl: '/project_images/BDM.png'
  },
  {
    id: 'engage2value',
    title: 'Engage 2 Value',
    period: 'Jan 2025 – May 2025',
    description: 'Built a machine learning model to predict customer purchase value using multi-session behavioral data. Handled large-scale datasets (116k+ rows) and trained multiple models including XGBoost, achieving best performance for final predictions.',
    technologies: ['Python', 'Scikit-learn', 'XGBoost', 'Feature Engineering', 'EDA'],
    githubUrl: 'https://github.com/Vaibhav0221/Engage2Value',
    liveUrl: null,
    imageUrl: '/project_images/Engage2Value.png'
  },
  {
    id: 'quizgen',
    title: 'Quizgen',
    period: 'Jan 2025 – May 2025',
    description: 'Developed a multi-user quiz management web application with role-based access (Admin and Users). Built RESTful backend using Flask, integrated with SQLite, and implemented Redis caching and Celery-based background tasks for performance.',
    technologies: ['Flask', 'Vue.js', 'SQLite', 'Redis', 'Celery', 'Flask-Security'],
    githubUrl: 'https://github.com/Vaibhav0221/Quiz-generator',
    liveUrl: null,
    imageUrl: '/project_images/Quizgen.png'
  },
  {
    id: 'household-services',
    title: 'Household Services Application',
    period: 'Sep 2024 – Dec 2024',
    description: 'Developed a multi-user household services web application supporting Admin, Customer, and Service Professional roles. Built backend using Flask and SQLAlchemy, designed relational database schemas, and created role-specific dashboards with data visualization.',
    technologies: ['Flask', 'SQLite', 'SQLAlchemy', 'Matplotlib'],
    githubUrl: 'https://github.com/Vaibhav0221/Household-Services-Application',
    liveUrl: null,
    imageUrl: '/project_images/HSA.png'
  },
  {
    id: 'gradebook',
    title: 'Gradebook Application Portal',
    period: 'May 2024 – Jul 2024',
    description: 'Developed a Gradebook web application with an admin dashboard displaying an index of all students. Admin can view detailed student information along with their registered courses by clicking on the roll number, and can update or remove student records. The system is backed by a relational database design linking Student, Courses, and Enrollment tables.',
    technologies: ['Python', 'Flask', 'SQLite', 'SQL', 'Web Development'],
    githubUrl: 'https://github.com/Vaibhav0221/Gradebook',
    liveUrl: 'https://gradebook-2.onrender.com/',
    imageUrl: '/project_images/Gradebook.png'
  },
  {
    id: 'smart-farming',
    title: 'Smart Farming for Pearl Millet (Western Rajasthan)',
    period: 'Sep 2023 – Feb 2024',
    description: 'Developed an IoT-based smart farming system for Pearl Millet cultivation tailored to the climatic conditions of Western Rajasthan. Collected crop-specific environmental data using multiple sensors integrated with an ESP8266 microcontroller. Enabled real-time monitoring via OLED display and cloud-based visualization using the ThingSpeak IoT platform to support precision farming.',
    technologies: ['IoT', 'ESP8266', 'Embedded C', 'Sensors', 'ThingSpeak', 'Smart Agriculture'],
    githubUrl: 'https://github.com/Vaibhav0221/Smart-Farming-for-Pearl-Millet-crop-for-Western-Rajasthan',
    liveUrl: null,
    imageUrl: '/project_images/Circuit_Diagram.png'
  },
  {
    id: 'human-action-recognition',
    title: 'Human Action Recognition',
    period: 'Sep 2023 – Dec 2023',
    description: 'Developed a machine learning model to recognize human actions from image data using transfer learning with VGG16 and TensorFlow. Trained the model on 16 distinct action classes and integrated it with a Django-based REST API to serve predictions programmatically.',
    technologies: ['Python', 'TensorFlow', 'VGG16', 'Machine Learning', 'Django', 'REST API'],
    githubUrl: 'https://github.com/Vaibhav0221/HAR',
    liveUrl: null,
    imageUrl: '/project_images/HAR.png'
  },
  {
    id: 'roller-bearing-analyzer',
    title: 'Roller Bearing Analyzer',
    period: 'Dec 2023 – Jan 2024',
    description: 'Developed a generalized Python-based program for roller bearing analysis that evaluates design parameters and determines whether a bearing design is safe or unsafe based on engineering calculations and operating conditions.',
    technologies: ['Python', 'Mechanical Design', 'Bearing Analysis', 'Engineering Calculations'],
    githubUrl: 'https://github.com/Vaibhav0221/Roller-Bearing-Analyzer',
    liveUrl: 'https://roller-bearing-analyzer.vercel.app/',
    imageUrl: '/project_images/Bearing.png'
  }
];