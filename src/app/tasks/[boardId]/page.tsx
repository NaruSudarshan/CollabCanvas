"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTasksForBoard, updateTaskStatus, createTask, getTaskBoards, updateTask, deleteTask } from '@/lib/firestore-services';
import { Task, TaskBoard } from '@/models/types';
import { useAuth } from '@/context/AuthContext';
import { categorizeTask } from '@/ai/flows/categorize-tasks-with-ai';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const STATUS: Task["status"][] = ["To Do", "In Progress", "Done"];
const PRIORITIES: Task["priority"][] = ["High", "Medium", "Low"];

export default function BoardPage() {
  const { boardId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [board, setBoard] = useState<TaskBoard | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editValues, setEditValues] = useState({ title: "", description: "", priority: "Medium" as Task["priority"] });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !boardId) return;
    setLoading(true);
    getTaskBoards(user.uid).then(boards => {
      const found = boards.find(b => b.id === boardId);
      setBoard(found || null);
    });
    getTasksForBoard(boardId as string).then(setTasks).finally(() => setLoading(false));
  }, [user, boardId, creating, editTask, deleteId]);

  const handleCreateTask = async () => {
    if (!user || !boardId || !newTaskTitle.trim()) return;
    setCreating(true);
    // Use AI to categorize and prioritize
    let category = "";
    let priority: Task["priority"] = "Medium";
    try {
      const ai = await categorizeTask({
        taskDescription: newTaskTitle,
        taskContent: newTaskTitle,
      });
      category = ai.category;
      priority = ai.priority as Task["priority"];
    } catch (e) {
      // fallback
    }
    try {
      await createTask({
        title: newTaskTitle,
        description: "",
        content: newTaskTitle,
        category,
        priority,
        status: "To Do",
        boardId: boardId as string,
        authorId: user.uid,
      });
      toast({ title: "Task created" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to create task.", variant: "destructive" });
    }
    setNewTaskTitle("");
    setCreating(false);
  };

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    try {
      await updateTaskStatus(taskId, status);
      toast({ title: "Task updated" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update task.", variant: "destructive" });
    }
    setCreating(c => !c); // trigger reload
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setEditValues({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "Medium",
    });
  };

  const handleEditSave = async () => {
    if (!editTask) return;
    try {
      await updateTask(editTask.id, {
        title: editValues.title,
        description: editValues.description,
        priority: editValues.priority,
      });
      toast({ title: "Task updated" });
      setEditTask(null);
    } catch (e) {
      toast({ title: "Error", description: "Failed to update task.", variant: "destructive" });
    }
  };

  const handleDelete = async (taskId: string) => {
    setDeleteId(taskId);
    try {
      await deleteTask(taskId);
      toast({ title: "Task deleted" });
    } catch (e) {
      toast({ title: "Error", description: "Failed to delete task.", variant: "destructive" });
    }
    setDeleteId(null);
    setConfirmDelete(null);
  };

  if (!user) return <div className="p-8 text-center">Sign in to view this board.</div>;
  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></div>;
  if (!board) return <div className="p-8 text-center">Board not found.</div>;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">{board.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="New task title"
              className="w-full"
              disabled={creating}
            />
            <Button onClick={handleCreateTask} disabled={creating || !newTaskTitle.trim()}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Task"}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATUS.map(status => (
              <div key={status} className="bg-muted rounded-lg p-4 min-h-[300px]">
                <h3 className="font-semibold mb-2">{status}</h3>
                {tasks.filter(t => t.status === status).length === 0 && (
                  <div className="text-muted-foreground text-sm">No tasks</div>
                )}
                {tasks.filter(t => t.status === status).map(task => (
                  <Card key={task.id} className="mb-4">
                    <CardHeader>
                      <CardTitle className="text-base">{task.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground mb-2">Category: {task.category || "-"} | Priority: {task.priority || "-"}</div>
                      <div className="flex gap-2 mb-2">
                        {STATUS.filter(s => s !== status).map(s => (
                          <Button key={s} size="sm" variant="outline" onClick={() => handleStatusChange(task.id, s)}>
                            Move to {s}
                          </Button>
                        ))}
                        <Button size="sm" variant="outline" onClick={() => openEdit(task)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setConfirmDelete(task.id)} disabled={deleteId === task.id}>
                          {deleteId === task.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">{task.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Button variant="outline" onClick={() => router.push('/tasks')}>Back to Boards</Button>

      {/* Edit Task Modal */}
      <Dialog open={!!editTask} onOpenChange={open => !open && setEditTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editValues.title}
              onChange={e => setEditValues(v => ({ ...v, title: e.target.value }))}
              placeholder="Task title"
            />
            <Input
              value={editValues.description}
              onChange={e => setEditValues(v => ({ ...v, description: e.target.value }))}
              placeholder="Description"
            />
            <div>
              <label className="block mb-1 text-sm font-medium">Priority</label>
              <select
                className="w-full border rounded p-2"
                value={editValues.priority}
                onChange={e => setEditValues(v => ({ ...v, priority: e.target.value as Task["priority"] }))}
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTask(null)}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for delete */}
      <Dialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task?</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this task? This action cannot be undone.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDelete(confirmDelete!)} disabled={deleteId === confirmDelete}>
              {deleteId === confirmDelete ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 