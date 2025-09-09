import { ReactNode } from "react"

export type Review = {
  id: string
  name: string
  rating: number
  comment: string
  date: string
}

export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  tags: string | null;
};

export interface DrawerProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export interface AssignmentFormProps {
  urgencyType: 'days' | 'hours';
  setUrgencyType: React.Dispatch<React.SetStateAction<'days' | 'hours'>>;
  urgencyValue: string;
  setUrgencyValue: React.Dispatch<React.SetStateAction<string>>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  finalizeAssignment: () => void;
  currentTasks: AssignmentTask[]; // changed from currentFiles
}

export interface FileUploaderProps {
  onUpload: (files: File[]) => void
  onFinalize: () => void
  hasFiles: boolean
}

export interface Assignment {
  id: number
  tasks: AssignmentTask[] // now holds both files and word counts
}

export interface FileStagerProps {
  currentTasks: AssignmentTask[]
  assignments: Assignment[]
}

export interface Props {
  options: string[]
  label: string
  selected: string
  onChange: (value: string) => void
  placeholder?: string
}

// NEW: represents a single task inside an assignment
export interface AssignmentTask {
  id: number
  wordCount?: string
  file?: File
}

// UPDATED: now contains tasks instead of flat files
export interface SingleAssignment {
  id: number;
  projectType: string;
  topic: string;
  urgencyType: 'days' | 'hours';
  urgencyValue: string;
  tasks: AssignmentTask[];
  sessionId?: string;
}
