import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectionMarkerProps {
    isChecked: boolean;
    children: React.ReactNode;
    textClassName?: string;
    variant?: 'box' | 'circle';
    size?: 'sm' | 'md' | 'lg';
    textScale?: boolean;
}

const SelectionMarker: React.FC<SelectionMarkerProps> = ({ 
    isChecked, 
    children,
    textClassName,
    variant = 'box',
    size = 'md',
    textScale = true
}) => {
    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return 'w-4 h-4';
            case 'lg':
                return 'w-6 h-6';
            case 'md':
            default:
                return 'w-5 h-5';
        }
    };

    const getMarkerStyles = () => {
        const baseStyles = "border-2 border-black flex items-center justify-center";
        const variantStyles = variant === 'circle' ? 'rounded-full' : '';
        const checkedStyles = isChecked ? 'bg-black' : '';
        const sizeStyles = getSizeStyles();
        
        return twMerge(baseStyles, variantStyles, checkedStyles, sizeStyles);
    };

    return (
        <span className="inline-flex items-center">
            <span className="inline-block align-middle mr-1">
                <div className={getMarkerStyles()} />
            </span>
            <span className={twMerge(
                "font-bold text-[10px]", 
                textScale ? "scale-x-[0.80]" : "",
                textClassName
            )}>{children}</span>
        </span>
    );
};

export default SelectionMarker; 