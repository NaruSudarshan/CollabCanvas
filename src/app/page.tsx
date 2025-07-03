import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { FileText, FileSpreadsheet, ClipboardList, Sparkles, LayoutGrid } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Welcome to CollabCanvas!</CardTitle>
          <CardDescription>Your unified workspace for seamless collaboration. Get started by exploring the features below.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Navigate using the sidebar to access your documents, spreadsheets, task boards, and more. Leverage our smart tools to organize your work efficiently.</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium font-headline">Documents</CardTitle>
            <FileText className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">Create and collaborate on text documents in real-time.</div>
            <Button asChild variant="outline">
              <Link href="/documents">Go to Documents</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium font-headline">Spreadsheets</CardTitle>
            <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">Manage data with powerful, collaborative spreadsheets.</div>
            <Button asChild variant="outline">
              <Link href="/spreadsheets">Go to Spreadsheets</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium font-headline">Task Boards</CardTitle>
            <ClipboardList className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">Organize projects and track progress with intuitive task boards.</div>
            <Button asChild variant="outline">
              <Link href="/tasks">Go to Task Boards</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium font-headline">Templates</CardTitle>
            <LayoutGrid className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">Kickstart your projects with customizable templates.</div>
            <Button asChild variant="outline">
              <Link href="/templates">Explore Templates</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium font-headline">Smart Tools</CardTitle>
            <Sparkles className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">Use AI to categorize tasks and suggest optimal templates.</div>
            <Button asChild>
              <Link href="/smart-tools">Try Smart Tools</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Collaboration in Action</CardTitle>
        </CardHeader>
        <CardContent>
            <Image 
                src="https://placehold.co/800x400.png" 
                alt="Team collaborating"
                data-ai-hint="team collaboration office" 
                width={800} 
                height={400} 
                className="rounded-lg object-cover w-full" 
            />
            <p className="mt-4 text-muted-foreground">CollabCanvas makes it easy for teams to work together, no matter where they are. See changes in real-time and stay perfectly in sync.</p>
        </CardContent>
      </Card>

    </div>
  );
}
