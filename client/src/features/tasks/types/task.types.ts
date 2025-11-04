export type User = {
  _id?: string;
  email?: string;
  username: string;
  avatar: string;
};

export interface Task {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  project?: string;
  assignedTo: User | null;
  progress: number;
  completed: boolean;
  deleted?: boolean;
  isDeleted?: boolean;
  avatar: string[];
  date: string;
  time: string;
  color?: string;
  createdBy?: User;
  updatedAt?: string;
  createdAt?: string;
}
