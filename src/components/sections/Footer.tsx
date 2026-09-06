import { Button, Icon } from '../ui';
import { personalInfo, socialLinks, navigation } from '../../data';
import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__main">
          <div className="footer__brand">
            <span className="footer__logo">{personalInfo.initials}</span>
            <div className="footer__brand-text">
              <h3 className="footer__name">{personalInfo.name}</h3>
              <p className="footer__title">{personalInfo.title}</p>
            </div>
          </div>

          <nav className="footer__nav" aria-label="Footer navigation">
            <ul className="footer__nav-list" role="list">
              {navigation.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className="footer__nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__social" role="list" aria-label="Social media links">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label={`${link.label} profile`}
                role="listitem"
              >
                <Icon name={link.icon} size={20} aria-hidden={true} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          <div className="footer__links">
            <a href="#contact" className="footer__link">Contact</a>
            <span className="footer__separator" aria-hidden={true}>·</span>
            <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer" className="footer__link">
              Resume
            </a>
            <span className="footer__separator" aria-hidden={true}>·</span>
            <Button
              variant="ghost"
              size="sm"
              className="footer__theme-toggle"
              aria-label="Toggle theme"
            >
              <Icon name="sun" size={18} className="footer__theme-icon footer__theme-icon--light" aria-hidden={true} />
              <Icon name="moon" size={18} className="footer__theme-icon footer__theme-icon--dark" aria-hidden={true} />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}