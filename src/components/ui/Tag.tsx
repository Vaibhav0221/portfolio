import './Tag.css';

export interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

export function Tag({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  removable = false,
  onRemove
}: TagProps) {
  const classNames = [
    'tag',
    `tag--${variant}`,
    `tag--${size}`,
    onClick ? 'tag--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }} : undefined}>
      <span className="tag__content">{children}</span>
      {removable && onRemove && (
        <button
          type="button"
          className="tag__remove"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label="Remove tag"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </span>
  );
}

export interface TagListProps {
  tags: string[];
  variant?: TagProps['variant'];
  size?: TagProps['size'];
  className?: string;
  maxVisible?: number;
  onTagClick?: (tag: string) => void;
}

export function TagList({ tags, variant = 'default', size = 'md', className = '', maxVisible, onTagClick }: TagListProps) {
  const visibleTags = maxVisible && tags.length > maxVisible ? tags.slice(0, maxVisible) : tags;
  const remainingCount = maxVisible && tags.length > maxVisible ? tags.length - maxVisible : 0;

  return (
    <div className={`tag-list ${className}`}>
      {visibleTags.map((tag, index) => (
        <Tag key={index} variant={variant} size={size} onClick={() => onTagClick?.(tag)}>
          {tag}
        </Tag>
      ))}
      {remainingCount > 0 && (
        <Tag variant="ghost" size={size} onClick={onTagClick ? () => onTagClick('more') : undefined}>
          +{remainingCount} more
        </Tag>
      )}
    </div>
  );
}