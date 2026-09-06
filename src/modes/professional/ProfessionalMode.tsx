import { Header, Hero, About, Experience, Skills, Projects, Education, Certifications, Contact } from '../../components/sections';

/**
 * Professional mode — recruiter-friendly portfolio.
 * Composes the existing production sections; eager-loaded (default mode).
 */
export function ProfessionalMode() {
  return (
    <div className="pmode">
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <Certifications />
        <Contact />
      </main>
    </div>
  );
}