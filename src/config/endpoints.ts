export const API_ENDPOINTS = {
  chatbot: {
    url: 'https://llm-backend-one.vercel.app/chat',
    model: 'liquid/lfm-2.5-1.2b-instruct:free',
    OPENROUTER_BASE_URL: 'https://gemini-web2api-535340878471.asia-south1.run.app/v1',
    OPENROUTER_API_KEY: 'sk-gemini',
    OPENROUTER_MODEL: 'gemini-3.6-flash'
  },
  emailjs: {
    serviceId: 'service_portfolio',
    templateId: 'template_contact',
    publicKey: 'YOUR_PUBLIC_KEY',
  },
} as const;