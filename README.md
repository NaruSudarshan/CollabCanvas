# CollabCanvas Workspace App

A modern collaborative workspace app built with Next.js, Firebase, and Genkit AI. Organize your projects, tasks, and templates with real-time sync, Google sign-in, and smart AI suggestions.

## ✨ Features
- **Google Authentication**: Secure sign-in with Google (Firebase Auth)
- **Task Boards**: Create, view, and manage project boards
- **Kanban Tasks**: Add, edit, delete, and move tasks between columns
- **AI Suggestions**: Auto-categorize and prioritize tasks using Genkit AI
- **Templates**: Create, edit, delete, and use project templates
- **Real-time Sync**: All data is stored in Firestore and updates instantly
- **User-specific Data**: Each user only sees their own boards and tasks
- **Beautiful UI**: Built with shadcn/ui and Tailwind CSS

## 🚀 Getting Started

### 1. Firebase Setup
- Go to [Firebase Console](https://console.firebase.google.com/) and create a project
- Enable **Authentication > Google**
- Enable **Cloud Firestore**
- Get your Firebase config from Project Settings > General
- Create a `.env.local` file in your project root:
  ```env
  NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
  ```

### 2. Install & Run Locally
```bash
npm install
npm run dev
```
Visit [http://localhost:9002](http://localhost:9002)

### 3. Deploy
- Deploy to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) (recommended for Next.js)
- Set the same Firebase environment variables in your deployment dashboard

## 🔒 Firestore Security Rules
To ensure users can only access their own data, set these rules in Firestore:
```plaintext
service cloud.firestore {
  match /databases/{database}/documents {
    match /taskBoards/{boardId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    match /templates/{templateId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🛠️ Tech Stack
- [Next.js](https://nextjs.org/)
- [Firebase Auth](https://firebase.google.com/products/auth)
- [Cloud Firestore](https://firebase.google.com/products/firestore)
- [Genkit AI](https://github.com/genkit-ai/genkit)
- [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)

## 🤖 How Firebase Works in This App
- **Authentication**: Handles Google sign-in and user identity
- **Firestore**: Stores all boards, tasks, and templates in the cloud
- **Security Rules**: Ensure users only access their own data
- **Real-time**: UI updates instantly as data changes

## 👤 Credits
Built by [Your Name].

---

For questions or contributions, open an issue or PR!
