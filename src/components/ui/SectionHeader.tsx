import './SectionHeader.css';

export interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: string;
  className?: string;
  align?: 'center' | 'left';
  id?: string;
}

export function SectionHeader({ title, subtitle, badge, className = '', align = 'center', id }: SectionHeaderProps) {
  return (
    <header className={`section-header section-header--${align} ${className}`} id={id}>
      {badge && (
        <span className="section-header__badge">
          {badge}
        </span>
      )}
      <h2 className="section-header__title">{title}</h2>
      <div className="section-header__divider" aria-hidden="true"></div>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </header>
  );
}