import { useState } from 'react';
import { CardContent, CardHeader, SectionHeader, Button, Tag, Icon } from '../ui';
import { projects } from '../../data/projects';
import './Projects.css';

export function Projects() {
  const [imageErrors] = useState<Set<string>>(new Set());

  return (
    <section id="projects" className="projects" aria-labelledby="projects-title">
      <div className="projects__container">
        <SectionHeader
          title="Projects"
          subtitle="A selection of my recent work and side projects"
          align="center"
        />
        <div className="projects__grid" role="list">
          {projects.map((project) => (
            <article
              key={project.id}
              className="project-card"
              role="listitem"
            >
              <div
                className="project-card__image"
                style={{
                  backgroundImage: imageErrors.has(project.id) || !project.imageUrl
                    ? undefined
                    : `url(${project.imageUrl})`
                }}
                aria-hidden={true}
              >
                {(imageErrors.has(project.id) || !project.imageUrl) && (
                  <div className="project-card__placeholder">
                    <Icon name="code" size={48} className="icon--white" />
                  </div>
                )}
              </div>

              <div className="project-card__content">
                <CardHeader
                  title={project.title}
                  subtitle={project.period && <span className="project-card__period">{project.period}</span>}
                />
                <CardContent>
                  <p className="project-card__description">{project.description}</p>
                  <div className="project-card__tech" role="list" aria-label={`${project.title} technologies`}>
                    {project.technologies.map((tech, index) => (
                      <Tag key={index} variant="outline" size="sm" className="project-card__tech-badge">
                        {tech}
                      </Tag>
                    ))}
                  </div>
                </CardContent>
                <div className="project-card__actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Icon name="github" size={16} />}
                    asChild
                  >
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      View on GitHub
                    </a>
                  </Button>
                  {project.liveUrl && (
                    <Button
                      variant="primary"
                      size="sm"
                      rightIcon={<Icon name="arrowRight" size={14} />}
                      asChild
                    >
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.title} live demo`}
                      >
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}