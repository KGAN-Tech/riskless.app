import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/atoms/card';
import { cn } from '@/lib/utils';

export type MetricColor = 'primary' | 'warning' | 'success';

interface MetricCardProps {
  title: string;
  count: number;
  trend: number;
  icon: LucideIcon;
  color: MetricColor;
  isActive: boolean;
  onClick: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  count,
  trend,
  icon: Icon,
  color,
  isActive,
  onClick
}) => {
  const colorConfig = {
    primary: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100'
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100'
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      iconBg: 'bg-green-100'
    }
  };

  const trendColors = {
    positive: 'text-green-600',
    negative: 'text-red-600'
  };

  const config = colorConfig[color];

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
        isActive ? "border-blue-300 shadow-lg" : config.border,
        config.bg
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={cn("p-3 rounded-full", config.iconBg)}>
            <Icon className={cn("h-6 w-6", config.text)} />
          </div>
          
          <div className="text-right">
            <p className={cn("text-sm font-medium", config.text)}>{title}</p>
            <h3 className={cn("text-2xl font-bold", config.text)}>{count.toLocaleString()}</h3>
            <p className={cn(
              "text-sm flex items-center font-medium",
              trend >= 0 ? trendColors.positive : trendColors.negative
            )}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last period
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};