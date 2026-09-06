export interface Education {
  id: string;
  institution: string;
  degree: string;
  details: string;
  location: string;
  period: string;
  status: string;
}

export const education: Education[] = [
  {
    id: 'iit-madras',
    institution: 'Indian Institute of Information Technology, Madras',
    degree: 'B.S (Online Degree) - Data Science and Application',
    details: 'CGPA - 7.97',
    location: 'Jodhpur, Rajasthan',
    period: '2023 – 2027',
    status: 'Degree level (3rd year) - TEC (Total Earned Credits): 88'
  },
  {
    id: 'mbm-university',
    institution: 'Mugneeram Bangur Memorial University',
    degree: 'B.E - Electronics and Communication',
    details: 'CGPA - 8.01',
    location: 'Jodhpur, Rajasthan',
    period: '2020 – 2024',
    status: 'Coordinator of King\'s Court Club (Official Chess Club)'
  },
  {
    id: 'mahaveer-school',
    institution: 'Mahaveer Public School',
    degree: 'Grade 12th - 83.2%',
    details: 'Grade 10th - 8.2 CGPA (77.9%)',
    location: 'Jodhpur, Rajasthan',
    period: '2009 – 2019',
    status: 'PCM with Computer Science, House Captain in 12th Grade'
  }
];