import { Card, Icon, SectionHeader } from '../ui';
import { personalInfo, socialLinks } from '../../data';
import { ContactForm } from '../shared/ContactForm';
import './Contact.css';

export function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__container">
        <SectionHeader
          title="Get In Touch"
          subtitle="Have a project in mind or just want to say hi? I'd love to hear from you."
          align="center"
        />
        <div className="contact__layout">
          <div className="contact__info" role="complementary" aria-label="Contact information">
            <Card padded bordered className="contact__card">
              <h3 className="contact__card-title">Let's Connect</h3>
              <p className="contact__card-text">
                I'm always open to discussing new opportunities, interesting projects, or just chatting about technology.
              </p>
              <div className="cform-info-details contact__details">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="contact__detail"
                  aria-label={`Email me at ${personalInfo.email}`}
                >
                  <Icon name="mail" size={20} aria-hidden={true} />
                  <span>{personalInfo.email}</span>
                </a>
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="contact__detail"
                  aria-label={`Call me at ${personalInfo.phone}`}
                >
                  <Icon name="phone" size={20} aria-hidden={true} />
                  <span>{personalInfo.phone}</span>
                </a>
                <div className="contact__detail">
                  <Icon name="location" size={20} aria-hidden={true} />
                  <span>{personalInfo.location}</span>
                </div>
              </div>
              <div className="contact__social" role="list" aria-label="Social links">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact__social-link"
                    aria-label={`${link.label} profile`}
                    role="listitem"
                  >
                    <Icon name={link.icon} size={20} aria-hidden={true} />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </Card>
          </div>
          <div className="contact__form-wrapper">
            <Card padded bordered className="contact__form-card">
              <ContactForm />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
