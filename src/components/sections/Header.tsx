import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Icon } from '../ui';
import { navigation, personalInfo } from '../../data';
import './Header.css';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth',
      });
      setIsMobileMenuOpen(false);
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      lastFocusedRef.current?.focus();
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      lastFocusedRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      // Focus first link in mobile menu
      setTimeout(() => {
        mobileMenuRef.current?.querySelector('a')?.focus();
      }, 0);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMobileMenuOpen(false);
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        lastFocusedRef.current?.focus();
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      ref={headerRef}
      className={`header ${isScrolled ? 'header--scrolled' : ''}`}
      role="banner"
    >
      <div className="header__container">
        <button
          className="header__logo"
          onClick={() => scrollToSection('hero')}
          aria-label={`Go to ${personalInfo.name}'s home page`}
          type="button"
        >
          <span className="header__logo-text">{personalInfo.initials}</span>
          <span className="header__logo-name">{personalInfo.name.split(' ')[0]}</span>
        </button>

        <nav
          ref={mobileMenuRef}
          className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}
          role="navigation"
          aria-label="Main navigation"
          onKeyDown={handleKeyDown}
        >
          <ul className="header__nav-list" role="list">
            {navigation.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href.replace('#', ''));
                  }}
                  className="header__nav-link"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <Button
            variant="ghost"
            size="sm"
            className="header__resume-btn"
            asChild
            aria-label="View resume"
          >
            <a href={personalInfo.resumeUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="fileText" size={16} aria-hidden={true} />
              Resume
            </a>
          </Button>

          <button
            className={`header__mobile-toggle ${isMobileMenuOpen ? 'header__mobile-toggle--open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="main-navigation"
            type="button"
          >
            <span className="header__mobile-bar" aria-hidden={true} />
            <span className="header__mobile-bar" aria-hidden={true} />
            <span className="header__mobile-bar" aria-hidden={true} />
          </button>
        </div>
      </div>
    </header>
  );
}