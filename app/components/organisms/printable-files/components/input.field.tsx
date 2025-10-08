import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputFieldProps extends React.ComponentProps<'div'> {
  label?: string;
  variant?: 'underline-dotted' | 'solid-border' | 'middle-dashed' | 'underline-solid';
  placeHolder?: string; // Value to display in the input area
  labelPosition?: 'before' | 'below'; // Position of the label relative to the input line
  labelClassName?: string; // Additional classes for the label span
  inputClassName?: string; // Additional classes for the input span
  containerClassName?: string; // Additional classes for the main container div
  labelWidth?: string; // Width class for label when position is 'before'
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  variant = 'solid-border',
  placeHolder: value,
  labelPosition = 'before',
  inputClassName,
  containerClassName,
  ...props
}) => {
  // Styles for the input line/border
  let inputLineStyles = '';
  if (variant === 'underline-dotted') {
    inputLineStyles = 'border-dotted border-gray-500 border-b-[2px] text-[8px] font-semibold text-center';
  } else if (variant === 'solid-border') {
    inputLineStyles = 'border border-black px-2 py-1 min-h-[24px] flex items-center';
  } else if (variant === 'middle-dashed') {
    inputLineStyles = 'border-dashed border-black border-b-[3px]';
  } else if (variant === 'underline-solid') {
    inputLineStyles = 'border-b-2 border-black min-h-[24px] text-[11px]';
  }

  // Styles for the label
  const baseLabelStyles = 'font-extrabold text-black whitespace-nowrap mr-2 font-stretched';

  const mergedInputClassName = twMerge(inputLineStyles, inputClassName);

  const content = (
    <span className={mergedInputClassName}>{value}</span>
  );

  const labelElement = label ? (
    <span className={baseLabelStyles}>{label}{labelPosition === 'before' && ':'}</span>
  ) : null;

  const containerContent = labelPosition === 'before' ? (
    <div className={twMerge("flex items-center gap-2", containerClassName)} {...props}>
      {labelElement}
      {content}
    </div>
  ) : (
    <div className={twMerge("flex flex-col", containerClassName)} {...props}>
       {content}
       {labelElement}
    </div>
  );

  return containerContent;
};

export default InputField;

export type { InputFieldProps }; 