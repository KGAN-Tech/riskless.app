import { Button } from "@/components/atoms/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface MemberProfileHeaderProps {
  title: string;
}

export function MemberProfileHeader({ title }: MemberProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-b">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
          onClick={() => navigate("/~/members")}
          aria-label="Go back to members"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Members</span>
        </Button>
      </div>
      <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
        {title}
      </h1>
    </div>
  );
}
