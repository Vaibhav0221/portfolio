import { Card, CardContent, CardHeader, SectionHeader, Icon } from '../ui';
import { education } from '../../data/education';
import './Education.css';

export function Education() {
  return (
    <section id="education" className="education" aria-labelledby="education-title">
      <div className="education__container">
        <SectionHeader
          title="Education"
          subtitle="Academic background and achievements"
          align="center"
        />
        <div className="education__grid" role="list">
          {education.map((edu) => (
            <article key={edu.id} className="education__card" role="listitem">
              <Card hover bordered padded>
                <CardHeader
                  title={edu.institution}
                  subtitle={<span className="education__degree">{edu.degree}</span>}
                  icon={<Icon name="graduation" size={28} />}
                />
                <CardContent>
                  <p className="education__details">{edu.details}</p>
                  <div className="education__meta">
                    <span className="education__location">
                      <Icon name="location" size={14} aria-hidden={true} className="icon--text-secondary" />
                      {edu.location}
                    </span>
                    <span className="education__period">{edu.period}</span>
                  </div>
                  <p className="education__status">{edu.status}</p>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}