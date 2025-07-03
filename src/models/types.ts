import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  content?: string;
  category?: string;
  priority?: "High" | "Medium" | "Low";
  status: "To Do" | "In Progress" | "Done";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  boardId: string;
  authorId: string;
}

export interface TaskBoard {
  id: string;
  title: string;
  description: string;
  createdAt: Timestamp;
  ownerId: string;
  memberIds: string[];
}

export interface Template {
  id: string;
  title:string;
  description: string;
  content: string;
} 