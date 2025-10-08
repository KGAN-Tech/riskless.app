import { useNavigate } from "react-router";
import { Card } from "~/app/components/atoms/card";
import { NAVIGATION } from "@/configuration/const.config";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

export default function PortalPage() {
  const navigate = useNavigate();
  const getAuth = getUserFromLocalStorage();

  return (
    <div className="space-y-4 px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {NAVIGATION.PORTAL.map(
          (item) =>
            item.isCardDisplayed &&
            item.userTypes.includes(getAuth?.user?.type) && (
              <Card
                key={item.code}
                className="px-4 py-8 cursor-pointer transition hover:shadow-md hover:bg-gray-50"
                onClick={() => navigate(item.path)}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full ">
                    {item.icon}
                  </div>
                  <p className="text-lg font-medium text-gray-700 text-center">
                    {item.title}
                  </p>
                </div>
              </Card>
            )
        )}
      </div>
    </div>
  );
}
