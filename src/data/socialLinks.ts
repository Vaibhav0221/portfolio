export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/Vaibhav0221',
    icon: 'github'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/vaibhav-soni21/',
    icon: 'linkedin'
  }
];