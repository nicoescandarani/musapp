import { NoteGroup } from './note-group';

export interface Mus {
  id: string;
  title: string;
  notes: string[];
  notesGroups: any[];
  isMus: boolean;
}
