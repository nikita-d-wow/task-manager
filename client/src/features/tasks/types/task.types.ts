export type User = {
  _id?: string;
  email?: string;
  username: string;
  avatar: string;
};

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  project?: string;
  assignedTo: string | null;
  progress: number;
  completed: boolean;
  avatar: string[];
  date: string;
  time: string;
  color?: string;
  createdBy?: User;
  updatedAt?: string;
  createdAt?: string;
}
