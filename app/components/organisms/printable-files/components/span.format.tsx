import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const spanVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "", // Default variant with no specific styles
        gradient: "font-bold italic bg-gradient-to-b from-gray-700 to-gray-200 bg-clip-text text-transparent text-[9px] align-top border-0 print:border-0 print:bg-none print:text-gray-700",
        // error: "text-red-500",
        // bold: "font-bold"
      },
      size: {
        default: "", // Default size
        // Add other sizes here as needed, e.g.:
        // sm: "text-sm",
        // lg: "text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface SpanProps extends React.ComponentProps<'span'>, VariantProps<typeof spanVariants> {}

const SpanFormat: React.FC<SpanProps> = ({
  className,
  variant,
  size,
  ...props
}) => {
  return (
    <span
      className={twMerge(spanVariants({ variant, size, className }))}
      {...props}
    />
  );
};

export { SpanFormat, spanVariants, type SpanProps };
