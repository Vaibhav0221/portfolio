import { Card, CardContent, CardHeader, SectionHeader, Icon } from '../ui';
import { certifications } from '../../data/certifications';
import { achievements } from '../../data/achievements';
import './Certifications.css';

export function Certifications() {
  return (
    <section id="certifications" className="certifications" aria-labelledby="certifications-title">
      <div className="certifications__container">
        <SectionHeader
          title="Certifications & Achievements"
          subtitle="Credentials, awards, and leadership roles"
          align="center"
        />
        <div className="certifications__grid" role="list">
          {certifications.map((cert) => (
            <article key={cert.id} className="certification-card" role="listitem">
              <Card hover bordered padded>
                <CardHeader
                  title={cert.title}
                  subtitle={
                    <div className="certification__meta">
                      <span className="certification__issuer">
                        <Icon name="award" size={14} aria-hidden={true} className="icon--text-secondary" />
                        {cert.issuer}
                      </span>
                      <span className="certification__date">{cert.date}</span>
                    </div>
                  }
                  icon={<Icon name={cert.icon} size={28} aria-hidden={true} />}
                />
                <CardContent>
                  <div className="certification__actions">
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="certification__verify-link"
                      aria-label={`View ${cert.title} credential`}
                    >
                      <Icon name="externalLink" size={14} aria-hidden={true} />
                      View Credential
                    </a>
                  </div>
                </CardContent>
              </Card>
              </article>
          ))}

          {achievements.map((achievement) => (
            <article key={achievement.id} role="listitem">
              <Card hover bordered padded>
                <CardHeader
                  title={achievement.title}
                  subtitle={
                    <div className="certification__meta">
                      <span className="certification__issuer">
                        <Icon name="award" size={14} aria-hidden={true} className="icon--text-secondary" />
                        {achievement.org}
                      </span>
                      <span className="certification__date">{achievement.period}</span>
                    </div>
                  }
                  icon={<Icon name={achievement.icon} size={28} aria-hidden={true} />}
                />
                <CardContent>
                  <p>{achievement.description}</p>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}