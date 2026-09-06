import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import emailjs from '@emailjs/browser';
import { personalInfo } from '../../data';
import './ContactForm.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'service_portfolio';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? 'template_contact';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';

interface ContactFormProps {
  /** 'ink' restyles the form for the manga mode's black-and-white world */
  variant?: 'default' | 'ink';
}

/**
 * Shared contact form used by Professional and Manga modes.
 * Sends through EmailJS using VITE_EMAILJS_* env vars.
 */
export function ContactForm({ variant = 'default' }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus('submitting');
    setStatusMessage('');

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: personalInfo.name,
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);

      setStatus('success');
      setStatusMessage('Thank you for your message! I\'ll get back to you soon.');
      formRef.current?.reset();
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus('error');
      setStatusMessage('Failed to send message. Please try again or email me directly.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`cform ${variant === 'ink' ? 'cform--ink' : ''}`}
      noValidate
    >
      <div className="cform__row">
        <div className="cform__group">
          <label htmlFor="cf-name" className="cform__label">
            Name <span className="cform__required" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="cf-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`cform__input ${errors.name ? 'cform__input--error' : ''}`}
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'cf-name-error' : undefined}
            disabled={status === 'submitting'}
          />
          {errors.name && (
            <p id="cf-name-error" className="cform__error" role="alert">{errors.name}</p>
          )}
        </div>

        <div className="cform__group">
          <label htmlFor="cf-email" className="cform__label">
            Email <span className="cform__required" aria-hidden="true">*</span>
          </label>
          <input
            type="email"
            id="cf-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`cform__input ${errors.email ? 'cform__input--error' : ''}`}
            placeholder="your@email.com"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'cf-email-error' : undefined}
            disabled={status === 'submitting'}
          />
          {errors.email && (
            <p id="cf-email-error" className="cform__error" role="alert">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="cform__group">
        <label htmlFor="cf-subject" className="cform__label">
          Subject <span className="cform__required" aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="cf-subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`cform__input ${errors.subject ? 'cform__input--error' : ''}`}
          placeholder="What's this about?"
          aria-invalid={errors.subject ? 'true' : 'false'}
          aria-describedby={errors.subject ? 'cf-subject-error' : undefined}
          disabled={status === 'submitting'}
        />
        {errors.subject && (
          <p id="cf-subject-error" className="cform__error" role="alert">{errors.subject}</p>
        )}
      </div>

      <div className="cform__group">
        <label htmlFor="cf-message" className="cform__label">
          Message <span className="cform__required" aria-hidden="true">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`cform__input cform__textarea ${errors.message ? 'cform__input--error' : ''}`}
          placeholder="Tell me about your project..."
          rows={5}
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'cf-message-error' : undefined}
          disabled={status === 'submitting'}
        />
        {errors.message && (
          <p id="cf-message-error" className="cform__error" role="alert">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="cform__submit"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>

      {status === 'success' && (
        <p className="cform__status cform__status--success" role="status" aria-live="polite">
          {statusMessage}
        </p>
      )}

      {status === 'error' && (
        <p className="cform__status cform__status--error" role="alert" aria-live="assertive">
          {statusMessage}
        </p>
      )}
    </form>
  );
}
