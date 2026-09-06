import { Card, CardContent, CardHeader, SectionHeader, TagList } from '../ui';
import { skillCategories } from '../../data/skills';
import './Skills.css';

export function Skills() {
  return (
    <section id="skills" className="skills" aria-labelledby="skills-title">
      <div className="skills__container">
        <SectionHeader
          title="Skills"
          subtitle="Technologies and tools I work with"
          align="center"
        />
        <div className="skills__grid">
          {skillCategories.map((category) => (
            <Card key={category.id} hover bordered padded className="skill-category">
              <CardHeader title={category.title} />
              <CardContent>
                <TagList
                  tags={category.skills}
                  variant="default"
                  size="sm"
                  className="skill-category__tags"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}