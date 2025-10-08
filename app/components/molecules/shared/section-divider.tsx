import React from 'react';

interface SectionDividerProps {
  icon?: React.ReactNode;
  color?: string;
  borderColor?: string;
  className?: string;
  iconClassName?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  icon,
  color = "blue",
  borderColor = "blue-100",
  className = "",
  iconClassName = "",
}) => {
  const defaultIcon = (
    <svg className={`w-8 h-8 ${iconClassName}`} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className={`relative py-8 w-full ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className={`w-full border-t border-${borderColor}`}></div>
      </div>
      <div className="relative flex justify-center">
        <span className={`px-4 text-${color}-400`}>
          {icon || defaultIcon}
        </span>
      </div>
    </div>
  );
}; 