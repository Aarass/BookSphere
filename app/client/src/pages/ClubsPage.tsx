import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AllBookClubs } from "@/features/clubs/AllBookClubs";
import { JoinedBookClubs } from "@/features/clubs/JoinedBookClubs";

export function ClubsPage() {
  return (
    <div className="flex-1 grid grid-cols-2 p-4 gap-4 overflow-hidden">
      <div className="flex flex-col gap-4 h-full ">
        <Button>Create your own book club</Button>
        <div className="flex-1">
          <Card className="max-h-full bg-background">
            <CardHeader>
              <CardTitle>Joined clubs</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full overflow-scroll">
              <JoinedBookClubs />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex-1 h-full overflow-hidden">
        <Card className="max-h-full bg-background">
          <CardHeader>
            <CardTitle>All clubs</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full overflow-scroll">
            <AllBookClubs />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
