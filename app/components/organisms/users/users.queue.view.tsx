import { Clock, Users } from "lucide-react";
import { Card } from "@/components/atoms/card";

export function QueueView() {
  const queueNumber = 15;
  const estimatedWait = "12-15 minutes";
  const currentServing = 8;

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <Card className="p-6 text-center">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Your Queue Number</p>
          <div className="text-4xl font-bold text-blue-600 mb-2">#{queueNumber}</div>
          <p className="text-xs text-muted-foreground">Please wait for your turn</p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Currently Serving</span>
            </div>
            <span className="font-medium">#{currentServing}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Estimated Wait</span>
            </div>
            <span className="font-medium">{estimatedWait}</span>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Queue updates automatically. You'll be notified when it's your turn.
        </p>
      </div>
    </div>
  );
}