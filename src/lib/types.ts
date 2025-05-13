export type ProfileType = 'client' | 'investor' | 'developer';

export interface User {
  id: string;
  email: string;
  name: string;
  profileType: ProfileType;
  avatarUrl?: string;
  initials?: string;
}

export type ProjectMethodology = 'agile' | 'waterfall' | 'kanban' | 'scrum';

export interface Project {
  id: string;
  name: string;
  description: string;
  methodology: ProjectMethodology;
  ownerId: string;
  teamMemberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeIds: string[];
  dueDate?: string;
  status: 'todo' | 'inprogress' | 'done' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  projectId: string;
  name: string;
  type: string; // e.g., 'pdf', 'txt', 'py'
  url: string; // or path to file
  uploadedBy: string;
  uploadedAt: string;
  size: number; // in bytes
}

export interface ChatMessage {
  id: string;
  channelId: string; // or projectId for general project chat
  senderId: string;
  content: string;
  timestamp: string;
  isPrivate?: boolean; // for DMs or private channels
}

export interface Decision {
  id:string;
  projectId: string;
  title: string;
  description: string;
  madeBy: string; // User ID or name
  date: string;
  outcomes?: string[];
}
