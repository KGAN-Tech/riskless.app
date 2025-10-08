import React from 'react';
import { twMerge } from 'tailwind-merge';

interface LabelFieldProps extends React.ComponentProps<'div'> {
  label: string;
  labelPosition?: 'before' | 'below';
  labelClassName?: string;
  variant?: 'default' | 'semibold';
}

const LabelField: React.FC<LabelFieldProps> = ({
  label,
  labelPosition = 'before',
  labelClassName,
  className,
  variant = 'default',
  ...props
}) => {
  const containerClassName = twMerge('flex flex-col', className);

  const defaultStyles = 'font-bold text-black whitespace-nowrap mr-2 scale-x-[0.70] text-[12px]';
  const semiboldStyles = 'font-semibold text-black whitespace-nowrap mr-2 text-[13px]';

  const baseLabelStyles = variant === 'default' ? defaultStyles : semiboldStyles;
  const labelStyles = twMerge(baseLabelStyles, labelClassName);

  const labelElement = (
    <span className={labelStyles}>{label}{labelPosition === 'before' && ':'}</span>
  );

  return (
    <div className={containerClassName} {...props}>
      {labelElement}
    </div>
  );
};

export default LabelField; 