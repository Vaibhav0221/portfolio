import { useState, useEffect } from 'react';
import { Card, SectionHeader, Icon } from '../ui';
import { aboutCards, aboutStats } from '../../data';
import './About.css';

function getExperienceInYears(startDateStr: string): string {
  const startDate = new Date(startDateStr);
  const today = new Date();
  const diffInMs = today.getTime() - startDate.getTime();
  const years = diffInMs / (1000 * 60 * 60 * 24 * 365.25);
  return years.toFixed(2);
}

export function About() {
  const [stats, setStats] = useState<typeof aboutStats>(aboutStats);

  useEffect(() => {
    setStats(prev => prev.map(stat => ({
      ...stat,
      value: stat.id === 'experience' ? `${getExperienceInYears('2025-01-16')}+` : stat.value
    })));
  }, []);

  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="about__container">
        <SectionHeader
          id="about-title"
          title={<span>Backend <span className="gradient-text">Developer</span></span>}
          subtitle="Crafting robust, scalable solutions that power exceptional digital experiences"
          align="center"
        />

        <div className="about__content">
          <div className="about__main" role="list">
            {aboutCards.map((card) => (
              <article key={card.id} className="about__card" role="listitem">
                <Card padded bordered hover>
                  <div className="about__icon">
                    <Icon name={card.icon} size={28} className="icon--primary" aria-hidden={true} />
                  </div>
                  <h3 className="about__card-title">{card.title}</h3>
                  <p className="about__card-description">{card.description}</p>
                </Card>
              </article>
            ))}
          </div>

          <div className="about__stats" role="list" aria-label="Key statistics">
            {stats.map((stat) => (
              <div key={stat.id} className="about__stat-item" role="listitem">
                <div className="about__stat-number gradient-text">{stat.value}</div>
                <div className="about__stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}