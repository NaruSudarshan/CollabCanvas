import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { TaskBoard, Task, Template } from '@/models/types';

const taskBoardsCollection = collection(db, 'taskBoards');
const tasksCollection = collection(db, 'tasks');
const templatesCollection = collection(db, 'templates');

// --- TaskBoard Functions ---

export async function createTaskBoard(
  boardData: Omit<TaskBoard, 'id' | 'createdAt'>
): Promise<string> {
  const newBoard = {
    ...boardData,
    createdAt: Timestamp.now(),
  };
  const docRef = await addDoc(taskBoardsCollection, newBoard);
  return docRef.id;
}

export async function getTaskBoards(userId: string): Promise<TaskBoard[]> {
  const q = query(taskBoardsCollection, where('ownerId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    doc => ({ id: doc.id, ...doc.data() } as TaskBoard)
  );
}

// --- Task Functions ---

export async function createTask(
  taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const newTask = {
    ...taskData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  const docRef = await addDoc(tasksCollection, newTask);
  return docRef.id;
}

export async function getTasksForBoard(boardId: string): Promise<Task[]> {
  const q = query(tasksCollection, where('boardId', '==', boardId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
}

export async function updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
        status,
        updatedAt: Timestamp.now(),
    });
}

export async function updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'boardId' | 'authorId'>>): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
}

// --- Template Functions ---

export async function createTemplate(template: Omit<Template, 'id'>): Promise<string> {
  const docRef = await addDoc(templatesCollection, template);
  return docRef.id;
}

export async function getTemplates(): Promise<Template[]> {
  const snapshot = await getDocs(templatesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Template));
}

export async function updateTemplate(templateId: string, updates: Partial<Omit<Template, 'id'>>): Promise<void> {
  const templateRef = doc(db, 'templates', templateId);
  await updateDoc(templateRef, updates);
}

export async function deleteTemplate(templateId: string): Promise<void> {
  const templateRef = doc(db, 'templates', templateId);
  await deleteDoc(templateRef);
} 