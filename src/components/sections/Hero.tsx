import { useState, useEffect, useRef } from 'react';
import { Button, Icon } from '../ui';
import { personalInfo } from '../../data';
import './Hero.css';

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const header = document.querySelector('header');
      const headerHeight = header?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth',
      });
    }
  };

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      const header = document.querySelector('header');
      const headerHeight = header?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="hero"
      aria-labelledby="hero-title"
    >
      <div className="hero__background" aria-hidden={true}>
        <div className="hero__gradient-orb hero__gradient-orb--1" />
        <div className="hero__gradient-orb hero__gradient-orb--2" />
        <div className="hero__gradient-orb hero__gradient-orb--3" />
      </div>

      <div className="hero__content">
        <div className={`hero__text ${isVisible ? 'hero__text--visible' : ''}`}>
          <div className="hero__greeting">
            <span className="hero__greeting-text">Hello, I'm</span>
          </div>

          <h1 id="hero-title" className="hero__title">
            <span className="hero__name-first">{personalInfo.firstName}</span>
            <span className="hero__name-last gradient-text">{personalInfo.lastName}</span>
          </h1>

          <div className="hero__subtitle-wrapper">
            <p className="hero__subtitle">
              <span className="hero__subtitle-line">{personalInfo.title}</span>
              <span className="hero__subtitle-accent" aria-hidden={true}>•</span>
              <span className="hero__subtitle-line">Problem Solver</span>
            </p>
          </div>

          <p className="hero__description">{personalInfo.description}</p>

          <div className="hero__actions">
            <Button
              variant="primary"
              size="lg"
              onClick={scrollToContact}
              rightIcon={<Icon name="arrowRight" size={20} />}
              className="hero__btn"
            >
              Get In Touch
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={scrollToProjects}
              leftIcon={<Icon name="briefcase" size={20} />}
              className="hero__btn"
            >
              View My Work
            </Button>
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="hero__btn hero__btn--resume"
            >
              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download resume"
              >
                <Icon name="download" size={20} aria-hidden={true} />
                Download Resume
              </a>
            </Button>
          </div>
        </div>

        <div className="hero__visual" aria-hidden={true}>
          <div className="hero__visual-container">
            <div className="hero__image-wrapper">
              <img
                src={personalInfo.profileImage}
                alt=""
                className="hero__image"
                loading="eager"
              />
              <div className="hero__image-border" />
            </div>
            <div className="hero__circle hero__circle--1" />
            <div className="hero__circle hero__circle--2" />
            <div className="hero__circle hero__circle--3" />
          </div>
        </div>
      </div>
    </section>
  );
}