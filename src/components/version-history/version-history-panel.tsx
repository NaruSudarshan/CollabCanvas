'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Eye, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const versions = [
  { id: 5, timestamp: "2024-07-26 10:30 AM", editor: "Alice W.", changes: "Updated introduction section.", current: true },
  { id: 4, timestamp: "2024-07-26 09:15 AM", editor: "Bob B.", changes: "Added new data points to table." },
  { id: 3, timestamp: "2024-07-25 03:45 PM", editor: "Alice W.", changes: "Revised conclusion and formatting." },
  { id: 2, timestamp: "2024-07-25 11:00 AM", editor: "Charlie C.", changes: "Minor typo fixes." },
  { id: 1, timestamp: "2024-07-24 05:20 PM", editor: "Alice W.", changes: "Initial draft created." },
];

export function VersionHistoryPanel() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <History className="mr-2 h-4 w-4" /> Version History
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="font-headline">Version History</SheetTitle>
          <SheetDescription>
            Browse and revert to previous versions of this document.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4 mt-4">
          <div className="space-y-4">
            {versions.map((version) => (
              <div key={version.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-semibold text-sm">
                    {version.timestamp} 
                    {version.current && <Badge variant="default" className="ml-2">Current</Badge>}
                  </p>
                  <p className="text-xs text-muted-foreground">Edited by: {version.editor}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{version.changes}</p>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Eye className="mr-1 h-3 w-3" /> Preview
                  </Button>
                  {!version.current && (
                    <Button variant="outline" size="sm" className="text-xs">
                      <RotateCcw className="mr-1 h-3 w-3" /> Revert to this version
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
