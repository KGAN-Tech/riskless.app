import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TextFormatProps extends React.ComponentProps<'p'> {
  variant?: 'default' | 'times';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TextFormat: React.FC<TextFormatProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const baseStyles = 'text-black';
  
  const variantStyles = {
    default: '',
    times: 'font-times'
  };

  const sizeStyles = {
    sm: 'text-[13px]',
    md: 'text-[15px]',
    lg: 'text-[17px]'
  };

  const styles = twMerge(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  return (
    <p className={styles} {...props}>
      {children}
    </p>
  );
};

export default TextFormat; 