export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const navigation: NavItem[] = [
  { id: 'about', label: 'About', href: '#about' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'education', label: 'Education', href: '#education' },
  { id: 'certifications', label: 'Credentials', href: '#certifications' },
  { id: 'contact', label: 'Contact', href: '#contact' }
];