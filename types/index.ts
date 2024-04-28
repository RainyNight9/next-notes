import type { ZodIssue } from 'zod';

export interface INote {
  title: string;
  content?: string;
  updateTime?: number;
}

export interface INotes {
  notes: Record<string, string>
}

export type TEditorFormState = {
  message?: string | null;
  errors?: ZodIssue[];
} | void;