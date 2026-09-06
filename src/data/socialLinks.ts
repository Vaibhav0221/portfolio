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
    url: 'https://github.com/VaibhavSoni11',
    icon: 'github'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/vaibhav-soni-11',
    icon: 'linkedin'
  }
];