import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  asChild = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const classNames = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full-width' : '',
    isLoading ? 'btn--loading' : '',
    className
  ].filter(Boolean).join(' ');

  const buttonContent = (
    <>
      {isLoading && <span className="btn__spinner" aria-hidden="true"></span>}
      {!isLoading && leftIcon && <span className="btn__icon btn__icon--left" aria-hidden="true">{leftIcon}</span>}
      <span className="btn__text">{children}</span>
      {!isLoading && rightIcon && <span className="btn__icon btn__icon--right" aria-hidden="true">{rightIcon}</span>}
    </>
  );

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      className: classNames,
      disabled: disabled || isLoading,
      ...props
    });
  }

  return (
    <button
      className={classNames}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {buttonContent}
    </button>
  );
}