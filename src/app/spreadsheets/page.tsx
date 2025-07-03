import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus2, Users } from "lucide-react";
import { PresenceAvatars } from "@/components/collaboration/presence-avatars";
import Image from "next/image";

export default function SpreadsheetsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-3xl">Spreadsheets</CardTitle>
            <PresenceAvatars />
          </div>
          <CardDescription>Manage your data with powerful, collaborative spreadsheets.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button>
            <FilePlus2 className="mr-2 h-4 w-4" /> New Spreadsheet
          </Button>
          <p className="text-muted-foreground">
            All your spreadsheets will be listed here. Create new sheets, import data, and collaborate with your team in real-time.
            Utilize formulas, charts, and conditional formatting to analyze your data effectively.
          </p>
        </CardContent>
      </Card>
       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline">Spreadsheet {index + 1}</CardTitle>
              <CardDescription>Shared with 3 collaborators</CardDescription>
            </CardHeader>
            <CardContent>
              <Image 
                src={`https://placehold.co/400x200.png`} 
                alt={`Placeholder for spreadsheet ${index + 1}`} 
                data-ai-hint="data chart spreadsheet"
                width={400} 
                height={200}
                className="rounded-md object-cover w-full mb-4"
              />
              <p className="text-sm text-muted-foreground truncate">
                A summary of data within this spreadsheet. For example, "Q3 Financial Report".
              </p>
              <Button variant="outline" className="mt-4 w-full">Open Spreadsheet</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
