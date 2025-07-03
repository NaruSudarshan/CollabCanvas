'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { categorizeTask, type CategorizeTaskOutput } from '@/ai/flows/categorize-tasks-with-ai';
import { suggestOptimalTemplate, type SuggestOptimalTemplateOutput } from '@/ai/flows/suggest-optimal-template';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  taskDescription: z.string().min(10, "Description must be at least 10 characters.").max(500, "Description must be at most 500 characters."),
  taskContent: z.string().max(2000, "Content must be at most 2000 characters.").optional(),
});

type FormData = z.infer<typeof formSchema>;

type AIResults = {
  categorization?: CategorizeTaskOutput;
  templateSuggestion?: SuggestOptimalTemplateOutput;
};

export function SmartOrganizationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AIResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskDescription: "",
      taskContent: "",
    }
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const categorizationPromise = categorizeTask({
        taskDescription: data.taskDescription,
        taskContent: data.taskContent || data.taskDescription,
      });
      const templateSuggestionPromise = suggestOptimalTemplate({
        content: `${data.taskDescription} ${data.taskContent || ''}`.trim(),
      });

      const [categorizationResult, templateSuggestionResult] = await Promise.all([
        categorizationPromise,
        templateSuggestionPromise,
      ]);
      
      setResults({ categorization: categorizationResult, templateSuggestion: templateSuggestionResult });
    } catch (err) {
      console.error("AI processing error:", err);
      setError("Failed to get suggestions. Please ensure your input is clear and try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Describe Your Task or Content</CardTitle>
              <CardDescription>Provide details below, and our AI will help you organize it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="taskDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Description (Required)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Plan Q4 marketing campaign, Draft blog post about AI..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taskContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Content/Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Provide more details, raw notes, or related information here." {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get Smart Suggestions
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {results.categorization && (
              <div>
                <h3 className="font-semibold text-lg mb-2 font-headline">Task Categorization:</h3>
                <p><strong>Category:</strong> {results.categorization.category}</p>
                <p><strong>Priority:</strong> {results.categorization.priority}</p>
                <p className="text-sm text-muted-foreground mt-1"><strong>Reasoning:</strong> {results.categorization.reasoning}</p>
              </div>
            )}
            {results.templateSuggestion && (
              <div>
                <h3 className="font-semibold text-lg mb-2 font-headline">Optimal Template:</h3>
                <p><strong>Suggested Template:</strong> {results.templateSuggestion.templateSuggestion}</p>
                <p className="text-sm text-muted-foreground mt-1"><strong>Reasoning:</strong> {results.templateSuggestion.reasoning}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
