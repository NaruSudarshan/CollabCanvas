"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ListChecks } from "lucide-react";
import { PresenceAvatars } from "@/components/collaboration/presence-avatars";
import Image from "next/image";
import { useAuth } from '@/context/AuthContext';
import { createTaskBoard, getTaskBoards, getTasksForBoard } from '@/lib/firestore-services';
import { TaskBoard } from '@/models/types';
import Link from 'next/link';

export default function TaskBoardsPage() {
  const { user } = useAuth();
  const [boards, setBoards] = useState<TaskBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getTaskBoards(user.uid).then(async (boards) => {
      // For each board, count tasks (optional: can be optimized)
      const boardsWithCounts = await Promise.all(
        boards.map(async (board) => {
          const tasks = await getTasksForBoard(board.id);
          const completed = tasks.filter(t => t.status === "Done").length;
          return { ...board, tasksCount: tasks.length, completed };
        })
      );
      setBoards(boardsWithCounts);
      setLoading(false);
    });
  }, [user, creating]);

  const handleCreateBoard = async () => {
    if (!user) return;
    setCreating(true);
    const title = prompt("Enter board title:");
    if (!title) {
      setCreating(false);
      return;
    }
    await createTaskBoard({
      title,
      description: "",
      ownerId: user.uid,
      memberIds: [user.uid],
    });
    setCreating(false);
  };

  if (!user) {
    return <div className="p-8 text-center">Sign in to view your task boards.</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-headline text-3xl">Task Boards</CardTitle>
            <PresenceAvatars />
          </div>
          <CardDescription>Organize projects and track progress with intuitive task boards.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleCreateBoard} disabled={creating}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Task Board
          </Button>
          <p className="text-muted-foreground">
            Visualize your workflows with customizable Kanban-style boards. Create tasks, assign them to team members, set deadlines, and monitor progress in real-time.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : boards.length === 0 ? (
          <div className="p-8 text-center">No boards yet. Create one!</div>
        ) : (
          boards.map((board) => (
            <Card key={board.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="font-headline">{board.title}</CardTitle>
                  <ListChecks className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>{board.completed} of {board.tasksCount} tasks completed</CardDescription>
              </CardHeader>
              <CardContent>
                <Image 
                  src={`https://placehold.co/600x300.png`} 
                  alt={`Placeholder for task board ${board.title}`} 
                  width={600} 
                  height={300}
                  className="rounded-md object-cover w-full mb-4"
                />
                <p className="text-sm text-muted-foreground">
                  Visual representation of the task board with columns like "To Do", "In Progress", "Done".
                </p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href={`/tasks/${board.id}`}>Open Board</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
