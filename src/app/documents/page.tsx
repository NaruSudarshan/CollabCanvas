import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus2, History } from "lucide-react";
import { PresenceAvatars } from "@/components/collaboration/presence-avatars";
import { VersionHistoryPanel } from "@/components/version-history/version-history-panel";
import Image from "next/image";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-3xl">Documents</CardTitle>
            <PresenceAvatars />
          </div>
          <CardDescription>Create, edit, and manage your collaborative documents.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button>
              <FilePlus2 className="mr-2 h-4 w-4" /> New Document
            </Button>
            <VersionHistoryPanel />
          </div>
          <p className="text-muted-foreground">
            Your documents will appear here. Start by creating a new one or opening an existing project.
            Enjoy real-time co-editing, version history, and smart commenting features.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline">Document Title {index + 1}</CardTitle>
              <CardDescription>Last edited: 2 hours ago</CardDescription>
            </CardHeader>
            <CardContent>
              <Image 
                src={`https://placehold.co/400x200.png`} 
                alt={`Placeholder for document ${index + 1}`} 
                data-ai-hint="text document abstract"
                width={400} 
                height={200}
                className="rounded-md object-cover w-full mb-4"
              />
              <p className="text-sm text-muted-foreground truncate">
                This is a brief preview of the document content. Click to open and edit...
              </p>
              <Button variant="outline" className="mt-4 w-full">Open Document</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
