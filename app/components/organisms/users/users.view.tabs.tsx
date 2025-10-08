import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/atoms/tabs";
import { FlippableCard } from "@/components/organisms/users/users.flippable";
import { QueueView } from "@/components/organisms/users/users.queue.view";

interface ViewTabsProps {
  userId: string;
  userName: string;
  memberType: string;
}

export function ViewTabs({ userId, userName, memberType }: ViewTabsProps) {
  return (
    <div className="px-4 md:px-6">
      <Tabs defaultValue="card" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="card">Digital ID</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="card" className="mt-0">
          <FlippableCard 
            userId={userId}
            userName={userName}
            memberType={memberType}
          />
        </TabsContent>
        
        <TabsContent value="queue" className="mt-0">
          <QueueView />
        </TabsContent>
      </Tabs>
    </div>
  );
}