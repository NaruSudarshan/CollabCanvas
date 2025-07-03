import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SmartOrganizationForm } from "@/components/smart-tools/smart-organization-form";
import { Lightbulb } from "lucide-react";

export default function SmartToolsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-3xl">Smart Organization Tools</CardTitle>
          </div>
          <CardDescription>
            Leverage AI to categorize tasks, organize content, and find the best templates for your needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground mb-6">
                Simply describe your task or paste your content, and let our intelligent assistant provide actionable suggestions to streamline your workflow. This tool uses reasoning to understand your input and offer relevant help.
            </p>
        </CardContent>
      </Card>
      <SmartOrganizationForm />
    </div>
  );
}
