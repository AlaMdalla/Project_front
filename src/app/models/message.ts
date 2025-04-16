// src/app/models/message.ts
export interface Message {
  id?: number;
  senderId: string;
  recipientId: string;
  content?: string;
  voiceNoteUrl?: string; // New field
  timestamp: string;
}