import './Card.css';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  bordered?: boolean;
  padded?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  hover = false,
  bordered = true,
  padded = true,
  onClick
}: CardProps) {
  const classNames = [
    'card',
    hover ? 'card--hover' : '',
    bordered ? 'card--bordered' : '',
    padded ? 'card--padded' : '',
    onClick ? 'card--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={classNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }} : undefined}
    >
      {children}
    </Component>
  );
}

export interface CardHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, icon, action, className = '' }: CardHeaderProps) {
  return (
    <div className={`card__header ${className}`}>
      {icon && <div className="card__icon" aria-hidden="true">{icon}</div>}
      <div className="card__header-text">
        <h3 className="card__title">{title}</h3>
        {subtitle && <div className="card__subtitle">{subtitle}</div>}
      </div>
      {action && <div className="card__action">{action}</div>}
    </div>
  );
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`card__content ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`card__footer ${className}`}>{children}</div>;
}