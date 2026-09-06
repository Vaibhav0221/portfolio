import { Card, CardContent, CardHeader, SectionHeader, Icon } from '../ui';
import { experiences } from '../../data';
import './Experience.css';

export function Experience() {
  return (
    <section id="experience" className="experience" aria-labelledby="experience-title">
      <div className="experience__container">
        <SectionHeader
          id="experience-title"
          title="Work Experience"
          subtitle="Professional journey and key achievements"
          align="center"
        />
        <div className="experience__timeline" role="list">
          {experiences.map((exp) => (
            <article key={exp.id} className="experience__item" role="listitem">
              <div className="experience__marker" aria-hidden={true} />
              <Card bordered padded hover className="experience__card">
                <CardHeader
                  title={exp.company}
                  subtitle={
                    <div className="experience__header-meta">
                      <span className="experience__position">{exp.position}</span>
                      <div className="experience__periods">
                        <span className="experience__period">
                          <Icon name="calendar" size={14} aria-hidden={true} className="icon--text-secondary" />
                          {exp.period}
                        </span>
                        <span className="experience__duration">
                          <Icon name="clock" size={14} aria-hidden={true} className="icon--text-secondary" />
                          {exp.duration}
                        </span>
                      </div>
                    </div>
                  }
                  icon={<Icon name="briefcase" size={28} />}
                />
                <CardContent>
                  <p className="experience__location">
                    <Icon name="location" size={14} aria-hidden={true} className="icon--text-secondary" />
                    {exp.location}
                  </p>
                  <ul className="experience__responsibilities" role="list">
                    {exp.responsibilities.map((resp, index) => (
                      <li key={index} className="experience__responsibility">
                        <Icon name="check" size={16} className="icon--success" aria-hidden={true} />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}