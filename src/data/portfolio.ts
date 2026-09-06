/**
 * Central portfolio data aggregator — the single source of truth consumed
 * by ALL three modes (terminal / professional / manga).
 *
 * Update content in the underlying `src/data/*` modules only; this file
 * only composes them into one object so no mode hardcodes its own copy.
 */
import { personalInfo } from './personal';
import { aboutCards, aboutStats } from './about';
import { experiences } from './experience';
import { education } from './education';
import { skillCategories } from './skills';
import { projects } from './projects';
import { certifications } from './certifications';
import { achievements } from './achievements';
import { socialLinks } from './socialLinks';
import { navigation } from './navigation';

export const portfolioData = {
  profile: personalInfo,
  about: {
    cards: aboutCards,
    stats: aboutStats,
  },
  experience: experiences,
  education,
  skills: skillCategories,
  projects,
  certifications,
  achievements,
  socialLinks,
  navigation,
} as const;

export type PortfolioData = typeof portfolioData;
