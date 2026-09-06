import { portfolioData } from '../../data/portfolio';

export interface TerminalLine {
  kind: 'input' | 'output' | 'error' | 'section' | 'system' | 'link';
  text: string;
  href?: string;
}

export type CommandResult = TerminalLine[] | 'CLEAR';

const d = portfolioData;

/** Find a social link URL by label substring. */
function socialUrl(label: string): string {
  const match = d.socialLinks.find((l) =>
    l.label.toLowerCase().includes(label.toLowerCase())
  );
  return match ? match.url : '';
}

function linkedInUrl(): string {
  return socialUrl('linkedin');
}

function resumeUrl(): string {
  return d.profile.resumeUrl;
}

/** Render a project as readable terminal output. */
function projectLines(p: (typeof d.projects)[number]): TerminalLine[] {
  const lines: TerminalLine[] = [
    { kind: 'section', text: p.title + '  [' + p.period + ']' },
    { kind: 'output', text: p.description },
    { kind: 'output', text: '' },
    { kind: 'output', text: 'Tech: ' + p.technologies.join(', ') },
  ];
  if (p.liveUrl) {
    lines.push({ kind: 'link', text: 'Live demo: ' + p.liveUrl, href: p.liveUrl });
  }
  lines.push({ kind: 'link', text: 'GitHub: ' + p.githubUrl, href: p.githubUrl });
  return lines;
}

/** `projects` command — list every project, optionally by id. */
function listProjects(args: string[]): CommandResult {
  if (args.length > 0) {
    const query = args.join(' ').toLowerCase();
    const match = d.projects.find(
      (p) => p.id === query || p.title.toLowerCase().includes(query)
    );
    if (match) {
      return projectLines(match);
    }
    return [{ kind: 'error', text: 'No project matching "' + query + '". Try: projects' }];
  }
  const lines: TerminalLine[] = [
    { kind: 'section', text: 'PROJECTS (' + d.projects.length + ')' },
    { kind: 'output', text: '' },
  ];
  for (const p of d.projects) {
    lines.push({
      kind: 'output',
      text: '  ' + p.id.padEnd(26) + p.title,
    });
  }
  lines.push({ kind: 'output', text: '' });
  lines.push({ kind: 'system', text: 'Tip: run "projects <query>" for details, e.g. projects llm-backend' });
  return lines;
}

/** `about` command — bio + about cards. */
function aboutCommand(): CommandResult {
  const lines: TerminalLine[] = [{ kind: 'section', text: 'ABOUT' }];
  lines.push({ kind: 'output', text: d.profile.description });
  for (const card of d.about.cards) {
    lines.push({ kind: 'output', text: '' });
    lines.push({ kind: 'section', text: card.title });
    lines.push({ kind: 'output', text: card.description });
  }
  return lines;
}

/** `skills` command — categories with items. */
function skillsCommand(): CommandResult {
  const lines: TerminalLine[] = [{ kind: 'section', text: 'SKILLS' }];
  lines.push({ kind: 'output', text: '' });
  for (const cat of d.skills) {
    lines.push({ kind: 'section', text: cat.title });
    for (const skill of cat.skills) {
      lines.push({ kind: 'output', text: '  • ' + skill });
      }
  }
  return lines;
}

/** `experience` command — roles with responsibilities. */
function experienceCommand(): CommandResult {
  const lines: TerminalLine[] = [{ kind: 'section', text: 'EXPERIENCE' }];
  for (const job of d.experience) {
    lines.push({ kind: 'output', text: '' });
    lines.push({
      kind: 'section',
      text: job.position + ' @ ' + job.company,
    });
    lines.push({
      kind: 'system',
      text: job.period + ' · ' + job.location + ' · ' + job.duration,
    });
    for (const item of job.responsibilities) {
      lines.push({ kind: 'output', text: '  - ' + item });
    }
  }
  return lines;
}

/** `education` command — institutions. */
function educationCommand(): CommandResult {
  const lines: TerminalLine[] = [{ kind: 'section', text: 'EDUCATION' }];
  for (const school of d.education) {
    lines.push({ kind: 'output', text: '' });
    lines.push({ kind: 'section', text: school.institution });
    lines.push({ kind: 'system', text: [school.degree, school.details].filter(Boolean).join(' · ') });
    lines.push({ kind: 'system', text: school.period + ' · ' + school.location });
    lines.push({ kind: 'system', text: school.status });
  }
  return lines;
}

/** `certifications` command — credential cards. */
function certsCommand(): CommandResult {
  const lines: TerminalLine[] = [{ kind: 'section', text: 'CERTIFICATIONS' }];
  for (const cert of d.certifications) {
    lines.push({ kind: 'output', text: '' });
    lines.push({ kind: 'section', text: cert.title });
    lines.push({ kind: 'system', text: cert.issuer + ' · ' + cert.date });
    lines.push({ kind: 'link', text: 'Credential: ' + cert.url, href: cert.url });
  }
  return lines;
}

/** `achievements` command — awards & leadership. */
function achievementsCommand(): CommandResult {
  const lines: TerminalLine[] = [{ kind: 'section', text: 'ACHIEVEMENTS' }];
  for (const achievement of d.achievements) {
    lines.push({ kind: 'output', text: '' });
    lines.push({ kind: 'section', text: achievement.title + ' — ' + achievement.org });
    lines.push({ kind: 'system', text: achievement.period });
    lines.push({ kind: 'output', text: '  ' + achievement.description });
  }
  return lines;
}

/** `contact` command — direct channels. */
function contactCommand(): CommandResult {
  return [
    { kind: 'section', text: 'CONTACT' },
    { kind: 'link', text: 'Email: ' + d.profile.email, href: 'mailto:' + d.profile.email },
    { kind: 'link', text: 'Phone: ' + d.profile.phone, href: 'tel:' + d.profile.phone },
    { kind: 'output', text: 'Location: ' + d.profile.location },
  ];
}

