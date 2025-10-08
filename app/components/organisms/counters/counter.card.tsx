import { Card } from '@/components/atoms/card';
import { Badge } from '@/components/atoms/badge';

interface CounterCardProps {
  id: string;
  title: string;
  currentNumber: number | null;
  waitingCount: number;
  counterNumber: string;
  isActive: boolean;
  lastCalled?: number | null;
}

export function CounterCard({
  title,
  currentNumber,
  waitingCount,
  counterNumber,
  isActive,
  lastCalled
}: CounterCardProps) {
  return (
    <Card className={`p-4 transition-all duration-300 ${
      isActive ? 'border-primary bg-primary/5 scale-105' : 'opacity-75'
    }`}>
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <Badge variant={isActive ? "default" : "secondary"} className="text-lg px-4 py-2">
            {counterNumber}
          </Badge>
          <h2 className="text-2xl font-medium text-muted-foreground">{title}</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Now Serving</p>
            <div className="text-8xl font-mono font-bold text-primary">
              {currentNumber || "---"}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Next Number</p>
            <div className="text-4xl font-mono font-semibold text-blue-600">
              {(currentNumber || 0) + 1}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Waiting</p>
          <div className="text-2xl font-semibold">
            {waitingCount} {waitingCount === 1 ? 'person' : 'people'}
          </div>
        </div>
      </div>
    </Card>
  );
}