/** `socials` command — profile links. */
function socialsCommand(): CommandResult {
  const lines: TerminalLine[] = [{ kind: 'section', text: 'SOCIALS' }];
  for (const link of d.socialLinks) {
    lines.push({ kind: 'link', text: '  ' + link.label + ': ' + link.url, href: link.url });
  }
  return lines;
}

/** `sudo hire-vaibhav` — the fun one. */
function hireCommand(): CommandResult {
  const lines: TerminalLine[] = [
    { kind: 'system', text: '[sudo] password for recruiter: ********' },
    { kind: 'output', text: '' },
    { kind: 'section', text: 'ACCESS GRANTED — LET\'S TALK.' },
    { kind: 'output', text: '' },
    { kind: 'system', text: 'Vaibhav is open to Backend / AI Engineer roles and interesting problems.' },
    { kind: 'link', text: 'Email: ' + d.profile.email, href: 'mailto:' + d.profile.email },
    { kind: 'link', text: 'LinkedIn: ' + linkedInUrl(), href: linkedInUrl() },
    { kind: 'link', text: 'Resume (PDF): ' + resumeUrl(), href: resumeUrl() },
    { kind: 'output', text: '' },
    { kind: 'output', text: '' },
    { kind: 'system', text: 'No sudo required — just say hi.' },
  ];
  return lines;
}

/** `home` command — ASCII banner + identity. */
function homeCommand(): CommandResult {
  const banner = [
    '██╗░░░██╗███████╗',
    '██║░░░██║██╔════╝',
    '███████║█████╗',
    '██╔══██║██╔══╝',
    '██║░░██║███████╗',
    '╚═╝░░╚═╝╚══════╝',
  ];
  return [
    ...banner.map((line): TerminalLine => ({ kind: 'section', text: line })),
    { kind: 'output', text: '' },
    { kind: 'section', text: d.profile.name },
    { kind: 'system', text: d.profile.subtitle + ' · Kolkata, India' },
    { kind: 'output', text: '' },
    { kind: 'system', text: 'Type "help" to see available commands.' },
  ];
}

/** `help` command — table of every command. */
function helpCommand(): CommandResult {
  const lines: TerminalLine[] = [{ kind: 'section', text: 'AVAILABLE COMMANDS' }];
  lines.push({ kind: 'output', text: '' });
  for (const [name, def] of Object.entries(COMMAND_REGISTRY)) {
    lines.push({
      kind: 'output',
      text: '  ' + name.padEnd(22) + def.desc,
    });
  }
  lines.push({ kind: 'output', text: '' });
  lines.push({ kind: 'system', text: '↑/↓ history · Tab completion · try "sudo hire-vaibhav"' });
  return lines;
}

/** Unknown command → error + nearest-match hint with Levenshtein suggestion. */
export function unknownCommand(rawInput: string): TerminalLine[] {
  const names = Object.keys(COMMAND_REGISTRY);
  let best: string | null = null;
  let bestDistance = Infinity;
  for (const name of names) {
    const dist = levenshtein(name, rawInput);
    if (dist < bestDistance) {
      bestDistance = dist;
      best = name;
      }
  }
  const hint =
    best !== null && bestDistance <= Math.max(3, rawInput.length - 2)
      ? 'Did you mean "' + best + '"?'
      : 'Run "help" to list commands.';
  return [
    { kind: 'error', text: 'command not found: ' + rawInput },
    { kind: 'system', text: hint },
  ];
}

/** Simple Levenshtein distance for "did you mean" suggestions. */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const prev = new Array(n + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= m; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = prev[j];
      prev[j] = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        diag + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      diag = temp;
    }
  }
  return prev[n];
}

export interface TerminalCommand {
  run: (args: string[]) => CommandResult;
  desc: string;
}

/** Registry of every terminal command, data-driven from portfolioData. */
export const COMMAND_REGISTRY: Record<string, TerminalCommand> = {
  help: { desc: 'Show this message', run: () => helpCommand() },
  whoami: {
    desc: 'Who is Vaibhav?',
    run: () => [
      { kind: 'section', text: d.profile.name },
      { kind: 'system', text: d.profile.title + ' | AI Engineer' },
      { kind: 'output', text: '' },
      { kind: 'output', text: d.profile.description },
    ],
  },
  about: { desc: 'Introduction & focus areas', run: () => aboutCommand() },
  skills: { desc: 'Technical skill categories', run: () => skillsCommand() },
  experience: { desc: 'Work history & responsibilities', run: () => experienceCommand() },
  projects: {
    desc: 'List projects; "projects <query>" for details',
    run: (args) => listProjects(args),
  },
  education: { desc: 'Academic background', run: () => educationCommand() },
  certifications: { desc: 'Verified credentials', run: () => certsCommand() },
  achievements: { desc: 'Awards & leadership roles', run: () => achievementsCommand() },
  contact: { desc: 'Email, phone, location', run: () => contactCommand() },
  socials: { desc: 'GitHub / LinkedIn profiles', run: () => socialsCommand() },
  home: { desc: 'Print welcome banner', run: () => homeCommand() },
  clear: {
    desc: 'Clear the screen',
    run: () => 'CLEAR',
  },
  date: { desc: 'Current date & time', run: () =>
    [{ kind: 'system', text: new Date().toString() }] },
  echo: {
    desc: 'Print arguments back',
    run: (args) => [{ kind: 'output', text: args.join(' ') || '(nothing to echo)' }],
  },
  'sudo hire-vaibhav': {
    desc: 'You know you want to.',
    run: () => hireCommand(),
  },
};